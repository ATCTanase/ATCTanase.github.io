/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * AR要素を読み込んだ時、その値をデバッグ画面の初期値として設定する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
videoPlane.addEventListener("loaded", () => {
    // const vpPositon  = videoPlane.object3D.position;
    const vpRotation = videoPlane.object3D.rotation;
    const vpHeight   = videoPlane.getAttribute("height");
    const vpWidth    = videoPlane.getAttribute("width");

    const xDirection = document.getElementById("XDirection");
    const yDirection = document.getElementById("YDirection");
    const zDirection = document.getElementById("ZDirection");
    const xRotation  = document.getElementById("XRotation");
    const yRotation  = document.getElementById("YRotation");
    const zRotation  = document.getElementById("ZRotation");
    const height     = document.getElementById("height");
    const width      = document.getElementById("width");

    xDirection.setAttribute("value", markerPositionX);
    yDirection.setAttribute("value", markerPositionY);
    zDirection.setAttribute("value", markerPositionZ);
    xRotation.setAttribute("value", THREE.MathUtils.radToDeg(vpRotation.x));
    yRotation.setAttribute("value", THREE.MathUtils.radToDeg(vpRotation.y));
    zRotation.setAttribute("value", THREE.MathUtils.radToDeg(vpRotation.z));
    height.setAttribute("value", vpHeight);
    width.setAttribute("value", vpWidth);

    let offset;
    if(location.href.indexOf("3Dof_1") != -1){
        // w:3224px × h:3336px
        offset = 3336 / 3224;
    }
    if(location.href.indexOf("3Dof_3") != -1){
        // w:4000px × h:4000px
        offset = 4000 / 4000;
    }
    if(location.href.indexOf("3Dof_4") != -1){
        // w:4848px × h:4200px
        offset = 4200 / 4848;
    }
    if(location.href.indexOf("3Dof_6") != -1){
        // w:3906px × h:3572px
        offset = 3572 / 3906;
    }

    // if(location.href.indexOf("3Dof_1") != -1){
    //     videoPlane.setAttribute("height", 4.0 * vpHeight);
    //     videoPlane.setAttribute("width",  4.1 * vpWidth);
    // }
    // if(location.href.indexOf("3Dof_3") != -1){
    //     videoPlane.setAttribute("height", 4.0 * vpHeight);
    //     videoPlane.setAttribute("width",  4.0 * vpWidth);
    // }
    // if(location.href.indexOf("3Dof_4") != -1){
    //     videoPlane.setAttribute("height", 1.7 * vpHeight);
    //     videoPlane.setAttribute("width",  2.0 * vpWidth);
    // }
    // if(location.href.indexOf("3Dof_6") != -1){
    //     videoPlane.setAttribute("height", 1.7 * vpHeight);
    //     videoPlane.setAttribute("width",  1.9 * vpWidth);
    // }


    
    console.log("cookie：" + document.cookie);
    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(location.href.indexOf("3Dof_1") != -1){
            if(content[0].trim(" ") == "arPosition1"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                markerPositionX = arPosition[0];
                markerPositionY = arPosition[1];
                markerPositionZ = arPosition[2];
            }

            if(content[0].trim(" ") == "arRotation1"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth1"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                // videoPlane.setAttribute("height", 4.0 * arHeightWidth[0]);
                // videoPlane.setAttribute("width",  4.1 * arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }

        if(location.href.indexOf("3Dof_3") != -1){
            if(content[0].trim(" ") == "arPosition3"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                markerPositionX = arPosition[0];
                markerPositionY = arPosition[1];
                markerPositionZ = arPosition[2];
            }

            if(content[0].trim(" ") == "arRotation3"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth3"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                // videoPlane.setAttribute("height", 4.0 * arHeightWidth[0]);
                // videoPlane.setAttribute("width",  4.0 * arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }

        if(location.href.indexOf("3Dof_4") != -1){
            if(content[0].trim(" ") == "arPosition4"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                markerPositionX = arPosition[0];
                markerPositionY = arPosition[1];
                markerPositionZ = arPosition[2];
            }

            if(content[0].trim(" ") == "arRotation4"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth4"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                // videoPlane.setAttribute("height", 1.7 * arHeightWidth[0]);
                // videoPlane.setAttribute("width",  2.0 * arHeightWidth[1]);
                videoPlane.setAttribute("height", arHeightWidth[1] * offset);
                videoPlane.setAttribute("width",  arHeightWidth[1]);
            }
        }

        if(location.href.indexOf("3Dof_6") != -1){
            if(content[0].trim(" ") == "arPosition6"){
                const arPosition = content[1].split(",");

                xDirection.setAttribute("value", arPosition[0]);
                yDirection.setAttribute("value", arPosition[1]);
                zDirection.setAttribute("value", arPosition[2]);
                markerPositionX = arPosition[0];
                markerPositionY = arPosition[1];
                markerPositionZ = arPosition[2];
            }

            if(content[0].trim(" ") == "arRotation6"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                videoPlane.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
            }

            if(content[0].trim(" ") == "arHeightWidth6"){
                const arHeightWidth = content[1].split(",");

                height.setAttribute("value", arHeightWidth[0]);
                width.setAttribute( "value", arHeightWidth[1]);
                // videoPlane.setAttribute("height", 1.7 * arHeightWidth[0]);
                // videoPlane.setAttribute("width",  1.9 * arHeightWidth[1]);
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
    const height     = document.getElementById("width"); // widthを変更するとアスペクト比を保った状態で変更するために、heightをwidthを同じ値で更新する
    const width      = document.getElementById("width");


    // cookieに値を保存する
    // 表示するARページごとに取得するcookieを分けるため、urlのページ名で識別する
    if(location.href.indexOf("3Dof_1") != -1){
        document.cookie = "arPosition1="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation1="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth1=" + [height.value, width.value];

        // w:3224px × h:3336px ⇒ アスペクト比:403 × 417
        // videoPlane.setAttribute("height", 4.0 * height.value);
        // videoPlane.setAttribute("width",  4.1 * width.value);
    }
    if(location.href.indexOf("3Dof_3") != -1){
        document.cookie = "arPosition3="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation3="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth3=" + [height.value, width.value];

        // w:4000px × h:4000px
        // videoPlane.setAttribute("height", 4.0 * height.value);
        // videoPlane.setAttribute("width",  4.0 * width.value);
    }
    if(location.href.indexOf("3Dof_4") != -1){
        document.cookie = "arPosition4="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation4="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth4=" + [height.value, width.value];

        // w:4848px × h:4200px ⇒ アスペクト比:202 × 175
        // videoPlane.setAttribute("height", 1.7 * height.value);
        // videoPlane.setAttribute("width",  2.0 * width.value);
    }
    if(location.href.indexOf("3Dof_6") != -1){
        document.cookie = "arPosition6="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6=" + [height.value, width.value];

        // w:3906px × h:3572px ⇒ アスペクト比:1953 × 1786
        // videoPlane.setAttribute("height", 1.7 * height.value);
        // videoPlane.setAttribute("width",  1.9 * width.value);
    }

    videoPlane.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
    videoPlane.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});

    let offset =  frames[0].height / frames[0].width;
    videoPlane.setAttribute("height", width.value * offset);
    videoPlane.setAttribute("width",  width.value); 

    markerPositionX = Number(xDirection.value);
    markerPositionY = Number(yDirection.value);
    markerPositionZ = Number(zDirection.value);
    
    const dialog = document.getElementById("kariModalDialog");
    dialog.close();
    const kariSettingButton = document.getElementById("kariSettingButton");
    kariSettingButton.setAttribute("style", "display: block;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: block; position: fixed; bottom: 60px; right: 10px;");



    // 設定更新
    markerVisible = true;
    videoPlane.setAttribute("visible", "false");
    startPlayback();
    cameraFrag = true;

    // カメラ視点のリセット（look-controlsを一時有効化）
    camera.setAttribute("look-controls", {
        enabled: true,
        magicWindowTrackingEnabled: true
    });

    markerTimer = setTimeout(() => {
        if (markerVisible) {
            const markerWorldPos = new THREE.Vector3();
            barcodeMarker.object3D.updateMatrixWorld(true);
            barcodeMarker.object3D.getWorldPosition(markerWorldPos);

            const offsetPosition = markerWorldPos.clone().add(new THREE.Vector3(parseInt(markerPositionX), parseInt(markerPositionY), parseInt(markerPositionZ)));
            videoPlane.object3D.position.copy(offsetPosition);
        }
    }, 100);
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