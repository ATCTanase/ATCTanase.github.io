// 背景画像の地図の枠にinHouseMapSwipeEreaを合わせるため、動的に高さを設定する
// スマホによって画面の長さが変わる関係で動的に値を計算してinHouseMapSwipeEreaに当てはめることが難しかったので、
// ダミー画像で疑似的に地図の枠の長さを取得してinHouseMapSwipeEreaに当てはめている
// iosで縦→横→縦画面に切り替えるとhiddenを設定しているのにも関わらず、はみ出た要素が見えてしまうので、
// それ対策も兼ねて実装している

// 館内マップ
const dummyImgMap                 = document.getElementById("dummyImgMap");
const inHouseMapDirectionErea     = document.getElementById("inHouseMapDirectionErea");
const inHouseMapDisplayErea       = document.getElementById("inHouseMapDisplayErea");
const inHouseMapScaleUpDownErea   = document.getElementById("inHouseMapScaleUpDownErea");
const inHouseMapSwipeEreaOuteside = document.getElementById("inHouseMapSwipeEreaOuteside");
// スタンプラリー
const dummyImgStampRally    = document.getElementById("dummyImgStampRally");
const stampRallyErea        = document.getElementById("stampRallyErea");
const stampRallyExplanation = document.getElementById("stampRallyExplanation");
const stampRallyResultErea  = document.getElementById("stampRallyResultErea");

const url = window.location.href;

window.addEventListener("load", function () {
    if (url.indexOf("inHouseMap") != -1) {
        // padding-topの値を取得するために、inHouseMapDisplayEreaの横幅を取得する
        const style = window.getComputedStyle(inHouseMapDisplayErea);
        const widthStr = style.width;

        // ダミー画像の高さから"padding-top: 37%"を引いた値を、inHouseMapSwipeEreaOutesideに設定する
        // padding-topの値は親要素のwidthから求めるらしい
        inHouseMapSwipeEreaOuteside.style.height = dummyImgMap.clientHeight - (parseFloat(widthStr) * 0.37) + "px";
        
        inHouseMapScaleUpDownErea.setAttribute("style", "bottom:" + (window.innerHeight - dummyImgMap.clientHeight + 2)  + "px;");
        inHouseMapDirectionErea.setAttribute(  "style", "bottom:" + (window.innerHeight - dummyImgMap.clientHeight + 10) + "px;");
    }

    if (url.indexOf("stampRally") != -1) {
        const style = window.getComputedStyle(stampRallyErea);
        const widthStr = style.width;

        // ダミー画像の高さから"padding-top: 7%"と"stampRallyExplanation"のheightの合計を引いた値を、stampRallyResultEreaに設定する
        stampRallyResultErea.style.height = dummyImgStampRally.clientHeight - (parseFloat(widthStr) * 0.07 + stampRallyExplanation.height) + "px";
    }
})