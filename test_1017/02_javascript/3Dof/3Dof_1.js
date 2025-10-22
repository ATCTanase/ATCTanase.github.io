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

// 次フレーム描画
function drawNextFrame() {
  const img = frames[currentFrame];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const planeMesh = videoPlane.getObject3D('mesh');
    if (planeMesh) {
      const mat = planeMesh.material;
  if (mat?.map) mat.map.needsUpdate = true;
    }

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

barcodeMarker.addEventListener("markerFound", () => {

  if (!markerVisible) {
    markerVisible = true;
    startPlayback();
    videoPlane.setAttribute('visible', 'true');

    // const playPromise = video.play();
    // if (playPromise !== undefined) {
    //   playPromise.catch(() => {/* ignore error */ });
    // }

    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });

    markerTimer = setInterval(() => {
      if (markerVisible) {
        // 1. マーカーのワールド座標・回転取得
        const markerWorldPos = new THREE.Vector3();
        barcodeMarker.object3D.updateMatrixWorld(true);
        barcodeMarker.object3D.getWorldPosition(markerWorldPos);

        const markerWorldQuat = new THREE.Quaternion();
        barcodeMarker.object3D.getWorldQuaternion(markerWorldQuat);

        // 2. マーカーからの相対位置をワールドに変換
        const offsetLocal = new THREE.Vector3(
          Number(markerPositionX),
          Number(markerPositionY),
          Number(markerPositionZ)
        );
        const offsetWorld = offsetLocal.clone().applyQuaternion(markerWorldQuat).add(markerWorldPos);

        // 3. カメラ座標系でのマーカー位置（距離や回転補正用）
        const markerPosLocalToCamera = camera.object3D.worldToLocal(markerWorldPos.clone());
        const distance = markerPosLocalToCamera.length();

        // マーカーの回転をカメラ座標系に変換
        const cameraWorldQuat = new THREE.Quaternion();
        camera.object3D.getWorldQuaternion(cameraWorldQuat);
        const markerLocalQuat = cameraWorldQuat.clone().invert().multiply(markerWorldQuat);
        const euler = new THREE.Euler();
        euler.setFromQuaternion(markerLocalQuat, 'YXZ');
        const rotX = THREE.MathUtils.radToDeg(euler.x);
        const rotY = THREE.MathUtils.radToDeg(euler.y);
        const rotZ = THREE.MathUtils.radToDeg(euler.z);

        // 4. 回転補正（カメラ回転に応じて微調整）
        const correctionFactor = 0.02;
        const yCorrection = -rotX * correctionFactor;

        const correctionFactorX = 0.02;
        let adjustedY;
        if (rotY > 0) {
          adjustedY = rotZ > 0 ? rotY - rotZ : rotY + rotZ;
        } else if (rotY < 0) {
          adjustedY = rotZ > 0 ? rotY + rotZ : rotY - rotZ;
        } else {
          adjustedY = rotY;
        }
        const xCorrection = adjustedY * correctionFactorX;

        // 5. 補正をワールド座標に適用
        offsetWorld.x += xCorrection;
        offsetWorld.y += yCorrection;

        // 6. videoPlane に反映
        videoPlane.object3D.position.copy(offsetWorld);
        console.log('finalPos:', offsetWorld);


        //ここまで


        // ログUIに表示
        logUI.innerHTML =
          `markerPosLocalToCamera:<br>` +
          `x: ${markerPosLocalToCamera.x.toFixed(3)}<br>` +
          `y: ${markerPosLocalToCamera.y.toFixed(3)}<br>` +
          `z: ${markerPosLocalToCamera.z.toFixed(3)}<br><br>` +
          `distance: ${distance.toFixed(3)}<br>` +
          `Marker World Position:<br>` +
          `x: ${markerWorldPos.x.toFixed(3)}<br>` +
          `y: ${markerWorldPos.y.toFixed(3)}<br>` +
          `z: ${markerWorldPos.z.toFixed(3)}<br><br>` +
          `AR World Position:<br>` +
          `x: ${videoPlane.object3D.position.x.toFixed(3)}<br>` +
          `y: ${videoPlane.object3D.position.y.toFixed(3)}<br>` +
          `z: ${videoPlane.object3D.position.z.toFixed(3)}<br><br>` +
          `Marker Rotation (deg):<br>` +
          `x: ${rotX.toFixed(1)}<br>` +
          `y: ${rotY.toFixed(1)}<br>` +
          `z: ${rotZ.toFixed(1)}`;
      }
    }, 33);
  }
});

barcodeMarker.addEventListener("markerLost", () => {
  markerVisible = false;
  stopPlayback();
  if (markerTimer) {
    clearInterval(markerTimer);
    markerTimer = null;
  }
  logUI.innerHTML =
    `Marker World Position:<br>(x, y, z)<br><br>` +
    `Marker Rotation (deg):<br>(x, y, z)`;
  //videoPlane.setAttribute('visible', 'false');
});

// 初期ロード
preloadFrames(() => {
  console.log("アニメーション準備完了");
});
