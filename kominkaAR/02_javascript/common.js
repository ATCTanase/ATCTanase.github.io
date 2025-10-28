function pushBtn(btnName, offName, onName, urlName) {
  if (onName == null) {
    // 館内マップの家マーク用処理
    // 家マークにはボタンON素材が無いため、ボタンをタッチすると画像が消えてしまう
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
  } else {
    const btn = $("#" + btnName);
    const off = $("#" + offName);
    const on  = $("#" + onName);

    btn.on("pointerdown", function () {
      // スタンプをコンプリートしていない場合は早期リターン
      if(off.is(":hidden")){
        return;
      };

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

$(window).on("load", function () {
  if (window.innerHeight < window.innerWidth) {
    $("#msgContents").show();
    
    if (getAngle() == 0) {
      if (checkDeviceSP()) $("#msgContents").hide();
    }
  }
});
var screenWidth = screen.width;
$(window).on("orientationchange", function (e) {
  if (window.innerHeight > window.innerWidth && screenWidth < 1025) {
    $("#msgContents").show();

    if (getAngle() == 0) {
      $("#msgContents").hide();
    }
  } else {
    setTimeout(() => {
      $("#msgContents").hide();
    }, 1000);
  }
});
function getAngle() {
  var angle = screen && screen.orientation && screen.orientation.angle;
  if (angle === undefined) angle = window.orientation;
  return angle;
}
