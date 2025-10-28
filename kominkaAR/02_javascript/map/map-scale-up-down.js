// マップ拡縮ボタン押下処理

const inHouseMapSwipeErea = document.getElementById("inHouseMapSwipeErea");
let iHMSEbaseWidth;
let iHMSEbaseHeight;

window.addEventListener("load", function () {
    iHMSEbaseWidth  = inHouseMapSwipeErea.offsetWidth;
    iHMSEbaseHeight = inHouseMapSwipeErea.offsetHeight;
});

function scaleUp() {
    if (newScale < 1.6) {
        newScale *= 1.1;

        // 実際のサイズを変更
        inHouseMapSwipeErea.style.width  = iHMSEbaseWidth  * newScale + "px";
        inHouseMapSwipeErea.style.height = iHMSEbaseHeight * newScale + "px";
    }
}

function scaleDown() {
    if (newScale > 1) {
        newScale /= 1.1;

        // 1より小さくなったら強制的に1に戻す
        if (newScale < 1) {
            newScale = 1;
        }

        // 実際のサイズを変更
        inHouseMapSwipeErea.style.width  = iHMSEbaseWidth  * newScale + "px";
        inHouseMapSwipeErea.style.height = iHMSEbaseHeight * newScale + "px";
    }
}