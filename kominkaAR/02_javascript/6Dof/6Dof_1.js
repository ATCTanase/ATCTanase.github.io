const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
const camera = document.querySelector("#mainCamera");

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

let markerLastPos = new THREE.Vector3();
let markerLastQuat = new THREE.Quaternion();
let cameraLastQuat = new THREE.Quaternion(); // ロスト時のスマホ角度保持
let gyroQuat = new THREE.Quaternion();       // 現在のスマホ角度
let lastDistance = 0;
let pseudoMode = false;
let appliedOnce = false;
let lastCamPos = new THREE.Vector3();
let lastCamQuat = new THREE.Quaternion();
// マーカーイベント
marker.addEventListener("markerFound", () => {
    videoPlane.setAttribute("visible", true);
    startPlayback();
    
    // 初期化
    pseudoMode = false;

    // 記録
    marker.object3D.getWorldPosition(markerLastPos);
    marker.object3D.getWorldQuaternion(markerLastQuat);
    
    camera.setAttribute('look-controls', {
      enabled: false,
      magicWindowTrackingEnabled: false
    });
    
    camera.object3D.quaternion.copy(new THREE.Quaternion());
    console.log("markerFound:lastCamQuat",lastCamQuat);
});
marker.addEventListener("markerLost", () => {
    pseudoMode = true;
    stopPlayback();

    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });
    appliedOnce = false;
});

AFRAME.registerComponent('pseudo-stabilizer', {
    tick: function () {
        if (!pseudoMode) {
            marker.object3D.getWorldPosition(markerLastPos);
            marker.object3D.getWorldQuaternion(markerLastQuat);
            videoPlane.object3D.position.copy(markerLastPos);
            videoPlane.object3D.quaternion.copy(markerLastQuat);
        }
        else {
            // マーカー消失後、初回のみ
            if (!appliedOnce) {
                const camQuat = camera.object3D.quaternion;

                // カメラ回転が初期値ならスルー
                if (camQuat.equals(new THREE.Quaternion())) return;

                const cam = camera.object3D;
                const obj = videoPlane.object3D;
                const offset = markerLastPos.clone().sub(cam.position);
                offset.applyQuaternion(camQuat);

                obj.position.copy(cam.position.clone().add(offset));
                
                const worldQuat = camQuat.clone().multiply(markerLastQuat);
                obj.quaternion.copy(worldQuat);
                
                appliedOnce = true; // 初回適用済み
            }
        }
    }
});

document.querySelector('a-scene').setAttribute('pseudo-stabilizer', '');
// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
