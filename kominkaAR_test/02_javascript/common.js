var stampRallyList = [false, false, false, false, false, false, false];
var device = "";

function pushBtn(btnName, offName, onName, urlName) {
  // 館内マップの家マーク用処理
  // 家マークにはボタンON素材が無いため、ボタンをタッチすると画像が消えてしまう
  if(onName == null){
    const btn = $("#" + btnName);

    btn.on("pointerdown", function () {
      document.addEventListener(
        "pointerup",
        function () {
          if (urlName) window.location.href = urlName;
        },
        { once: true }
      );
    });
  }else{
    const btn = $("#" + btnName);
    const off = $("#" + offName);
    const on  = $("#" + onName);

    btn.on("pointerdown", function () {
      off.hide();
      on.show();
      document.addEventListener(
        "pointerup",
        function () {
          off.show();
          on.hide();
          if (urlName) window.location.href = urlName;
        },
        { once: true }
      );
    });
  }
}

function checkDeviceSP() {
  var ua = navigator.userAgent;
  if (/(iPad|iPhone|iPod|Macintosh)/g.test(ua) && "ontouchend" in document) {
    device = "iphone";
    return true;
  } else if (ua.indexOf("Android") > 0) {
    device = "android";
    return true;
  } else {
    device = "pc";
    return false;
  }
}

function calcDeviceDirection(e) {
  const ry = ((e.gamma || 0) * Math.PI) / 180;
  const rx = ((e.beta || 0) * Math.PI) / 180;
  const rz = ((e.alpha || 0) * Math.PI) / 180;
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  const x = -(sy * cz + cy * sx * sz);
  const y = -(sy * sz - cy * sx * cz);
  const z = -(cy * cx);
  const angle = Math.atan2(-x, y) * (180.0 / Math.PI);
  return angle;
}

function checkCookie(name){
  const result = getCookie(name);
  if(!result){
    setCookie(name, stampRallyList);
    return false;
  }else{
    return true;
  }
}
function setCookie(name, json){
  var cookies = "";
  cookies = name + "=" + JSON.stringify(json) + ";";
  cookies += "path=/;";

  const second = 31536000;
  cookies += "max-age=" + second + ";";
  document.cookie = cookies;
}
function getCookie(name){
  var cookies = "";
  var cookieArray = [];
  var result = [];

  cookies = document.cookie;
  cookieArray = cookies.split(";");

  for(let i=0; i<cookieArray.length; i++){
    cookieArray[i] = cookieArray[i].trim();
    result[i] = cookieArray[i].split('=');
    if(result[i][0] == name){
      return JSON.parse(result[i][1]);
    }
  }
  return false;
}

$(window).on("load", function(){
  if(window.innerHeight < window.innerWidth) {
    $("#msgContents").show();
    if(getAngle() == 0) {
      if(checkDeviceSP()) $("#msgContents").hide();
    }
  }
});
var screenWidth = screen.width;
$(window).on("orientationchange", function(e){
  if(window.innerHeight > window.innerWidth && screenWidth < 1025) {
    $("#msgContents").show();
    if(getAngle() == 0) $("#msgContents").hide();
  }else{
    setTimeout(() => {
      $("#msgContents").hide();
    }, 1000);
  }
});
function getAngle() {
  var angle = screen && screen.orientation && screen.orientation.angle;
  if(angle === undefined) angle = window.orientation;
  return angle;
}

const scene = document.querySelector("a-scene");
const startBtn = document.getElementById("startARBtn");

startBtn.addEventListener("click", () => {
    const marker = document.createElement("a-marker");
    marker.setAttribute("type", "pattern");
    marker.setAttribute("url", "../../04_image/patt/AR1.patt");
    marker.setAttribute("id", "barcodeMarker");
    marker.setAttribute("size", "0.05");
    marker.setAttribute("smooth", "true");
    marker.setAttribute("smoothCount", "10");
    marker.setAttribute("smoothTolerance", "0.01");
    marker.setAttribute("smoothThreshold", "5");

    const plane = document.createElement("a-plane");
    plane.setAttribute("id", "videoPlane");
    plane.setAttribute("position", "0 -10 0");
    plane.setAttribute("rotation", "-90 0 0");
    plane.setAttribute("width", "3");
    plane.setAttribute("height", "3");
    plane.setAttribute("visible", "false");
    plane.setAttribute("material", "shader: flat; side: double; transparent: true; alphaTest:0.01");

    marker.appendChild(plane);
    scene.appendChild(marker);

    // ボタンを非表示に
    startBtn.style.display = "none";
});
// $("#changeLanguageBtn").on("click", function(){
//   $(".langArea").toggleClass("langOpen");
// });
// $("#changeLanguageBtnQuiz").on("click", function(){
//   $(".langArea").toggleClass("langOpen");
// });
// $("#changeLanguageBtnAR").on("click", function(){
//   $(".langArea").toggleClass("langOpen");
// });
// $(".langArea a").on("click", function(){
//   const classNames = $(this).attr("class");
//   if(!classNames) return;
//   const updateClassName = classNames.split(" ")
//     .filter(className => className !== 'active');
//   setCookie("selectedLanguage", updateClassName);
// });