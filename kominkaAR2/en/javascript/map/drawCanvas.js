const canvas = document.getElementById("myCanvas");
const ctx    = canvas.getContext("2d");

const images = {
    map:       new Image(),
    kominka1:  new Image(), // 河内布施の長屋門
    kominka2:  new Image(), // 堂島の米蔵
    kominka3:  new Image(), // 飛騨白川の民家
    kominka4:  new Image(), // 日向椎葉の民家
    kominka5:  new Image(), // 摂津能勢の民家
    kominka6:  new Image(), // 庵美大島の高倉
    kominka7:  new Image(), // 信濃秋山の民家
    kominka8:  new Image(), // 大和十津川の民家
    kominka9:  new Image(), // 小豆島の農村歌舞伎舞台
    kominka10: new Image(), // 南部の曲家
    kominka11: new Image(), // 越前敦賀の民家
    kominka12: new Image(), // 北河内の茶室
    gps:       new Image()
}

// draw()の度に画像を読み込むと画像がちらつくので、初回だけ読み込み
images.map.src       = "../image/map/map_img.png";
images.kominka1.src  = "../image/map/map_img_pin_01.png"; // 河内布施の長屋門
images.kominka2.src  = "../image/map/map_img_pin_12.png"; // 堂島の米蔵
images.kominka3.src  = "../image/map/map_img_pin_11.png"; // 飛騨白川の民家
images.kominka4.src  = "../image/map/map_img_pin_02.png"; // 日向椎葉の民家
images.kominka5.src  = "../image/map/map_img_pin_10.png"; // 摂津能勢の民家
images.kominka6.src  = "../image/map/map_img_pin_09.png"; // 庵美大島の高倉
images.kominka7.src  = "../image/map/map_img_pin_03.png"; // 信濃秋山の民家
images.kominka8.src  = "../image/map/map_img_pin_04.png"; // 大和十津川の民家
images.kominka9.src  = "../image/map/map_img_pin_07.png"; // 小豆島の農村歌舞伎舞台
images.kominka10.src = "../image/map/map_img_pin_08.png"; // 南部の曲家
images.kominka11.src = "../image/map/map_img_pin_05.png"; // 越前敦賀の民家
images.kominka12.src = "../image/map/map_img_pin_06.png"; // 北河内の茶室
images.gps.src       = "../image/map/map_img_point.png";

for (let key in images) {
    images[key].addEventListener("load", () => {
        draw(); // 初回描画
    });
}


const dummyImgMapC           = document.getElementById("dummyImgMap");
const inHouseMapDisplayEreaC = document.getElementById("inHouseMapDisplayErea");
const styleC                 = window.getComputedStyle(inHouseMapDisplayEreaC);
canvas.setAttribute("width",  parseFloat(styleC.width));
canvas.setAttribute("height", dummyImgMapC.clientHeight - (parseFloat(styleC.width) * 0.37));


let lastClick = { x: canvas.width / 2, y: canvas.height / 2 }; // 初期は中央
// クリック位置を記録
canvas.addEventListener("click", event => {
    const rect = canvas.getBoundingClientRect();
    lastClick.x = event.clientX - rect.left;
    lastClick.y = event.clientY - rect.top;

    squareHitJudgement(lastClick.x, lastClick.y);
});
let square1;
let square2;
let square3;
let square4;
let square5;
let square6;
let square7;
let square8;
let square9;
let square10;
let square11;
let square12;


let offsetX = 0;
let offsetY = 0;
let zoom    = 1;
let globalNewWidth  = 0;
let globalNewHeight = 0;
function draw() {
    const map          = images.map;
    const canvasWidth  = canvas.width;
    const canvasHeight = canvas.height;
    const mapWidth     = map.width;
    const mapHeight    = map.height;

    // 比率計算（キャンバス内に収まるように）
    const mapScale = Math.max(canvasWidth / mapWidth, canvasHeight / mapHeight);
    const newMapWidth  = mapWidth  * mapScale * zoom;
    const newMapHeight = mapHeight * mapScale * zoom;
    // 地図のサイズをgpsの位置情報に利用するため、global変数に入れる
    globalNewWidth  = newMapWidth;
    globalNewHeight = newMapHeight;

    ctx.drawImage(map, offsetX, offsetY, newMapWidth, newMapHeight);



    // 河内布施の長屋門
    const kominka1 = images.kominka1;
    const kominka1Width  = kominka1.width;
    const kominka1Height = kominka1.height;

    const kominka1Scale = Math.max(canvasWidth / kominka1Width, canvasHeight / kominka1Height);
    const newKominka1Width  = kominka1Width  * kominka1Scale * zoom;
    const newKominka1Height = kominka1Height * kominka1Scale * zoom;

    // cssで「top: 78%; left: 12%」と同じことをしている
    const kominka1Top  = globalNewHeight * (77.5 / 100);
    const kominka1Left = globalNewWidth  * (5.5 / 100);
    ctx.drawImage(kominka1, offsetX + kominka1Left, offsetY + kominka1Top, newKominka1Width / 9, newKominka1Height / 9);

    // 家マークに当たり判定を作成
    square1 = {
        x: offsetX + kominka1Left, y: offsetY + kominka1Top,    // 座標
        // 堂島の米蔵と当たり判定が被っているので調整
        w: newKominka1Width / 9 - 10, h: newKominka1Height / 9 // サイズ
    };
    // 色を設定
    // ctx.fillStyle = "red";
    // 塗りつぶし四角を描画
    // ctx.fillRect(square1.x, square1.y, square1.w, square1.h);



    // 堂島の米蔵
    const kominka2 = images.kominka2;
    const kominka2Width  = kominka2.width;
    const kominka2Height = kominka2.height;

    const kominka2Scale = Math.max(canvasWidth / kominka2Width, canvasHeight / kominka2Height);
    const newKominka2Width  = kominka2Width  * kominka2Scale * zoom;
    const newKominka2Height = kominka2Height * kominka2Scale * zoom;

    const kominka2Top  = globalNewHeight * (74 / 100);
    const kominka2Left = globalNewWidth  * (27.5 / 100);
    ctx.drawImage(kominka2, offsetX + kominka2Left, offsetY + kominka2Top, newKominka2Width / 10, newKominka2Height / 10);

    square2 = {
        x: offsetX + kominka2Left + 3, y: offsetY + kominka2Top + 7,
        w: newKominka2Width / 10 , h: newKominka2Height / 10 - 7
    };



    // 飛騨白川の民家
    const kominka3 = images.kominka3;
    const kominka3Width  = kominka3.width;
    const kominka3Height = kominka3.height;

    const kominka3Scale = Math.max(canvasWidth / kominka3Width, canvasHeight / kominka3Height);
    const newKominka3Width  = kominka3Width  * kominka3Scale * zoom;
    const newKominka3Height = kominka3Height * kominka3Scale * zoom;

    const kominka3Top  = globalNewHeight * (64 / 100);
    const kominka3Left = globalNewWidth  * (47 / 100);
    ctx.drawImage(kominka3, offsetX + kominka3Left, offsetY + kominka3Top, newKominka3Width / 7.5, newKominka3Height / 7.5);

    square3 = {
        x: offsetX + kominka3Left, y: offsetY + kominka3Top,
        w: newKominka3Width / 7.5 , h: newKominka3Height / 7.5 - 7
    };



    // 日向椎葉の民家
    const kominka4 = images.kominka4;
    const kominka4Width  = kominka4.width;
    const kominka4Height = kominka4.height;

    const kominka4Scale = Math.max(canvasWidth / kominka4Width, canvasHeight / kominka4Height);
    const newKominka4Width  = kominka4Width  * kominka4Scale * zoom;
    const newKominka4Height = kominka4Height * kominka4Scale * zoom;

    const kominka4Top  = globalNewHeight * (53 / 100);
    const kominka4Left = globalNewWidth  * (10 / 100);
    ctx.drawImage(kominka4, offsetX + kominka4Left, offsetY + kominka4Top, newKominka4Width / 7.5, newKominka4Height / 7.5);

    square4 = {
        x: offsetX + kominka4Left, y: offsetY + kominka4Top,
        w: newKominka4Width / 7.5 , h: newKominka4Height / 7.5
    };



    // 摂津能勢の民家
    const kominka5 = images.kominka5;
    const kominka5Width  = kominka5.width;
    const kominka5Height = kominka5.height;

    const kominka5Scale = Math.max(canvasWidth / kominka5Width, canvasHeight / kominka5Height);
    const newKominka5Width  = kominka5Width  * kominka5Scale * zoom;
    const newKominka5Height = kominka5Height * kominka5Scale * zoom;

    const kominka5Top  = globalNewHeight * (51 / 100);
    const kominka5Left = globalNewWidth  * (42 / 100);
    ctx.drawImage(kominka5, offsetX + kominka5Left, offsetY + kominka5Top, newKominka5Width / 7.5, newKominka5Height / 7.5);

    square5 = {
        x: offsetX + kominka5Left, y: offsetY + kominka5Top + 3,
        w: newKominka5Width / 7.5 , h: newKominka5Height / 7.5
    };



    // 庵美大島の高倉
    const kominka6 = images.kominka6;
    const kominka6Width  = kominka6.width;
    const kominka6Height = kominka6.height;

    const kominka6Scale = Math.max(canvasWidth / kominka6Width, canvasHeight / kominka6Height);
    const newKominka6Width  = kominka6Width  * kominka6Scale * zoom;
    const newKominka6Height = kominka6Height * kominka6Scale * zoom;

    const kominka6Top  = globalNewHeight * (41.5 / 100);
    const kominka6Left = globalNewWidth  * (31 / 100);
    ctx.drawImage(kominka6, offsetX + kominka6Left, offsetY + kominka6Top, newKominka6Width / 8, newKominka6Height / 8);

    square6 = {
        x: offsetX + kominka6Left + 6, y: offsetY + kominka6Top,
        w: newKominka6Width / 8 - 4 , h: newKominka6Height / 8 - 10
    };



    // 信濃秋山の民家
    const kominka7 = images.kominka7;
    const kominka7Width  = kominka7.width;
    const kominka7Height = kominka7.height;

    const kominka7Scale = Math.max(canvasWidth / kominka7Width, canvasHeight / kominka7Height);
    const newKominka7Width  = kominka7Width  * kominka7Scale * zoom;
    const newKominka7Height = kominka7Height * kominka7Scale * zoom;

    const kominka7Top  = globalNewHeight * (37.5 / 100);
    const kominka7Left = globalNewWidth  * (13 / 100);
    ctx.drawImage(kominka7, offsetX + kominka7Left, offsetY + kominka7Top, newKominka7Width / 8, newKominka7Height / 8);

    square7 = {
        x: offsetX + kominka7Left, y: offsetY + kominka7Top,
        w: newKominka6Width / 8 - 10 , h: newKominka6Height / 8
    };



    // 大和十津川の民家
    const kominka8 = images.kominka8;
    const kominka8Width  = kominka8.width;
    const kominka8Height = kominka8.height;

    const kominka8Scale = Math.max(canvasWidth / kominka8Width, canvasHeight / kominka8Height);
    const newKominka8Width  = kominka8Width  * kominka8Scale * zoom;
    const newKominka8Height = kominka8Height * kominka8Scale * zoom;

    const kominka8Top  = globalNewHeight * (19 / 100);
    const kominka8Left = globalNewWidth  * (21.5 / 100);
    ctx.drawImage(kominka8, offsetX + kominka8Left, offsetY + kominka8Top, newKominka8Width / 9, newKominka8Height / 9);

    square8 = {
        x: offsetX + kominka8Left, y: offsetY + kominka8Top,
        w: newKominka8Width / 9 , h: newKominka8Height / 9
    };



    // 小豆島の農村歌舞伎舞台
    const kominka9 = images.kominka9;
    const kominka9Width  = kominka9.width;
    const kominka9Height = kominka9.height;

    const kominka9Scale = Math.max(canvasWidth / kominka9Width, canvasHeight / kominka9Height);
    const newKominka9Width  = kominka9Width  * kominka9Scale * zoom;
    const newKominka9Height = kominka9Height * kominka9Scale * zoom;

    const kominka9Top  = globalNewHeight * (23.5 / 100);
    const kominka9Left = globalNewWidth  * (46 / 100);
    ctx.drawImage(kominka9, offsetX + kominka9Left, offsetY + kominka9Top, newKominka9Width / 9, newKominka9Height / 9);

    square9 = {
        x: offsetX + kominka9Left + 2, y: offsetY + kominka9Top,
        w: newKominka9Width / 9 - 14 , h: newKominka9Height / 9
    };



    // 南部の曲家
    const kominka10 = images.kominka10;
    const kominka10Width  = kominka10.width;
    const kominka10Height = kominka10.height;

    const kominka10Scale = Math.max(canvasWidth / kominka10Width, canvasHeight / kominka10Height);
    const newKominka10Width  = kominka10Width  * kominka10Scale * zoom;
    const newKominka10Height = kominka10Height * kominka10Scale * zoom;

    const kominka10Top  = globalNewHeight * (19.5 / 100);
    const kominka10Left = globalNewWidth  * (72.5 / 100);
    ctx.drawImage(kominka10, offsetX + kominka10Left, offsetY + kominka10Top, newKominka10Width / 9, newKominka10Height / 9);

    square10 = {
        x: offsetX + kominka10Left + 6, y: offsetY + kominka10Top,
        w: newKominka10Width / 9 - 10, h: newKominka10Height / 9
    };



    // 越前敦賀の民家
    const kominka11 = images.kominka11;
    const kominka11Width  = kominka11.width;
    const kominka11Height = kominka11.height;

    const kominka11Scale = Math.max(canvasWidth / kominka11Width, canvasHeight / kominka11Height);
    const newKominka11Width  = kominka11Width  * kominka11Scale * zoom;
    const newKominka11Height = kominka11Height * kominka11Scale * zoom;

    const kominka11Top  = globalNewHeight * (10 / 100);
    const kominka11Left = globalNewWidth  * (42 / 100);
    ctx.drawImage(kominka11, offsetX + kominka11Left, offsetY + kominka11Top, newKominka11Width / 8, newKominka11Height / 8);

    square11 = {
        x: offsetX + kominka11Left, y: offsetY + kominka11Top,
        w: newKominka11Width / 8 , h: newKominka11Height / 8 - 11
    };



    // 北河内の茶室
    const kominka12 = images.kominka12;
    const kominka12Width  = kominka12.width;
    const kominka12Height = kominka12.height;

    const kominka12Scale = Math.max(canvasWidth / kominka12Width, canvasHeight / kominka12Height);
    const newKominka12Width  = kominka12Width  * kominka12Scale * zoom;
    const newKominka12Height = kominka12Height * kominka12Scale * zoom;

    const kominka12Top  = globalNewHeight * (9 / 100);
    const kominka12Left = globalNewWidth  * (62 / 100);
    ctx.drawImage(kominka12, offsetX + kominka12Left, offsetY + kominka12Top, newKominka12Width / 8, newKominka12Height / 8);

    square12 = {
        x: offsetX + kominka12Left + 4, y: offsetY + kominka12Top,
        w: newKominka12Width / 8 - 8 , h: newKominka12Height / 8 - 6
    };



    const gps = images.gps;
    const gpsWidth  = gps.width;
    const gpsHeight = gps.height;

    const gpsScale = Math.max(canvasWidth / gpsWidth, canvasHeight / gpsHeight);
    const newGpsWidth  = gpsWidth  * gpsScale * zoom;
    const newGpsHeight = gpsHeight * gpsScale * zoom;

    const gpsLeft   = globalNewWidth  * (gpsRatioY / 100);
    const gpsBottom = globalNewHeight * (gpsRatioX / 100);
    // 地図は北が左を向いてるので、topとleftで計算されているgpsの座標を、top⇒left,left⇒bottomに計算し直して表示
    ctx.drawImage(gps, offsetX + gpsLeft, offsetY + (globalNewHeight - gpsBottom), newGpsWidth / 30, newGpsHeight / 30);
}

draw();