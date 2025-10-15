// ---------------------
// 独立 Three.js シーン
// ---------------------
const independentScene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.01, 1000);
camera.position.z = 5;

// ---------------------
// 固定用テクスチャ
// ---------------------
const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手.png";
const loadingOverlay = document.getElementById("loadingOverlay");

const texture = new THREE.TextureLoader().load(
  ARImage,
  () => {
    // 読み込み完了時に非表示
    if (loadingOverlay) loadingOverlay.style.display = "none";
  }
);

const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const planeGeometry = new THREE.PlaneGeometry(1, ratio);
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(planeGeometry, planeMaterial);
fixedMesh.visible = false;
independentScene.add(fixedMesh);

// ---------------------
// マーカー処理
// ---------------------
const marker = document.querySelector("#barcodeMarker");
let followMarker = false;
let lastWorldPos = new THREE.Vector3();
let lastWorldQuat = new THREE.Quaternion();

marker.addEventListener("markerFound", () => {
    followMarker = true;
    fixedMesh.visible = true;
});

marker.addEventListener("markerLost", () => {
    followMarker = false;

    // マーカー座標をワールド座標に変換して固定
    marker.object3D.getWorldPosition(lastWorldPos);
    marker.object3D.getWorldQuaternion(lastWorldQuat);
});

// ---------------------
// 毎フレーム更新
// ---------------------
function update() {
    requestAnimationFrame(update);

    if (followMarker) {
        marker.object3D.getWorldPosition(lastWorldPos);
        marker.object3D.getWorldQuaternion(lastWorldQuat);
    }

    fixedMesh.position.copy(lastWorldPos);
    fixedMesh.quaternion.copy(lastWorldQuat);

    renderer.render(independentScene, camera);
}

update();
