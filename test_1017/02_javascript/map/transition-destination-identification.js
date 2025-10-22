// 家マークタップ時にurlにパラメータを設定する
// 設定したパラメータは遷移先で表示するコンテンツを識別するために使用する

function transitionDestinationIdentification() {
    document.addEventListener("click", (event) => {
        const clickedElement = event.target;
        const url1 = "/01_html/contentsExplanation/contentsExplanationNoAR.html";
        const url2 = "/01_html/contentsExplanation/contentsExplanationWithAR.html";

        switch (clickedElement.id) {
            case "arExplanationButton1": // 河内布施の長屋門
                location.href = window.location.origin + url1 + "?id=Explanation1";

                break;

            case "arExplanationButton2": // 堂島の米蔵
                location.href = window.location.origin + url1 + "?id=Explanation2";

                break;

            case "arExplanationButton3": // 飛騨白川の民家
                location.href = window.location.origin + url2 + "?id=AR1";

                break;

            case "arExplanationButton4": // 日向椎葉の民家
                location.href = window.location.origin + url2 + "?id=AR2";

                break;

            case "arExplanationButton5": // 摂津能勢の民家
                location.href = window.location.origin + url2 + "?id=AR3";

                break;

            case "arExplanationButton6": // 庵美大島の高倉
                location.href = window.location.origin + url1 + "?id=Explanation3";

                break;

            case "arExplanationButton7": // 信濃秋山の民家
                location.href = window.location.origin + url2 + "?id=AR4";

                break;

            case "arExplanationButton8": // 大和十津川の民家
                location.href = window.location.origin + url1 + "?id=Explanation4";

                break;

            case "arExplanationButton9": // 小豆島の農村歌舞伎舞台
                location.href = window.location.origin + url2 + "?id=AR5";

                break;

            case "arExplanationButton10": // 南部の曲家
                location.href = window.location.origin + url2 + "?id=AR6";

                break;

            case "arExplanationButton11": // 越前敦賀の民家
                location.href = window.location.origin + url1 + "?id=Explanation5";

                break;

            case "arExplanationButton12": // 北河内の茶室
                location.href = window.location.origin + url1 + "?id=Explanation6";

                break;
        }
    });
}