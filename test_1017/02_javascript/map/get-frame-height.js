// 背景の地図を模した枠の幅にinHouseMapSwipeEreaを合わせるため、動的に高さを設定する


const inHouseMapSwipeEreaHeight = document.querySelector("#inHouseMapSwipeErea");

window.addEventListener("load",function(){
    inHouseMapSwipeEreaHeight.style.height = window.innerHeight * 0.74 + "px";
})