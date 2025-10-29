const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
const camera = document.querySelector("#mainCamera");

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);
let offset;

let markerPositionX = 0;
let markerPositionY = 4;
let markerPositionZ = -1;

let markerRotationX = 0;
let markerRotationY = 0;
let markerRotationZ = 0;

let markerHeight = 6;
let markerWidth = 6;

const ARImageFolder = "../../04_image/ARImage/AR1/";
const fileName = "kominka_AR1_";
const frameCount = 48;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null;


const loadingOverlay = document.getElementById("loadingOverlay");
const AROverlay = document.getElementById("AROverlay");
const progressText   = document.getElementById("progress");


// フレームロード
function preloadFrames(callback) {
  let loaded = 0;
  for (let i = 0; i <= frameCount; i++) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = `${ARImageFolder}${fileName}${String(i).padStart(2, "0")}${frameExt}`;
    img.onload = () => {
      loaded++;
      progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
      if (loaded === frameCount) {
        loadingOverlay.style.display = "none";
        callback();
        offset = img.height / img.width;
        markerHeight = markerWidth * offset;
      }
    };
    frames.push(img);
  }
}

// 次フレーム描画
function drawNextFrame() {
  const img = frames[currentFrame];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const mat = videoPlane.getObject3D("mesh")?.material;
  if (mat?.map) mat.map.needsUpdate = true;

  currentFrame = (currentFrame + 1) % frameCount;
}

function startPlayback() {
  if (!playTimer) playTimer = setInterval(drawNextFrame, 1000 / fps);
}

function stopPlayback() {
  if (playTimer) {
    clearInterval(playTimer);
    playTimer = null;
  }
}


let markerLastPos = new THREE.Vector3();
let markerLastQuat = new THREE.Quaternion();
let pseudoMode = false;
let appliedOnce = false;
let lastCamPos = new THREE.Vector3();
// マーカーイベント
marker.addEventListener("markerFound", () => {
    videoPlane.setAttribute("visible", true);
    startPlayback();
    AROverlay.style.display = "none";
    
    // 初期化
    pseudoMode = false;

    // 記録
    marker.object3D.getWorldPosition(markerLastPos);
    marker.object3D.getWorldQuaternion(markerLastQuat);
    
    camera.setAttribute('look-controls', {
      enabled: false,
      magicWindowTrackingEnabled: false
    });
    
    camera.object3D.quaternion.copy(new THREE.Quaternion());
});
marker.addEventListener("markerLost", () => {
    pseudoMode = true;
    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });
    appliedOnce = false;
});

AFRAME.registerComponent('pseudo-stabilizer', {
    tick: function () {

        const localPosOffset = new THREE.Vector3(markerPositionX, markerPositionY, markerPositionZ);
        const localRotOffset = new THREE.Euler(
            THREE.Math.degToRad(markerRotationX),
            THREE.Math.degToRad(markerRotationY),
            THREE.Math.degToRad(markerRotationZ)
        );
        
        if (!pseudoMode) {
            marker.object3D.getWorldPosition(markerLastPos);
            marker.object3D.getWorldQuaternion(markerLastQuat);
            const offsetWorld = localPosOffset.clone().applyQuaternion(markerLastQuat);
            videoPlane.object3D.position.copy(markerLastPos.clone().add(offsetWorld));

  
            const quatOffset = new THREE.Quaternion().setFromEuler(localRotOffset);
            videoPlane.object3D.quaternion.copy(markerLastQuat.clone().multiply(quatOffset));
        }
        else {
            // マーカー消失後、初回のみ
            if (!appliedOnce) {
                const cam = camera.object3D;
                const camQuat = cam.quaternion;

                // カメラ回転が初期値ならスルー
                if (camQuat.equals(new THREE.Quaternion())) return;

                const obj = videoPlane.object3D;
                const offsetWorld = localPosOffset.clone().applyQuaternion(markerLastQuat);
                const finalPos = markerLastPos.clone().add(offsetWorld).sub(cam.position);
                finalPos.applyQuaternion(camQuat);
                obj.position.copy(cam.position.clone().add(finalPos));
                
                const quatOffset = new THREE.Quaternion().setFromEuler(localRotOffset);

                const worldQuat = camQuat.clone().multiply(markerLastQuat.clone().multiply(quatOffset));
                obj.quaternion.copy(worldQuat);

                appliedOnce = true; // 初回適用済み
            }
        }
    }
});

document.querySelector('a-scene').setAttribute('pseudo-stabilizer', '');
// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
