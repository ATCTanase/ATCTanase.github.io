const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

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

let trackingMode = "6dof";
let lastKnownPosition = new THREE.Vector3();
let lastKnownQuaternion = new THREE.Quaternion();

// DeviceOrientationデータ
let alpha = 0, beta = 0, gamma = 0;

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
    trackingMode = "6dof";
    videoPlane.setAttribute("visible", true);
    videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);
    startPlayback();
});
marker.addEventListener("markerLost", () => {
    
    trackingMode = "3dof";
    const obj = videoPlane.object3D;
    lastPosition.copy(obj.position);
    lastQuaternion.copy(obj.quaternion);
    stopPlayback();
});
let deviceEuler = new THREE.Euler(0, 0, 0, "YXZ");

window.addEventListener("deviceorientation", (event) => {
    const alpha = THREE.MathUtils.degToRad(event.alpha || 0); // Yaw
    const beta  = THREE.MathUtils.degToRad(event.beta  || 0); // Pitch
    const gamma = THREE.MathUtils.degToRad(event.gamma || 0); // Roll
    deviceEuler.set(beta, alpha, -gamma);
});
AFRAME.registerComponent("tracking-switcher", {
    tick: function () {
        const obj = videoPlane.object3D;
        if (trackingMode === "6dof") {
                const pos = new THREE.Vector3();
                const quat = new THREE.Quaternion();
                marker.object3D.getWorldPosition(pos);
                marker.object3D.getWorldQuaternion(quat);

                fixedMesh.position.copy(pos);
                fixedMesh.quaternion.copy(quat);
        } else if (trackingMode === "3dof") {
            // 位置は固定（マーカーが最後にあった場所）
            obj.position.copy(lastPosition);

            // 向きだけデバイス回転を適用
            const q = new THREE.Quaternion().setFromEuler(deviceEuler);
            obj.quaternion.copy(lastQuaternion.clone().multiply(q));
        }
    },
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
