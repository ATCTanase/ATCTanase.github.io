/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * AR要素を読み込んだ時、その値をデバッグ画面の初期値として設定する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
// videoPlane.addEventListener("loaded", () => {
//     const vpRotation = videoPlane.object3D.rotation;
//     const vpHeight = videoPlane.getAttribute("height");
//     const vpWidth = videoPlane.getAttribute("width");

//     const xDirection = document.getElementById("XDirection");
//     const yDirection = document.getElementById("YDirection");
//     const zDirection = document.getElementById("ZDirection");
//     const xRotation = document.getElementById("XRotation");
//     const yRotation = document.getElementById("YRotation");
//     const zRotation = document.getElementById("ZRotation");
//     const height = document.getElementById("height");
//     const width = document.getElementById("width");

//     xDirection.setAttribute("value", markerPositionX);
//     yDirection.setAttribute("value", markerPositionY);
//     zDirection.setAttribute("value", markerPositionZ);
//     xRotation.setAttribute("value", markerRotationX);
//     yRotation.setAttribute("value", markerRotationY);
//     zRotation.setAttribute("value", markerRotationZ);
//     height.setAttribute("value", markerHeight);
//     width.setAttribute("value", markerWidth);

//     console.log("cookie：" + document.cookie);
//     const cookies = document.cookie;
//     const array = cookies.split(";");

//     array.forEach(function (value) {
//         const content = value.split("=");

//         if (location.href.indexOf("3Dof_1") != -1) {
//             if (content[0].trim(" ") == "arPosition1") {
//                 const arPosition = content[1].split(",");

//                 xDirection.setAttribute("value", arPosition[0]);
//                 yDirection.setAttribute("value", arPosition[1]);
//                 zDirection.setAttribute("value", arPosition[2]);
//                 markerPositionX = Number(arPosition[0]);
//                 markerPositionY = Number(arPosition[1]);
//                 markerPositionZ = Number(arPosition[2]);
//             }

//             if (content[0].trim(" ") == "arRotation1") {
//                 const arRotation = content[1].split(",");

//                 xRotation.setAttribute("value", arRotation[0]);
//                 yRotation.setAttribute("value", arRotation[1]);
//                 zRotation.setAttribute("value", arRotation[2]);
//                 markerRotationX = xRotation.value;
//                 markerRotationY = yRotation.value;
//                 markerRotationZ = zRotation.value;
//             }

//             if (content[0].trim(" ") == "arHeightWidth1") {
//                 const arHeightWidth = content[1].split(",");
//                 height.setAttribute("value", arHeightWidth[0]);
//                 width.setAttribute("value", arHeightWidth[1]);
//                 markerHeight = Number(arHeightWidth[0]);
//                 markerWidth = Number(arHeightWidth[1]);
//             }
//         }

//         if (location.href.indexOf("3Dof_3") != -1) {
//             if (content[0].trim(" ") == "arPosition3") {
//                 const arPosition = content[1].split(",");

//                 xDirection.setAttribute("value", arPosition[0]);
//                 yDirection.setAttribute("value", arPosition[1]);
//                 zDirection.setAttribute("value", arPosition[2]);
//                 markerPositionX = arPosition[0];
//                 markerPositionY = arPosition[1];
//                 markerPositionZ = arPosition[2];
//             }

//             if (content[0].trim(" ") == "arRotation3") {
//                 const arRotation = content[1].split(",");

//                 xRotation.setAttribute("value", arRotation[0]);
//                 yRotation.setAttribute("value", arRotation[1]);
//                 zRotation.setAttribute("value", arRotation[2]);
//                 markerRotationX = xRotation.value;
//                 markerRotationY = yRotation.value;
//                 markerRotationZ = zRotation.value;
//             }

//             if (content[0].trim(" ") == "arHeightWidth3") {
//                 const arHeightWidth = content[1].split(",");
//                 height.setAttribute("value", arHeightWidth[0]);
//                 width.setAttribute("value", arHeightWidth[1]);
//                 markerHeight = Number(arHeightWidth[0]);
//                 markerWidth = Number(arHeightWidth[1]);
//             }
//         }

//         if (location.href.indexOf("3Dof_4") != -1) {
//             if (content[0].trim(" ") == "arPosition4") {
//                 const arPosition = content[1].split(",");

//                 xDirection.setAttribute("value", arPosition[0]);
//                 yDirection.setAttribute("value", arPosition[1]);
//                 zDirection.setAttribute("value", arPosition[2]);
//                 markerPositionX = arPosition[0];
//                 markerPositionY = arPosition[1];
//                 markerPositionZ = arPosition[2];
//             }

//             if (content[0].trim(" ") == "arRotation4") {
//                 const arRotation = content[1].split(",");

//                 xRotation.setAttribute("value", arRotation[0]);
//                 yRotation.setAttribute("value", arRotation[1]);
//                 zRotation.setAttribute("value", arRotation[2]);
//                 markerRotationX = xRotation.value;
//                 markerRotationY = yRotation.value;
//                 markerRotationZ = zRotation.value;
//             }

//             if (content[0].trim(" ") == "arHeightWidth4") {
//                 const arHeightWidth = content[1].split(",");
//                 height.setAttribute("value", arHeightWidth[0]);
//                 width.setAttribute("value", arHeightWidth[1]);
//                 markerHeight = Number(arHeightWidth[0]);
//                 markerWidth = Number(arHeightWidth[1]);
//             }
//         }

//         if (location.href.indexOf("3Dof_6") != -1) {
//             if (content[0].trim(" ") == "arPosition6") {
//                 const arPosition = content[1].split(",");

//                 xDirection.setAttribute("value", arPosition[0]);
//                 yDirection.setAttribute("value", arPosition[1]);
//                 zDirection.setAttribute("value", arPosition[2]);
//                 markerPositionX = arPosition[0];
//                 markerPositionY = arPosition[1];
//                 markerPositionZ = arPosition[2];
//             }

//             if (content[0].trim(" ") == "arRotation6") {
//                 const arRotation = content[1].split(",");

//                 xRotation.setAttribute("value", arRotation[0]);
//                 yRotation.setAttribute("value", arRotation[1]);
//                 zRotation.setAttribute("value", arRotation[2]);
//                 markerRotationX = xRotation.value;
//                 markerRotationY = yRotation.value;
//                 markerRotationZ = zRotation.value;
//             }

//             if (content[0].trim(" ") == "arHeightWidth6") {
//                 const arHeightWidth = content[1].split(",");
//                 height.setAttribute("value", arHeightWidth[0]);
//                 width.setAttribute("value", arHeightWidth[1]);
//                 markerHeight = Number(arHeightWidth[0]);
//                 markerWidth = Number(arHeightWidth[1]);
//             }
//         }
//     })
// });

// const dialog = document.getElementById("kariModalDialog");;
// const kariSettingButton = document.getElementById("kariSettingButton");;
// const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
// /*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//  * 設定ボタン・適応ボタン押下時の処理
//  *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
// function openDialog() {
//     dialog.show();
//     kariSettingButton.setAttribute("style", "display: none;");
//     kariGuidemarkerButton.setAttribute("style", "display: none;");
// }

// function closeDialog() {
//     // デバッグ画面に入力されている値を、a-planeのposition、rotation、height・widthに適応する
//     const xDirection = document.getElementById("XDirection");
//     const yDirection = document.getElementById("YDirection");
//     const zDirection = document.getElementById("ZDirection");
//     const xRotation = document.getElementById("XRotation");
//     const yRotation = document.getElementById("YRotation");
//     const zRotation = document.getElementById("ZRotation");
//     const height = document.getElementById("width"); // widthを変更するとアスペクト比を保った状態で変更するために、heightをwidthを同じ値で更新する
//     const width = document.getElementById("width");


//     // cookieに値を保存する
//     // 表示するARページごとに取得するcookieを分けるため、urlのページ名で識別する
//     if (location.href.indexOf("3Dof_1") != -1) {
//         document.cookie = "arPosition1=" + [xDirection.value, yDirection.value, zDirection.value];
//         document.cookie = "arRotation1=" + [xRotation.value, yRotation.value, zRotation.value];
//         document.cookie = "arHeightWidth1=" + [height.value, width.value];
//     }
//     if (location.href.indexOf("3Dof_3") != -1) {
//         document.cookie = "arPosition3=" + [xDirection.value, yDirection.value, zDirection.value];
//         document.cookie = "arRotation3=" + [xRotation.value, yRotation.value, zRotation.value];
//         document.cookie = "arHeightWidth3=" + [height.value, width.value];
//     }
//     if (location.href.indexOf("3Dof_4") != -1) {
//         document.cookie = "arPosition4=" + [xDirection.value, yDirection.value, zDirection.value];
//         document.cookie = "arRotation4=" + [xRotation.value, yRotation.value, zRotation.value];
//         document.cookie = "arHeightWidth4=" + [height.value, width.value];
//     }
//     if (location.href.indexOf("3Dof_6") != -1) {
//         document.cookie = "arPosition6=" + [xDirection.value, yDirection.value, zDirection.value];
//         document.cookie = "arRotation6=" + [xRotation.value, yRotation.value, zRotation.value];
//         document.cookie = "arHeightWidth6=" + [height.value, width.value];
//     }

//     markerRotationX = xRotation.value;
//     markerRotationY = yRotation.value;
//     markerRotationZ = zRotation.value;

//     let offset = frames[0].height / frames[0].width;
//     markerHeight = width.value * offset;
//     markerWidth = width.value;

//     markerPositionX = Number(xDirection.value);
//     markerPositionY = Number(yDirection.value);
//     markerPositionZ = Number(zDirection.value);

//     dialog.close();
//     kariSettingButton.setAttribute("style", "display: block;");
//     kariGuidemarkerButton.setAttribute("style", "display: block; position: fixed; bottom: 60px; right: 10px;");
// }



/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 画面の傾きに応じてデバッグ画面のレイアウトを変える
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
$(window).on("load", function (event) {
    debugScreenFlexGrid(getAngle());
});
$(window).on("orientationchange", function (event) {
    debugScreenFlexGrid(getAngle());
});

const arrangementChange = document.getElementById("arrangementChange");
function debugScreenFlexGrid(angle) {
    if (angle == 0) {
        const arrangementChange = document.getElementById("arrangementChange");
        const kominkaArLogoErea = document.getElementById("kominkaArLogoErea");
        const pageBackBtnErea = document.getElementById("pageBackBtnErea");
        const ARTargetImg = document.getElementById("ARTargetImg");

        arrangementChange.setAttribute("style", "display: grid; height: 530px;");
        kominkaArLogoErea.setAttribute("style", "width: 20%;");
        pageBackBtnErea.setAttribute("style", "left: 87%; width: 12%;");
        ARTargetImg.setAttribute("src", "../../../image/ARImage/map_img_ar_frame_vertical.png");
        ARTargetImg.setAttribute("height", "auto");
        ARTargetImg.setAttribute("width", "100%");
    }

    if (angle == 90) {
        const arrangementChange = document.getElementById("arrangementChange");
        const kominkaArLogoErea = document.getElementById("kominkaArLogoErea");
        const pageBackBtnErea = document.getElementById("pageBackBtnErea");
        const ARTargetImg = document.getElementById("ARTargetImg");

        arrangementChange.setAttribute("style", "display: flex; height: 250px;");
        kominkaArLogoErea.setAttribute("style", "width: 10%;");
        pageBackBtnErea.setAttribute("style", "width: 6%;");
        ARTargetImg.setAttribute("src", "../../../image/ARImage/map_img_ar_frame.png");
        ARTargetImg.setAttribute("width", "auto");
        ARTargetImg.setAttribute("height", "100%");
    }
    if (angle == 270) {
        const arrangementChange = document.getElementById("arrangementChange");
        const kominkaArLogoErea = document.getElementById("kominkaArLogoErea");
        const pageBackBtnErea = document.getElementById("pageBackBtnErea");
        const ARTargetImg = document.getElementById("ARTargetImg");

        arrangementChange.setAttribute("style", "display: flex; height: 250px;");
        kominkaArLogoErea.setAttribute("style", "width: 10%;");
        pageBackBtnErea.setAttribute("style", "width: 6%;");
        ARTargetImg.setAttribute("src", "../../../image/ARImage/map_img_ar_frame.png");
        ARTargetImg.setAttribute("width", "auto");
        ARTargetImg.setAttribute("height", "100%");
    }
}