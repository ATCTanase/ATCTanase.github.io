const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

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

// Three.js シーン取得
const aframeScene = document.querySelector("a-scene");
const threeScene = aframeScene.object3D;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.xr.enabled = true;  // XR対応

document.body.appendChild(renderer.domElement);


// 固定オブジェクト用の Three.js Mesh を作成
const texture = new THREE.TextureLoader().load(`${ARImage}${frameExt}`);
const ratio = 1; // 仮で1:1（後で画像の比率で調整）
const geometry = new THREE.PlaneGeometry(1, ratio);
geometry.translate(0, ratio / 2, 0); // 基準を下端中央に
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.visible = false;
threeScene.add(fixedMesh);
const camera = new THREE.PerspectiveCamera();
threeScene.add(camera);

function render() {
    renderer.setAnimationLoop(() => {
        renderer.render(threeScene, camera); // camera は自動で端末トラッキングに従う
    });
}
render();

// === アニメーション処理 ===
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
                console.log("✅ 全フレームロード完了");
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

// === マーカーイベント ===
marker.addEventListener("markerFound", () => {
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    marker.object3D.updateMatrixWorld(true);
    marker.object3D.getWorldPosition(pos);
    marker.object3D.getWorldQuaternion(quat);

    fixedMesh.position.copy(pos);
    fixedMesh.quaternion.copy(quat);

    const offsetVec = new THREE.Vector3(0, 0.5 * offset, 0);
    offsetVec.applyQuaternion(quat);
    fixedMesh.position.add(offsetVec);

    fixedMesh.visible = true;

    
    camera.setAttribute("look-controls", {
        enabled: false,
        magicWindowTrackingEnabled: false
    });
    console.log("🎯 マーカー位置に固定配置完了");
});

marker.addEventListener("markerLost", () => {
    // マーカーを失っても非表示にしない
    console.log("ℹ️ マーカー見失ったがオブジェクトは保持");
    camera.setAttribute("look-controls", {
        enabled: true,
        magicWindowTrackingEnabled: true
    });
});

// === フレーム読み込み開始 ===
preloadFrames(() => {
    console.log("アニメーション準備完了");
});
