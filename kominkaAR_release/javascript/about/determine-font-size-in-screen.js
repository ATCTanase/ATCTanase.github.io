// 文字サイズを画面サイズに合わせる
const aboutThisSiteExplanatoryImg = document.getElementById("aboutThisSiteExplanatoryImg");
const explanatoryTextErea         = document.getElementById("explanatoryTextErea");

aboutThisSiteExplanatoryImg.onload = function () {
    const fontSize = aboutThisSiteExplanatoryImg.offsetHeight * 0.01 * 1.9;
    explanatoryTextErea.setAttribute("style", "font-size: " + fontSize + "px;");
}