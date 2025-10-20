
const scene = document.querySelector("a-scene");
const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
let cameraEl  = null; // ユーザー操作用のカメラエンティティ

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

let isMarkerDetected = false; // マーカー検出状態を管理するフラグ
let originalParent = null; // videoPlaneの元の親要素を保持

// 🔹 全フレームをロード
function preloadFrames(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `${ARImage}${frameExt}`; // フレームが1枚なのでこれでおk
        img.onload = () => {
            loaded++;
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none";
                callback();
                offset = img.height / img.width;
                videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);
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

// マーカーが見つかった際の処理
marker.addEventListener("markerFound", () => {
    console.log("markerFound");
    if (!cameraEl) cameraEl = scene.querySelector('[camera]');

    // マーカーが見つかった場合のみ処理
    if (!isMarkerDetected) {
        // videoPlaneが元の親 (marker) に戻っていることを確認
        if (videoPlane.parentNode !== marker) {
            originalParent = videoPlane.parentNode; // 現在の親を保存 (通常はa-scene)
            marker.appendChild(videoPlane); // マーカーの子に戻す
        }
        videoPlane.setAttribute("visible", true);
        startPlayback();

        // 6DoFを有効に（WASD移動を有効に）
        if (cameraEl) {
            cameraEl.setAttribute("wasd-controls", "enabled: true");
        }
        isMarkerDetected = true;
    }
});

// マーカーが失われた際の処理
marker.addEventListener("markerLost", () => {
    console.log("markerLost");

    // マーカーが失われた場合のみ処理
    if (isMarkerDetected) {
        // videoPlaneの現在のワールド座標と回転を取得
        const worldPosition = new THREE.Vector3();
        const worldQuaternion = new THREE.Quaternion();
        videoPlane.object3D.getWorldPosition(worldPosition);
        videoPlane.object3D.getWorldQuaternion(worldQuaternion);

        // videoPlaneをa-markerから切り離し、a-sceneの直下に追加
        if (videoPlane.parentNode === marker) {
            marker.removeChild(videoPlane);
            scene.appendChild(videoPlane);
        }

        // a-scene直下での位置と回転をワールド座標で設定
        videoPlane.object3D.position.copy(worldPosition);
        videoPlane.object3D.quaternion.copy(worldQuaternion);

        // アニメーションは停止
        stopPlayback();

        // 3DoFを有効に（WASD移動を無効に）
        if (cameraEl) {
            cameraEl.setAttribute("wasd-controls", "enabled: false");
        }
        isMarkerDetected = false;
    }
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});