import { DeviceOrientationControls } from "./library/DeviceOrientationControls.js";

var screenWidth, screenHeight, canvas;
var scene, camera, renderer, object;
var group, cameraGroup, markerRoot;
var controls, mouseControls;
var arToolkitSource, arToolkitContext, arMarkerControls;
var houkou;
var buildingJsonData, buildingLabel, buildingImg, buildingImgLabel;
var buildingPeriod, buildingNameImg, buildText, buildingPhotoImg, buildingPhotoTextImg;
var detailVoice, audio;
var isAlreadySceneAdd = false;
var isArSoundPlay = true;
var isAllMapClick = false;
var isUseDeviceOrien = true;
var isGyroCounter = 10;
var groupRotationSave;
var touchStartX = 0;
var touchStartY = 0;
var touchMoveX = 0;
var touchMoveY = 0;
var compassOFFMsg;
const url = new URL(window.location.href); // URLを取得する
const paramId = url.searchParams.get("id"); // URL内の"id"を取得する
const id = (paramId >= 1 && paramId <= 7) ? paramId : null ; // idが1以上7以下かを判断。それ以外ならnull

if(id != null){
  $(".menuAttendContents").addClass("flash"); // menuAttendContentsクラスにflashクラスを追加する
}

const init = () => {
  screenWidth  = window.innerWidth;
  screenHeight = window.innerHeight;
  canvas = document.querySelector(".arCanvas"); // "canvas = document.getElementById("arCanvas")"から変更

  setMsgImg(); //image-controller.jsから呼び出し。jQueryのattrを使って画像のsrcを書き換えを行ってる
  if(!id){ // null以外なら = 上記のurlからidを取得出来ていたら
    $("#markerGuide").show();
    setMap();
    setCurrentLocation();
    setBackBtn();
  }

  setScene();
  setCamera();
  if (checkDeviceSP()) { // デバイスがiPhoneかandroidかを識別する。
    controls = new DeviceOrientationControls(camera, true); // スマホのカメラを有効化する
  }

  setObject().then(() => { // promise/then。promiseが解決したら実行される
    setArToolkit();
  });

  if(id){ // スタンプラリーの処理
    isAlreadySceneAdd = true;
    setMenuBtn();
    settingBuildingImage(id - 1);
    removeMap();
    $("#markerGuide").hide();
    $("#arContentsBuildingContents").show();
    
    checkCookie("stampList");
    var list = getCookie("stampList");
    stampRallyList = list;

    if(id == 5 || id == 6){
      stampRallyList[4] = true;
      stampRallyList[5] = true;
    }else{
      stampRallyList[id-1] = true;
    }
    setCookie("stampList", stampRallyList);
  }
};

$.getJSON(BUILDING_JSON_PATH).done(function (json) {
  buildingJsonData = json;
}).fail(function () {
  console.log(`json取得失敗`);
}).always(function () {
  console.log(`json取得処理終了`);
});

// Three.jsを初期化する
const setScene = () => {
  scene      = new THREE.Scene();
  group      = new THREE.Group();
  markerRoot = new THREE.Group();
};

// カメラ初期化
const setCamera = () => {
  camera = new THREE.PerspectiveCamera(90, screenWidth / screenHeight, 0.1, 30);
  camera.position.set(0, 0, 0.1);
  camera.lookAt(new THREE.Vector3(0,0,0));

  cameraGroup = new THREE.Group();
  cameraGroup.add(camera);
  scene.add(cameraGroup);
};

// async/awaitを用いた非同期処理
const setObject = async () => {
  if(id != null){
    await addObject(id - 1, true); // asyncの処理が完了するまでawait(待機)する
    if(id == 5){
      await addObject(id - 1, false);
    }
  }
};

const addObject = async (id, flg) => {
  async function loadTex(url) { // Three.jsのテクスチャを読み込む
    const texLoader = new THREE.TextureLoader();
    const texture = await texLoader.loadAsync(url);
    return texture;
  }

  var textureText;
  if(flg){
    textureText = buildingJsonData[id].building_path; // jsonデータを読み込む
  }else{
    textureText = AR_IMAGE05;
  }

  const geometry = new THREE.SphereBufferGeometry(10, 100, 100); // 円球のジオメトリ(ポリゴン)を作る。SphereBufferGeometryの引数は"半径, 横方向を何面にするか, 縦方向を何面にするか"
  geometry.scale(-1, 1, 1);

  const material = new THREE.ShaderMaterial({
    transparent: true,
    opacity: 0.5,
    uniforms: {
      uTex: {
        value: await loadTex(textureText),
      },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D uTex;
      void main() {
        vec2 uvTop = vec2(vUv.x, vUv.y / 2.0 + 0.5);
        vec4 colorTop = texture2D(uTex, uvTop);
        vec2 uvBottom = vec2(vUv.x, vUv.y / 2.0);
        vec4 alphaBottom = texture2D(uTex, uvBottom);

        vec4 texColor = texture2D(uTex, vUv);
        gl_FragColor = vec4(colorTop.r, colorTop.g, colorTop.b, alphaBottom.b);
    }`,
  });

  object = new THREE.Mesh(geometry, material);
  object.rotation.y = 0;

  if(!flg) object.visible = false;

  group.add(object);
  scene.add(group);
};

const setArToolkit = () => {
    arToolkitContext = new THREEx.ArToolkitContext({
      // cameraParametersUrl: "../../common/marker/camera.dat",
      cameraParametersUrl: "../common/marker/camera.dat",
      detectionMode: "mono",
      patternRatio: 0.8,
    });
    arToolkitContext.init(() => {
      camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: "webcam",
    });
    arToolkitSource.init(() => {
      setTimeout(() => handleResize(), 2000);
    });
    let onRenderFcts = [];
    onRenderFcts.push(() => {
      if (arToolkitSource.ready === false) return;
      arToolkitContext.update(arToolkitSource.domElement);
      scene.visible = camera.visible;
    });

    arMarkerControls = [
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id1.patt",
        changeMatrixMode: "modelViewMatrix",
      }),
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id2.patt",
        changeMatrixMode: "modelViewMatrix",
      }),
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id3.patt",
        changeMatrixMode: "modelViewMatrix",
      }),
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id4.patt",
        changeMatrixMode: "modelViewMatrix",
      }),
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id5.patt",
        changeMatrixMode: "modelViewMatrix",
      }),
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id6.patt",
        changeMatrixMode: "modelViewMatrix",
      }),
      new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: "pattern",
        patternUrl: "../../common/marker/pattern-id7.patt",
        changeMatrixMode: "modelViewMatrix",
      })
    ];

    for(let i = 0; i < arMarkerControls.length; i++) {
      arMarkerControls[i].addEventListener("markerFound", () => {
        if (!isAlreadySceneAdd) {
          removeMap();
          $("#markerGuide").hide();
          $(".loaderContents").removeClass("hidden");
          setMenuBtn();

          addObject(i, true).then(() => {
            $(".loaderContents").addClass("hidden");
            settingBuildingImage(i);
            $("#arContentsBuildingContents").show();
            audio.play();
            isArSoundPlay = false;
          });
          if(i == 4){
            addObject(i, false);
          }

          checkCookie("stampList");
          var list = getCookie("stampList");
          stampRallyList = list;
          stampRallyList[i] = true;
          if(i == 4 || i == 5){
            stampRallyList[4] = true;
            stampRallyList[5] = true;
          }else{
            stampRallyList[i] = true;
          }
          setCookie("stampList", stampRallyList);
        }
        isAlreadySceneAdd = true;
      });
    }
    scene.add(markerRoot);

    setRenderer();
};

const setRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    canvas: canvas,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(screenWidth, screenHeight);
  renderer.setClearColor(0x000000, 0);

  if (!checkDeviceSP()) {
    mouseControls = new THREE.OrbitControls(camera, renderer.domElement);
    mouseControls.enablePan = false;
    mouseControls.enableZoom = false;
  }

  audio = new Audio();
  audio.src = "../../common/movies/AR01_2画面出力_2048.mp4";
  audio.load();

  renderer.setAnimationLoop(() => {
    render();
  });
};

const render = () => {
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
    scene.visible = camera.visible;
  }
  if (checkDeviceSP()) {
    controls.update();
  } else {
    mouseControls.update();
  }

  if(isGyroCounter == 0) {
    if(device == "iphone" ) group.rotation.y = (Math.PI * 2) * ((( houkou + 180 ) % 360) / 360);
    if(device == "android") group.rotation.y = (Math.PI * 2) * ((( houkou + 270 ) % 360) / 360);
    isGyroCounter--;
  }
  renderer.render(scene, camera);
};

const handleResize = () => {
  if(arToolkitSource != undefined){
    arToolkitSource.onResizeElement();
    arToolkitSource.copyElementSizeTo(renderer.domElement);
    if (arToolkitContext.arController !== null) {
      arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
    }
    setTimeout(() => {
      $(".loaderContents").addClass("hidden");
      if(id && isArSoundPlay) {
        audio.play();
        isArSoundPlay = false;
      }
    }, 2000);
  }
};

var screenWidth = screen.width;
$(window).on("orientationchange", function(e){
  $("#arCanvas").css("width", screenWidth + "px");
  $(".loaderContents").removeClass("hidden");
  if(window.innerHeight > window.innerWidth && screenWidth < 1025) {
    if(getAngle() == 0){
      setTimeout(() => {
        handleResize();
      }, 2000);
    }
  }else{
    if(getAngle() == 0){
      setTimeout(() => {
        handleResize();
      }, 2000);
    }
  }
});
window.addEventListener("deviceorientation",
  (event) => {
    const deg = calcDeviceDirection(event);
    const rad = deg * (Math.PI / 180);
    if (controls) {
      controls.alphaOffset -= rad;
    }
  },
  { once: true }
);

// const setCurrentLocation = () => {
//   navigator.geolocation.getCurrentPosition(
//     function(position){
//       const latitude  = position.coords.latitude;  // 緯度
//       const longitude = position.coords.longitude; // 経度

//       const minY = 34.677982;
//       const maxY = 34.684100;
//       const minX = 135.518861;
//       const maxX = 135.527315;
//       const mapX = $("#mapImg").innerWidth()  - 80;
//       const mapY = $("#mapImg").innerHeight() - 82;

//       // 経度が全体の範囲(minX～maxX)の中でどの位置にあるかを0〜1の割合で表している
//       // minX = 120、maxX = 130、longitude = 125の場合、
//       // (125-120)/(130-120) = 5/10 = 0.5、真ん中あたりになる。×100倍したあとMath.round()で四捨五入する
//       const mapXrat = Math.round(((longitude - minX) / (maxX - minX)) * 100);
//       // 地図の横幅(mapX)に対して、その割合だけ位置を決める。
//       const x = mapX * (mapXrat / 100);

//       const width = $("#mapContents").width(); // 画面に見えているmapContentsの幅を取得
//       const mapWidth = $("#mapImg").width(); // mapImgの要素(画像)の元の幅を取得
//       const scrollWidth = Math.floor(mapWidth - width); // スクロール可能な横幅を取得
//       const scrollX = scrollWidth * (mapXrat / 100); // 地図を横スクロールして指定の位置を中央に持ってくる量を計算
//       var ratX = 0;

//       if(mapXrat <= 20){
//         ratX = scrollX - 150;
//       // }else if(mapXrat > 20 && mapXrat <= 40){
//       }else if(20 < mapXrat && mapXrat <= 40){
//         ratX = scrollX - 100;
//       }else if(70 <= mapXrat){
//         ratX = scrollX + 100;
//       }else{
//         ratX = scrollX;
//       }
//       $("#mapContents").scrollLeft(ratX);

//       const mapYrat = Math.round(((latitude - minY) / (maxY - minY)) * 100);
//       const y = mapY * (mapYrat / 100);

//       const height = $("#mapContents").height();
//       const mapHeight = $("#mapImg").height();
//       const scrollHeight = Math.floor(mapHeight - height);
//       const scrollY = scrollHeight * (mapYrat / 100);
//       var ratY = 0;

//       if(mapYrat <= 40){
//         ratY = scrollY - 60;
//       // }else if(mapYrat >= 70){
//       }else if(70 <= mapYrat){
//         ratY = scrollY + 60;
//       }else{
//         ratY = scrollY;
//       }
//       $("#mapContents").scrollTop(ratY);

//       if((minY < latitude && latitude < maxY) && (minX < longitude && longitude < maxX)){
//         $("#mapCurrent").css({
//           top: `${y}px`,
//           left: `${x}px`,
//         });
//         $("#mapCurrent").append(
//           `<img src=${MAP_RADAR} id="mapMarkerRadar">
//           <img src=${MAP_HERE} id="mapMarkerPin">`
//         );
//       }else{
//         if(window.innerHeight < window.innerWidth && screenWidth < 1025){
//           $("#msgOutside").hide();
//         }else{
//           $("#msgOutside").show();
//           $("#mapComment").hide();
//           $("#mapBtn").hide();
//         }
//       }
//     },

//     function(error){
//       switch(error.code){
//         case 1:
//           console.log("エラー：位置情報を取得する許可が必要");
//           break;
//         case 2:
//           console.log("エラー：原因不明のエラーが発生し位置情報を取得出来なかった");
//           break;
//         case 3:
//           console.log("エラー：タイムアウト  制限時間内に位置情報を取得出来なかった");
//           break;
//         default:
//           console.log("エラー：原因不明のエラーが発生");
//           break;
//       }
//     },

//     {
//       enableHighAccuracy: false,
//       timeout: 5000,
//       maximumAge: 0
//     }
//   );
// }

const settingBuildingImage = (markerNum) => {
  buildingImg          = buildingJsonData[markerNum].detail.image_path;
  buildingImgLabel     = buildingJsonData[markerNum].detail.label_path;
  buildingLabel        = buildingJsonData[markerNum].name_path;
  buildingNameImg      = buildingJsonData[markerNum].detail.name_path;
  buildingPeriod       = buildingJsonData[markerNum].detail.period;
  buildingPhotoImg     = buildingJsonData[markerNum].detail.photo_path;
  buildingPhotoTextImg = buildingJsonData[markerNum].detail.photo_text_path;
  buildText            = buildingJsonData[markerNum].detail.text;
  detailVoice = new Audio();
  detailVoice.src      = buildingJsonData[markerNum].detail.voice;
  detailVoice.load();

  switch(markerNum){
    case 0:
    case 2:
    case 3:
      $("#arContentsBuildingContents:not(.en) #arContentsDetail").css("top", "55%");
      $("#arContentsBuildingContents.ko #arContentsDetail").css("top", "70%");
      break;
    case 4:
    case 5:
      $("#arContentsBuildingContents:not(.en) #arContentsDetail").css("top", "70%");
      $("#arContentsBuildingContents.ko #arContentsDetail").css("top", "85%");
      break;
    default:
      break;
  }
  if(markerNum == 4){
    $("#changeARbuildingBtn").show();
  }
  setBuildingName();
}

const setBuildingName = () => {
  $("#arContentsBuildingName").attr("src", buildingLabel);
  $("#arContentsDetailImg").attr("src", DETAIL);
  $("#arContentsDetailBtnImg").attr("src", DETAIL_BTN);
  $("#arCompassOFFBtnImg").attr("src", COMPASS_OFF);
  $("#arCompassOFFBtnImgOn").attr("src", COMPASS_OFF_PRS).hide();
  $("#arCompassONBtnImg").attr("src", COMPASS_ON);
  $("#arCompassONBtnImgOn").attr("src", COMPASS_ON_PRS).hide();
  $("#arCompassMsgImg").attr("src", COMPASS_MSG);
  $("#detailBuilding").attr("src", buildingImg);
  $("#detailBuildingImgLabel").attr("src", buildingImgLabel);
  $("#detailBuildingPeriod").attr("src", buildingPeriod);
  $("#detailBuildingName").attr("src", buildingNameImg);
  $("#detailBuildingTextArea > p").html(buildText);
  $("#detailBuildingFigImg").attr("src", buildingPhotoImg);
  $("#detailBuildingFigTextImg").attr("src", buildingPhotoTextImg);
  setDetailBuildingCommon();
  setBackBtnAR();
}

if(checkDeviceSP()) {
  if(device == "iphone") {
    window.addEventListener("deviceorientation", orientation, true);
  } else if(device == "android") {
    window.addEventListener("deviceorientationabsolute", orientation, true);
  } else {
    window.addEventListener("deviceorientation", orientation, true);
  }
}

// デバイスの向きを検出する
function orientation(event){
  let absolute = event.absolute;
  let alpha = event.alpha;
  let beta  = event.beta;
  let gamma = event.gamma;

  if(alpha != null){
    var degrees; // 度
    if(device == "iphone"){
      degrees = event.webkitCompassHeading;
    }else{
      degrees = compassHeading(alpha, beta, gamma);
    }

    var direction; // 方向
    if((degrees > 337.5 && degrees < 360) || (degrees > 0 && degrees < 22.5)){
      direction = "北";
    }else if(degrees > 22.5 && degrees < 67.5){
      direction = "北東";
    }else if(degrees > 67.5 && degrees < 112.5){
      direction = "東";
    }else if(degrees > 112.5 && degrees < 157.5){
      direction = "東南";
    }else if(degrees > 157.5 && degrees < 202.5){
      direction = "南";
    }else if(degrees > 202.5 && degrees < 247.5){
      direction = "南西";
    }else if(degrees > 247.5 && degrees < 292.5){
      direction = "西";
    }else if(degrees > 292.5 && degrees < 337.5){
      direction = "北西";
    }else{
      direction = "ないよ";
    }

    if(degrees != 0){
      if(isGyroCounter > 0) isGyroCounter--;
      houkou = degrees;
    }

    degrees = degrees + 180;
    const img = document.getElementById("mapMarkerRadar");
    if(img != null){
      img.style.transform = `rotate(${degrees}deg)`;
    }
  }
}

function compassHeading(alpha, beta, gamma) {
  var degtorad = Math.PI / 180; // Degree-to-Radian conversion

  var _x = beta  ? beta  * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos(_x);
  var cY = Math.cos(_y);
  var cZ = Math.cos(_z);
  var sX = Math.sin(_x);
  var sY = Math.sin(_y);
  var sZ = Math.sin(_z);

  // Calculate Vx and Vy components
  var Vx = -cZ * sY - sZ * sX * cY;
  var Vy = -sZ * sY + cZ * sX * cY;

  // Calculate compass heading
  var compassHeading = Math.atan(Vx / Vy);

  // Convert compass heading to use whole unit circle
  if (Vy < 0) {
    compassHeading += Math.PI;
  } else if (Vx < 0) {
    compassHeading += 2 * Math.PI;
  }

  return compassHeading * ( 180 / Math.PI ); // Compass Heading (in degrees)
}

$("#menuInHouseMapBtn").on("click", function(){
  $("#mainContents").hide();
  window.scroll({top:0});
  setTimeout(() => {
    init();
  }, 100);
  $("#arContents").show();
  $("body").css("overflow", "hidden");
});

pushBtn("mapBtn", "mapBtnImg", "mapBtnImgOn", false);
$("#mapCommon").css({height: "100%"});
// $("#mapBtn").on("click", function () {
//   isAllMapClick = true;
//   $(this).hide();
//   $("#mapComment").hide();
//   $("#mapLine").hide();
//   $("#mapCurrent").hide();
//   $("#markerGuide").hide();
//   $("#mapCommon").css({height: "100%"});
// });

pushBtn("changeLanguageBtnAR", "langBtnImgAR", "langBtnImgOnAR", false);
pushBtn("backBtn", "backBtnImg", "backBtnImgOn", false);
$("#backBtn").on("click", function(){
  window.location.href = "./index.html";
});
// $("#backBtn").on("click", function(){
//   if(isAllMapClick){
//     isAllMapClick = false;
//     $("#mapBtn").show();
//     $("#mapComment").show();
//     $("#mapLine").show();
//     $("#mapCurrent").show();
//     $("#markerGuide").show();
//     $("#mapCommon").css({height: "35%"});
//   }else{
//     window.location.href = "./arContents.html";
//   }
// });

pushBtn("backBtnAR", "backBtnARImg", "backBtnARImgOn", false);
$("#backBtnAR").on("click", function () {
  detailVoice.pause();
  detailVoice.currentTime = 0;
  $("#detailBuildingContents").hide();
  $("#arCanvas").show();
  $("#arjs-video").show();
  $("#menuBtn").show();
  $("#arContentsBuildingContents").show();
  $("#arContents").css("overflowY", "");
  window.scroll({top:0});
});

$("#arContentsDetailBtn").on("click", function () {
  $("#detailBuildingContents").show();
  $("#arCanvas").hide();
  $("#arjs-video").hide();
  $("#menuBtn").hide();
  $("#arContentsBuildingContents").hide();
  removeMap();
  $("#arContents").css("overflowY", "initial");
  audio.pause();
  audio.currentTime = 0;
});

$("#changeARbuildingBtn").on("click", function(){
  group.children[0].visible = !group.children[0].visible;
  group.children[1].visible = !group.children[1].visible;
  $("#arBuildingBtnImg").toggle();
  $("#arBuildingBtnImgOn").toggle();
});

pushBtn("menuBtn", "menuBtnImg", "menuBtnImgOn", "./arContents.html");
pushBtn("detailBuildingVoiceBtn", "detailBuildingVoiceBtnImg", "detailBuildingVoiceBtnImgOn", false);
$("#detailBuildingVoiceBtn").on("click", function(){
  $("#detailBuildingVoiceStopBtn").show();
  $(this).hide();
  detailVoice.play();
  detailVoice.addEventListener("ended", function(){
    $("#detailBuildingVoiceStopBtn").hide();
    $("#detailBuildingVoiceBtn").show();
  });
});

pushBtn("detailBuildingVoiceStopBtn", "detailBuildingVoiceStopBtnImg", "detailBuildingVoiceStopBtnImgOn", false);
$("#detailBuildingVoiceStopBtn").on("click", function(){
  $("#detailBuildingVoiceBtn").show();
  $(this).hide();
  if(detailVoice.currentTime > 0){
    detailVoice.pause();
    detailVoice.currentTime = 0;
  }
});

$("#sphereControlOFF").on("click", function(){
  isUseDeviceOrien = !isUseDeviceOrien;
  $(this).hide();
  $("#sphereControlON").show();
  $("#arCompassMsg").show();
  compassOFFMsg = setTimeout(() => {
    $("#arCompassMsg").hide();
  }, 15000);
  groupRotationSave = group.rotation.y;
});
$("#sphereControlON").on("click", function(){
  isUseDeviceOrien = !isUseDeviceOrien;
  $(this).hide();
  $("#sphereControlOFF").show();
  $("#arCompassMsg").hide();
  clearTimeout(compassOFFMsg);
  group.rotation.y = groupRotationSave;
});

window.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

window.addEventListener("touchmove", (event) => {
  if(!isUseDeviceOrien){
    touchMoveX = event.touches[0].clientX;
    touchMoveY = event.touches[0].clientY;
    rotateObject();
  }
});

function rotateObject(){
  let deltaX = touchMoveX - touchStartX;
  let deltaY = touchMoveY - touchStartY;
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    group.rotation.y -= deltaX * 0.0002;
  }
}
