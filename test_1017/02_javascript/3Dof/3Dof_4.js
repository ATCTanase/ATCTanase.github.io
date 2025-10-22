const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane = document.getElementById("videoPlane");
const camera = document.querySelector("#mainCamera");

let markerTimer = null;
let markerVisible = false;

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

const ARImage = "../../04_image/ARImage/AR4_小豆島の農村歌舞伎舞台";
const frameCount = 1;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null;

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText = document.getElementById("progress");

let offset;

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

let markerPositionX = 0;
let markerPositionY = -2.5;
let markerPositionZ = -7;
let cameraFrag = true;

// barcodeMarker.addEventListener("markerFound", () => {
//     if (!cameraFrag) return;

//     if (!markerVisible) {
//         markerVisible = true;
//         videoPlane.setAttribute("visible", "true");
//         startPlayback();
//         cameraFrag = false;

//         // カメラ視点のリセット（look-controlsを一時有効化）
//         camera.setAttribute("look-controls", {
//             enabled: true,
//             magicWindowTrackingEnabled: true
//         });

//         markerTimer = setTimeout(() => {
//             if (markerVisible) {
//                 const markerWorldPos = new THREE.Vector3();
//                 barcodeMarker.object3D.updateMatrixWorld(true);
//                 barcodeMarker.object3D.getWorldPosition(markerWorldPos);

//                 const offsetPosition = markerWorldPos.clone().add(new THREE.Vector3(parseInt(markerPositionX), parseInt(markerPositionY), parseInt(markerPositionZ)));
//                 videoPlane.object3D.position.copy(offsetPosition);
//                 videoPlane.setAttribute("visible", "true");  // ← マーカー検出時に表示
//             }
//         }, 100);
//     }
// });

barcodeMarker.addEventListener("markerLost", () => {
    markerVisible = false;
    CountOverlay.textContent = parseInt((holdTime) / 1000);
    if (markerTimer) {
        clearTimeout(markerTimer);
        markerTimer = null;
    }
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});

const AROverlay = document.getElementById("AROverlay");
const CountOverlay = document.getElementById("CountOverlay");
const centerThreshold = 0.2; // 画面中央±20%以内を「中央」とみなす
const holdTime = 3000; // 3秒保持で確定

let markerWorldPos;
let holdStartTime = null;
let markerFound = false;

window.addEventListener("load", () => {
    const cameraEntity = document.querySelector("[camera]");

    if (!cameraEntity) {
        console.error("カメラが見つかりません。<a-entity camera> を確認してください。");
        return;
    }

    const threeCamera = cameraEntity.getObject3D("camera");

    // マーカーの認識位置検出
    function checkMarkerPosition() {
        if (!barcodeMarker.object3D.visible) {
            // マーカーが見えなくなったらリセット
            holdStartTime = null;
            if (markerFound) markerFound = false;
            return;
        }

        // --- マーカー四隅のワールド座標を取得 ---
        const markerSize = 0.2; // meter
        const half = markerSize / 2;
        const corners = [
            new THREE.Vector3(-half, -half, 0),
            new THREE.Vector3(half, -half, 0),
            new THREE.Vector3(half, half, 0),
            new THREE.Vector3(-half, half, 0),
        ];

        const worldCorners = corners.map(v =>
            v.clone().applyMatrix4(barcodeMarker.object3D.matrixWorld)
        );

        // --- 四隅の中点（見た目上の中心）を算出 ---
        const avg = worldCorners.reduce((sum, v) => sum.add(v), new THREE.Vector3()).multiplyScalar(1 / 4);

        // --- カメラ空間へ投影してスクリーン中心との距離を求める ---
        const projected = avg.clone().project(threeCamera);
        const dx = projected.x;
        const dy = projected.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const inCenter = dist < centerThreshold;

        if (inCenter) {
            if (!holdStartTime) {
                holdStartTime = Date.now();
            } else {
                CountOverlay.textContent = parseInt((holdTime - (Date.now() - holdStartTime)) / 1000);
                if (!markerFound && Date.now() - holdStartTime >= holdTime) {
                    markerFound = true;
                    barcodeMarker.dispatchEvent(new CustomEvent("centerMarkerFound"));
                }
            }
        } else {
            CountOverlay.textContent = parseInt((holdTime) / 1000);
            holdStartTime = null;
            if (markerFound) markerFound = false;
        }
    }

    function loop() {
        requestAnimationFrame(loop);
        checkMarkerPosition();
    }
    loop();
});

barcodeMarker.addEventListener("centerMarkerFound", () => {
    if (!cameraFrag) {
        return;
    }

    if (!markerVisible) {
        markerVisible = true;
        videoPlane.setAttribute("visible", "true");
        startPlayback();
        cameraFrag = false;

        videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);

        // カメラ視点のリセット（look-controlsを一時有効化）
        camera.setAttribute("look-controls", {
            enabled: true,
            magicWindowTrackingEnabled: true
        });

        markerTimer = setTimeout(() => {
            if (markerVisible) {
                markerWorldPos = new THREE.Vector3();
                barcodeMarker.object3D.updateMatrixWorld(true);
                barcodeMarker.object3D.getWorldPosition(markerWorldPos);

                const offsetPosition = markerWorldPos.clone().add(new THREE.Vector3(parseInt(markerPositionX), parseInt(markerPositionY), parseInt(markerPositionZ)));
                videoPlane.object3D.position.copy(offsetPosition);
                videoPlane.setAttribute("visible", "true");  // ← マーカー検出時に表示
                AROverlay.style.display = "none";
                CountOverlay.style.display = "none";
            }
        }, 100);
    }
});