// マップ拡縮ボタン押下処理


const inHouseMapSwipeErea = document.querySelector("#inHouseMapSwipeErea");
// let scale = 1;
// マップが拡大しすぎないように&マップが初期表示より小さくならないように設定
// function scaleUp() {
//     if (scale < 1.6) {
//         scale *= 1.1;

//         inHouseMapSwipeErea.style.transform = `scale(${scale})`;
//     }
// }
// function scaleDown() {
//     if (1 < scale) {
//         scale /= 1.1;

//         inHouseMapSwipeErea.style.transform = `scale(${scale})`;
//     }
// }
function scaleUp() {
    if (newScale < 1.6) {
        newScale *= 1.1;

        inHouseMapSwipeErea.style.transform = `scale(${newScale})`;
    }
}
function scaleDown() {
    if (1 < newScale) {
        newScale /= 1.1;
        // 1より小さくなると背景の白色が見えてしまうので強制的に1にする
        if(newScale < 1){
            newScale = 1;
        }

        inHouseMapSwipeErea.style.transform = `scale(${newScale})`;
    }
}