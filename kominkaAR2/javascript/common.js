function pushBtn(btnName, offName, onName, urlName) {
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
    let left = false;
    const onLeave = function () {
      left = true;
      off.show();
      on.hide();
    };

    const onUp = function () {
      if (left) return; // ← pointerleaveが起きていたら処理しない
      off.show();
      on.hide();
      if(urlName == "officialWebsite"){
        // 公式ページは別タブで開く
        window.open("https://www.occh.or.jp/minka/", "_blank", "noreferrer");
      } else if (urlName) {
        window.location.href = urlName;
      }
    };

    document.addEventListener("pointerleave", onLeave, { once: true });
    document.addEventListener("pointerup", onUp, { once: true });
  });
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
      window.location.reload();
    }
  } else {
    setTimeout(() => {
      $("#msgContents").hide();
      window.location.reload();
    }, 1000);
  }
});
function getAngle() {
  var angle = screen && screen.orientation && screen.orientation.angle;
  if (angle === undefined) angle = window.orientation;
  return angle;
}
