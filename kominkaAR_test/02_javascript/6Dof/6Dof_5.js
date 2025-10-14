/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 一枚絵
 * AR画像は3枚表示する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
const videoPlane1 = document.getElementById("videoPlane1");
const videoPlane2 = document.getElementById("videoPlane2");
const videoPlane3 = document.getElementById("videoPlane3");
const marker      = document.getElementById("barcodeMarker");

// Canvasを作成
const canvas1 = document.createElement("canvas");
canvas1.width  = window.innerWidth;
canvas1.height = window.innerHeight;
const ctx = canvas1.getContext("2d", { willReadFrequently: true });
videoPlane1.setAttribute("material", "src", canvas1);
let offset1;

const canvas2 = document.createElement("canvas");
canvas2.width  = window.innerWidth;
canvas2.height = window.innerHeight;
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
videoPlane2.setAttribute("material", "src", canvas2);
let offset2;

const canvas3 = document.createElement("canvas");
canvas3.width  = window.innerWidth;
canvas3.height = window.innerHeight;
const ctx3 = canvas3.getContext("2d", { willReadFrequently: true });
videoPlane3.setAttribute("material", "src", canvas3);
let offset3;

const ARImage1 = "../../04_image/ARImage/AR5_摂津能世_お母さん";
const ARImage2 = "../../04_image/ARImage/AR5_摂津能世_お父さん";
const ARImage3 = "../../04_image/ARImage/AR5_摂津能世_客人";
const frameCount = 1;
const frameExt = ".png";
let currentFrame = 0;
const fps = 20;

const loadingOverlay = document.getElementById("loadingOverlay");
const progressText   = document.getElementById("progress");

// 🔹 全フレームをロード
function preloadFrames1(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img1 = new Image();
        img1.crossOrigin = "anonymous";
        img1.src = `${ARImage1}${frameExt}`;
        img1.onload = () => {
            loaded++;
            // 進捗を表示
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none"; // ローディング画面を隠す
                callback();
                offset1 =  img1.height / img1.width;
            }
        };
    }
}
function preloadFrames2(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img2 = new Image();
        img2.crossOrigin = "anonymous";
        img2.src = `${ARImage2}${frameExt}`;
        img2.onload = () => {
            loaded++;
            // 進捗を表示
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none"; // ローディング画面を隠す
                callback();
                offset2 =  img2.height / img2.width;
            }
        };
    }
}
function preloadFrames3(callback) {
    let loaded = 0;
    for (let i = 1; i <= frameCount; i++) {
        const img3 = new Image();
        img3.crossOrigin = "anonymous";
        img3.src = `${ARImage3}${frameExt}`;
        img3.onload = () => {
            loaded++;
            // 進捗を表示
            progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
            if (loaded === frameCount) {
                console.log("✅ 全フレームロード完了");
                loadingOverlay.style.display = "none"; // ローディング画面を隠す
                callback();
                offset3 =  img3.height / img3.width;
            }
        };
    }
}


// w:1660px × h:1992px
let offset1_5 = 1992 * 1660;
let initialValueWidthVP1;
// w:1581px × h:1977px
let offset2_5 = 1977 * 1581;
let initialValueWidthVP2;
// w:1741px × h:2041px
let offset3_5 = 2041 * 1741;
let initialValueWidthVP3;
videoPlane1.addEventListener("loaded", () => {
    const vpRotation = videoPlane1.object3D.rotation;
    const vpWidth    = videoPlane1.getAttribute("width");

    initialValueWidthVP1  = vpWidth;
    videoPlane1.setAttribute("height", vpWidth * offset1_5);
    videoPlane1.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-5-1"){
            const arPosition = content[1].split(",");

            videoPlane1.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
        }

        if(content[0].trim(" ") == "arRotation6-5-1"){
            const arRotation = content[1].split(",");

            videoPlane1.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth6-5-1"){
            const arHeightWidth = content[1].split(",");

            videoPlane1.setAttribute("height", arHeightWidth[1] * offset1_5);
            videoPlane1.setAttribute("width",  arHeightWidth[1]);
        }
    })
});
videoPlane2.addEventListener("loaded", () => {
    const vpRotation = videoPlane2.object3D.rotation;
    const vpWidth    = videoPlane2.getAttribute("width");

    initialValueWidthVP2  = vpWidth;
    videoPlane2.setAttribute("height", vpWidth * offset2_5);
    videoPlane2.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-5-2"){
            const arPosition = content[1].split(",");

            videoPlane2.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
        }

        if(content[0].trim(" ") == "arRotation6-5-2"){
            const arRotation = content[1].split(",");

            videoPlane2.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth6-5-2"){
            const arHeightWidth = content[1].split(",");

            videoPlane2.setAttribute("height", arHeightWidth[1] * offset2_5);
            videoPlane2.setAttribute("width",  arHeightWidth[1]);
        }
    })
});
videoPlane3.addEventListener("loaded", () => {
    const vpRotation = videoPlane3.object3D.rotation;
    const vpWidth    = videoPlane3.getAttribute("width");

    initialValueWidthVP3  = vpWidth;
    videoPlane3.setAttribute("height", vpWidth * offset3_5);
    videoPlane3.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-5-3"){
            const arPosition = content[1].split(",");

            videoPlane3.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
        }

        if(content[0].trim(" ") == "arRotation6-5-3"){
            const arRotation = content[1].split(",");

            videoPlane3.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth6-5-3"){
            const arHeightWidth = content[1].split(",");

            videoPlane3.setAttribute("height", arHeightWidth[1] * offset3_5);
            videoPlane3.setAttribute("width",  arHeightWidth[1]);
        }
    })
});


// 6Dof環境では、同じpattファイルを使い回して複数のARを表示しようとすると
// 後に登録したARのみが表示されるようなので、2と5のAR表示処理は他とは別の処理で対処する
marker.addEventListener("markerFound", () => {
    videoPlane1.setAttribute("visible", true);
    videoPlane2.setAttribute("visible", true);
    videoPlane3.setAttribute("visible", true);
    videoPlane1.setAttribute("src", "../../04_image/ARImage/AR5_摂津能世_お母さん.png");
    videoPlane2.setAttribute("src", "../../04_image/ARImage/AR5_摂津能世_お父さん.png");
    videoPlane3.setAttribute("src", "../../04_image/ARImage/AR5_摂津能世_客人.png");

    videoPlane1.setAttribute("height", videoPlane1.getAttribute("width") * offset1);
    videoPlane2.setAttribute("height", videoPlane2.getAttribute("width") * offset2);
    videoPlane3.setAttribute("height", videoPlane3.getAttribute("width") * offset3);
});
marker.addEventListener("markerLost", () => {
    videoPlane1.setAttribute("visible", false);
    videoPlane2.setAttribute("visible", false);
    videoPlane3.setAttribute("visible", false);
});

// 🔹 まずフレームを読み込み開始
preloadFrames1(() => {
    console.log("アニメーション準備完了");
});
preloadFrames2(() => {
    console.log("アニメーション準備完了");
});
preloadFrames3(() => {
    console.log("アニメーション準備完了");
});



/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * AR要素を読み込んだ時、その値をデバッグ画面の初期値として設定する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
let modalIdentification;
function openDialog1() {
    const vpPositon  = videoPlane1.object3D.position;
    const vpRotation = videoPlane1.object3D.rotation;

    document.getElementById("XDirection").value = vpPositon.x;
    document.getElementById("YDirection").value = vpPositon.y;
    document.getElementById("ZDirection").value = vpPositon.z;
    document.getElementById("XRotation").value  = THREE.MathUtils.radToDeg(vpRotation.x);
    document.getElementById("YRotation").value  = THREE.MathUtils.radToDeg(vpRotation.y);
    document.getElementById("ZRotation").value  = THREE.MathUtils.radToDeg(vpRotation.z);
    document.getElementById("height").value     = initialValueWidthVP1;
    document.getElementById("width").value      = initialValueWidthVP1;


    const cookies = document.cookie;
    const array = cookies.split(";");
    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-5-1"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation6-5-1"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
        }

        if(content[0].trim(" ") == "arHeightWidth6-5-1"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
        }
    });


    const dialog = document.getElementById("kariModalDialog");
    dialog.show();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    const kariSettingButton3 = document.getElementById("kariSettingButton3");
    kariSettingButton1.setAttribute("style", "display: none;");
    kariSettingButton2.setAttribute("style", "display: none;");
    kariSettingButton3.setAttribute("style", "display: none;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: none;");

    modalIdentification = 1;
}
function openDialog2() {
    const vpPositon  = videoPlane2.object3D.position;
    const vpRotation = videoPlane2.object3D.rotation;

    document.getElementById("XDirection").value = vpPositon.x;
    document.getElementById("YDirection").value = vpPositon.y;
    document.getElementById("ZDirection").value = vpPositon.z;
    document.getElementById("XRotation").value  = THREE.MathUtils.radToDeg(vpRotation.x);
    document.getElementById("YRotation").value  = THREE.MathUtils.radToDeg(vpRotation.y);
    document.getElementById("ZRotation").value  = THREE.MathUtils.radToDeg(vpRotation.z);
    document.getElementById("height").value     = initialValueWidthVP2;
    document.getElementById("width").value      = initialValueWidthVP2;


    const cookies = document.cookie;
    const array = cookies.split(";");
    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-5-2"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation6-5-2"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
        }

        if(content[0].trim(" ") == "arHeightWidth6-5-2"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
        }
    });


    const dialog = document.getElementById("kariModalDialog");
    dialog.show();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    const kariSettingButton3 = document.getElementById("kariSettingButton3");
    kariSettingButton1.setAttribute("style", "display: none;");
    kariSettingButton2.setAttribute("style", "display: none;");
    kariSettingButton3.setAttribute("style", "display: none;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: none;");

    modalIdentification = 2;
}
function openDialog3() {
    const vpPositon  = videoPlane3.object3D.position;
    const vpRotation = videoPlane3.object3D.rotation;

    document.getElementById("XDirection").value = vpPositon.x;
    document.getElementById("YDirection").value = vpPositon.y;
    document.getElementById("ZDirection").value = vpPositon.z;
    document.getElementById("XRotation").value  = THREE.MathUtils.radToDeg(vpRotation.x);
    document.getElementById("YRotation").value  = THREE.MathUtils.radToDeg(vpRotation.y);
    document.getElementById("ZRotation").value  = THREE.MathUtils.radToDeg(vpRotation.z);
    document.getElementById("height").value     = initialValueWidthVP3;
    document.getElementById("width").value      = initialValueWidthVP3;


    const cookies = document.cookie;
    const array = cookies.split(";");
    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-5-3"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation6-5-3"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
        }

        if(content[0].trim(" ") == "arHeightWidth6-5-3"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
        }
    });


    const dialog = document.getElementById("kariModalDialog");
    dialog.show();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    const kariSettingButton3 = document.getElementById("kariSettingButton3");
    kariSettingButton1.setAttribute("style", "display: none;");
    kariSettingButton2.setAttribute("style", "display: none;");
    kariSettingButton3.setAttribute("style", "display: none;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: none;");

    modalIdentification = 3;
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
    const height     = document.getElementById("width");
    const width      = document.getElementById("width");

    if(modalIdentification == 1){
        videoPlane1.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
        videoPlane1.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});
        // videoPlane1.setAttribute("height", height.value);
        videoPlane1.setAttribute("height", width.value * offset1);
        videoPlane1.setAttribute("width",  width.value);

        document.cookie = "arPosition6-5-1="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-5-1="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-5-1=" + [height.value, width.value];
    }else if(modalIdentification == 2){
        videoPlane2.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
        videoPlane2.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});
        // videoPlane2.setAttribute("height", height.value);
        videoPlane2.setAttribute("height", width.value * offset2);
        videoPlane2.setAttribute("width",  width.value);

        document.cookie = "arPosition6-5-2="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-5-2="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-5-2=" + [height.value, width.value];
    }else{
        videoPlane3.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
        videoPlane3.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});
        // videoPlane3.setAttribute("height", height.value);
        videoPlane3.setAttribute("height", width.value * offset3);
        videoPlane3.setAttribute("width",  width.value);

        document.cookie = "arPosition6-5-3="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-5-3="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-5-3=" + [height.value, width.value];
    }
    
    const dialog = document.getElementById("kariModalDialog");
    dialog.close();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    const kariSettingButton3 = document.getElementById("kariSettingButton3");
    kariSettingButton1.setAttribute("style", "display: block;");
    kariSettingButton2.setAttribute("style", "display: block;");
    kariSettingButton3.setAttribute("style", "display: block;");

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
