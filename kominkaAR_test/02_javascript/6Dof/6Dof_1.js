// -----------------------------
// DOM要素
// -----------------------------
const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");
const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

// -----------------------------
// Canvas作成
// -----------------------------
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

// -----------------------------
// AR画像
// -----------------------------
const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手";
const frames = [];
const texture = new THREE.TextureLoader().load(ARImage+".png", ()=>{
    if(loadingOverlay) loadingOverlay.style.display = "none";
});

const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const geometry = new THREE.PlaneGeometry(1, ratio);
geometry.translate(0, 0.5*ratio, 0); // 下端中央基準
const material = new THREE.MeshBasicMaterial({ map: texture, transparent:true, side:THREE.DoubleSide });

// -----------------------------
// A-Frameシーン & originGroup
// -----------------------------
const sceneEl = document.querySelector('a-scene');
let camera = null;
const scene = sceneEl.object3D;
const originGroup = new THREE.Group();
scene.add(originGroup);
// シーンの初期化完了後にカメラを取得
sceneEl.addEventListener('loaded', () => {
    camera = sceneEl.camera;
    console.log("✅ A-Frame camera ready:", camera);
});


const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.visible = false;
originGroup.add(fixedMesh);

// -----------------------------
// 状態
// -----------------------------
let followMarker = false;
let baselinePosition = new THREE.Vector3();
let baselineRotation = new THREE.Quaternion();
let baselineEuler = new THREE.Euler('ZXY');
let currentEuler = new THREE.Euler('ZXY');

let initialBeta  = 0;
let initialGamma = 0;
const moveScale = 1;

// -----------------------------
// マーカーイベント
// -----------------------------
marker.addEventListener("markerFound", ()=>{
    followMarker = true;
    fixedMesh.visible = true;
});

marker.addEventListener("markerLost", ()=>{
    followMarker = false;

    // マーカー追従時の最後の座標を保持
    marker.object3D.getWorldPosition(baselinePosition);
    marker.object3D.getWorldQuaternion(baselineRotation);
    baselineEuler.setFromQuaternion(baselineRotation,'ZXY');

    initialBeta  = currentEuler.x;
    initialGamma = currentEuler.y;
});

// -----------------------------
// デバイス傾き
// -----------------------------
window.addEventListener("deviceorientation", (event)=>{
    currentEuler.x = THREE.MathUtils.degToRad(event.beta  || 0);   // 上下
    currentEuler.y = THREE.MathUtils.degToRad(event.gamma || 0);   // 左右
    currentEuler.z = THREE.MathUtils.degToRad(event.alpha || 0);
});

// -----------------------------
// 毎フレーム更新
// -----------------------------
function updateFixedMesh(){
    requestAnimationFrame(updateFixedMesh);

    if(followMarker){
        // マーカー追従
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        marker.object3D.getWorldPosition(pos);
        marker.object3D.getWorldQuaternion(quat);

        originGroup.worldToLocal(pos);
        const invOriginQuat = originGroup.getWorldQuaternion(new THREE.Quaternion()).invert();
        quat.premultiply(invOriginQuat);

        fixedMesh.position.copy(pos);
        fixedMesh.quaternion.copy(quat);
    } else {
        if (!camera) return;
        // マーカー消失中: 回転は固定
        fixedMesh.quaternion.copy(baselineRotation);

        // スマホ傾き差分
        const deltaBeta  = currentEuler.x - initialBeta;   // 前後傾き → Y移動
        const deltaGamma = currentEuler.y - initialGamma;  // 左右傾き → X移動

        const moveAmount = -deltaGamma * moveScale * 0.1;

        // カメラから見た各方向ベクトルを取得
        const cameraRight = new THREE.Vector3();   // 右方向 (+X)
        const cameraUp = new THREE.Vector3();      // 上方向 (+Y)
        const cameraForward = new THREE.Vector3(); // 前方向 (-Z)
        camera.matrix.extractBasis(cameraRight, cameraUp, cameraForward);
        cameraForward.negate(); // 前方向は -Z

        console.log("deltaBeta:", THREE.MathUtils.radToDeg(deltaBeta).toFixed(2),
            "deltaGamma:", THREE.MathUtils.radToDeg(deltaGamma).toFixed(2));
        console.log("cameraRight:", cameraRight);


        fixedMesh.position.addScaledVector(cameraRight, moveAmount);
    }
}

updateFixedMesh();
