const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

// Canvas作成
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

const scene = document.querySelector('a-scene').object3D;

// Three.jsオブジェクト作成（例: Planeに画像）

const texture = new THREE.TextureLoader().load(`${ARImage}${frameExt}`) ;
const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const geometry = new THREE.PlaneGeometry(1, ratio);
geometry.translate(0, 0.5 * ratio, 0); // 下端中央基準
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.visible = false;
scene.add(fixedMesh);

// 最後にマーカーがあった座標を保持
let lastMarkerPosition = new THREE.Vector3();

// 🔹 全フレームロード
function preloadFrames(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `${ARImage}${frameExt}`;
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
marker.addEventListener("markerFound", () => {
    marker.object3D.updateMatrixWorld(true);

    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    marker.object3D.getWorldPosition(pos);
    marker.object3D.getWorldQuaternion(quat);

    fixedMesh.position.copy(pos);
    fixedMesh.quaternion.copy(quat);

    fixedMesh.visible = true;
    startPlayback();
});


// 🔹 マーカーを失ったとき
marker.addEventListener("markerLost", () => {
});

// 🔹 フレーム読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
