let startX, endX; // 座標を記録する変数
const minSwipeDistance = 50; // 最小スワイプ距離

const flickImage1   = document.getElementById("flickImage1");
const flickImage2   = document.getElementById("flickImage2");
const flickImage3   = document.getElementById("flickImage3");
const indicatorOff1 = $("#indicatorOff1");
const indicatorOn1  = $("#indicatorOn1");
const indicatorOff2 = $("#indicatorOff2");
const indicatorOn2  = $("#indicatorOn2");
const indicatorOff3 = $("#indicatorOff3");
const indicatorOn3  = $("#indicatorOn3");

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
                flickImage1.setAttribute("style", "display: block;");
                flickImage2.setAttribute("style", "display: none;");
                flickImage3.setAttribute("style", "display: none;");

                // 縦に長い画像が表示されても背景が途切れないようにする
                const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
                const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
                backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
                if((contentsHeightLimitErea.offsetHeight + 30) < window.innerHeight){
                    backgroundHiddenErea.setAttribute("style", "height:" + window.innerHeight + "px");
                }

                indicatorOff1.hide();
                indicatorOn1.show();
                indicatorOff2.show();
                indicatorOn2.hide();
                indicatorOff3.show();
                indicatorOn3.hide();
            }else if(clickedElement.id == "flickImage3"){
                flickImage2.setAttribute("style", "display: block;");
                flickImage1.setAttribute("style", "display: none;");
                flickImage3.setAttribute("style", "display: none;");

                const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
                const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
                backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
                if((contentsHeightLimitErea.offsetHeight + 30) < window.innerHeight){
                    backgroundHiddenErea.setAttribute("style", "height:" + window.innerHeight + "px");
                }

                indicatorOff2.hide();
                indicatorOn2.show();
                indicatorOff1.show();
                indicatorOn1.hide();
                indicatorOff3.show();
                indicatorOn3.hide();
            }
        } else {
            // 左スワイプ
            if(clickedElement.id == "flickImage1"){
                flickImage2.setAttribute("style", "display: block;");
                flickImage1.setAttribute("style", "display: none;");
                flickImage3.setAttribute("style", "display: none;");

                const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
                const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
                backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
                if((contentsHeightLimitErea.offsetHeight + 30) < window.innerHeight){
                    backgroundHiddenErea.setAttribute("style", "height:" + window.innerHeight + "px");
                }
                
                indicatorOff2.hide();
                indicatorOn2.show();
                indicatorOff1.show();
                indicatorOn1.hide();
                indicatorOff3.show();
                indicatorOn3.hide();
            }else if(clickedElement.id == "flickImage2"){
                flickImage3.setAttribute("style", "display: block;");
                flickImage1.setAttribute("style", "display: none;");
                flickImage2.setAttribute("style", "display: none;");

                const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
                const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
                backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
                if((contentsHeightLimitErea.offsetHeight + 30) < window.innerHeight){
                    backgroundHiddenErea.setAttribute("style", "height:" + window.innerHeight + "px");
                }

                indicatorOff3.hide();
                indicatorOn3.show();
                indicatorOff1.show();
                indicatorOn1.hide();
                indicatorOff2.show();
                indicatorOn2.hide();
            }
        }
    }
});