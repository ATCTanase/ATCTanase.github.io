// 解説ページを見た・ARを見たことを契機にcookieに値を追加する
document.addEventListener("DOMContentLoaded", () => {
    // console.log("cookie：" + document.cookie);
    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function (value) {
        const content = value.split("=");

        if (content[0].trim(" ").indexOf("watchedAR") != -1) {
            changeToWatchedStamp(content[1]);
        }

        if (content[0].trim(" ").indexOf("watchedExplanation") != -1) {
            changeToWatchedStamp(content[1]);
        }
    })
});

let stampList = [];
function changeToWatchedStamp(ARStamp) {
    if (ARStamp == "AR1") {
        stampList.push("AR1");
    }

    if (ARStamp == "AR2") {
        stampList.push("AR2");
    }

    if (ARStamp == "AR3") {
        stampList.push("AR3");
    }

    if (ARStamp == "AR4") {
        stampList.push("AR4");
    }

    if (ARStamp == "AR5") {
        stampList.push("AR5");
    }

    if (ARStamp == "AR6") {
        stampList.push("AR6");
    }

    if (ARStamp == "Explanation1") {
        stampList.push("Explanation1");
    }

    if (ARStamp == "Explanation2") {
        stampList.push("Explanation2");
    }

    if (ARStamp == "Explanation3") {
        stampList.push("Explanation3");
    }

    if (ARStamp == "Explanation4") {
        stampList.push("Explanation4");
    }

    if (ARStamp == "Explanation5") {
        stampList.push("Explanation5");
    }

    if (ARStamp == "Explanation6") {
        stampList.push("Explanation6");
    }
}