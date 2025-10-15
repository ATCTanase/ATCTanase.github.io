    // A-Frameシーンが完全にロードされてからメインスクリプトを実行
    document.querySelector('a-scene').addEventListener('loaded', function () {
        const videoPlane = document.getElementById("videoPlane");
        const marker     = document.getElementById("barcodeMarker");
        // const scene      = document.querySelector('a-scene'); // a-scene要素はここでは直接不要だが、参考用

        // Canvasを作成
        const canvas = document.createElement("canvas");
        canvas.width  = 512; // 画像の幅と高さに合わせて調整してください
        canvas.height = 512; // Three.jsのテクスチャサイズとして一般的な512x512
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        videoPlane.setAttribute("material", "src", canvas);
        let offset; // 画像の縦横比 (height / width)

        const ARImage = "../../04_image/ARImage/AR1_日向椎葉の舞手";
        const frameCount = 1; // 現状は1フレーム
        const frameExt = ".png";
        const frames = [];
        let currentFrame = 0;
        const fps = 20; // フレームレート
        let playTimer = null;

        const loadingOverlay = document.getElementById("loadingOverlay");
        const progressText   = document.getElementById("progress");

        let isImageFixed = false; // 画像がAR空間に固定されたかどうかのフラグ

        // 🔹 全フレームをロード
        function preloadFrames(callback) {
            let loaded = 0;
            for (let i = 1; i <= frameCount; i++) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = `${ARImage}${frameExt}`; // ご提示のコードに合わせて修正
                img.onload = () => {
                    loaded++;
                    progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
                    if (loaded === frameCount) {
                        console.log("✅ 全フレームロード完了");
                        loadingOverlay.style.display = "none"; // ローディング画面を隠す
                        callback();
                        offset =  img.height / img.width; // 縦横比を計算
                    }
                };
                img.onerror = () => {
                    console.error(`Error loading image: ${img.src}`);
                };
                frames.push(img);
            }
        }

        function drawNextFrame() {
            if (frames.length === 0 || !frames[currentFrame]) return;

            const img = frames[currentFrame];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const mat = videoPlane.getObject3D("mesh")?.material;
            if (mat?.map) mat.map.needsUpdate = true;

            currentFrame = (currentFrame + 1) % frameCount;
        }

        function startPlayback() {
            if (!playTimer) {
                drawNextFrame(); // 最初のフレームをすぐに描画
                if (frameCount > 1) { // 複数フレームの場合のみアニメーションを繰り返す
                    playTimer = setInterval(drawNextFrame, 1000 / fps);
                }
            }
        }
        function stopPlayback() {
            if (playTimer) {
                clearInterval(playTimer);
                playTimer = null;
            }
        }

        // Three.jsのヘルパーオブジェクト（一時的な格納用）
        const tempPosition = new THREE.Vector3();
        const tempQuaternion = new THREE.Quaternion();

        // マーカーイベント
        marker.addEventListener("markerFound", () => {
            console.log("Marker found!");
            if (!isImageFixed) { // まだAR空間に固定されていない場合のみ実行
                videoPlane.setAttribute("visible", true);
                videoPlane.setAttribute("height", videoPlane.getAttribute("width") * offset);

                // マーカーの現在のワールド座標と回転を取得
                marker.object3D.getWorldPosition(tempPosition);
                marker.object3D.getWorldQuaternion(tempQuaternion);

                // videoPlaneにワールド座標と回転を設定
                // A-Frameのrotation="-90 0 0"は、Three.jsではX軸の-PI/2ラジアン回転に相当
                // マーカーの回転にこのオフセットを適用する必要がある
                const planeInitialRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
                tempQuaternion.multiply(planeInitialRotation); // マーカーの回転にPlaneの初期回転を結合

                videoPlane.object3D.position.copy(tempPosition);
                videoPlane.object3D.quaternion.copy(tempQuaternion);

                isImageFixed = true; // 画像を固定するフラグを立てる
                startPlayback();
            }
        });

        marker.addEventListener("markerLost", () => {
            console.log("Marker lost!");
            // マーカーが失われてもvideoPlaneのvisible属性は変更しない
            // isImageFixedがtrueなので、videoPlaneはすでにAR空間に固定されている
            stopPlayback();
        });

        // 🔹 まずフレームを読み込み開始
        preloadFrames(() => {
            console.log("アニメーション準備完了");
        });
    });