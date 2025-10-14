const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

// Canvas作成
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

// 最後にマーカーがあった座標を保持
let lastMarkerPosition = new THREE.Vector3();

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
marker.addEventListener("markerFound", () => {
    // マーカーの位置を取得
    const markerWorldPos = new THREE.Vector3();
    const markerWorldQuat = new THREE.Quaternion();
    marker.object3D.updateMatrixWorld(true);
    marker.object3D.getWorldPosition(markerWorldPos);
    marker.object3D.getWorldQuaternion(markerWorldQuat);

    // videoPlane をシーン直下に移動
    const scene = document.querySelector("a-scene");
    scene.appendChild(videoPlane);

    // ワールド座標・回転を維持
    videoPlane.object3D.position.copy(markerWorldPos);
    videoPlane.object3D.quaternion.copy(markerWorldQuat);

    lastMarkerPosition.copy(markerWorldPos);
    videoPlane.setAttribute("visible", true);
    startPlayback();
});


// 🔹 マーカーを失ったとき
marker.addEventListener("markerLost", () => {
    // 表示は維持
    // ここで座標は更新せず、最後の位置を保持
    videoPlane.object3D.position.copy(lastMarkerPosition);
});

// 🔹 フレーム読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
