// const videoPlane = document.getElementById("videoPlane"); // HTMLから削除したので不要
const marker     = document.getElementById("barcodeMarker");
const sceneEl    = document.querySelector("a-scene"); // A-Frameシーン要素

let threeScene; // Three.jsのシーン
let threeCamera; // Three.jsのカメラ
let videoMesh; // Three.jsで作成する平面メッシュ

// Canvasを作成 (これは以前と同じ)
const canvas = document.createElement("canvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d", { willReadFrequently: true });
let offset; // 画像のアスペクト比

const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手";
const frameCount = 1;
const frameExt = ".png";
const frames = [];
let currentFrame = 0;
const fps = 20;
let playTimer = null; // アニメーションタイマー

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

let isMarkerVisible = false; // マーカーが現在見えているかどうかのフラグ
let objectFixed = false; // オブジェクトがワールド座標に固定されたかどうかのフラグ

// 🔹 全フレームをロード
function preloadFrames(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        // img.src = `${ARImage}${String(i).padStart(3, "0")}${frameExt}`;
        img.src = `${ARImage}${frameExt}`;
        img.onload = () => {
            loaded++;
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none";
                callback();
                offset = img.height / img.width; // 画像のアスペクト比を設定
            }
        };
        frames.push(img);
    }
}

// Canvasにフレームを描画
function drawNextFrame() {
    if (!videoMesh || !videoMesh.material.map) return;

    const img = frames[currentFrame];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    videoMesh.material.map.needsUpdate = true; // Three.jsテクスチャの更新
    currentFrame = (currentFrame + 1) % frameCount;
}

function startPlayback() {
    if (!playTimer) {
        drawNextFrame(); // 初回描画
        playTimer = setInterval(drawNextFrame, 1000 / fps);
    }
}
function stopPlayback() {
    if (playTimer) {
        clearInterval(playTimer);
        playTimer = null;
    }
}

// A-Frameシーンが完全にロードされた後にThree.jsオブジェクトを作成
sceneEl.addEventListener('loaded', () => {
    threeScene = sceneEl.object3D;
    threeCamera = sceneEl.camera;

    // Three.jsでジオメトリとマテリアルを作成
    const geometry = new THREE.PlaneGeometry(1, 1); // デフォルトサイズ
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.01 // 透明部分を完全に抜く
    });

    videoMesh = new THREE.Mesh(geometry, material);
    videoMesh.rotation.x = -Math.PI / 2; // X軸に-90度回転させて水平にする
    videoMesh.visible = false; // 最初は非表示
    videoMesh.scale.y = offset; // アスペクト比に合わせて高さを調整

    threeScene.add(videoMesh); // シーンにメッシュを追加
    console.log("Three.js videoMesh created and added to scene.");

    // 初期アスペクト比の設定
    if (offset) {
        videoMesh.scale.y = videoMesh.scale.x * offset;
    }
});


// マーカーイベント
marker.addEventListener("markerFound", () => {
    if (!isMarkerVisible) { // 初回検出時、またはロスト後に再検出された場合のみ処理
        console.log("Marker Found!");
        isMarkerVisible = true;
        objectFixed = false; // マーカー検出中は固定を解除し、追従させる

        if (videoMesh) {
            videoMesh.visible = true; // オブジェクトを表示
            startPlayback(); // アニメーション開始
        }
    }
});

marker.addEventListener("markerLost", () => {
    if (isMarkerVisible) { // マーカーがロストした場合の処理
        console.log("Marker Lost!");
        isMarkerVisible = false;
        objectFixed = true; // マーカーロスト時はオブジェクトを固定

        if (videoMesh) {
            // videoMesh.visible = false; // 固定した状態で非表示にする場合はコメントアウト解除
            stopPlayback(); // アニメーション停止
        }
    }
});

// A-Frameのtickイベントで毎フレームの更新処理
sceneEl.addEventListener('tick', () => {
    if (!videoMesh || !marker.object3D) return;

    if (isMarkerVisible && !objectFixed) {
        // マーカーが見えていて、まだ固定されていない場合、マーカーの姿勢に追従
        // マーカーのワールド行列を取得
        const markerMatrix = marker.object3D.matrixWorld;

        // videoMeshのmatrixを直接更新
        videoMesh.matrix.copy(markerMatrix);
        
        // 回転のオフセット（-90度）を適用するため、個別に設定
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
    // else if (objectFixed) {
    //     // マーカーロストでオブジェクトが固定された場合、ここでは何もしない
    //     // ただし、非表示にする場合はmarkerLostイベントで処理済み
    // }
});


// 🔹 まずフレームを読み込み開始
preloadFrames(() => {
    console.log("アニメーション準備完了");
    // ここでvideoMeshの初期化を行う場合もあるが、loadedイベントで実施済み
});