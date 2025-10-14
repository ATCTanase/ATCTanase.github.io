let startX, endX; // 座標を記録する変数
const minSwipeDistance = 50; // 最小スワイプ距離

const flickImage1     = document.getElementById("flickImage1");
const flickImage2     = document.getElementById("flickImage2");
const flickImage3     = document.getElementById("flickImage3");
const flickImageLamp1 = document.getElementById("flickImageLamp1");
const flickImageLamp2 = document.getElementById("flickImageLamp2");
const flickImageLamp3 = document.getElementById("flickImageLamp3");

// タッチ開始時の座標を取得
document.addEventListener("touchstart", function (event) {
    startX = event.touches[0].clientX;
});

// タッチ終了時の座標を取得し、スワイプ方向を判定
document.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].clientX;
    let diffX = endX - startX; // X方向の移動距離
    const clickedElement = event.target; //画像スワイプエリアかどうかを判断する

    if (minSwipeDistance < Math.abs(diffX)) {
        // 横方向のスワイプ判定
        if (0 < diffX) {
            // 右スワイプ
            if(clickedElement.id == "flickImage2"){
                flickImage1.setAttribute("style", "align-items: center; display: flex; justify-content: center;")
                flickImage2.setAttribute("style", "display: none;")
                flickImage3.setAttribute("style", "display: none;")

                flickImageLamp1.setAttribute("style", "background-color: orange;")
                flickImageLamp2.setAttribute("style", "background-color: white;")
                flickImageLamp3.setAttribute("style", "background-color: white;")
            }else if(clickedElement.id == "flickImage3"){
                flickImage2.setAttribute("style", "align-items: center; display: flex; justify-content: center;")
                flickImage1.setAttribute("style", "display: none;")
                flickImage3.setAttribute("style", "display: none;")

                flickImageLamp2.setAttribute("style", "background-color: orange;")
                flickImageLamp1.setAttribute("style", "background-color: white;")
                flickImageLamp3.setAttribute("style", "background-color: white;")
            }
        } else {
            if(clickedElement.id == "flickImage1"){
                flickImage2.setAttribute("style", "align-items: center; display: flex; justify-content: center;")
                flickImage1.setAttribute("style", "display: none;")
                flickImage3.setAttribute("style", "display: none;")
                
                flickImageLamp2.setAttribute("style", "background-color: orange;")
                flickImageLamp1.setAttribute("style", "background-color: white;")
                flickImageLamp3.setAttribute("style", "background-color: white;")
            }else if(clickedElement.id == "flickImage2"){
                flickImage3.setAttribute("style", "align-items: center; display: flex; justify-content: center;")
                flickImage1.setAttribute("style", "display: none;")
                flickImage2.setAttribute("style", "display: none;")

                flickImageLamp3.setAttribute("style", "background-color: orange;")
                flickImageLamp1.setAttribute("style", "background-color: white;")
                flickImageLamp2.setAttribute("style", "background-color: white;")
            }
        }
    }
});