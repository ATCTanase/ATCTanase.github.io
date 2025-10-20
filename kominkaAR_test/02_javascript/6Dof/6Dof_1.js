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
let axesAdded = false;
// マーカーイベント
marker.addEventListener("markerFound", () => {  
      if (!axesAdded) {
        marker.setAttribute("axes-helper", "size: 2");
        axesAdded = true;
    }
    console.log("markerFound");
    if(cameraEl == null)
    {
        cameraEl = scene.camera.el;
    }
    videoPlane.setAttribute("visible", true);
    videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);
    startPlayback();
    cameraEl.setAttribute("look-controls", {
        enabled: false,
        magicWindowTrackingEnabled: false,
        resetCamera: false
    });
    
    const cameraObj = cameraEl.object3D;
    const markerObj = marker.object3D;

    markerObj.updateMatrixWorld(true);    
    const helper = marker.object3D.children.find(c => c.type === "AxesHelper");
    if (helper) helper.updateMatrixWorld(true);

    // Vector3 でワールド座標を取得
    const cameraPos = new THREE.Vector3();
    const markerPos = new THREE.Vector3();
    cameraObj.getWorldPosition(cameraPos);
    markerObj.getWorldPosition(markerPos);

    // カメラ → マーカーへのベクトル
    const vectorToMarker = new THREE.Vector3();
    vectorToMarker.subVectors(markerPos, cameraPos); // marker - cameras
    // 距離
    const distance = vectorToMarker.length();

    console.log("Marker position:", markerPos);          // Vector3(x, y, z)
    console.log("markerObj.position:", markerObj.position);          // Vector3(x, y, z)
    console.log("Vector to marker:", vectorToMarker);    // Vector3(x, y, z)
    console.log("Distance to marker:", distance.toFixed(3));

});
marker.addEventListener("markerLost", () => {
    // scene直下に追加
    cameraEl.setAttribute("look-controls", {
        enabled: true,
        magicWindowTrackingEnabled: true,
        resetCamera: false
    });
});

// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
