// ピンチ操作・ドラッグ操作

let baseScale = 1.0;
let touchStartDist = 0;   // ピンチ距離（2本指間距離）
let lastX = 0, lastY = 0;
let isDragging;
let isPinching;
// --- タッチ操作 ---
canvas.addEventListener("touchstart", event => {
    if (event.touches.length === 1) {
        // ドラッグ開始
        isDragging = true;
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;
    } else if (event.touches.length === 2) {
        // ピンチ開始
        isDragging = false;
        touchStartDist = getTouchDist(event);
        baseScale = zoom;

        isPinching = true;
        // ピンチ中心を取得
        pinchCenter = getTouchCenter(event);
        // ピンチ操作をした後に縮小ボタンを押下した時、配列の中に要素があると
        // そこを基準に縮小した結果、縮小位置が画面外になる場合があるので
        // クリック位置の配列はリセットする
        array = [];
    }
});

canvas.addEventListener("touchmove", event => {
    // event.preventDefault();

    if (event.touches.length === 1 && isDragging) {
        // ドラッグ処理
        const dx = event.touches[0].clientX - lastX;
        const dy = event.touches[0].clientY - lastY;

        offsetX += dx;
        offsetY += dy;

        limitOffset(); // 範囲制限
        lastX = event.touches[0].clientX;
        lastY = event.touches[0].clientY;

        draw();
    } else if (event.touches.length === 2) {
        // ピンチ処理
        const newDist = getTouchDist(event);
        const scaleFactor = newDist / touchStartDist;

        const prevZoom = zoom;
        if((baseScale * scaleFactor) < 1){
            zoom = 1;
        } else {
            zoom = baseScale * scaleFactor;
        }

        // ズームする中心を「pinchCenter」にする補正
        // const canvasRect = canvas.getBoundingClientRect();
        const cx = pinchCenter.x;
        const cy = pinchCenter.y;

        // pinchCenterの位置をズーム前後で同じ見た目位置に保つ
        offsetX -= (cx - offsetX) * (zoom / prevZoom - 1);
        offsetY -= (cy - offsetY) * (zoom / prevZoom - 1);

        limitOffset(); // 範囲制限
        draw();
    }
});

canvas.addEventListener("touchend", event => {
    if (event.touches.length === 0) {
        isDragging = false;
    }
});

// ピンチ開始時に中心点を計算
function getTouchCenter(event) {
    const x = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    const y = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    return { x, y };
}
// --- 2本指間の距離を計算 ---
function getTouchDist(event) {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.hypot(dx, dy);
}

// --- 範囲制限 ---
function limitOffset() {
    const canvasWidth  = canvas.width;
    const canvasHeight = canvas.height;
    const map          = images.map;
    const imageWidth  = map.width;
    const imageHeight = map.height;
    const baseScale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
    const newWidth  = imageWidth  * baseScale * zoom; // 拡大後の画像の幅
    const newHeight = imageHeight * baseScale * zoom;

    if (newWidth > canvasWidth) {
        const maxOffsetX = 0;                      // ゼロより大きい ⇒ 画面の右端より右にドラッグしている。つまり画面外に出ているので、ゼロを指定する
        const minOffsetX = canvasWidth - newWidth; // キャンバスの幅より拡大した画像の幅より値がマイナス ⇒ 画面の左端より左にドラッグしている。つまり画面外に出ているので、差分を指定する
        offsetX = Math.min(Math.max(offsetX, minOffsetX), maxOffsetX); // clamp処理で端から出ないようにする
    } else {
        offsetX = (canvasWidth - newWidth) / 2;
    }

    if (newHeight > canvasHeight) {
        const maxOffsetY = 0;
        const minOffsetY = canvasHeight - newHeight;
        offsetY = Math.min(Math.max(offsetY, minOffsetY), maxOffsetY);
    } else {
        offsetY = (canvasHeight - newHeight) / 2;
    }
}