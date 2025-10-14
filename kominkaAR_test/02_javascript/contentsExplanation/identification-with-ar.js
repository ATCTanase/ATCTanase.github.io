// URLパラメータから表示するコンテンツ選別する
// こっちはARあり

const params = new URLSearchParams(window.location.search);
const identificationId = params.get("id");

switch (identificationId) {
    case "AR1":
        const AR1ExplanationErea = document.getElementById("explanationErea");
        AR1ExplanationErea.innerText = "説明1";

        const AR1flickImage1 = document.getElementById("flickImage1");
        const AR1flickImage2 = document.getElementById("flickImage2");
        const AR1flickImage3 = document.getElementById("flickImage3");
        AR1flickImage1.innerText = "イメージ1";
        AR1flickImage2.innerText = "イメージ1";
        AR1flickImage3.innerText = "イメージ1";

        const AR1Invoke = document.getElementById("ARInvoke");
        AR1Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_1.html'");
        break;

    case "AR2":
        const AR2ExplanationErea = document.getElementById("explanationErea");
        AR2ExplanationErea.innerText = "説明2";

        const AR2flickImage1 = document.getElementById("flickImage1");
        const AR2flickImage2 = document.getElementById("flickImage2");
        const AR2flickImage3 = document.getElementById("flickImage3");
        AR2flickImage1.innerText = "イメージ2";
        AR2flickImage2.innerText = "イメージ2";
        AR2flickImage3.innerText = "イメージ2";

        const AR2Invoke = document.getElementById("ARInvoke");
        AR2Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_2.html'");
        break;

    case "AR3":
        const AR3ExplanationErea = document.getElementById("explanationErea");
        AR3ExplanationErea.innerText = "説明3";

        const AR3flickImage1 = document.getElementById("flickImage1");
        const AR3flickImage2 = document.getElementById("flickImage2");
        const AR3flickImage3 = document.getElementById("flickImage3");
        AR3flickImage1.innerText = "イメージ3";
        AR3flickImage2.innerText = "イメージ3";
        AR3flickImage3.innerText = "イメージ3";

        const AR3Invoke = document.getElementById("ARInvoke");
        AR3Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_3.html'");
        break;

    case "AR4":
        const AR4ExplanationErea = document.getElementById("explanationErea");
        AR4ExplanationErea.innerText = "説明4";

        const AR4flickImage1 = document.getElementById("flickImage1");
        const AR4flickImage2 = document.getElementById("flickImage2");
        const AR4flickImage3 = document.getElementById("flickImage3");
        AR4flickImage1.innerText = "イメージ4";
        AR4flickImage2.innerText = "イメージ4";
        AR4flickImage3.innerText = "イメージ4";

        const AR4Invoke = document.getElementById("ARInvoke");
        AR4Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_4.html'");
        break;

    case "AR5":
        const AR5ExplanationErea = document.getElementById("explanationErea");
        AR5ExplanationErea.innerText = "説明5";

        const AR5flickImage1 = document.getElementById("flickImage1");
        const AR5flickImage2 = document.getElementById("flickImage2");
        const AR5flickImage3 = document.getElementById("flickImage3");
        AR5flickImage1.innerText = "イメージ5";
        AR5flickImage2.innerText = "イメージ5";
        AR5flickImage3.innerText = "イメージ5";

        const AR5Invoke = document.getElementById("ARInvoke");
        AR5Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_5.html'");
        break;

    case "AR6":
        const AR6ExplanationErea = document.getElementById("explanationErea");
        AR6ExplanationErea.innerText = "説明6";

        const AR6flickImage1 = document.getElementById("flickImage1");
        const AR6flickImage2 = document.getElementById("flickImage2");
        const AR6flickImage3 = document.getElementById("flickImage3");
        AR6flickImage1.innerText = "イメージ6";
        AR6flickImage2.innerText = "イメージ6";
        AR6flickImage3.innerText = "イメージ6";

        const AR6Invoke = document.getElementById("ARInvoke");
        AR6Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_6.html'");
        break;
}