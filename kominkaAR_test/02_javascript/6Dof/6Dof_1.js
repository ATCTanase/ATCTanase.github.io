const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

// Canvasを作成
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

let offset;
let imageMesh = null;

// --- パラメータ ---
const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手.png";
const frameCount = 1;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null;

// --- UI要素 ---
const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

// --- Three.jsのシーンを取得 ---
const aframeScene = document.querySelector("a-scene");
const threeScene = aframeScene.object3D;

// 🔹 テクスチャをロードしてMeshを作成
new THREE.TextureLoader().load(
    ARImage,
    (texture) => {
        const ratio = texture.image.height / texture.image.width;
        const geometry = new THREE.PlaneGeometry(1, ratio);
        geometry.translate(0, ratio / 2, 0); // 下端を原点に

        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });

        imageMesh = new THREE.Mesh(geometry, material);
        imageMesh.visible = false;
        threeScene.add(imageMesh);

        console.log("✅ 画像Meshロード完了");
    },
    undefined,
    (err) => console.error("❌ テクスチャ読み込み失敗:", err)
);


// --- フレーム描画関連 ---
function drawNextFrame() {
    const img = frames[currentFrame];
    if (!img) return;
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


// --- マーカーイベント ---
marker.addEventListener("markerFound", () => {
    if (!imageMesh) return; // テクスチャ未読み込み防止

    marker.object3D.updateMatrixWorld(true);

    // マーカーのワールド位置・回転・スケールを取得
    const markerPos = new THREE.Vector3();
    const markerQuat = new THREE.Quaternion();
    const markerScale = new THREE.Vector3();
    marker.object3D.getWorldPosition(markerPos);
    marker.object3D.getWorldQuaternion(markerQuat);
    marker.object3D.getWorldScale(markerScale);

    // Meshをマーカー位置に配置
    imageMesh.position.copy(markerPos);
    imageMesh.quaternion.copy(markerQuat);
    imageMesh.scale.copy(markerScale);

    // 下端中央を基準にオフセット
    const ratio = imageMesh.geometry.parameters.height / imageMesh.geometry.parameters.width;
    const offset = new THREE.Vector3(0, -0.5 * ratio, 0);
    offset.applyQuaternion(markerQuat);
    imageMesh.position.add(offset);

    imageMesh.visible = true;
    startPlayback();
});

marker.addEventListener("markerLost", () => {
    // stopPlayback();
    // マーカーが消えても保持（表示したまま）
});


// --- フレーム読み込み ---
function preloadFrames(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `${ARImage}`; // 1枚だけ
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
preloadFrames(() => console.log("🎨 アニメーション準備完了"));
