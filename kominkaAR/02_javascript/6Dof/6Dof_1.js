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

let markerLastPos = new THREE.Vector3();
let markerLastQuat = new THREE.Quaternion();
let cameraLastQuat = new THREE.Quaternion(); // ロスト時のスマホ角度保持
let gyroQuat = new THREE.Quaternion();       // 現在のスマホ角度
let lastDistance = 0;
let pseudoMode = false;


window.addEventListener('deviceorientation', (event) => {
  const alpha = THREE.MathUtils.degToRad(event.alpha || 0); // Z軸
  const beta  = THREE.MathUtils.degToRad(event.beta || 0);  // X軸
  const gamma = THREE.MathUtils.degToRad(event.gamma || 0); // Y軸
  const euler = new THREE.Euler(beta, alpha, -gamma, 'ZXY');
  gyroQuat.setFromEuler(euler);
});

// マーカーイベント
marker.addEventListener("markerFound", () => {
    videoPlane.setAttribute("visible", true);
    startPlayback();
    
    // 初期化
    pseudoMode = false;

    // 記録
    marker.object3D.getWorldPosition(markerLastPos);
    marker.object3D.getWorldQuaternion(markerLastQuat);

    
    // 距離記録（カメラ位置はジャイロ基準の疑似位置計算に使う）
    const camPos = new THREE.Vector3();
    camera.object3D.getWorldPosition(camPos);
    lastDistance = markerLastPos.distanceTo(camPos);
});
marker.addEventListener("markerLost", () => {
    pseudoMode = true;
    stopPlayback();
    
    // ロスト時のスマホ角度を保持
    cameraLastQuat.copy(gyroQuat);
});

AFRAME.registerComponent('pseudo-stabilizer', {
    tick: function () {
        if (!pseudoMode) {
            marker.object3D.getWorldPosition(markerLastPos);
            marker.object3D.getWorldQuaternion(markerLastQuat);
            videoPlane.object3D.position.copy(markerLastPos);
            videoPlane.object3D.quaternion.copy(markerLastQuat);
        }
        else {
            // ロスト時の角度
            const lastEuler = new THREE.Euler().setFromQuaternion(cameraLastQuat, 'YXZ');
            const currentEuler = new THREE.Euler().setFromQuaternion(gyroQuat, 'YXZ');

            // 回転差分
            const deltaYaw = currentEuler.y - lastEuler.y;   // 左右
            const deltaPitch = currentEuler.x - lastEuler.x; // 前後

            // マーカー最後の距離
            const d = lastDistance;

            // Y軸回転による左右オフセット
            const offsetX = d * Math.tan(deltaYaw);

            // X軸回転による上下オフセット
            const offsetY = d * Math.tan(deltaPitch);

            // 疑似位置
            const pseudoPos = markerLastPos.clone().add(new THREE.Vector3(offsetX, offsetY, 0));
            videoPlane.object3D.position.copy(pseudoPos);

            // 回転はマーカー最後のまま維持
            videoPlane.object3D.quaternion.copy(markerLastQuat);
        }
    }
});

document.querySelector('a-scene').setAttribute('pseudo-stabilizer', '');
// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
