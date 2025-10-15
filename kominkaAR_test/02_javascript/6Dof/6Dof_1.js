const scene = document.querySelector('a-scene').object3D;

// 🔹 追従オブジェクト
const texture = new THREE.TextureLoader().load("../../04_image/ARImage/AR1_日向椎葉の舞手.png");
const ratio = texture.image ? texture.image.height / texture.image.width : 1;
const geometry = new THREE.PlaneGeometry(1, ratio);
geometry.translate(0, 0.5 * ratio, 0);
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const fixedMesh = new THREE.Mesh(geometry, material);
fixedMesh.visible = false;

// 🔹 マーカー追従フラグ
let followMarker = false;

// 🔹 マーカー消失後に独立させるためのグループ
const independentGroup = new THREE.Group();
scene.add(independentGroup);
let independentMesh = null;

// 🔹 マーカー検出
marker.addEventListener("markerFound", () => {
    followMarker = true;
    fixedMesh.visible = true;
});

// 🔹 マーカー消失
marker.addEventListener("markerLost", () => {
    followMarker = false;

    // マーカー座標系からワールド座標系に変換
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    marker.object3D.getWorldPosition(worldPos);
    marker.object3D.getWorldQuaternion(worldQuat);

    // 固定用の新しいメッシュを independentGroup に追加

    if (!independentMesh) {
        // 初めて固定する場合は clone
        independentMesh = fixedMesh.clone();
        independentMesh.visible = true;
        independentGroup.add(independentMesh);
    }
    // 座標・回転を更新
    independentMesh.position.copy(worldPos);
    independentMesh.quaternion.copy(worldQuat);

    independentGroup.add(independentMesh);

    // 元の fixedMesh は非表示にする
    fixedMesh.visible = false;
});

// 🔹 毎フレーム更新
function updateFixedMesh() {
    if (followMarker) {
        marker.object3D.getWorldPosition(fixedMesh.position);
        marker.object3D.getWorldQuaternion(fixedMesh.quaternion);
    }
    requestAnimationFrame(updateFixedMesh);
}

scene.add(fixedMesh);
updateFixedMesh();
