const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane = document.getElementById("videoPlane");
const camera = document.querySelector("#mainCamera");

let markerTimer = null;
let markerVisible = false;

// Canvas作成
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

// ARアニメ
const ARImageFolder = "../../04_image/ARImage/AR1/";
const fileName = "kominka_AR1_";
const frameCount = 48;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null;

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText = document.getElementById("progress");

let offset;
let firstRotX = null;
let firstRotY = null;
let firstRotZ = null;

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

AFRAME.registerComponent("marker-tracker", {
  tick: function () {
    if (markerVisible) {
      // --- ワールド座標 ---
      const markerWorldPos = new THREE.Vector3();
      barcodeMarker.object3D.updateMatrixWorld(true);
      barcodeMarker.object3D.getWorldPosition(markerWorldPos);
      camera.object3D.updateMatrixWorld(true);
      markerWorldPos.setFromMatrixPosition(barcodeMarker.object3D.matrixWorld);
      markerWorldPos.applyMatrix4(camera.object3D.matrixWorld);

      // --- ワールド回転 ---
      const markerLocalQuat = new THREE.Quaternion();
      const markerWorldQuat = new THREE.Quaternion();
      barcodeMarker.object3D.getWorldQuaternion(markerLocalQuat);
      const cameraWorldQuat = new THREE.Quaternion();
      camera.object3D.getWorldQuaternion(cameraWorldQuat);
      markerWorldQuat.multiplyQuaternions(cameraWorldQuat, markerLocalQuat);

      // --- 位置補正 ---
      
      const offsetPosition = new THREE.Vector3(
        Number(markerPositionX),
        Number(markerPositionY),
        Number(markerPositionZ)
      );
      // マーカーのワールド回転を適用
      const rotatedOffset = offsetPosition.clone().applyQuaternion(markerWorldQuat);
      const finalPos = markerWorldPos.clone().add(rotatedOffset);

      // --- 回転補正 ---
      const offsetEuler = new THREE.Euler(
        THREE.MathUtils.degToRad(markerRotationX),
        THREE.MathUtils.degToRad(markerRotationY),
        THREE.MathUtils.degToRad(markerRotationZ)
      );
      const offsetQuat = new THREE.Quaternion().setFromEuler(offsetEuler);
      const finalQuat = markerWorldQuat.clone().multiply(offsetQuat);

      // --- スケール補正 ---
      const markerScale = barcodeMarker.object3D.scale.clone();
      const offsetScale = new THREE.Vector3(markerWidth ,markerHeight,1);
      const finalScale = markerScale.multiply(offsetScale);

      // --- 適用 ---
      videoPlane.object3D.position.copy(finalPos);
      videoPlane.object3D.quaternion.copy(finalQuat);
      videoPlane.object3D.scale.copy(finalScale);
    }
  }
});

barcodeMarker.addEventListener("markerFound", () => {
  if (!markerVisible) {
    markerVisible = true;
    startPlayback();
    videoPlane.setAttribute('visible', 'true');

    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });
  }
});


barcodeMarker.addEventListener("markerLost", () => {
  markerVisible = false;
  stopPlayback();
  if (markerTimer) {
    clearInterval(markerTimer);
    markerTimer = null;
  }
});

// 初期ロード
preloadFrames(() => {
  console.log("アニメーション準備完了");
});
