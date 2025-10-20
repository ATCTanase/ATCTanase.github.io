const scene = document.querySelector("a-scene");
const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
let  cameraEl  = null;

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

let update6DoFFrameId = null;
let clone = null;
function update6DoF() {
    if (!markerVisible) return;

    const srcObj = videoPlane.object3D;
    const dstObj = clone.object3D;
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    srcObj.getWorldPosition(pos);
    srcObj.getWorldQuaternion(quat);
    srcObj.getWorldScale(scale);

    // ワールド座標と回転をコピー
    dstObj.position.copy(pos);
    dstObj.quaternion.copy(quat);
    dstObj.scale.copy(scale);

    update6DoFFrameId = requestAnimationFrame(update6DoF);
};
// マーカーイベント
marker.addEventListener("markerFound", () => {
    markerVisible = true;
    if(cameraEl == null)
    {
        cameraEl = scene.camera.el;
    }
    videoPlane.setAttribute("visible", true);
    videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);
    startPlayback();

    cameraEl.setAttribute("look-controls", {
        enabled: false,
        magicWindowTrackingEnabled: false
    });

    // 既存の clone があれば削除
    if (clone == null) {
        // videoPlaneの複製を作成
        clone = videoPlane.cloneNode(true);
        clone.setAttribute("id", "videoPlaneClone");
        clone.setAttribute("visible", true);
        clone.setAttribute("material", "src", canvas);
    }
    
    cameraEl.appendChild(clone);
    update6DoFFrameId = requestAnimationFrame(update6DoF);
});

marker.addEventListener("markerLost", () => {
    markerVisible = false;
    if (update6DoFFrameId) { 
        cancelAnimationFrame(update6DoFFrameId);
        update6DoFFrameId = null;
    }
    

    cameraEl.setAttribute("look-controls", {
        enabled: true,
        magicWindowTrackingEnabled: true
    });

    scene.appendChild(clone);
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
