// マップ上に現在地を表示する処理を行う
// Geolocation: watchPosition()メソッド。端末の位置が変化するたびに自動的に呼び出される
// "navigator.geolocation.getCurrentPosition"は初回だけ実行されるが、"watchPosition"はリアルタイムで実行されるのでこちらを使用する
let gpsRatioX = 0, gpsRatioY = 0;
navigator.geolocation.watchPosition(
    // success引数
    function(position){
        const latitude  = position.coords.latitude;  // 緯度
        const longitude = position.coords.longitude; // 経度
        console.log("現在地：", latitude, longitude);

        const minY = 34.777665;  // 南西
        const maxY = 34.779960;  // 北東
        const minX = 135.486332; // 南西
        const maxX = 135.490550; // 北東
        

        // 緯度をメルカトル図法で計算したY軸に変換する
        // 地球は球体なので、球体で計算をするメルカトル図法を用いないとズレが生じる
        function mercatorY(lat) {
            const rad = lat * Math.PI / 180;                  // 緯度を度 → ラジアンに変換
            return Math.log(Math.tan(Math.PI / 4 + rad / 2)); // メルカトル図法で計算
        }

        const yMin = mercatorY(minY);
        const yMax = mercatorY(maxY);
        const y    = mercatorY(latitude);

        // 現在地を緯度(Y軸)経度(X軸)を用いてパーセントで表した座標に変換
        const ratioY = Math.round(((yMax - y) / (yMax - yMin)) * 100);
        const ratioX = Math.round(((longitude - minX) / (maxX - minX)) * 100);
        gpsRatioY = ratioY;
        gpsRatioX = ratioX;
        console.log("緯度  ：", gpsRatioY);
        console.log("経度  ：", gpsRatioX);
        draw();
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
        maximumAge: 0,            // ゼロの場合は実際の現在地を取得する
        timeout: Infinity,        // 位置を取得できるまで処理し続ける
        enableHighAccuracy: true  // trueで可能な限り正確な位置を取得
    }
);