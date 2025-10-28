const canvas = document.getElementById("myCanvas");
const ctx    = canvas.getContext("2d");
const image  = new Image();
const gps    = new Image();

const dummyImgMapC           = document.getElementById("dummyImgMap");
const inHouseMapDisplayEreaC = document.getElementById("inHouseMapDisplayErea");
const styleC                 = window.getComputedStyle(inHouseMapDisplayEreaC);
canvas.setAttribute("width",  parseFloat(styleC.width));
canvas.setAttribute("height", dummyImgMapC.clientHeight - (parseFloat(styleC.width) * 0.37));

let offsetX = 0;
let offsetY = 0;
let zoom    = 1;
function draw() {
    image.src = "../../04_image/map/map_img.png";
    image.addEventListener("load", function () {
        const canvasWidth  = canvas.width;
        const canvasHeight = canvas.height;
        const imageWidth  = image.width;
        const imageHeight = image.height;

        // 比率計算（キャンバス内に収まるように）
        const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);

        const newWidth  = imageWidth  * scale * zoom;
        const newHeight = imageHeight * scale * zoom;

        // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(image, offsetX, offsetY, newWidth, newHeight);
    }, { once: true });

    gps.src = "../../04_image/map/map_img_point.png";
    gps.addEventListener("load", function () {
        const canvasWidth  = canvas.width;
        const canvasHeight = canvas.height;
        const imageWidth  = gps.width;
        const imageHeight = gps.height;

        // 比率計算（キャンバス内に収まるように）
        const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight);

        const newWidth  = imageWidth  * scale * zoom;
        const newHeight = imageHeight * scale * zoom;

        console.log(gpsRatioX, gpsRatioY);
        const aaa = (gpsRatioX / 100) * canvasWidth;
        const bbb = (gpsRatioY / 100) * canvasHeight;

        console.log(aaa, bbb);

        // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // ctx.drawImage(gps, offsetX + (gpsRatioX * zoom), offsetY + (gpsRatioY * zoom), newWidth / 40, newHeight / 40);
        ctx.drawImage(gps, offsetX + (aaa * zoom), offsetY + (bbb * zoom), newWidth / 40, newHeight / 40);
    }, { once: true });
}

// Canvas上ではブラウザのスクロールを無効に
// function disableScroll() { document.addEventListener(   "mousewheel", scrollControl, { passive: false }); }
// function enableScroll()  { document.removeEventListener("mousewheel", scrollControl, { passive: false }); }
// function scrollControl(e) { e.preventDefault(); }

draw();