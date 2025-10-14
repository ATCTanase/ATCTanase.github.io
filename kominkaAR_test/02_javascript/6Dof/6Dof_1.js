const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

// 画面依存ではなく、plane に合わせたテクスチャサイズ
const planeWidth  = 1;
let offset; // 画像縦横比
let markerVisible = false;

// canvas 作成
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

// AR画像フレーム
const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手";
const frameCount = 1;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null;

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

// 🔹 全フレームロード
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

                // 画像縦横比計算
                offset = img.height / img.width;

                // canvas サイズ設定（plane に合わせ、devicePixelRatio考慮）
                const dpr = window.devicePixelRatio || 1;
                const planeHeight = planeWidth * offset;
                canvas.width  = 1024 * dpr; // 任意解像度
                canvas.height = Math.floor(1024 * (planeHeight / planeWidth) * dpr);
                ctx.scale(dpr, dpr);

                callback();
            }
        };
        frames.push(img);
    }
}

// 🔹 次フレーム描画
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

// plane の pivot 調整（下端に揃える）
function adjustPlanePivot() {
    const planeHeight = videoPlane.getAttribute("height");
    const planeMesh = videoPlane.getObject3D("mesh");
    if (planeMesh && !videoPlane.dataset.pivotAdjusted) {
        planeMesh.geometry.translate(0, planeHeight / 2, 0);
        videoPlane.dataset.pivotAdjusted = true;
    }
}

// 🔹 マーカー検出時
marker.addEventListener("markerFound", () => {
    markerVisible = true;

    // plane サイズ調整（初回だけ）
    if (!videoPlane.dataset.initialized) {
        videoPlane.setAttribute("width", planeWidth);
        videoPlane.setAttribute("height", planeWidth * offset);
        adjustPlanePivot();
        videoPlane.dataset.initialized = true;
    }

    // マーカー位置に毎回再配置
    const markerWorldPos = new THREE.Vector3();
    marker.object3D.updateMatrixWorld(true);
    marker.object3D.getWorldPosition(markerWorldPos);
    videoPlane.object3D.position.copy(markerWorldPos);

    videoPlane.setAttribute("visible", true);
    startPlayback();
});

// 🔹 マーカー失っても表示維持
marker.addEventListener("markerLost", () => {
    markerVisible = false;
    // videoPlane.visible はそのまま
});

// 🔹 フレーム読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
