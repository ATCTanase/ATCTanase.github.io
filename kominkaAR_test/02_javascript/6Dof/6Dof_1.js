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
const imagePath = ARImage + frameExt;

let currentFrame = 0;
const fps = 20;
let playTimer = null;

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

const scene = document.querySelector('a-scene').object3D;

// Three.jsオブジェクト作成（例: Planeに画像）

const texture = new THREE.TextureLoader().load(imagePath);
const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const geometry = new THREE.PlaneGeometry(1, ratio);
geometry.translate(0, 0.5 * ratio, 0); // 下端中央基準
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.visible = false;
scene.add(fixedMesh);

// 最後にマーカーがあった座標を保持
let lastMarkerPosition = new THREE.Vector3();
let lastRotation = new THREE.Quaternion();

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

let followMarker = false; 

function startPlayback() {
    if (!playTimer) playTimer = setInterval(drawNextFrame, 1000 / fps);
}
function stopPlayback() {
    if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
    }
}

let followMarker = false;

// マーカー消失時の基準
let baselineRotation = new THREE.Quaternion();
let baselinePosition = new THREE.Vector3();

let currentRotationEuler = new THREE.Euler();


const moveScale = 0.05; // 傾きに応じた移動量の倍率

marker.addEventListener("markerFound", () => {
    followMarker = true;    // 追従開始
    fixedMesh.visible = true;

    startPlayback();
});


// 🔹 マーカーを失ったとき
marker.addEventListener("markerLost", () => {
    followMarker = false;   // 追従終了、位置固定

    // 基準として現在のスマホ姿勢を保存
    const alpha = THREE.MathUtils.degToRad(currentRotationEuler.z || 0);
    const beta  = THREE.MathUtils.degToRad(currentRotationEuler.x || 0);
    const gamma = THREE.MathUtils.degToRad(currentRotationEuler.y || 0);

    baselineRotation.setFromEuler(new THREE.Euler(beta, gamma, alpha, 'ZXY'));
    baselinePosition.copy(fixedMesh.position);
});

window.addEventListener("deviceorientation", (event)=>{
    currentRotationEuler.set(
        THREE.MathUtils.degToRad(event.beta  || 0),
        THREE.MathUtils.degToRad(event.gamma || 0),
        THREE.MathUtils.degToRad(event.alpha || 0),
        'ZXY'
    );
});


function updateFixedMesh(){
    if(followMarker){
        // マーカー追従
        marker.object3D.getWorldPosition(fixedMesh.position);
        marker.object3D.getWorldQuaternion(fixedMesh.quaternion);
    } else {
        // 基準からの回転差
        const currentQuat = new THREE.Quaternion().setFromEuler(currentRotationEuler);
        const deltaQuat = currentQuat.clone().multiply(baselineRotation.clone().invert());

        // 回転に応じてオブジェクト回転
        fixedMesh.quaternion.copy(deltaQuat);

        // 回転差から移動を生成（例：X軸回転→Z移動, Y軸回転→X移動）
        const deltaEuler = new THREE.Euler().setFromQuaternion(deltaQuat, 'ZXY');
        fixedMesh.position.set(
            baselinePosition.x + Math.sin(deltaEuler.y) * moveScale,
            baselinePosition.y,
            baselinePosition.z + Math.sin(deltaEuler.x) * moveScale
        );
    }

    requestAnimationFrame(updateFixedMesh);
}

updateFixedMesh();









// 🔹 フレーム読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
});