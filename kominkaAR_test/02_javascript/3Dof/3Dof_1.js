const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane    = document.getElementById("videoPlane");
const videoGroup    = document.getElementById("videoGroup");
const camera        = document.querySelector("#mainCamera");


let markerTimer = null;
let markerVisible = false;

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

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

let markerPositionX = 0;
let markerPositionY = -1.2;
let markerPositionZ = -2;
let cameraFrag = true;
let update6DoFFrameId = null;

let lastMarkerPos = new THREE.Vector3();
let lastMarkerQuat = new THREE.Quaternion();

function update6DoF() {
    if (!markerVisible) return;
    const markerWorldPos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    barcodeMarker.object3D.updateMatrixWorld(true);
    barcodeMarker.object3D.getWorldPosition(markerWorldPos);
    barcodeMarker.object3D.getWorldQuaternion(quat);

    // videoGroup を追従させる
    videoGroup.object3D.position.copy(markerWorldPos);  

    videoPlane.object3D.position.set(markerPositionX, markerPositionY, markerPositionZ);
    videoPlane.object3D.quaternion.copy(quat);
    
    lastMarkerPos.copy(markerWorldPos);
    lastMarkerQuat.copy(quat);
    
    update6DoFFrameId = requestAnimationFrame(update6DoF);
};

barcodeMarker.addEventListener("markerFound", () => {
    barcodeMarker.setAttribute("axes-helper", "size: 2");
    // look-controlsを無効化
    camera.setAttribute("look-controls", {
        enabled: false,
        magicWindowTrackingEnabled: false
    });
    markerVisible = true;

    if(cameraFrag) {
        videoPlane.setAttribute("visible", "true");
        cameraFrag = false;  
    
        const planeMesh = videoPlane.getObject3D("mesh");
        if (planeMesh) {
            planeMesh.geometry.translate(0, planeMesh.geometry.parameters.height / 2, 0);
        }
        startPlayback();
    }
        
    setTimeout(() => {
       update6DoF();
    }, 200);
});

barcodeMarker.addEventListener("markerLost", () => {
    markerVisible = false;
    if (update6DoFFrameId) { 
        cancelAnimationFrame(update6DoFFrameId);
        update6DoFFrameId = null;
    }

    camera.setAttribute("look-controls", {
        enabled: true,
        magicWindowTrackingEnabled: true
    });
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});