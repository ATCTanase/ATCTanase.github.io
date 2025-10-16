const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
const scene      = document.querySelector("a-scene");

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);
let offset;

const ARImage = "../../04_image/ARImage/AR3_南部の曲屋_うまやの馬";
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


let lastPosition = new THREE.Vector3();
let lastQuaternion = new THREE.Quaternion();
let update3DoFFrameId = null;

marker.addEventListener("markerFound", () => {
    // 6DoFに戻す
    if(update3DoFFrameId) {
        cancelAnimationFrame(update3DoFFrameId);
        update3DoFFrameId = null;
    }
    // 親をマーカーに戻す
    marker.object3D.add(videoPlane.object3D);

    videoPlane.setAttribute("visible", true);
    videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);
    startPlayback();
});

marker.addEventListener("markerLost", () => {
    stopPlayback();

    // 現在のワールドTransformを保持
    videoPlane.object3D.getWorldPosition(lastPosition);
    videoPlane.object3D.getWorldQuaternion(lastQuaternion);

    // マーカーから外してシーン直下に置く
    scene.object3D.add(videoPlane.object3D);
    videoPlane.object3D.position.copy(lastPosition);
    videoPlane.object3D.quaternion.copy(lastQuaternion);

    // 3DoF更新ループ
    const camera = document.querySelector("[camera]").object3D;
    const update3DoF = () => {
        // マーカーが再認識されたら停止
        if(marker.object3D.children.includes(videoPlane.object3D)) return;

        videoPlane.object3D.quaternion.copy(camera.quaternion);
        update3DoFFrameId = requestAnimationFrame(update3DoF);
    };
    update3DoF();
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
