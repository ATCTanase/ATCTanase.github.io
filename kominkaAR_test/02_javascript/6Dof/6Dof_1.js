//const videoPlane = document.getElementById("videoPlane");
//const marker     = document.getElementById("barcodeMarker");

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
//videoPlane.setAttribute("material", "src", canvas);
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
const scene = document.querySelector("a-scene");
const startBtn = document.getElementById("startARBtn");

startBtn.addEventListener("click", () => {
    const marker = document.createElement("a-marker");
    marker.setAttribute("type", "pattern");
    marker.setAttribute("url", "../../04_image/patt/AR1.patt");
    marker.setAttribute("id", "barcodeMarker");
    marker.setAttribute("size", "0.05");
    marker.setAttribute("smooth", "true");
    marker.setAttribute("smoothCount", "10");
    marker.setAttribute("smoothTolerance", "0.01");
    marker.setAttribute("smoothThreshold", "5");

    const plane = document.createElement("a-plane");
    plane.setAttribute("id", "videoPlane");
    plane.setAttribute("position", "0 0 0");
    plane.setAttribute("rotation", "-90 0 0");
    plane.setAttribute("width", "3");
    plane.setAttribute("height", "3");
    plane.setAttribute("visible", "false");
    plane.setAttribute("material", "shader: flat; side: double; transparent: true; alphaTest:0.01");

    marker.appendChild(plane);
    scene.appendChild(marker);

    // ボタンを非表示に
    startBtn.style.display = "none";
});
// マーカーイベント
marker.addEventListener("markerFound", () => {
    videoPlane.setAttribute("visible", true);

    const width = videoPlane.getAttribute("width");
    const height = width * offset;
    videoPlane.setAttribute("height", height);

    // plane の原点を下端に移動
    const planeMesh = videoPlane.getObject3D("mesh");
    if (planeMesh) {
        planeMesh.geometry.translate(0, height / 2, 0);
    }
    startPlayback();
});
marker.addEventListener("markerLost", () => {
    videoPlane.setAttribute("visible", false);
    stopPlayback();
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
