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
const AROverlay = document.getElementById("AROverlay");
const progressText = document.getElementById("progress");

let offset;
let markerPositionX = 0;
let markerPositionY = 4;
let markerPositionZ = -1;

let markerRotationX = 0;
let markerRotationY = 0;
let markerRotationZ = 0;

let markerHeight = 6;
let markerWidth = 6;
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

function updateVideoPlane() {
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

    // 現在のマーカーの「上」方向（ローカルのY軸がワールド空間でどうなっているか）
    const markerUp = new THREE.Vector3(0, 1, 0).applyQuaternion(markerWorldQuat);
    // ワールドの「上」方向
    const worldUp = new THREE.Vector3(0, 1, 0);
    // マーカーのUpベクトルとワールドのUpベクトルの間の回転軸と角度を計算
    const correctionQuaternion = new THREE.Quaternion().setFromUnitVectors(markerUp, worldUp);
    // 元のマーカーの回転に補正回転を適用（ワールド座標系で回転を安定させる）
    const stableMarkerWorldQuat = correctionQuaternion.multiply(markerWorldQuat);

    // --- 位置補正 ---

    const offsetPosition = new THREE.Vector3(
      Number(markerPositionX),
      Number(markerPositionY),
      Number(markerPositionZ)
    );
    // マーカーのワールド回転を適用
    const rotatedOffset = offsetPosition.clone().applyQuaternion(stableMarkerWorldQuat);
    const finalPos = markerWorldPos.clone().add(rotatedOffset);

    // --- 回転補正 ---
    const offsetEuler = new THREE.Euler(
      THREE.MathUtils.degToRad(markerRotationX),
      THREE.MathUtils.degToRad(markerRotationY),
      THREE.MathUtils.degToRad(markerRotationZ)
    );
    const offsetQuat = new THREE.Quaternion().setFromEuler(offsetEuler);
    const finalQuat = stableMarkerWorldQuat.clone().multiply(offsetQuat);

    // --- スケール補正 ---
    const markerScale = barcodeMarker.object3D.scale.clone();
    const offsetScale = new THREE.Vector3(markerWidth, markerHeight, 1);
    const finalScale = markerScale.multiply(offsetScale);
    
    const lerpFactor = 0.25; // 補間速度 (0〜1) 小さいほどゆっくり追従
    // 現在の位置・回転・スケール
    const currentPos = videoPlane.object3D.position;
    const currentQuat = videoPlane.object3D.quaternion;
    const currentScale = videoPlane.object3D.scale;

    // 目標位置・回転・スケール
    const targetPos = finalPos;   // THREE.Vector3
    const targetQuat = finalQuat; // THREE.Quaternion
    const targetScale = finalScale; // THREE.Vector3

    // --- 位置補間 ---
    currentPos.lerp(targetPos, lerpFactor);
    // --- 回転補間 ---
    currentQuat.slerp(targetQuat, lerpFactor);
    // --- スケール補間 ---
    currentScale.lerp(targetScale, lerpFactor);
  }
}

AFRAME.registerComponent("marker-tracker", {
  tick: function () {
    updateVideoPlane();
  }
});

barcodeMarker.addEventListener("markerFound", () => {
  if (!markerVisible) {
    markerVisible = true;
    startPlayback();
    videoPlane.setAttribute('visible', 'true');
    AROverlay.style.display = "none";

    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });
  }
});


barcodeMarker.addEventListener("markerLost", () => {
  markerVisible = false;
  if (markerTimer) {
    clearInterval(markerTimer);
    markerTimer = null;
  }
});

// 初期ロード
preloadFrames(() => {
  console.log("アニメーション準備完了");
});
