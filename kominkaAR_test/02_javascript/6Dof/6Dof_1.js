const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

let offset;
let markerVisible = false;

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
        img.src = `${ARImage}${frameExt}`;
        img.onload = () => {
            loaded++;
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none";
                callback();
                offset = img.height / img.width;
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

// 🔹 マーカー検出時
marker.addEventListener("markerFound", () => {
    markerVisible = true;
    
    // plane サイズを調整
    const width = videoPlane.getAttribute("width");
    const height = width * offset;
    videoPlane.setAttribute("height", height);

    // plane の原点を下端に移動（1回だけでOK）
    const planeMesh = videoPlane.getObject3D("mesh");
    if (planeMesh) {
        planeMesh.geometry.translate(0, height / 2, 0);
    }

    // マーカーの位置に再配置
    const markerWorldPos = new THREE.Vector3();
    marker.object3D.updateMatrixWorld(true);
    marker.object3D.getWorldPosition(markerWorldPos);
    videoPlane.object3D.position.copy(markerWorldPos);

    videoPlane.setAttribute("visible", true);
    startPlayback();
});

// 🔹 マーカーを失っても表示は保持
marker.addEventListener("markerLost", () => {
    markerVisible = false;
    // ARオブジェクトの位置はそのままにする
    stopPlayback(); // アニメーションは止めたい場合はここで
});

// 🔹 フレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
