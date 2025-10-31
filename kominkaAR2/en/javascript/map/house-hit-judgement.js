// 家マークをクリックしたかを判定する

function squareHitJudgement(clickX, clickY) {
    // 河内布施の長屋門
    const squareHit1 =
        (square1.x <= clickX && clickX <= square1.x + square1.w) && // 横方向の判定
        (square1.y <= clickY && clickY <= square1.y + square1.h)    // 縦方向の判定
    if(squareHit1){ 
        location.href = "./explain/movie/index.html?id=Explanation1";
    }

    // 堂島の米蔵
    const squareHit2 =
        (square2.x <= lastClick.x && lastClick.x <= square2.x + square2.w) &&
        (square2.y <= lastClick.y && lastClick.y <= square2.y + square2.h)
    if(squareHit2){ 
        location.href = "./explain/movie/index.html?id=Explanation2";
    }

    // 飛騨白川の民家
    const squareHit3 =
        (square3.x <= lastClick.x && lastClick.x <= square3.x + square3.w) &&
        (square3.y <= lastClick.y && lastClick.y <= square3.y + square3.h)
    if(squareHit3){ 
        location.href = "./explain/ar/index.html?id=AR6";
    }

    // 日向椎葉の民家
    const squareHit4 =
        (square4.x <= lastClick.x && lastClick.x <= square4.x + square4.w) &&
        (square4.y <= lastClick.y && lastClick.y <= square4.y + square4.h)
    if(squareHit4){ 
        location.href = "./explain/ar/index.html?id=AR1";
    }

    // 摂津能勢の民家
    const squareHit5 =
        (square5.x <= lastClick.x && lastClick.x <= square5.x + square5.w) &&
        (square5.y <= lastClick.y && lastClick.y <= square5.y + square5.h)
    if(squareHit5){ 
        location.href = "./explain/ar/index.html?id=AR5";
    }

    // 庵美大島の高倉
    const squareHit6 =
        (square6.x <= lastClick.x && lastClick.x <= square6.x + square6.w) &&
        (square6.y <= lastClick.y && lastClick.y <= square6.y + square6.h)
    if(squareHit6){ 
        location.href = "./explain/movie/index.html?id=Explanation3"; 
    }

    // 信濃秋山の民家
    const squareHit7 =
        (square7.x <= lastClick.x && lastClick.x <= square7.x + square7.w) &&
        (square7.y <= lastClick.y && lastClick.y <= square7.y + square7.h)
    if(squareHit7){ 
        location.href = "./explain/ar/index.html?id=AR2";
    }

    // 大和十津川の民家
    const squareHit8 =
        (square8.x <= lastClick.x && lastClick.x <= square8.x + square8.w) &&
        (square8.y <= lastClick.y && lastClick.y <= square8.y + square8.h)
    if(squareHit8){ 
        location.href = "./explain/movie/index.html?id=Explanation4";
    }

    // 小豆島の農村歌舞伎舞台
    const squareHit9 =
        (square9.x <= lastClick.x && lastClick.x <= square9.x + square9.w) &&
        (square9.y <= lastClick.y && lastClick.y <= square9.y + square9.h)
    if(squareHit9){ 
        location.href = "./explain/ar/index.html?id=AR4";
    }

    // 南部の曲家
    const squareHit10 =
        (square10.x <= lastClick.x && lastClick.x <= square10.x + square10.w) &&
        (square10.y <= lastClick.y && lastClick.y <= square10.y + square10.h)
    if(squareHit10){ 
        location.href = "./explain/ar/index.html?id=AR3";
    }

    // 越前敦賀の民家
    const squareHit11 =
        (square11.x <= lastClick.x && lastClick.x <= square11.x + square11.w) &&
        (square11.y <= lastClick.y && lastClick.y <= square11.y + square11.h)
    if(squareHit11){ 
        location.href = "./explain/movie/index.html?id=Explanation5";
    }

    // 北河内の茶室
    const squareHit12 =
        (square12.x <= lastClick.x && lastClick.x <= square12.x + square12.w) &&
        (square12.y <= lastClick.y && lastClick.y <= square12.y + square12.h)
    if(squareHit12){ 
        location.href = "./explain/movie/index.html?id=Explanation6";
    }
}