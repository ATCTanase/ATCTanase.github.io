// URLパラメータから表示するコンテンツ選別する
// こっちはARなし

const params = new URLSearchParams(window.location.search);
const identificationId = params.get("id");

switch (identificationId) {
    case "Explanation1":
        const Explanation1ExplanationErea = document.getElementById("explanationErea");
        Explanation1ExplanationErea.innerText = "説明1";

        const Explanation1flickImage1 = document.getElementById("flickImage1");
        const Explanation1flickImage2 = document.getElementById("flickImage2");
        const Explanation1flickImage3 = document.getElementById("flickImage3");
        Explanation1flickImage1.innerText = "イメージ1";
        Explanation1flickImage2.innerText = "イメージ1";
        Explanation1flickImage3.innerText = "イメージ1";

        break;

    case "Explanation2":
        const Explanation2ExplanationErea = document.getElementById("explanationErea");
        Explanation2ExplanationErea.innerText = "説明2";

        const Explanation2flickImage1 = document.getElementById("flickImage1");
        const Explanation2flickImage2 = document.getElementById("flickImage2");
        const Explanation2flickImage3 = document.getElementById("flickImage3");
        Explanation2flickImage1.innerText = "イメージ2";
        Explanation2flickImage2.innerText = "イメージ2";
        Explanation2flickImage3.innerText = "イメージ2";

        break;

    case "Explanation3":
        const Explanation3ExplanationErea = document.getElementById("explanationErea");
        Explanation3ExplanationErea.innerText = "説明3";

        const Explanation3flickImage1 = document.getElementById("flickImage1");
        const Explanation3flickImage2 = document.getElementById("flickImage2");
        const Explanation3flickImage3 = document.getElementById("flickImage3");
        Explanation3flickImage1.innerText = "イメージ3";
        Explanation3flickImage2.innerText = "イメージ3";
        Explanation3flickImage3.innerText = "イメージ3";

        break;

    case "Explanation4":
        const Explanation4ExplanationErea = document.getElementById("explanationErea");
        Explanation4ExplanationErea.innerText = "説明4";

        const Explanation4flickImage1 = document.getElementById("flickImage1");
        const Explanation4flickImage2 = document.getElementById("flickImage2");
        const Explanation4flickImage3 = document.getElementById("flickImage3");
        Explanation4flickImage1.innerText = "イメージ4";
        Explanation4flickImage2.innerText = "イメージ4";
        Explanation4flickImage3.innerText = "イメージ4";

        break;

    case "Explanation5":
        const Explanation5ExplanationErea = document.getElementById("explanationErea");
        Explanation5ExplanationErea.innerText = "説明5";

        const Explanation5flickImage1 = document.getElementById("flickImage1");
        const Explanation5flickImage2 = document.getElementById("flickImage2");
        const Explanation5flickImage3 = document.getElementById("flickImage3");
        Explanation5flickImage1.innerText = "イメージ5";
        Explanation5flickImage2.innerText = "イメージ5";
        Explanation5flickImage3.innerText = "イメージ5";

        break;

    case "Explanation6":
        const Explanation6ExplanationErea = document.getElementById("explanationErea");
        Explanation6ExplanationErea.innerText = "説明6";

        const Explanation6flickImage1 = document.getElementById("flickImage1");
        const Explanation6flickImage2 = document.getElementById("flickImage2");
        const Explanation6flickImage3 = document.getElementById("flickImage3");
        Explanation6flickImage1.innerText = "イメージ6";
        Explanation6flickImage2.innerText = "イメージ6";
        Explanation6flickImage3.innerText = "イメージ6";

        break;
}