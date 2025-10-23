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
let markerPositionZ = -1;

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
      if (markerVisible) {
    if (!markerVisible) return;
    
    // マーカーのワールド位置と回転
    const markerWorldPos = new THREE.Vector3();
    barcodeMarker.object3D.updateMatrixWorld(true);
    barcodeMarker.object3D.getWorldPosition(markerWorldPos);

    const markerWorldQuat = new THREE.Quaternion();
    barcodeMarker.object3D.getWorldQuaternion(markerWorldQuat);

    // オフセット（Yは高さ固定、XZは回転に追従）
    const offsetVec = new THREE.Vector3(markerPositionX, markerPositionY, markerPositionZ);
    
    // Y軸は固定、XZ平面のみ回転
    const quatXZ = new THREE.Quaternion();
    const euler = new THREE.Euler();
    euler.setFromQuaternion(markerWorldQuat, "YXZ");
    quatXZ.setFromEuler(new THREE.Euler(0, euler.y, 0)); // Y軸回転のみ

    offsetVec.applyQuaternion(quatXZ);

    // ワールド座標に加算
    const worldPos = markerWorldPos.clone().add(offsetVec);
    videoPlane.object3D.position.copy(worldPos);

    // Plane の回転もXZ回転のみ追従
    videoPlane.object3D.quaternion.copy(quatXZ);


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
