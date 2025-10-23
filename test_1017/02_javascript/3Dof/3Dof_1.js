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
let markerPositionX = 0;
let markerPositionY = 0;
let markerPositionZ = 0;

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

let mat = null;
// 次フレーム描画
function drawNextFrame() {
  const img = frames[currentFrame];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  if(mat == null){
    const planeMesh = videoPlane.getObject3D('mesh');
    if (planeMesh) {
      mat = planeMesh.material;
    }
  }
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
    if (!markerVisible) return;
      const markerWorldPos = new THREE.Vector3();
      barcodeMarker.object3D.updateMatrixWorld(true);
      barcodeMarker.object3D.getWorldPosition(markerWorldPos);

      const markerWorldQuat = new THREE.Quaternion();
      barcodeMarker.object3D.getWorldQuaternion(markerWorldQuat);

      // Plane のオフセット（必要ならY方向微調整）
      const offsetVec = new THREE.Vector3(markerPositionX, markerPositionY, markerPositionZ);

      // マーカー回転に沿わせる
      offsetVec.applyQuaternion(markerWorldQuat);

      // Plane のワールド座標に設定
      const worldPos = markerWorldPos.clone().add(offsetVec);
      videoPlane.object3D.position.copy(worldPos);

      // Plane の回転はマーカーに完全追従
      videoPlane.object3D.quaternion.copy(markerWorldQuat);


        // ログUIに表示
        logUI.innerHTML =
          `Marker World Position:<br>` +
          `x: ${markerWorldPos.x.toFixed(3)}<br>` +
          `y: ${markerWorldPos.y.toFixed(3)}<br>` +
          `z: ${markerWorldPos.z.toFixed(3)}<br><br>` +
          `AR World Position:<br>` +
          `x: ${videoPlane.object3D.position.x.toFixed(3)}<br>` +
          `y: ${videoPlane.object3D.position.y.toFixed(3)}<br>` +
          `z: ${videoPlane.object3D.position.z.toFixed(3)}<br><br>`;
  }
});

barcodeMarker.addEventListener("markerFound", () => {
  if (!markerVisible) {
    markerVisible = true;
    startPlayback();
    videoPlane.setAttribute('visible', 'true');
  }
})

barcodeMarker.addEventListener("markerLost", () => {
  markerVisible = false;
  stopPlayback();

  logUI.innerHTML =
    `Marker World Position:<br>(x, y, z)<br><br>` +
    `Marker Rotation (deg):<br>(x, y, z)`;
  //videoPlane.setAttribute('visible', 'false');
});

// 初期ロード
preloadFrames(() => {
  console.log("アニメーション準備完了");
});
