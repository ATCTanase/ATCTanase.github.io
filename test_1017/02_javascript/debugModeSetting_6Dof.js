/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * AR要素を読み込んだ時、その値をデバッグ画面の初期値として設定する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
videoPlane.addEventListener("loaded", () => {
    const vpPositon  = videoPlane.object3D.position;
    const vpRotation = videoPlane.object3D.rotation;
    // const vpHeight   = videoPlane.getAttribute("height");
    const vpWidth    = videoPlane.getAttribute("width");

    const xDirection = document.getElementById("XDirection");
    const yDirection = document.getElementById("YDirection");
    const zDirection = document.getElementById("ZDirection");
    const xRotation  = document.getElementById("XRotation");
    const yRotation  = document.getElementById("YRotation");
    const zRotation  = document.getElementById("ZRotation");
    const height     = document.getElementById("height");
    const width      = document.getElementById("width");

    xDirection.setAttribute("value", vpPositon.x);
    yDirection.setAttribute("value", vpPositon.y);
    zDirection.setAttribute("value", vpPositon.z);
    xRotation.setAttribute("value", THREE.MathUtils.radToDeg(vpRotation.x));
    yRotation.setAttribute("value", THREE.MathUtils.radToDeg(vpRotation.y));
    zRotation.setAttribute("value", THREE.MathUtils.radToDeg(vpRotation.z));
    // height.setAttribute("value", vpHeight);
    height.setAttribute("value", vpWidth);
    width.setAttribute("value",  vpWidth);


    let offset;
    if(location.href.indexOf("6Dof_1") != -1){
        // w:3224px × h:3336px
        offset = 3336 / 3224;
    }
    if(location.href.indexOf("6Dof_3") != -1){
        // w:4000px × h:4000px
        offset = 4000 / 4000;
    }
    if(location.href.indexOf("6Dof_4") != -1){
        // w:4848px × h:4200px
        offset = 4200 / 4848;
    }
    if(location.href.indexOf("6Dof_6") != -1){
        // w:3906px × h:3572px
        offset = 3572 / 3906;
    }
    
    console.log("cookie：" + document.cookie);
    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(location.href.indexOf("6Dof_1") != -1){
            if(content[0].trim(" ") == "arPosition6-1"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                videoPlane.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
            }

            if(content[0].trim(" ") == "arRotation6-1"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth6-1"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }

        if(location.href.indexOf("6Dof_3") != -1){
            if(content[0].trim(" ") == "arPosition6-3"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                videoPlane.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
            }

            if(content[0].trim(" ") == "arRotation6-3"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth6-3"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }

        if(location.href.indexOf("6Dof_4") != -1){
            if(content[0].trim(" ") == "arPosition6-4"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                videoPlane.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
            }

            if(content[0].trim(" ") == "arRotation6-4"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth6-4"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }

        if(location.href.indexOf("6Dof_6") != -1){
            if(content[0].trim(" ") == "arPosition6-6"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                videoPlane.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
            }

            if(content[0].trim(" ") == "arRotation6-6"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth6-6"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }
    })
});


/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 設定ボタン・適応ボタン押下時の処理
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
function openDialog() {
    const dialog = document.getElementById("kariModalDialog");
    dialog.show();
    const kariSettingButton = document.getElementById("kariSettingButton");
    kariSettingButton.setAttribute("style", "display: none;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: none;");
}
function closeDialog() {
    // デバッグ画面に入力されている値を、a-planeのposition、rotation、height・widthに適応する
    const xDirection = document.getElementById("XDirection");
    const yDirection = document.getElementById("YDirection");
    const zDirection = document.getElementById("ZDirection");
    const xRotation  = document.getElementById("XRotation");
    const yRotation  = document.getElementById("YRotation");
    const zRotation  = document.getElementById("ZRotation");
    // const height     = document.getElementById("height");
    const width      = document.getElementById("width");


    // cookieに値を保存する
    // 表示するARページごとに取得するcookieを分けるため、urlのページ名で識別する
    if(location.href.indexOf("6Dof_1") != -1){
        document.cookie = "arPosition6-1="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-1="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-1=" + [width.value, width.value];
    }
    if(location.href.indexOf("6Dof_3") != -1){
        document.cookie = "arPosition6-3="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-3="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-3=" + [width.value, width.value];
    }
    if(location.href.indexOf("6Dof_4") != -1){
        document.cookie = "arPosition6-4="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-4="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-4=" + [width.value, width.value];
    }
    if(location.href.indexOf("6Dof_6") != -1){
        document.cookie = "arPosition6-6="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-6="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-6=" + [width.value, width.value];
    }


    videoPlane.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
    videoPlane.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});
    let offset =  frames[0].height / frames[0].width;
    // videoPlane.setAttribute("height", height.value);
    videoPlane.setAttribute("height", width.value * offset);
    videoPlane.setAttribute("width",  width.value);
    
    const dialog = document.getElementById("kariModalDialog");
    dialog.close();
    const kariSettingButton = document.getElementById("kariSettingButton");
    kariSettingButton.setAttribute("style", "display: block;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: block; position: fixed; bottom: 60px; right: 10px;");
}


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
        arrangementChange.setAttribute("style", "display: grid; height: 530px;");
    }

    if (angle == 90 || angle == 270) {
        arrangementChange.setAttribute("style", "display: flex; height: 250px;");
    }
}