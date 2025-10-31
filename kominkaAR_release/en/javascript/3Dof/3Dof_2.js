const barcodeMarker = document.getElementById("barcodeMarker");
const videoPlane1 = document.getElementById("videoPlane1");
const videoPlane2 = document.getElementById("videoPlane2");
const camera = document.querySelector("#mainCamera");

let markerTimer = null;
let markerVisible = false;

// Canvasを作成
const canvas1 = document.createElement("canvas");
canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
const ctx1 = canvas1.getContext("2d", { willReadFrequently: true });
videoPlane1.setAttribute("material", "src", canvas1);
let offset1;

const canvas2 = document.createElement("canvas");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight;
const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
videoPlane2.setAttribute("material", "src", canvas2);
let offset2;

// ARアニメ
const ARImage1 = "../../../image/ARImage/AR2_信濃秋山_薪";
const ARImage2 = "../../../image/ARImage/AR2_信濃秋山_お婆さんのみ";
const frameCount = 1;
const frameExt = ".png";
const frames1 = [];
const frames2 = [];
let currentFrame = 0;
const fps = 20;
let playTimer1 = null;
let playTimer2 = null;


const loadingOverlay = document.getElementById("loadingOverlay");
const AROverlay = document.getElementById("AROverlay");
const progressText = document.getElementById("progress");

let markerPositionX = -2;
let markerPositionY = 0;
let markerPositionZ = -1;

let markerRotationX = 0;
let markerRotationY = 30;
let markerRotationZ = 0;

let markerHeight = 4;
let markerWidth = 4;

let markerPositionX2 = -1;
let markerPositionY2 = 2;
let markerPositionZ2 = -2;

let markerRotationX2 = 0;
let markerRotationY2 = 15;
let markerRotationZ2 = 0;

let markerHeight2 = 2;
let markerWidth2 = 2;

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
        offset1 = img1.height / img1.width;
        markerHeight = markerWidth * offset1;
      }
    };
    frames1.push(img1);
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
        offset2 = img2.height / img2.width;
        markerHeight2 = markerWidth2 * offset2;
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


function updateVideoPlane() {
  if (markerVisible) {
    // --- ワールド座標 ---
    const markerWorldPos = new THREE.Vector3();
    barcodeMarker.object3D.updateMatrixWorld(true);
    barcodeMarker.object3D.getWorldPosition(markerWorldPos);
    camera.object3D.updateMatrixWorld(true);
    markerWorldPos.setFromMatrixPosition(barcodeMarker.object3D.matrixWorld);
    markerWorldPos.applyMatrix4(camera.object3D.matrixWorld);

    // --- ワールド回転 ---
    const markerLocalQuat = new THREE.Quaternion();
    const markerWorldQuat = new THREE.Quaternion();
    barcodeMarker.object3D.getWorldQuaternion(markerLocalQuat);
    const cameraWorldQuat = new THREE.Quaternion();
    camera.object3D.getWorldQuaternion(cameraWorldQuat);
    markerWorldQuat.multiplyQuaternions(cameraWorldQuat, markerLocalQuat);

    // 現在のマーカーの「上」方向（ローカルのY軸がワールド空間でどうなっているか）
    const markerUp = new THREE.Vector3(0, 1, 0).applyQuaternion(markerWorldQuat);
    // ワールドの「上」方向
    const worldUp = new THREE.Vector3(0, 1, 0);
    // マーカーのUpベクトルとワールドのUpベクトルの間の回転軸と角度を計算
    const correctionQuaternion = new THREE.Quaternion().setFromUnitVectors(markerUp, worldUp);
    // 元のマーカーの回転に補正回転を適用（ワールド座標系で回転を安定させる）
    const stableMarkerWorldQuat = correctionQuaternion.multiply(markerWorldQuat);

    // --- 位置補正 ---
    const offsetPosition = new THREE.Vector3(
      Number(markerPositionX),
      Number(markerPositionY),
      Number(markerPositionZ)
    );
    // マーカーのワールド回転を適用
    const rotatedOffset = offsetPosition.clone().applyQuaternion(stableMarkerWorldQuat);
    const finalPos = markerWorldPos.clone().add(rotatedOffset);

    // --- 回転補正 ---
    const offsetEuler = new THREE.Euler(
      THREE.MathUtils.degToRad(markerRotationX),
      THREE.MathUtils.degToRad(markerRotationY),
      THREE.MathUtils.degToRad(markerRotationZ)
    );
    const offsetQuat = new THREE.Quaternion().setFromEuler(offsetEuler);
    const finalQuat = stableMarkerWorldQuat.clone().multiply(offsetQuat);

    // --- スケール補正 ---
    const markerScale = barcodeMarker.object3D.scale.clone();
    const offsetScale = new THREE.Vector3(markerWidth, markerHeight, 1);
    const finalScale = markerScale.multiply(offsetScale);
    console.log(markerHeight);

    // --- 適用 ---
    videoPlane1.object3D.position.copy(finalPos);
    videoPlane1.object3D.quaternion.copy(finalQuat);
    videoPlane1.object3D.scale.copy(finalScale);

    // --- 位置補正 ---

    const offsetPosition2 = new THREE.Vector3(
      Number(markerPositionX2),
      Number(markerPositionY2),
      Number(markerPositionZ2)
    );
    // マーカーのワールド回転を適用
    const rotatedOffset2 = offsetPosition2.clone().applyQuaternion(stableMarkerWorldQuat);
    const finalPos2 = markerWorldPos.clone().add(rotatedOffset2);

    // --- 回転補正 ---
    const offsetEuler2 = new THREE.Euler(
      THREE.MathUtils.degToRad(markerRotationX2),
      THREE.MathUtils.degToRad(markerRotationY2),
      THREE.MathUtils.degToRad(markerRotationZ2)
    );
    const offsetQuat2 = new THREE.Quaternion().setFromEuler(offsetEuler2);
    const finalQuat2 = stableMarkerWorldQuat.clone().multiply(offsetQuat2);

    // --- スケール補正 ---
    const markerScale2 = barcodeMarker.object3D.scale.clone();
    const offsetScale2 = new THREE.Vector3(markerWidth2, markerHeight2, 1);
    const finalScale2 = markerScale2.multiply(offsetScale2);

    // --- 適用 ---
    videoPlane2.object3D.position.copy(finalPos2);
    videoPlane2.object3D.quaternion.copy(finalQuat2);
    videoPlane2.object3D.scale.copy(finalScale2);
  }
}

AFRAME.registerComponent("marker-tracker", {
  tick: function () {
    updateVideoPlane();
  }
});

barcodeMarker.addEventListener("markerFound", () => {
  if (!markerVisible) {
    markerVisible = true;
    videoPlane1.setAttribute("visible", "true");
    startPlayback1();
    videoPlane2.setAttribute("visible", "true");
    startPlayback2();
    AROverlay.style.display = "none";

    camera.setAttribute('look-controls', {
      enabled: true,
      magicWindowTrackingEnabled: true
    });
  }
});


barcodeMarker.addEventListener("markerLost", () => {
  markerVisible = false;
  if (markerTimer) {
    clearInterval(markerTimer);
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

videoPlane1.addEventListener("loaded", () => {
  const vpRotation = videoPlane1.object3D.rotation;
  const vpHeight = videoPlane1.getAttribute("height");
  const vpWidth = videoPlane1.getAttribute("width");


  initialValueHeightVP1 = vpHeight;
  initialValueWidthVP1 = vpWidth;

  const cookies = document.cookie;
  const array = cookies.split(";");

  array.forEach(function (value) {
    const content = value.split("=");

    if (content[0].trim(" ") == "arPosition2_1") {
      const arPosition = content[1].split(",");

      markerPositionX = arPosition[0];
      markerPositionY = arPosition[1];
      markerPositionZ = arPosition[2];
    }

    if (content[0].trim(" ") == "arRotation2_1") {
      const arRotation = content[1].split(",");

      markerRotationX = arRotation[0];
      markerRotationY = arRotation[1];
      markerRotationZ = arRotation[2];
    }

    if (content[0].trim(" ") == "arHeightWidth2_1") {
      const arHeightWidth = content[1].split(",");

      markerHeight = Number(arHeightWidth[0]);
      markerWidth = Number(arHeightWidth[1]);
    }
  })
});

videoPlane2.addEventListener("loaded", () => {
  const vpRotation = videoPlane2.object3D.rotation;
  const vpHeight = videoPlane2.getAttribute("height");
  const vpWidth = videoPlane2.getAttribute("width");

  initialValueHeightVP2 = vpHeight;
  initialValueWidthVP2 = vpWidth;

  const cookies = document.cookie;
  const array = cookies.split(";");

  array.forEach(function (value) {
    const content = value.split("=");

    if (content[0].trim(" ") == "arPosition2_2") {
      const arPosition = content[1].split(",");

      markerPositionX2 = arPosition[0];
      markerPositionY2 = arPosition[1];
      markerPositionZ2 = arPosition[2];
    }

    if (content[0].trim(" ") == "arRotation2_2") {
      const arRotation = content[1].split(",");

      markerRotationX2 = arRotation[0];
      markerRotationY2 = arRotation[1];
      markerRotationZ2 = arRotation[2];
    }

    if (content[0].trim(" ") == "arHeightWidth2_2") {
      const arHeightWidth = content[1].split(",");

      markerHeight2 = Number(arHeightWidth[0]);
      markerWidth2 = Number(arHeightWidth[1]);
    }
  })
});

let modalIdentification;
function openDialog1() {
  document.getElementById("XDirection").value = markerPositionX;
  document.getElementById("YDirection").value = markerPositionY;
  document.getElementById("ZDirection").value = markerPositionZ;
  document.getElementById("XRotation").value = markerRotationX;
  document.getElementById("YRotation").value = markerRotationY;
  document.getElementById("ZRotation").value = markerRotationZ;

  document.getElementById("height").value = markerHeight;
  document.getElementById("width").value = markerWidth;



  console.log("cookie：" + document.cookie);
  const cookies = document.cookie;
  const array = cookies.split(";");

  array.forEach(function (value) {
    const content = value.split("=");

    if (content[0].trim(" ") == "arPosition2_1") {
      const arPosition = content[1].split(",");

      document.getElementById("XDirection").value = arPosition[0];
      document.getElementById("YDirection").value = arPosition[1];
      document.getElementById("ZDirection").value = arPosition[2];
    }

    if (content[0].trim(" ") == "arRotation2_1") {
      const arRotation = content[1].split(",");

      document.getElementById("XRotation").value = arRotation[0];
      document.getElementById("YRotation").value = arRotation[1];
      document.getElementById("ZRotation").value = arRotation[2];
    }

    if (content[0].trim(" ") == "arHeightWidth2_1") {
      const arHeightWidth = content[1].split(",");

      document.getElementById("height").value = arHeightWidth[0];
      document.getElementById("width").value = arHeightWidth[1];
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
  document.getElementById("XDirection").value = markerPositionX2;
  document.getElementById("YDirection").value = markerPositionY2;
  document.getElementById("ZDirection").value = markerPositionZ2;
  document.getElementById("XRotation").value = markerRotationX2;
  document.getElementById("YRotation").value = markerRotationY2;
  document.getElementById("ZRotation").value = markerRotationZ2;

  document.getElementById("height").value = markerHeight2;
  document.getElementById("width").value = markerWidth2;



  console.log("cookie：" + document.cookie);
  const cookies = document.cookie;
  const array = cookies.split(";");

  array.forEach(function (value) {
    const content = value.split("=");

    if (content[0].trim(" ") == "arPosition2_2") {
      const arPosition = content[1].split(",");

      document.getElementById("XDirection").value = arPosition[0];
      document.getElementById("YDirection").value = arPosition[1];
      document.getElementById("ZDirection").value = arPosition[2];
    }

    if (content[0].trim(" ") == "arRotation2_2") {
      const arRotation = content[1].split(",");

      document.getElementById("XRotation").value = arRotation[0];
      document.getElementById("YRotation").value = arRotation[1];
      document.getElementById("ZRotation").value = arRotation[2];
    }

    if (content[0].trim(" ") == "arHeightWidth2_2") {
      const arHeightWidth = content[1].split(",");

      document.getElementById("height").value = arHeightWidth[0];
      document.getElementById("width").value = arHeightWidth[1];
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
  const xRotation = document.getElementById("XRotation");
  const yRotation = document.getElementById("YRotation");
  const zRotation = document.getElementById("ZRotation");
  // const height     = document.getElementById("height");
  const height = document.getElementById("width");
  const width = document.getElementById("width");

  if (modalIdentification == 1) {
    markerRotationX = xRotation.value;
    markerRotationY = yRotation.value;
    markerRotationZ = zRotation.value;

    markerHeight = width.value * offset1;
    markerWidth = width.value;

    markerPositionX = Number(xDirection.value);
    markerPositionY = Number(yDirection.value);
    markerPositionZ = Number(zDirection.value);

    document.cookie = "arPosition2_1=" + [xDirection.value, yDirection.value, zDirection.value];
    document.cookie = "arRotation2_1=" + [xRotation.value, yRotation.value, zRotation.value];
    document.cookie = "arHeightWidth2_1=" + [height.value, width.value];
  } else {
    markerRotationX2 = xRotation.value;
    markerRotationY2 = yRotation.value;
    markerRotationZ2 = zRotation.value;

    markerHeight2 = width.value * offset2;
    markerWidth2 = width.value;

    markerPositionX2 = Number(xDirection.value);
    markerPositionY2 = Number(yDirection.value);
    markerPositionZ2 = Number(zDirection.value);

    document.cookie = "arPosition2_2=" + [xDirection.value, yDirection.value, zDirection.value];
    document.cookie = "arRotation2_2=" + [xRotation.value, yRotation.value, zRotation.value];
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
  startPlayback1();
  startPlayback2();
  cameraFrag = true;
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

//const arrangementChange = document.getElementById("arrangementChange");
function debugScreenFlexGrid(angle) {
    if (angle == 0) {
        //const arrangementChange = document.getElementById("arrangementChange");
        const kominkaArLogoErea = document.getElementById("kominkaArLogoErea");
        const pageBackBtnErea = document.getElementById("pageBackBtnErea");
        const ARTargetImg = document.getElementById("ARTargetImg");

        //arrangementChange.setAttribute("style", "display: grid; height: 530px;");
        kominkaArLogoErea.setAttribute("style", "width: 20%;");
        pageBackBtnErea.setAttribute("style", "left: 87%; width: 12%;");
        ARTargetImg.setAttribute("src", "../../../image/ARImage/map_img_ar_frame_vertical.png");
        ARTargetImg.setAttribute("height", "auto");
        ARTargetImg.setAttribute("width", "100%");
    }

    if (angle == 90) {
        //const arrangementChange = document.getElementById("arrangementChange");
        const kominkaArLogoErea = document.getElementById("kominkaArLogoErea");
        const pageBackBtnErea = document.getElementById("pageBackBtnErea");
        const ARTargetImg = document.getElementById("ARTargetImg");

        //arrangementChange.setAttribute("style", "display: flex; height: 250px;");
        kominkaArLogoErea.setAttribute("style", "width: 10%;");
        pageBackBtnErea.setAttribute("style", "width: 6%;");
        ARTargetImg.setAttribute("src", "../../../image/ARImage/map_img_ar_frame.png");
        ARTargetImg.setAttribute("width", "auto");
        ARTargetImg.setAttribute("height", "100%");
    }
    if (angle == 270) {
        //const arrangementChange = document.getElementById("arrangementChange");
        const kominkaArLogoErea = document.getElementById("kominkaArLogoErea");
        const pageBackBtnErea = document.getElementById("pageBackBtnErea");
        const ARTargetImg = document.getElementById("ARTargetImg");

        //arrangementChange.setAttribute("style", "display: flex; height: 250px;");
        kominkaArLogoErea.setAttribute("style", "width: 10%;");
        pageBackBtnErea.setAttribute("style", "width: 6%;");
        ARTargetImg.setAttribute("src", "../../../image/ARImage/map_img_ar_frame.png");
        ARTargetImg.setAttribute("width", "auto");
        ARTargetImg.setAttribute("height", "100%");
    }
}