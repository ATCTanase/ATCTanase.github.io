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
        // ワールド座標
        const markerWorldPos = new THREE.Vector3();
        barcodeMarker.object3D.updateMatrixWorld(true);
        barcodeMarker.object3D.getWorldPosition(markerWorldPos);
        
        // --- カメラ座標系に変換 ---
        const markerPosLocalToCamera = camera.object3D.worldToLocal(markerWorldPos.clone());

        // --- 角度計算 ---
        // マーカーのワールド回転クォータニオン
        const markerWorldQuat = new THREE.Quaternion();
        barcodeMarker.object3D.getWorldQuaternion(markerWorldQuat);

        // カメラのワールド回転クォータニオン
        const cameraWorldQuat = new THREE.Quaternion();
        camera.object3D.getWorldQuaternion(cameraWorldQuat);

        // カメラ回転の逆元を計算（カメラ座標系に変換）
        const cameraWorldQuatInverse = cameraWorldQuat.clone().invert();

        // マーカーの回転をカメラ座標系に変換
        const markerLocalQuat = new THREE.Quaternion();
        markerLocalQuat.multiplyQuaternions(cameraWorldQuatInverse, markerWorldQuat);

        const localOffset = new THREE.Vector3(
          0,
          Number(markerPositionY),
          Number(markerPositionZ)
        );

        const offsetWorld = localOffset.applyQuaternion(markerWorldQuat);
        const worldPos = markerWorldPos.clone();

        // オイラー角に変換（ラジアン→度）
        const euler = new THREE.Euler();
        euler.setFromQuaternion(markerLocalQuat, 'YXZ'); // YXZはよく使う順序
        const radToDeg = THREE.MathUtils.radToDeg;
        const rotX = radToDeg(euler.x);
        const rotY = radToDeg(euler.y);
        const rotZ = radToDeg(euler.z);

        // マーカー距離（カメラからマーカーまでの距離）
        const distance = markerPosLocalToCamera.length();
        // 距離に応じて補正をスケーリング
        const distanceFactor = THREE.MathUtils.clamp(distance * 0.5, 1, 4);

        // 下向き角度に応じたy軸補正（rotXが正ならplaneは下方向にズレるので、y座標を減らす）
        const correctionFactor = 0.02; // 補正量は調整可能
        const yCorrection = -rotX * correctionFactor * distanceFactor;
        
        const correctionFactorX = 0.01; // 補正量は調整可能
        const xCorrection = -rotY * correctionFactorX;
      
        const xWorld = barcodeMarker.object3D.localToWorld(new THREE.Vector3(markerPositionX, 0, 0));
        worldPos.x = xWorld.x + xCorrection;
        worldPos.y += offsetWorld.y + yCorrection;
        worldPos.z += offsetWorld.z;

        videoPlane.object3D.position.copy(worldPos);
        console.log(videoPlane.object3D.position);

        // 現在の回転を取得
        const currentEuler = new THREE.Euler().setFromQuaternion(videoPlane.object3D.quaternion, 'YXZ');
        // マーカーから取得したY回転のみ更新
        const markerEuler = new THREE.Euler().setFromQuaternion(markerWorldQuat, 'YXZ');
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
