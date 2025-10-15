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
const frameCount = 1; // 1枚固定
const frameExt = ".png";
const frames = [];
const imagePath = ARImage + frameExt;

let currentFrame = 0;
const fps = 20;
let playTimer = null;

// -----------------------------
// A-Frameシーン
// -----------------------------
const scene = document.querySelector('a-scene').object3D;

// -----------------------------
// originGroupを作り、fixedMeshを追加
// -----------------------------
const originGroup = new THREE.Group();
scene.add(originGroup);

const texture = new THREE.TextureLoader().load(imagePath, ()=>{
    if(loadingOverlay) loadingOverlay.style.display = "none";
});

const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const geometry = new THREE.PlaneGeometry(1, ratio);
geometry.translate(0, 0.5 * ratio, 0); // 下端中央基準
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.visible = false;
originGroup.add(fixedMesh);

// -----------------------------
// 状態フラグ
// -----------------------------
let followMarker = false;
let baselinePosition = new THREE.Vector3();
let baselineRotation = new THREE.Quaternion();
let baselineEuler = new THREE.Euler(); // マーカー追従時の回転を固定

let initialBeta = 0;
let initialGamma = 0;
const moveScale = 0.05;

// -----------------------------
// Canvas描画
// -----------------------------
function preloadFrames(callback){
    let loaded = 0;
    for(let i=0; i<frameCount; i++){
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `${ARImage}${frameExt}`;
        img.onload = ()=>{
            loaded++;
            progressText.textContent = Math.floor((loaded/frameCount)*100) + "%";
            if(loaded===frameCount){
                if(loadingOverlay) loadingOverlay.style.display = "none";
                callback();
            }
        };
        frames.push(img);
    }
}

function drawNextFrame(){
    const img = frames[currentFrame];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);

    const mat = videoPlane.getObject3D("mesh")?.material;
    if(mat?.map) mat.map.needsUpdate = true;

    currentFrame = (currentFrame+1) % frameCount;
}

function startPlayback(){
    if(!playTimer) playTimer = setInterval(drawNextFrame, 1000/fps);
}

preloadFrames(()=>{ console.log("アニメーション準備完了"); startPlayback(); });

// -----------------------------
// マーカーイベント
// -----------------------------
marker.addEventListener("markerFound", ()=>{
    followMarker = true;
    fixedMesh.visible = true;
});

marker.addEventListener("markerLost", ()=>{
    followMarker = false;

    // マーカー消失時の位置固定
    marker.object3D.getWorldPosition(baselinePosition);

    // マーカー追従時の回転を固定
    marker.object3D.getWorldQuaternion(baselineRotation);
    baselineEuler.setFromQuaternion(baselineRotation, 'ZXY');

    // 初期角度を記録
    initialBeta = currentRotationEuler.x;
    initialGamma = currentRotationEuler.y;
});

// -----------------------------
// デバイス傾き
// -----------------------------
window.addEventListener("deviceorientation", (event)=>{
    currentRotationEuler.set(
        THREE.MathUtils.degToRad(event.beta  || 0),
        THREE.MathUtils.degToRad(event.gamma || 0),
        THREE.MathUtils.degToRad(event.alpha || 0),
        'ZXY'
    );
});

// -----------------------------
// 毎フレーム更新
// -----------------------------
function updateFixedMesh(){
    if(followMarker){
        // マーカー追従
        const pos = new THREE.Vector3();
        const quat = new THREE.Quaternion();
        marker.object3D.getWorldPosition(pos);
        marker.object3D.getWorldQuaternion(quat);

        // originGroup基準に変換
        originGroup.worldToLocal(pos);
        const invOriginQuat = originGroup.getWorldQuaternion(new THREE.Quaternion()).invert();
        quat.premultiply(invOriginQuat);

        fixedMesh.position.copy(pos);
        fixedMesh.quaternion.copy(quat);

    } else {
        // マーカー消失後: 回転は固定
        fixedMesh.quaternion.copy(baselineRotation);

        // スマホの傾き差分
        const deltaBeta  = currentRotationEuler.x - initialBeta;   // 前後傾き → 上下移動
        const deltaGamma = currentRotationEuler.y - initialGamma;  // 左右傾き → 横移動

        const right = new THREE.Vector3(1,0,0);   // 横方向
        const up    = new THREE.Vector3(0,1,0);   // 上下方向

        // リバース適用
        const moveRight = right.clone().multiplyScalar(-Math.sin(deltaGamma)*moveScale);
        const moveUp    = up.clone().multiplyScalar(-Math.sin(deltaBeta)*moveScale);

        fixedMesh.position.copy(baselinePosition).add(moveForward).add(moveRight);
    }

    requestAnimationFrame(updateFixedMesh);
}

updateFixedMesh();
