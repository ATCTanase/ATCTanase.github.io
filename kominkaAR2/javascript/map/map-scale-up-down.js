// マップ拡縮ボタン押下処理

let array = [];
function scaleUp() {
    const canvasWidth  = canvas.width;
    const canvasHeight = canvas.height;
    const map          = images.map;
    const imageWidth  = map.width;
    const imageHeight = map.height;

    const baseScale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);
    const prevScale = baseScale * zoom;

    zoom *= 1.1;
    const newScale = baseScale * zoom;

    if(isPinching){
        // 縮小処理を安定させるために左上で縮小をする
        offsetX = 0;
        offsetY = 0;
    } else {
        // クリック位置を基準にオフセットを調整
        offsetX = lastClick.x - ((lastClick.x - offsetX) * (newScale / prevScale));
        offsetY = lastClick.y - ((lastClick.y - offsetY) * (newScale / prevScale));
        array.push([offsetX, offsetY]);
    }

    draw();
}

function scaleDown() {
    zoom /= 1.1;

    if(isPinching){
        // 縮小処理を安定させるために左上で縮小をする
        offsetX = 0;
        offsetY = 0;

        if (zoom < 1) {
            zoom = 1;
            isPinching = false;
        }
    } else {
        // 配列に入れたoffsetX・offsetYを最新の値から順に取得する
        if(array.length == 1) {
            offsetX = 0;
            offsetY = 0;
            array.pop();
        }
        if(0 < array.length){
            offsetX = array[array.length - 2][0];
            offsetY = array[array.length - 2][1];
            array.pop();
        }

        // 1より小さくなったら強制的に初期値1に戻す
        if (zoom < 1) {
            zoom = 1;
        }
    }

    draw();
}