// マップのピンチ操作を実装
// imgではなくdivに対して行っていることに注意
const mapDiv = document.getElementById("inHouseMapSwipeErea");
let mapScale = 1;         // 現在の拡大率
let startDistance = 0;    // ピンチ開始時の指の距離
let newScale = 1;

// 元のサイズを記録
let baseWidth;
let baseHeight;

window.addEventListener("load", function () {
  baseWidth  = mapDiv.offsetWidth;
  baseHeight = mapDiv.offsetHeight;
});


// 2点間の距離を計算する関数
function getDistance(touches) {
  const [touch1, touch2] = touches;
  const dx = touch1.pageX - touch2.pageX;
  const dy = touch1.pageY - touch2.pageY;
  return Math.sqrt(dx * dx + dy * dy);
}

mapDiv.addEventListener("touchstart", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();
    startDistance = getDistance(event.touches);
  }
});

mapDiv.addEventListener("touchmove", (event) => {
  if (event.touches.length === 2) {
    event.preventDefault();
    const currentDistance = getDistance(event.touches);
    const pinchRatio = currentDistance / startDistance;

    // 新しい拡大率を0.5〜3倍に制限
    newScale = Math.min(Math.max(mapScale * pinchRatio, 0.5), 3);

    // 実際のwidthとheightを更新
    if (1 < newScale) {
      mapDiv.style.width  = baseWidth  * newScale + "px";
      mapDiv.style.height = baseHeight * newScale + "px";
    } else {
      mapDiv.style.width  = baseWidth  * 1 + "px";
      mapDiv.style.height = baseHeight * 1 + "px";
      newScale = 1;
    }
  }
});

mapDiv.addEventListener("touchend", (event) => {
  if (event.touches.length < 2) {
    // ピンチが終了したら拡大率を確定
    mapScale = newScale;
  }
});