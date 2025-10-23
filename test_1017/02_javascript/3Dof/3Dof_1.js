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

let markerInitialPos = null;
let markerInitialQuat = null;

AFRAME.registerComponent("marker-tracker", {
  tick: function () {
      if (markerVisible) {
        // ワールド座標
        const currentPos  = new THREE.Vector3();
        barcodeMarker.object3D.updateMatrixWorld(true);
        barcodeMarker.object3D.getWorldPosition(currentPos);

        if(markerInitialPos == null){
          markerInitialPos = currentPos.clone();
        }
        
        // --- カメラ座標系に変換 ---
        const markerPosLocalToCamera = camera.object3D.worldToLocal(currentPos.clone());

        // --- 角度計算 ---
        // マーカーのワールド回転クォータニオン
        const currentQuat  = new THREE.Quaternion();
        barcodeMarker.object3D.getWorldQuaternion(currentQuat );

        if(markerInitialQuat == null){
          markerInitialQuat = currentQuat.clone();
        }
        // カメラのワールド回転クォータニオン
        const cameraWorldQuat = new THREE.Quaternion();
        camera.object3D.getWorldQuaternion(cameraWorldQuat);

       // --- 移動差分（ワールド座標） ---
        const deltaPos = currentPos.clone().sub(markerInitialPos);

        // --- 回転差分 ---
        const deltaQuat = markerInitialQuat.clone().invert().multiply(currentQuat);
        
        // ここで deltaPos, deltaQuat を plane の位置・回転に適用
        const localOffset = new THREE.Vector3(markerPositionX, markerPositionY, markerPositionZ);

        // deltaQuat を使ってローカルオフセットを回転
        const rotatedOffset = localOffset.applyQuaternion(deltaQuat);

        const newWorldPos = markerInitialPos.clone().add(deltaPos).add(rotatedOffset);
        videoPlane.object3D.position.copy(newWorldPos);
        console.log(videoPlane.object3D.position);

        // 現在の回転を取得
        const currentEuler = new THREE.Euler().setFromQuaternion(videoPlane.object3D.quaternion, 'YXZ');
        // マーカーから取得したY回転のみ更新
        const markerEuler = new THREE.Euler().setFromQuaternion(currentQuat, 'YXZ');
        currentEuler.y = markerEuler.y;
        // 更新後の回転を反映
        videoPlane.object3D.quaternion.setFromEuler(currentEuler);
        
        //ここまで


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
    markerInitialPos = null;
    markerInitialQuat = null;
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
