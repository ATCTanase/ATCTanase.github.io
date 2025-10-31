// cookie-check.jsで確認した解説ページに対応したスタンプを活性化させる
document.addEventListener("DOMContentLoaded", () => {
    stampList.forEach(function (ARStamp) {
        if (ARStamp == "AR1") {
            const minkaOfHyugaSibaStamp   = $("#minkaOfHyugaSibaStamp");
            const minkaOfHyugaSibaStampOn = $("#minkaOfHyugaSibaStampOn");

            minkaOfHyugaSibaStamp.hide();
            minkaOfHyugaSibaStampOn.show();
        }

        if (ARStamp == "AR2") {
            const minkaOfSinanoAkiyamaStamp   = $("#minkaOfSinanoAkiyamaStamp");
            const minkaOfSinanoAkiyamaStampOn = $("#minkaOfSinanoAkiyamaStampOn");

            minkaOfSinanoAkiyamaStamp.hide();
            minkaOfSinanoAkiyamaStampOn.show();
        }

        if (ARStamp == "AR3") {
            const magariyaOfNanbuStamp   = $("#magariyaOfNanbuStamp");
            const magariyaOfNanbuStampOn = $("#magariyaOfNanbuStampOn");

            magariyaOfNanbuStamp.hide();
            magariyaOfNanbuStampOn.show();
        }

        if (ARStamp == "AR4") {
            const nosonKabukiButaiOfSyodosimaStamp   = $("#nosonKabukiButaiOfSyodosimaStamp");
            const nosonKabukiButaiOfSyodosimaStampOn = $("#nosonKabukiButaiOfSyodosimaStampOn");

            nosonKabukiButaiOfSyodosimaStamp.hide();
            nosonKabukiButaiOfSyodosimaStampOn.show();
        }

        if (ARStamp == "AR5") {
            const minkaOfSettunoseStamp   = $("#minkaOfSettunoseStamp");
            const minkaOfSettunoseStampOn = $("#minkaOfSettunoseStampOn");

            minkaOfSettunoseStamp.hide();
            minkaOfSettunoseStampOn.show();
        }

        if (ARStamp == "AR6") {
            const minkaOfHidanSirakawaStamp   = $("#minkaOfHidanSirakawaStamp");
            const minkaOfHidanSirakawaStampOn = $("#minkaOfHidanSirakawaStampOn");

            minkaOfHidanSirakawaStamp.hide();
            minkaOfHidanSirakawaStampOn.show();
        }

        if (ARStamp == "Explanation1") {
            const nagayamonOfKawatihuseStamp   = $("#nagayamonOfKawatihuseStamp");
            const nagayamonOfKawatihuseStampOn = $("#nagayamonOfKawatihuseStampOn");

            nagayamonOfKawatihuseStamp.hide();
            nagayamonOfKawatihuseStampOn.show();
        }

        if (ARStamp == "Explanation2") {
            const komeguraOfDozimaStamp   = $("#komeguraOfDozimaStamp");
            const komeguraOfDozimaStampOn = $("#komeguraOfDozimaStampOn");

            komeguraOfDozimaStamp.hide();
            komeguraOfDozimaStampOn.show();
        }

        if (ARStamp == "Explanation3") {
            const takakuraOfAmamiosimaStamp   = $("#takakuraOfAmamiosimaStamp");
            const takakuraOfAmamiosimaStampOn = $("#takakuraOfAmamiosimaStampOn");

            takakuraOfAmamiosimaStamp.hide();
            takakuraOfAmamiosimaStampOn.show();
        }

        if (ARStamp == "Explanation4") {
            const minkaOfYamatoTotugawaStamp   = $("#minkaOfYamatoTotugawaStamp");
            const minkaOfYamatoTotugawaStampOn = $("#minkaOfYamatoTotugawaStampOn");

            minkaOfYamatoTotugawaStamp.hide();
            minkaOfYamatoTotugawaStampOn.show();
        }

        if (ARStamp == "Explanation5") {
            const minkaOfEtizenSurugaStamp   = $("#minkaOfEtizenSurugaStamp");
            const minkaOfEtizenSurugaStampOn = $("#minkaOfEtizenSurugaStampOn");

            minkaOfEtizenSurugaStamp.hide();
            minkaOfEtizenSurugaStampOn.show();
        }

        if (ARStamp == "Explanation6") {
            const tyasituOfKitakawautiStamp   = $("#tyasituOfKitakawautiStamp");
            const tyasituOfKitakawautiStampOn = $("#tyasituOfKitakawautiStampOn");

            tyasituOfKitakawautiStamp.hide();
            tyasituOfKitakawautiStampOn.show();
        }
    })
});