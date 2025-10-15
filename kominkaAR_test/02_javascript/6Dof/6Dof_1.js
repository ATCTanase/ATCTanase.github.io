const videoPlane = document.getElementById("videoPlane");
const marker     = document.getElementById("barcodeMarker");

// Canvas作成（任意：使わない場合は削除OK）
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
videoPlane.setAttribute("material", "src", canvas);

let imageMesh = null;
let offset;

// Three.jsのシーン取得（A-Frameの中身を共有）
const aframeScene = document.querySelector("a-scene");
const threeScene = aframeScene.object3D;

// === 画像設定 ===
const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手.png";

// === 状態管理 ===
let objectPlaced = false; // 配置済みかどうか

// --- Three.js Planeを作成 ---
new THREE.TextureLoader().load(
    ARImage,
    (texture) => {
        const ratio = texture.image.height / texture.image.width;
        const geometry = new THREE.PlaneGeometry(1, ratio);
        geometry.translate(0, ratio / 2, 0); // 🔸 下端を基準点に
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true
        });

        imageMesh = new THREE.Mesh(geometry, material);
        imageMesh.visible = false;
        threeScene.add(imageMesh);
        console.log("✅ テクスチャロード完了");
    }
);

// --- マーカーイベント ---
marker.addEventListener("markerFound", () => {
    if (!imageMesh) return;

    // 🔹 マーカーのワールド位置・回転・スケールを取得
    marker.object3D.updateMatrixWorld(true);
    const markerPos = new THREE.Vector3();
    const markerQuat = new THREE.Quaternion();
    const markerScale = new THREE.Vector3();
    marker.object3D.getWorldPosition(markerPos);
    marker.object3D.getWorldQuaternion(markerQuat);
    marker.object3D.getWorldScale(markerScale);

    // 🔹 imageMesh が存在すれば座標更新
    imageMesh.position.copy(markerPos);
    imageMesh.quaternion.copy(markerQuat);
    imageMesh.scale.copy(markerScale);

    // 🔹 基準点を下端中央に補正
    const ratio = imageMesh.geometry.parameters.height / imageMesh.geometry.parameters.width;
    const offset = new THREE.Vector3(0, -0.5 * ratio, 0);
    offset.applyQuaternion(markerQuat);
    imageMesh.position.add(offset);

    // 🔹 表示ON
    imageMesh.visible = true;

    // 🔹 親から切り離して固定（これが重要！）
    if (!objectPlaced) {
        threeScene.attach(imageMesh); // markerから独立させる
        objectPlaced = true;
        console.log("📍 オブジェクト固定しました");
    } else {
        console.log("♻️ 既存オブジェクトを再配置しました");
    }
});

// 🔹 マーカー消失時（何もしない）
marker.addEventListener("markerLost", () => {
    // imageMesh.visible = true; // 消さない
});
