/*＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
 * 一枚絵
 * AR画像は2枚表示する
 *＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝*/
const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane1   = document.getElementById("videoPlane1");
const videoPlane2   = document.getElementById("videoPlane2");
const camera        = document.querySelector("#mainCamera");

let markerTimer = null;
let markerVisible = false;

// Canvasを作成
const canvas1 = document.createElement("canvas");
canvas1.width  = window.innerWidth;
canvas1.height = window.innerHeight;
const ctx1 = canvas1.getContext("2d", { willReadFrequently: true });
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
const frames1 = [];
const frames2 = [];
let currentFrame = 0;
const fps = 20;
let playTimer1 = null;
let playTimer2 = null;

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
        frames1.push(img1);

        // const img2 = new Image();
        // img2.crossOrigin = "anonymous";
        // img2.src = `${ARImage2}${frameExt}`;
        // img2.onload = () => {
        //     loaded++;
        //     // 進捗を表示
        //     progressText.textContent = Math.floor((loaded / frameCount) * 100) + "%";
        //     if (loaded === frameCount) {
        //         console.log("✅ 全フレームロード完了");
        //         loadingOverlay.style.display = "none"; // ローディング画面を隠す
        //         callback();
        //         offset2 =  img2.height / img2.width;
        //     }
        // };
        // frames2.push(img2);
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
        frames2.push(img2);
    }
}

function drawNextFrame1() {
    const img1 = frames1[currentFrame];
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.drawImage(img1, 0, 0, canvas1.width, canvas1.height);

    const mat1 = videoPlane1.getObject3D("mesh")?.material;
    if (mat1?.map) mat1.map.needsUpdate = true;

    currentFrame = (currentFrame + 1) % frameCount;
}
function startPlayback1() {
    if (!playTimer1) playTimer1 = setInterval(drawNextFrame1, 1000 / fps);
}
function stopPlayback1() {
    if (playTimer1) {
        clearInterval(playTimer1);
        playTimer1 = null;
    }
}

function drawNextFrame2() {
    const img2 = frames2[currentFrame];
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(img2, 0, 0, canvas2.width, canvas2.height);

    const mat2 = videoPlane2.getObject3D("mesh")?.material;
    if (mat2?.map) mat2.map.needsUpdate = true;

    currentFrame = (currentFrame + 1) % frameCount;
}
function startPlayback2() {
    if (!playTimer2) playTimer2 = setInterval(drawNextFrame2, 1000 / fps);
}
function stopPlayback2() {
    if (playTimer2) {
        clearInterval(playTimer2);
        playTimer2 = null;
    }
}


let marker1PositionX = -1;
let marker1PositionY = -3.5;
let marker1PositionZ = 0;
let marker2PositionX = 0.5;
let marker2PositionY = -3.5;
let marker2PositionZ = -5;
let cameraFrag = true;

barcodeMarker.addEventListener("markerFound", () => {
    if(!cameraFrag) return;

    if (!markerVisible) {
        markerVisible = true;
        videoPlane1.setAttribute("visible", "true");
        startPlayback1();
        videoPlane2.setAttribute("visible", "true");
        startPlayback2();
        cameraFrag = false;

        videoPlane1.setAttribute("height", videoPlane1.getAttribute("width") * offset1);
        videoPlane2.setAttribute("height", videoPlane2.getAttribute("width") * offset2);

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

                const offsetPosition1 = markerWorldPos.clone().add(new THREE.Vector3(parseInt(marker1PositionX), parseInt(marker1PositionY), parseInt(marker1PositionZ)));
                videoPlane1.object3D.position.copy(offsetPosition1);
                videoPlane1.setAttribute("visible", "true");  // ← マーカー検出時に表示

                const offsetPosition2 = markerWorldPos.clone().add(new THREE.Vector3(parseInt(marker2PositionX), parseInt(marker2PositionY), parseInt(marker2PositionZ)));
                videoPlane2.object3D.position.copy(offsetPosition2);
                videoPlane2.setAttribute("visible", "true");
            }
        }, 100);
    }
});

barcodeMarker.addEventListener("markerLost", () => {
    markerVisible = false;
    if (markerTimer) {
        clearTimeout(markerTimer);
        markerTimer = null;
    }
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
let initialValueHeightVP1;
let initialValueWidthVP1;
let initialValueHeightVP2;
let initialValueWidthVP2;

// w:2865px × h:622px
let offset1_2 = 622 * 2865;
// w:1576px × h:1812px
let offset2_2 = 1812 * 1576;
videoPlane1.addEventListener("loaded", () => {
    const vpRotation = videoPlane1.object3D.rotation;
    const vpHeight   = videoPlane1.getAttribute("height");
    const vpWidth    = videoPlane1.getAttribute("width");

    
    initialValueHeightVP1 = vpHeight;
    initialValueWidthVP1  = vpWidth;
    // videoPlane1.setAttribute("height", 0.6 * vpHeight);
    // videoPlane1.setAttribute("width",  2.8 * vpWidth);
    videoPlane1.setAttribute("height", vpWidth * offset1_2);
    videoPlane1.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition2_1"){
            const arPosition = content[1].split(",");

            markerPositionX = arPosition[0];
            markerPositionY = arPosition[1];
            markerPositionZ = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation2_1"){
            const arRotation = content[1].split(",");

            videoPlane1.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth2_1"){
            const arHeightWidth = content[1].split(",");

            // videoPlane1.setAttribute("height", 0.6 * arHeightWidth[0]);
            // videoPlane1.setAttribute("width",  2.8 * arHeightWidth[1]);
            videoPlane1.setAttribute("height", arHeightWidth[1] * offset1_2);
            videoPlane1.setAttribute("width",  arHeightWidth[1]);
        }
    })
});
videoPlane2.addEventListener("loaded", () => {
    const vpRotation = videoPlane2.object3D.rotation;
    const vpHeight   = videoPlane2.getAttribute("height");
    const vpWidth    = videoPlane2.getAttribute("width");

    initialValueHeightVP2 = vpHeight;
    initialValueWidthVP2  = vpWidth;
    // videoPlane2.setAttribute("height", 3.9 * vpHeight);
    // videoPlane2.setAttribute("width",  4.5 * vpWidth);
    videoPlane2.setAttribute("height", vpHeight * offset2_2);
    videoPlane2.setAttribute("width",  vpWidth);

    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition2_2"){
            const arPosition = content[1].split(",");

            markerPositionX = arPosition[0];
            markerPositionY = arPosition[1];
            markerPositionZ = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation2_2"){
            const arRotation = content[1].split(",");

            videoPlane2.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth2_2"){
            const arHeightWidth = content[1].split(",");

            // videoPlane2.setAttribute("height", 3.9 * arHeightWidth[0]);
            // videoPlane2.setAttribute("width",  4.5 * arHeightWidth[1]);
            videoPlane2.setAttribute("height", arHeightWidth[1] * offset2_2);
            videoPlane2.setAttribute("width",  arHeightWidth[1]);
        }
    })
});

let modalIdentification;
function openDialog1() {
    const vpRotation = videoPlane1.object3D.rotation;
    document.getElementById("XDirection").value = marker1PositionX;
    document.getElementById("YDirection").value = marker1PositionY;
    document.getElementById("ZDirection").value = marker1PositionZ;
    document.getElementById("XRotation").value  = Math.floor(THREE.MathUtils.radToDeg(vpRotation.x)); //整数で入力しても小数点が出るので切り捨て
    document.getElementById("YRotation").value  = Math.floor(THREE.MathUtils.radToDeg(vpRotation.y));
    document.getElementById("ZRotation").value  = Math.floor(THREE.MathUtils.radToDeg(vpRotation.z));

    // const height = document.getElementById("height");
    // const width  = document.getElementById("width");
    // height.setAttribute("value", initialValueHeightVP1);
    // width.setAttribute( "value", initialValueWidthVP1);
    document.getElementById("height").value     = initialValueWidthVP1;
    document.getElementById("width").value      = initialValueWidthVP1;



    console.log("cookie：" + document.cookie);
    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition2_1"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation2_1"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
            videoPlane1.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth2_1"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
            videoPlane1.setAttribute("height", arHeightWidth[0]);
            videoPlane1.setAttribute("width",  arHeightWidth[1]);
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
    const vpRotation = videoPlane2.object3D.rotation;
    document.getElementById("XDirection").value = marker2PositionX;
    document.getElementById("YDirection").value = marker2PositionY;
    document.getElementById("ZDirection").value = marker2PositionZ;
    document.getElementById("XRotation").value  = Math.floor(THREE.MathUtils.radToDeg(vpRotation.x));
    document.getElementById("YRotation").value  = Math.floor(THREE.MathUtils.radToDeg(vpRotation.y));
    document.getElementById("ZRotation").value  = Math.floor(THREE.MathUtils.radToDeg(vpRotation.z));

    // const height = document.getElementById("height");
    // const width  = document.getElementById("width");
    // height.setAttribute("value", initialValueHeightVP2);
    // width.setAttribute( "value", initialValueWidthVP2);
    document.getElementById("height").value     = initialValueWidthVP2;
    document.getElementById("width").value      = initialValueWidthVP2;



    console.log("cookie：" + document.cookie);
    const cookies = document.cookie;
    const array = cookies.split(";");

    array.forEach(function(value) {
        const content = value.split("=");

        if(content[0].trim(" ") == "arPosition2_2"){
            const arPosition = content[1].split(",");

            document.getElementById("XDirection").value = arPosition[0];
            document.getElementById("YDirection").value = arPosition[1];
            document.getElementById("ZDirection").value = arPosition[2];
        }

        if(content[0].trim(" ") == "arRotation2_2"){
            const arRotation = content[1].split(",");

            document.getElementById("XRotation").value = arRotation[0];
            document.getElementById("YRotation").value = arRotation[1];
            document.getElementById("ZRotation").value = arRotation[2];
            videoPlane2.setAttribute("rotation", {x: arRotation[0], y: arRotation[1], z: arRotation[2]});
        }

        if(content[0].trim(" ") == "arHeightWidth2_2"){
            const arHeightWidth = content[1].split(",");

            document.getElementById("height").value = arHeightWidth[0];
            document.getElementById("width").value  = arHeightWidth[1];
            videoPlane2.setAttribute("height", arHeightWidth[0]);
            videoPlane2.setAttribute("width",  arHeightWidth[1]);
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
        // w:2865px × h:622px
        // videoPlane1.setAttribute("height", 0.6 * height.value);
        // videoPlane1.setAttribute("width",  2.8 * width.value);
        videoPlane1.setAttribute("height", width.value * offset1);
        videoPlane1.setAttribute("width",  width.value);

        marker1PositionX = Number(xDirection.value);
        marker1PositionY = Number(yDirection.value);
        marker1PositionZ = Number(zDirection.value);

        document.cookie = "arPosition2_1="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation2_1="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth2_1=" + [height.value, width.value];
    }else{
        videoPlane2.setAttribute("position", {x: xDirection.value, y: yDirection.value, z: zDirection.value});
        videoPlane2.setAttribute("rotation", {x: xRotation.value, y: yRotation.value, z: zRotation.value});
        // w:1576px × h:1812px ⇒ アスペクト比:394:453
        videoPlane2.setAttribute("height", width.value * offset2);
        videoPlane2.setAttribute("width",  width.value);

        marker2PositionX = Number(xDirection.value);
        marker2PositionY = Number(yDirection.value);
        marker2PositionZ = Number(zDirection.value);

        document.cookie = "arPosition2_2="    + [xDirection.value, yDirection.value, zDirection.value];
        document.cookie = "arRotation2_2="    + [xRotation.value, yRotation.value, zRotation.value];
        document.cookie = "arHeightWidth2_2=" + [height.value, width.value];
    }
    
    const dialog = document.getElementById("kariModalDialog");
    dialog.close();
    const kariSettingButton1 = document.getElementById("kariSettingButton1");
    const kariSettingButton2 = document.getElementById("kariSettingButton2");
    kariSettingButton1.setAttribute("style", "display: block;");
    kariSettingButton2.setAttribute("style", "display: block;");

    const kariGuidemarkerButton = document.getElementById("kariGuidemarkerButton");
    kariGuidemarkerButton.setAttribute("style", "display: block; position: fixed; bottom: 60px; right: 10px;");



    // 設定更新
    markerVisible = true;
    videoPlane1.setAttribute("visible", "false");
    startPlayback1();
    videoPlane2.setAttribute("visible", "false");
    startPlayback2();
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

            const offsetPosition1 = markerWorldPos.clone().add(new THREE.Vector3(marker1PositionX, marker1PositionY, marker1PositionZ));
            videoPlane1.object3D.position.copy(offsetPosition1);

            const offsetPosition2 = markerWorldPos.clone().add(new THREE.Vector3(marker2PositionX, marker2PositionY, marker2PositionZ));
            videoPlane2.object3D.position.copy(offsetPosition2);
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