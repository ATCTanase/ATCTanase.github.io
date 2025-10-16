// const videoPlane = document.getElementById("videoPlane"); // HTMLから削除したので不要
const marker     = document.getElementById("barcodeMarker");
const sceneEl    = document.querySelector("a-scene"); // A-Frameシーン要素

let threeScene; // Three.jsのシーン
let threeCamera; // Three.jsのカメラ
let videoMesh; // Three.jsで作成する平面メッシュ
let textureImage; // ロードする画像オブジェクト


let offset; // 画像のアスペクト比

const ARImageSrc = "../../04_image/ARImage/AR1_日向椎葉の舞手.png"; // 単一の画像パスに修正

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

let isMarkerVisible = false; // マーカーが現在見えているかどうかのフラグ
let objectFixed = false; // オブジェクトがワールド座標に固定されたかどうかのフラグ

// 🔹 単一の画像をロード
function loadImage(callback) {
    textureImage = new Image();
    textureImage.crossOrigin = "anonymous";
    textureImage.src = ARImageSrc;
    textureImage.onload = () => {
        console.log("✅ 画像ロード完了");
        progressText.textContent = "100%";
        loadingOverlay.style.display = "none"; // ローディング画面を隠す

        offset = textureImage.height / textureImage.width; // 画像のアスペクト比を設定
        callback();
    };
    textureImage.onerror = () => {
        console.error("❌ 画像のロードに失敗しました:", ARImageSrc);
        loadingOverlay.innerHTML = "画像のロードに失敗しました。";
    };
    // 進捗は単純に0% -> 100%
    progressText.textContent = "0%";
}

// A-Frameシーンが完全にロードされた後にThree.jsオブジェクトを作成
sceneEl.addEventListener('loaded', () => {
    threeScene = sceneEl.object3D;
    threeCamera = sceneEl.camera; // カメラへのアクセスが必要なら

    // Three.jsでジオメトリとマテリアルを作成
    const geometry = new THREE.PlaneGeometry(1, 1); // デフォルトサイズ
    
    // 画像がロードされるまでプレースホルダーテクスチャを設定
    const placeholderTexture = new THREE.Texture();
    const material = new THREE.MeshBasicMaterial({
        map: placeholderTexture, // 初期は空のテクスチャ
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.01 // 透明部分を完全に抜く
    });

    videoMesh = new THREE.Mesh(geometry, material);
    videoMesh.rotation.x = -Math.PI / 2; // X軸に-90度回転させて水平にする
    videoMesh.visible = false; // 最初は非表示

    threeScene.add(videoMesh); // シーンにメッシュを追加
    console.log("Three.js videoMesh created and added to scene.");

    // 画像がロードされた後にテクスチャを更新
    loadImage(() => {
        // ロードされた画像でテクスチャを更新
        videoMesh.material.map = new THREE.Texture(textureImage);
        videoMesh.material.map.needsUpdate = true; // テクスチャの更新をThree.jsに通知

        // ロードされた画像のアスペクト比に合わせて高さを調整
        if (offset) {
            videoMesh.scale.y = videoMesh.scale.x * offset; // 基準の幅(1)に対して高さを調整
        }
        console.log("videoMesh material updated with loaded image.");
    });
});


// マーカーイベント
marker.addEventListener("markerFound", () => {
    if (!isMarkerVisible) { // 初回検出時、またはロスト後に再検出された場合のみ処理
        console.log("Marker Found!");
        isMarkerVisible = true;
        objectFixed = false; // マーカー検出中は固定を解除し、追従させる

        if (videoMesh && textureImage.complete) { // 画像が完全にロードされていることを確認
            videoMesh.visible = true; // オブジェクトを表示
        }
    }
});

marker.addEventListener("markerLost", () => {
    if (isMarkerVisible) { // マーカーがロストした場合の処理
        console.log("Marker Lost!");
        isMarkerVisible = false;
        objectFixed = true; // マーカーロスト時はオブジェクトを固定

        if (videoMesh) {
        }
    }
});

// A-Frameのtickイベントで毎フレームの更新処理
sceneEl.addEventListener('tick', () => {
    if (!videoMesh || !marker.object3D || !textureImage || !textureImage.complete) return; // 画像がロードされていない場合はスキップ

    if (isMarkerVisible && !objectFixed) {
        // マーカーが見えていて、まだ固定されていない場合、マーカーの姿勢に追従
        const markerMatrix = marker.object3D.matrixWorld;

        // videoMeshのmatrixを直接更新
        videoMesh.matrix.copy(markerMatrix);
        
        // Three.jsのMatrixからPosition/Quaternion/Scaleを抽出し、回転だけ修正
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        videoMesh.matrix.decompose(position, quaternion, scale);

        // PlaneGeometryの向きを修正 (X軸に-90度)
        const rotationOffset = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        quaternion.multiply(rotationOffset); // 既存の回転にオフセットを適用

        videoMesh.position.copy(position);
        videoMesh.quaternion.copy(quaternion);
        // スケールはそのまま
        videoMesh.scale.x = scale.x;
        videoMesh.scale.y = scale.x * offset; // アスペクト比を維持
        videoMesh.scale.z = scale.z; // Zスケールは通常1
        
        videoMesh.updateMatrix(); // Three.jsのObject3Dのmatrixを更新
        videoMesh.updateMatrixWorld(true); // ワールド行列も更新

    } 
});
