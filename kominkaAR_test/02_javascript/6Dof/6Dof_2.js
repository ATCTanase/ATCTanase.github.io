/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 一枚絵
 * AR画像は2枚表示する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
const videoPlane1 = document.getElementById("videoPlane1");
const videoPlane2 = document.getElementById("videoPlane2");
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

const ARImage1 = "../../04_image/ARImage/AR2_信濃秋山_薪";
const ARImage2 = "../../04_image/ARImage/AR2_信濃秋山_お婆さんのみ";
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


// w:2865px × h:622px
let offset1_2 = 622 * 2865;
let initialValueWidthVP1;
// w:1576px × h:1812px
let offset2_2 = 1812 * 1576;
let initialValueWidthVP2;
videoPlane1.addEventListener("loaded", () => {
    const vpRotation = videoPlane1.object3D.rotation;
    const vpWidth    = videoPlane1.getAttribute("width");

    initialValueWidthVP1  = vpWidth;
    videoPlane1.setAttribute("height", vpWidth * offset1_2);
    videoPlane1.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-2-1"){
            const arPosition = content[1].split(",");

            videoPlane1.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
        }

        if(content[0].trim(" ") == "arRotation6-2-1"){
            const arRotation = content[1].split(",");

            videoPlane1.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth6-2-1"){
            const arHeightWidth = content[1].split(",");

            videoPlane1.setAttribute("height", arHeightWidth[1] * offset1_2);
            videoPlane1.setAttribute("width",  arHeightWidth[1]);
        }
    })
});
videoPlane2.addEventListener("loaded", () => {
    const vpRotation = videoPlane2.object3D.rotation;
    const vpWidth    = videoPlane2.getAttribute("width");

    initialValueWidthVP2  = vpWidth;
    videoPlane2.setAttribute("height", vpWidth * offset2_2);
    videoPlane2.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition6-2-2"){
            const arPosition = content[1].split(",");

            videoPlane2.setAttribute("position", {x: arPosition[0], y: arPosition[1], z: arPosition[2]});
        }

        if(content[0].trim(" ") == "arRotation6-2-2"){
            const arRotation = content[1].split(",");

            videoPlane2.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth6-2-2"){
            const arHeightWidth = content[1].split(",");

            videoPlane2.setAttribute("height", arHeightWidth[1] * offset2_2);
            videoPlane2.setAttribute("width",  arHeightWidth[1]);
        }
    })
});

// 6Dof環境では、同じpattファイルを使い回して複数のARを表示しようとすると
// 後に登録したARのみが表示されるようなので、2と5のAR表示処理は他とは別の処理で対処する
marker.addEventListener("markerFound", () => {
    videoPlane1.setAttribute("visible", true);
    videoPlane2.setAttribute("visible", true);
    videoPlane1.setAttribute("src", "../../04_image/ARImage/AR2_信濃秋山_薪.png");
    videoPlane2.setAttribute("src", "../../04_image/ARImage/AR2_信濃秋山_お婆さんのみ.png");

    videoPlane1.setAttribute("height", videoPlane1.getAttribute("width") * offset1);
    videoPlane2.setAttribute("height", videoPlane2.getAttribute("width") * offset2);
});
marker.addEventListener("markerLost", () => {
    videoPlane1.setAttribute("visible", false);
    videoPlane2.setAttribute("visible", false);
});

// 🔹 まずフレームを読み込み開始
preloadFrames1(() => {
    console.log("アニメーション準備完了");
});
preloadFrames2(() => {
    console.log("アニメーション準備完了");
});



/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * AR要素を読み込んだ時、その値をデバッグ画面の初期値として設定する
 * 「AR2_信濃秋山」だけAR画像を2枚表示するが、そのためだけに新しくJSを作るのは面倒なので、
 * このJS内にデバッグ画面の処理を記載する
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

        if(content[0].trim(" ") == "arPosition6-2-1"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation6-2-1"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
        }

        if(content[0].trim(" ") == "arHeightWidth6-2-1"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
        }
    });


    const dialog = document.getElementById("kariModalDialog");
    dialog.show();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    kariSettingButton1.setAttribute("style", "display: none;");
    kariSettingButton2.setAttribute("style", "display: none;");

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

        if(content[0].trim(" ") == "arPosition6-2-2"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation6-2-2"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
        }

        if(content[0].trim(" ") == "arHeightWidth6-2-2"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
        }
    });


    const dialog = document.getElementById("kariModalDialog");
    dialog.show();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    kariSettingButton1.setAttribute("style", "display: none;");
    kariSettingButton2.setAttribute("style", "display: none;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: none;");

    modalIdentification = 2;
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

        document.cookie = "arPosition6-2-1="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-2-1="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-2-1=" + [height.value, width.value];
    }else{
        videoPlane2.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
        videoPlane2.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});
        // videoPlane2.setAttribute("height", height.value);
        videoPlane2.setAttribute("height", width.value * offset2);
        videoPlane2.setAttribute("width",  width.value);

        document.cookie = "arPosition6-2-2="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation6-2-2="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth6-2-2=" + [height.value, width.value];
    }
    
    const dialog = document.getElementById("kariModalDialog");
    dialog.close();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    kariSettingButton1.setAttribute("style", "display: block;");
    kariSettingButton2.setAttribute("style", "display: block;");

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
