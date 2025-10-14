// マップ上に現在地を表示する処理を行う


screenWidth  = window.innerWidth;
// screenHeight = window.innerHeight; // 使わないけど一応宣言

// Geolocation: watchPosition()メソッド。端末の位置が変化するたびに自動的に呼び出される
// "navigator.geolocation.getCurrentPosition"は初回だけ実行されるが、"watchPosition"はリアルタイムで実行されるのでこちらを使用する
navigator.geolocation.watchPosition(
    // success引数
    function(position){
        const latitude  = position.coords.latitude;  // 緯度
        const longitude = position.coords.longitude; // 経度

        const minY = 34.677982;
        const maxY = 34.684100;
        const minX = 135.518861;
        const maxX = 135.527315;
        const mapX = $("#mapImg").innerWidth()  - 80;
        const mapY = $("#mapImg").innerHeight() - 82;

        // 経度が全体の範囲(minX～maxX)の中でどの位置にあるかを0〜1の割合で表している
        // minX = 120、maxX = 130、longitude = 125の場合、
        // (125-120)/(130-120) = 5/10 = 0.5、真ん中あたりになる。×100倍したあとMath.round()で四捨五入する
        const mapXrat = Math.round(((longitude - minX) / (maxX - minX)) * 100);
        // 地図の横幅(mapX)に対して、その割合だけ位置を決める。
        const x = mapX * (mapXrat / 100);

        const width = $("#mapContents").width(); // 画面に見えているmapContentsの幅を取得
        const mapWidth = $("#mapImg").width(); // mapImgの要素(画像)の元の幅を取得
        const scrollWidth = Math.floor(mapWidth - width); // スクロール可能な横幅を取得
        const scrollX = scrollWidth * (mapXrat / 100); // 地図を横スクロールして指定の位置を中央に持ってくる量を計算
        var ratX = 0;

        if(mapXrat <= 20){
            ratX = scrollX - 150;
        }else if(20 < mapXrat && mapXrat <= 40){
            ratX = scrollX - 100;
        }else if(70 <= mapXrat){
            ratX = scrollX + 100;
        }else{
            ratX = scrollX;
        }
        $("#mapContents").scrollLeft(ratX);



        const mapYrat = Math.round(((latitude - minY) / (maxY - minY)) * 100);
        const y = mapY * (mapYrat / 100);

        const height = $("#mapContents").height();
        const mapHeight = $("#mapImg").height();
        const scrollHeight = Math.floor(mapHeight - height);
        const scrollY = scrollHeight * (mapYrat / 100);
        var ratY = 0;

        if(mapYrat <= 40){
            ratY = scrollY - 60;
        }else if(70 <= mapYrat){
            ratY = scrollY + 60;
        }else{
            ratY = scrollY;
        }
        $("#mapContents").scrollTop(ratY);



        if((minY < latitude && latitude < maxY) && (minX < longitude && longitude < maxX)){
            $("#mapCurrent").css({
                top: `${y}px`,
                left: `${x}px`,
            });
            $("#mapCurrent").append(
                `<img src=${MAP_RADAR} id="mapMarkerRadar">
                <img src=${MAP_HERE} id="mapMarkerPin">`
            );
        }else{
            if(window.innerHeight < window.innerWidth && screenWidth < 1025){
                $("#msgOutside").hide();
            }else{
                $("#msgOutside").show();
                $("#mapComment").hide();
                $("#mapBtn").hide();
            }
        }
    },

    // error引数
    function(error){
        switch(error.code){
            case 1:
                console.log("エラー：位置情報を取得する許可が必要");
                break;
            case 2:
                console.log("エラー：原因不明のエラーが発生し位置情報を取得出来なかった");
                break;
            case 3:
                console.log("エラー：タイムアウト  制限時間内に位置情報を取得出来なかった");
                break;
            default:
                console.log("エラー：原因不明のエラーが発生");
                break;
        }
    },

    // option引数
    {
        enableHighAccuracy: false, //省エネで現在地を取得する
        timeout: 5000, //5秒までなら位置情報取得に時間をかけていい
        maximumAge: 0  //ゼロの場合は実際の現在地を取得する
    }
);

// setBackBtn();

// $("#mainContents").hide();
// window.scroll({top:0});
// $("#arContents").show();
// $("body").css("overflow", "hidden");