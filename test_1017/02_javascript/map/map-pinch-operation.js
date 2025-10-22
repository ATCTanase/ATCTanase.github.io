// マップのピンチ操作を実装
// imgではなくdivに対して行っていることに注意

const img = document.getElementById("inHouseMapSwipeErea");

let mapScale = 1;         // 現在の拡大率
let startDistance = 0;    // ピンチ開始時の指の距離
let newScale = 1;

// 2点間の距離を計算する関数
function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
}

img.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        startDistance = getDistance(e.touches);
    }
});

img.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        const pinchRatio = currentDistance / startDistance;
        newScale = Math.min(Math.max(mapScale * pinchRatio, 0.5), 3); // 0.5～3倍に制限
        if (1 < newScale) {
            img.style.transform = `scale(${newScale})`
        } else {
            img.style.transform = `scale(1)`
        }
        console.log(mapScale);
    }
});

img.addEventListener("touchend", (e) => {
    // ピンチが終わったときに拡大率を確定
    if (e.touches.length < 2) {
        const transform = img.style.transform.match(/scale\(([^)]+)\)/);
        if (transform) mapScale = parseFloat(transform[1]);
    }
});