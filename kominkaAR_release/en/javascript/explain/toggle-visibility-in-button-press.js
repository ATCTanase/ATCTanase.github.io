// ボタン押下時のコンテンツの表示・非表示を管理
let iframeContents;

// 古民家AR体験方法ダイアログの閉じるボタン押下時
function howToClose() {
    const howToExperienceIt = document.getElementById("howToExperienceIt");
    howToExperienceIt.setAttribute("style", "display:none;");
}
// ARを見るボタン押下時
function howToExperienceItDialog() {
    const howToExperienceIt = document.getElementById("howToExperienceIt");
    howToExperienceIt.setAttribute("style", "display:block;");
}

// こっちはARがある版
// 戻るボタン押下時
function watchMovieClose() {
    // 初期表示に戻す
    const imageFlickErea = document.getElementById("imageFlickErea");
    imageFlickErea.setAttribute("style", "display:block;");
    const watchARButtonErea = document.getElementById("watchARButtonErea");
    watchARButtonErea.setAttribute("style", "display:block;");
    const watchMovieButtonErea = document.getElementById("watchMovieButtonErea");
    watchMovieButtonErea.setAttribute("style", "display:block;");

    // Youtube関連の要素は非表示にする
    const watchMovie = document.getElementById("watchMovie");
    watchMovie.setAttribute("style", "display:none;");
    const watchMovieBackButtonErea = document.getElementById("watchMovieBackButtonErea");
    watchMovieBackButtonErea.setAttribute("style", "display:none;");

    // iframe要素を削除しないと動画が停止しない
    const iframeErea = document.getElementById("iframeErea");
    iframeErea.innerHTML.remove;
}
// 映像を見るボタン押下時
function watchMovieDialog() {
    // Youtube要素を表示するために非表示にする
    const imageFlickErea = document.getElementById("imageFlickErea");
    imageFlickErea.setAttribute("style", "display:none;");
    const watchARButtonErea = document.getElementById("watchARButtonErea");
    watchARButtonErea.setAttribute("style", "display:none;");
    const watchMovieButtonErea = document.getElementById("watchMovieButtonErea");
    watchMovieButtonErea.setAttribute("style", "display:none;");

    // Youtube要素を表示する
    const watchMovie = document.getElementById("watchMovie");
    watchMovie.setAttribute("style", "display:block;");
    const watchMovieBackButtonErea = document.getElementById("watchMovieBackButtonErea");
    watchMovieBackButtonErea.setAttribute("style", "display:block;");

    // iframeを新規追加する。動画はidentification-with-ar.jsで選別
    const iframeErea = document.getElementById("iframeErea");
    iframeErea.innerHTML = iframeContents;
}

// こっちはARがない版
function watchMovieLongClose() {
    const imageFlickErea = document.getElementById("imageFlickErea");
    imageFlickErea.setAttribute("style", "display:block;");
    const watchMovieLongButtonErea = document.getElementById("watchMovieLongButtonErea");
    watchMovieLongButtonErea.setAttribute("style", "display:block;");

    const watchMovie = document.getElementById("watchMovie");
    watchMovie.setAttribute("style", "display:none;");
    const watchMovieBackButtonErea = document.getElementById("watchMovieBackButtonErea");
    watchMovieBackButtonErea.setAttribute("style", "display:none;");

    const iframeErea = document.getElementById("iframeErea");
    iframeErea.innerHTML.remove;
}
function watchMovieLongDialog() {
    const imageFlickErea = document.getElementById("imageFlickErea");
    imageFlickErea.setAttribute("style", "display:none;");
    const watchMovieLongButtonErea = document.getElementById("watchMovieLongButtonErea");
    watchMovieLongButtonErea.setAttribute("style", "display:none;");

    const watchMovie = document.getElementById("watchMovie");
    watchMovie.setAttribute("style", "display:block;");
    const watchMovieBackButtonErea = document.getElementById("watchMovieBackButtonErea");
    watchMovieBackButtonErea.setAttribute("style", "display:block;");

    // 動画はidentification-no-ar.jsで選別
    const iframeErea = document.getElementById("iframeErea");
    iframeErea.innerHTML = iframeContents;
}