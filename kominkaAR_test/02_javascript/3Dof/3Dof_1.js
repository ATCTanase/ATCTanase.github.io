const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane    = document.getElementById("videoPlane");
const videoGroup    = document.getElementById("videoGroup");
let mainCamera  = null;
let subCamera = null;

document.addEventListener('DOMContentLoaded', () => {
    mainCamera = document.getElementById('mainCamera');
    subCamera = document.getElementById('subCamera');
});

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

let lastCamPos = new THREE.Vector3();
let lastCamQuat = new THREE.Quaternion();


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
    
    mainCamera.object3D.updateMatrixWorld(true);
    mainCamera.object3D.getWorldPosition(lastCamPos);
    mainCamera.object3D.getWorldQuaternion(lastCamQuat);
    
    update6DoFFrameId = requestAnimationFrame(update6DoF);
};

barcodeMarker.addEventListener("markerFound", () => {
    barcodeMarker.setAttribute("axes-helper", "size: 2");
    barcodeMarker.setAttribute("visible", "true"); // visible を true に設定
    barcodeMarker.setAttribute("position", "0 0 0");
    markerVisible = true;
    
    if(cameraFrag)
    {
        cameraFrag = false;
    }
    else{
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();

        subCamera.object3D.updateMatrixWorld(true);
        subCamera.object3D.getWorldPosition(pos);
        subCamera.object3D.getWorldQuaternion(quat);
            
        // 切り替え後のカメラに座標と回転を適用
        mainCamera.object3D.position.copy(pos);
        mainCamera.object3D.quaternion.copy(quat);

        mainCamera.setAttribute('camera', 'active', true);
        subCamera.setAttribute('camera', 'active', false);
    }

    startPlayback();
    
    setTimeout(() => {
       update6DoF();
    }, 200);
});
// videoPlane.addEventListener('loaded', () => {
//     const planeMesh = videoPlane.getObject3D("mesh");
//     if (planeMesh) {
//         planeMesh.geometry.translate(0, planeMesh.geometry.parameters.height / 2, 0);
//     }
// });

barcodeMarker.addEventListener("markerLost", () => {
    
    markerVisible = false;
    stopPlayback();
    if (update6DoFFrameId) { 
        cancelAnimationFrame(update6DoFFrameId);
        update6DoFFrameId = null;
    }
            
    // 切り替え後のカメラに座標と回転を適用
    subCamera.object3D.position.copy(lastCamPos);
    subCamera.object3D.quaternion.copy(lastCamQuat);

    mainCamera.setAttribute('camera', 'active', false);
    subCamera.setAttribute('camera', 'active', true);
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});