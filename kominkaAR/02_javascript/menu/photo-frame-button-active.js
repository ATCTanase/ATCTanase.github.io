// スタンプをコンプリーとしたら活性化
document.addEventListener("DOMContentLoaded", () => {
    if (stampList.length == 12) {
        const menuCompletePhotoFrameIncomplete = $("#menuCompletePhotoFrameIncomplete");
        const menuCompletePhotoFrame = $("#menuCompletePhotoFrame");

        menuCompletePhotoFrameIncomplete.hide();
        menuCompletePhotoFrame.show();
    }
});