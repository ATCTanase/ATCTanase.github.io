const videoPlane = document.getElementById("videoPlane");
const sceneRoot = videoPlane.parentElement;
const marker     = document.getElementById("barcodeMarker");

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

// マーカーイベント
marker.addEventListener("markerFound", () => {
    videoPlane.setAttribute("visible", true);
    videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);
    
    marker.appendChild(videoPlane);
  
    camera.setAttribute('look-controls', {
      enabled: false,
      magicWindowTrackingEnabled: false
    });
    startPlayback();
});
marker.addEventListener("markerLost", () => {
    
    sceneRoot.appendChild(videoPlane);
    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });
    stopPlayback();
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
