// スタンプを全て取得したと時に表示されるダイアログの処理
document.addEventListener("DOMContentLoaded", () => {
  if (stampList.length == 12) {
    stampRallyCompleteDialog();
  }
});

function stampRallyCompleteDialog() {
  const stampRallyCompleteDialog = document.getElementById("stampRallyCompleteDialog");
  stampRallyCompleteDialog.setAttribute("style", "display: block;");
}

function stampRallyCompleteDialogClose() {
  const stampRallyCompleteDialog = document.getElementById("stampRallyCompleteDialog");
  stampRallyCompleteDialog.setAttribute("style", "display: none;");
}