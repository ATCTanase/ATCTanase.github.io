const scene = document.querySelector("a-scene");
const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
let  cameraEl  = null; // ユーザー操作用のカメラエンティティ
let arjsCameraEl = null; // AR.jsが生成するカメラエンティティ

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
// AR.jsがカメラを初期化した後に実行されるイベント
scene.addEventListener('arjs-init', () => {
    arjsCameraEl = scene.querySelector('.a-camera'); // AR.jsが生成するカメラ
    cameraEl = scene.querySelector('[camera]'); 
    if (cameraEl && arjsCameraEl) {
        console.log("AR.js camera initialized:", arjsCameraEl);
        console.log("User camera initialized:", cameraEl);
    }
});


let axesAdded = false;
// マーカーイベント
marker.addEventListener("markerFound", () => {
    console.log("markerFound");
    if (!cameraEl) cameraEl = scene.querySelector('[camera]');

    videoPlane.setAttribute("visible", true);
    startPlayback();

    // マーカーの位置と回転をvideoPlaneに適用
    const markerObject = marker.object3D;
    const markerPosition = new THREE.Vector3();
    const markerRotation = new THREE.Quaternion();
    markerObject.getWorldPosition(markerPosition);
    markerObject.getWorldQuaternion(markerRotation);
    videoPlane.object3D.position.copy(markerPosition);
    videoPlane.object3D.quaternion.copy(markerRotation);
    videoPlane.object3D.scale.set(1, offset, 1); // width=1の場合

    // 6DoFを有効に（WASD移動を有効に）
    if (cameraEl) {
        cameraEl.setAttribute("wasd-controls", "enabled: true");
    }

    markerFoundLastTime = true;
});
marker.addEventListener("markerLost", () => {
    console.log("markerLost");
    if (cameraEl) {
        cameraEl.setAttribute("wasd-controls", "enabled: false");
    }

    markerFoundLastTime = false;
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
