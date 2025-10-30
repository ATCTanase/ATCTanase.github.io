const videoPlane = document.getElementById("videoPlane");
const planeParent = document.getElementById("planeParent");
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
function parametarCheck()
{
    const localPosOffset = new THREE.Vector3(markerPositionX, markerPositionY, markerPositionZ);
    
    if (!localPosOffset.equals(videoPlane.object3D.position))
    {
        videoPlane.object3D.position.copy(localPosOffset);
    }

    const localRotOffset = new THREE.Euler(
        THREE.MathUtils.degToRad(markerRotationX),
        THREE.MathUtils.degToRad(markerRotationY),
        THREE.MathUtils.degToRad(markerRotationZ)
    );
    const quatOffset = new THREE.Quaternion().setFromEuler(localRotOffset);
    
    if (!quatOffset.equals(videoPlane.object3D.quaternion))
    {
        videoPlane.object3D.quaternion.copy(quatOffset);
    }
    
    const markerScale = marker.object3D.scale.clone();
    const offsetScale = new THREE.Vector3(markerWidth, markerHeight, 1);
    const finalScale = markerScale.multiply(offsetScale);

    if (!finalScale.equals(planeParent.object3D.scale))
    {
        planeParent.object3D.scale.copy(finalScale);
    }
}
AFRAME.registerComponent('pseudo-stabilizer', {
    tick: function () {
      parametarCheck();
       
      if (!pseudoMode) {
        marker.object3D.getWorldPosition(markerLastPos);
        marker.object3D.getWorldQuaternion(markerLastQuat);

        // planeParentをマーカー基準で配置
        planeParent.object3D.position.copy(markerLastPos);
        planeParent.object3D.quaternion.copy(markerLastQuat);
      }
      else if (!appliedOnce) {
        const cam = camera.object3D;
        const camQuat = cam.quaternion;
        if (camQuat.equals(new THREE.Quaternion())) return;

        const camToMarker = new THREE.Vector3().copy(markerLastPos).sub(cam.position);
        camToMarker.applyQuaternion(camQuat);
        planeParent.object3D.position.copy(cam.position.clone().add(camToMarker));
        
        const worldQuat = camQuat.clone().multiply(markerLastQuat);
        planeParent.object3D.quaternion.copy(worldQuat);
        
        appliedOnce = true; // 初回適用済み
      }
    }
});


document.querySelector('a-scene').setAttribute('pseudo-stabilizer', '');
// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
