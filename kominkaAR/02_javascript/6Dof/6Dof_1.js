const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
const camera = document.querySelector('[camera]');

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);
let offset;

const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手";
const frameCount = 1;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null;

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

// 🔹 全フレームをロード
function preloadFrames(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        // img.src = `${ARImage}${String(i).padStart(3, "0")}${frameExt}`;
        img.src = `${ARImage}${frameExt}`;
        img.onload = () => {
            loaded++;
            // 進捗を表示
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none"; // ローディング画面を隠す
                callback();
                offset =  img.height / img.width;
            }
        };
        frames.push(img);
    }
}

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
let isMarkerAttached = false;
let markerLastPos = new THREE.Vector3();
let markerLastQuat = new THREE.Quaternion();
let cameraLastQuat = new THREE.Quaternion();

let velocity = new THREE.Vector3();
let positionOffset = new THREE.Vector3();

let cameraQuat = new THREE.Quaternion();
let lastTime = null;
let pseudoMode = false;


// 加速度センサーから擬似移動を更新
window.addEventListener("devicemotion", (event) => {
  if (!lastTime) return;
  const dt = (performance.now() - lastTime) / 1000;

  // 加速度値（重力を除いた値が理想）
  const acc = new THREE.Vector3(
    event.acceleration.x || 0,
    event.acceleration.y || 0,
    event.acceleration.z || 0
  );

  // スマホの姿勢に基づき、加速度をワールド空間へ変換
  const accWorld = acc.clone().applyQuaternion(cameraQuat);

  // 積分で速度・位置オフセットを更新（疑似的な移動）
  velocity.add(accWorld.clone().multiplyScalar(dt));
  positionOffset.add(velocity.clone().multiplyScalar(dt));
});



// マーカーイベント
marker.addEventListener("markerFound", () => {
    videoPlane.setAttribute("visible", true);
    startPlayback();
    
    // 初期化
    isMarkerAttached = true;
    pseudoMode = false;
    velocity.set(0, 0, 0);
    positionOffset.set(0, 0, 0);

    // 記録
    marker.object3D.getWorldPosition(markerLastPos);
    marker.object3D.getWorldQuaternion(markerLastQuat);
    camera.object3D.getWorldQuaternion(cameraLastQuat);

    lastTime = performance.now();
});
marker.addEventListener("markerLost", () => {
    
     // マーカーから切り離してシーン直下に戻す
    marker.sceneEl.object3D.add(videoPlane.object3D);
    marker.object3D.getWorldPosition(markerLastPos);
    marker.object3D.getWorldQuaternion(markerLastQuat);
    camera.object3D.getWorldQuaternion(cameraLastQuat);

    isMarkerAttached = false;
    pseudoMode = true;

    stopPlayback();
});

AFRAME.registerComponent('pseudo-stabilizer', {
  tick: function () {
    if (!pseudoMode) return;

    camera.object3D.getWorldQuaternion(cameraQuat);

    // 疑似固定位置：マーカーがあった位置 - スマホ移動分
    const pseudoPos = markerLastPos.clone().sub(
      positionOffset.clone().applyQuaternion(cameraQuat)
    );

    videoPlane.object3D.position.copy(pseudoPos);
    videoPlane.object3D.quaternion.copy(markerLastQuat);

    lastTime = performance.now();
  }
});

document.querySelector('a-scene').setAttribute('pseudo-stabilizer', '');
// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
