let markerPositionX = 0;
let markerPositionY = 0;
let markerPositionZ = 0;

let markerRotationX = 0;
let markerRotationY = 0;
let markerRotationZ = 0;

let markerHeight = 1;
let markerWidth = 1;

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
                markerPositionX = Number(arPosition[0]);
                markerPositionY = Number(arPosition[1]);
                markerPositionZ = Number(arPosition[2]);
            }

            if(content[0].trim(" ") == "arRotation1"){
                const arRotation = content[1].split(",");

                xRotation.setAttribute("value", arRotation[0]);
                yRotation.setAttribute("value", arRotation[1]);
                zRotation.setAttribute("value", arRotation[2]);
                
                markerRotationX = xRotation.value;
                markerRotationY = yRotation.value;
                markerRotationZ = zRotation.value;
            }

            if(content[0].trim(" ") == "arHeightWidth1"){
                const arHeightWidth = content[1].split(",");
                markerHeight =Number(arHeightWidth[0]);
                markerWidth = Number(arHeightWidth[1]);
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

    markerRotationX = xRotation.value;
    markerRotationY = yRotation.value;
    markerRotationZ = zRotation.value;
    
    let offset =  frames[0].height / frames[0].width;
    markerHeight = width.value * offset;
    markerWidth = width.value;

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
    markerVisible = false;
    startPlayback();
    cameraFrag = true;

    const offsetPosition = markerWorldPos.clone().add(new THREE.Vector3(parseInt(markerPositionX), parseInt(markerPositionY), parseInt(markerPositionZ)));
    videoPlane.object3D.position.copy(offsetPosition);
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