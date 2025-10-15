// -----------------------------
// DOM要素
// -----------------------------
const loadingOverlay = document.getElementById("loadingOverlay");
const marker = document.querySelector("#barcodeMarker");

// -----------------------------
// Three.js 独立シーン
// -----------------------------
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
document.body.appendChild(renderer.domElement);

// AR.js カメラ追従用
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 0);

// 原点代わりの親グループ
const originGroup = new THREE.Group();
scene.add(originGroup);

// -----------------------------
// 固定画像オブジェクト
// -----------------------------
const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手.png";
const texture = new THREE.TextureLoader().load(ARImage, () => {
    if (loadingOverlay) loadingOverlay.style.display = "none";
    console.log("[✅] テクスチャ読み込み完了");
});

const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const geometry = new THREE.PlaneGeometry(1, ratio);
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.position.set(0, 0, 0); // 原点に配置
fixedMesh.visible = false;
originGroup.add(fixedMesh);

// -----------------------------
// マーカー原点固定フラグ
// -----------------------------
let originSet = false;
let followMarker = false;

// -----------------------------
// マーカー検出イベント
// -----------------------------
marker.addEventListener("markerFound", () => {
    followMarker = true;
    fixedMesh.visible = true;

    console.log("🟢 markerFound!");

    if (!originSet) {
        // マーカー座標を原点に設定
        const markerPos = new THREE.Vector3();
        const markerQuat = new THREE.Quaternion();
        marker.object3D.getWorldPosition(markerPos);
        marker.object3D.getWorldQuaternion(markerQuat);

        originGroup.position.copy(markerPos);
        originGroup.quaternion.copy(markerQuat);

        originSet = true;

        console.log("📍 マーカー原点固定:");
        console.log("   markerPos:", markerPos);
        console.log("   markerQuat:", markerQuat);
    }
});

marker.addEventListener("markerLost", () => {
    followMarker = false;
    console.log("🔴 markerLost!");
});

// -----------------------------
// マーカーON/OFF切替用
// -----------------------------
let guidemarkerOnOff = false;
function onOff() {
    if (guidemarkerOnOff) {
        marker.removeAttribute("axes-helper");
        guidemarkerOnOff = false;
    } else {
        marker.setAttribute("axes-helper", "size: 3");
        guidemarkerOnOff = true;
    }
}

// -----------------------------
// 毎フレーム更新
// -----------------------------
const arCamera = document.querySelector("a-entity[camera]").object3D;
const tempPos = new THREE.Vector3();
const tempQuat = new THREE.Quaternion();

function animate() {
    requestAnimationFrame(animate);

    // AR.js カメラに追従
    arCamera.getWorldPosition(tempPos);
    arCamera.getWorldQuaternion(tempQuat);

    camera.position.copy(tempPos);
    camera.quaternion.copy(tempQuat);

    // デバッグログ：1秒に1回だけ
    if (Math.floor(performance.now() / 1000) % 1 === 0 && originSet) {
        const objPos = fixedMesh.getWorldPosition(new THREE.Vector3());
        console.log("---- FRAME LOG ----");
        console.log("📸 arCamera:", tempPos);
        console.log("🌍 originGroup:", originGroup.position);
        console.log("🧱 fixedMesh:", objPos);
    }

    renderer.render(scene, camera);
}

animate();
