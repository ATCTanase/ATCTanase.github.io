const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane = document.getElementById("videoPlane");
const camera = document.querySelector("#mainCamera");

let markerTimer = null;
let markerVisible = false;

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

// ARアニメ
const ARImageFolder = "../../04_image/ARImage/AR4/";
const fileName = "kominka_AR4_anim";
const frameCount = 22;
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
let markerPositionY = 0;
let markerPositionZ = 0;

let markerRotationX = 0;
let markerRotationY = 0;
let markerRotationZ = 0;

let markerHeight = 1;
let markerWidth = 1;
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
    const markerObject3D = barcodeMarker.object3D;
    // AR.jsが提供するマーカーの推定サイズを取得することを試みる
    // 通常、AR.jsのマーカーは1x1の単位平面として扱われるため、
    // markerObject3D.scale にはそのスケールが反映されているはず
    const currentMarkerScaleX = markerObject3D.scale.x;
    const currentMarkerScaleY = markerObject3D.scale.y; // 縦のマーカーの場合、Yスケールも意味を持
    // ARコンテンツの元のアスペクト比
    const originalAspectRatio = 1 / offset; // width / height

    // videoPlane の新しい幅と高さを計算
    // `markerWidth` はユーザー定義のオフセットスケールなので、これも考慮
    const newPlaneWidth = currentMarkerScaleX * markerWidth; 
    const newPlaneHeight = newPlaneWidth / originalAspectRatio; // アスペクト比を維持して高さを計算

    // finalScale の計算を修正
    // videoPlane の Z軸のスケールは通常1で固定
    const finalScale = new THREE.Vector3(newPlaneWidth, newPlaneHeight, 1);

    // --- 適用 ---
    videoPlane.object3D.position.copy(finalPos);
    videoPlane.object3D.quaternion.copy(finalQuat);
    videoPlane.object3D.scale.copy(finalScale);
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
