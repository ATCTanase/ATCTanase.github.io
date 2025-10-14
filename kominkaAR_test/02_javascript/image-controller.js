function setAboutThisSiteBtn() {
  $("#aboutThisSiteImg").attr("src", BACK_BTN);
  $("#aboutThisSiteImgOn").attr("src", BACK_BTN).hide();
}

function setBackBtn() {
  $("#backBtnImg").attr("src", BACK_BTN);
  $("#backBtnImgOn").attr("src", BACK_BTN_PRS).hide();
}
function setBackBtnAR() {
  $("#backBtnARImg").attr("src", BACK_BTN);
  $("#backBtnARImgOn").attr("src", BACK_BTN_PRS).hide();
}
function setChangeLangBtn() {
  $("#langBtnImg").attr("src", LANG_BTN);
  $("#langBtnImgOn").attr("src", LANG_BTN_PRS).hide();
}
function setRotationImg(){
  $("#msgRotationImg").attr("src", MSG_ROTATION);
}
function setMenuBtn() {
  $("#menuBtnImg").attr("src", MENU_BTN);
  $("#menuBtnImgOn").attr("src", MENU_BTN_PRS).hide();
}
function setMsgImg() {
  $("#msgOutsideImg").attr("src", MSG_OUTSIDE);
  $("#markerGuideImg").attr("src", MARKER_GUIDE);
  // $("#langBtnImgAR").attr("src", LANG_BTN);
  // $("#langBtnImgOnAR").attr("src", LANG_BTN_PRS).hide();
  $("#arBuildingBtnImg").attr("src", AR_SWITCH_BTN_OFF);
  $("#arBuildingBtnImgOn").attr("src", AR_SWITCH_BTN_ON).hide();
}
function setMap() {
  $("#mapLine").attr("src", MAP_LINE);
  $("#mapCommon").show();
  $("#mapComment").attr("src", MAP_BALLOON);
  $("#mapBtnImg").attr("src", ALLMAP_BTN);
  $("#mapBtnImgOn").attr("src", ALLMAP_BTN_PRS).hide();
  $("#mapLegend").attr("src", MAP_LEGEND);
}
function addMap() {
  $("#mapCommon").show();
  $("#mapBtn").show();
  $("#backBtn").show();
}
function removeMap() {
  $("#mapCommon").hide();
  $("#mapBtn").hide();
  $("#backBtn").hide();
}
function setDetailBuildingCommon() {
  $("#detailBuildingLine").attr("src", ABOUT_LINE);
  $("#detailBuildingLineText").attr("src", ABOUT_TXTLINE);
  $("#detailBuildingVoiceBtnImg").attr("src", VOICE_BTN);
  $("#detailBuildingVoiceBtnImgOn").attr("src", VOICE_BTN_PRS).hide();
  $("#detailBuildingVoiceStopBtnImg").attr("src", VOICE_STOP_BTN);
  $("#detailBuildingVoiceStopBtnImgOn").attr("src", VOICE_STOP_BTN_PRS).hide();
  $("#langBtnImgARDetail").attr("src", LANG_BTN);
  $("#langBtnImgOnARDetail").attr("src", LANG_BTN_PRS).hide();
}
function setNaniwaImg() {
  $("#aboutBuilding").attr("src", ABOUT_IMG01);
  $("#aboutBuildingName").attr("src", ABOUT_TXT01);
  $("#aboutBuildingVoiceBtnImg").attr("src", VOICE_BTN);
  $("#aboutBuildingVoiceBtnImgOn").attr("src", VOICE_BTN_PRS).hide();
  $("#aboutBuildingVoiceStopBtnImg").attr("src", VOICE_STOP_BTN);
  $("#aboutBuildingVoiceStopBtnImgOn").attr("src", VOICE_STOP_BTN_PRS).hide();
  $("#aboutBuildingLine").attr("src", ABOUT_LINE);
  $("#aboutBuildingLineText").attr("src", ABOUT_TXTLINE);
  $("#aboutNaniwaARWebsiteBtnImg").attr("src", ABOUT_WEBSITE_BTN);
  $("#aboutNaniwaARWebsiteBtnImgOn").attr("src", ABOUT_WEBSITE_BTN_PRS).hide();
  setBackBtn();
  setChangeLangBtn();
}
function setQuizImg() {
  $("#quizBackgroud").attr("src", QUIZ_BG);
  $("#quizBackgroudSecond").attr("src", QUIZ_BG2).hide();
  const quizBtnJson = [
    {
      id: 1,
      blockId: "#quizQuestion01",
      text: QUIZ_Q1_TXT,
      btn01: QUIZ_Q1_ANS01,
      btn01On: QUIZ_Q1_ANS01_PRS,
      btn01Id: "quizQuestionBtnQ1-01",
      btn01Img: "quizQuestionImgQ1-01",
      btn01ImgOn: "quizQuestionImgQ1-01On",
      btn02: QUIZ_Q1_ANS02,
      btn02On: QUIZ_Q1_ANS02_PRS,
      btn02Id: "quizQuestionBtnQ1-02",
      btn02Img: "quizQuestionImgQ1-02",
      btn02ImgOn: "quizQuestionImgQ1-02On",
      btn03: QUIZ_Q1_ANS03,
      btn03On: QUIZ_Q1_ANS03_PRS,
      btn03Id: "quizQuestionBtnQ1-03",
      btn03Img: "quizQuestionImgQ1-03",
      btn03ImgOn: "quizQuestionImgQ1-03On",
      btn04: QUIZ_Q1_ANS04,
      btn04On: QUIZ_Q1_ANS04_PRS,
      btn04Id: "quizQuestionBtnQ1-04",
      btn04Img: "quizQuestionImgQ1-04",
      btn04ImgOn: "quizQuestionImgQ1-04On",
    },
    {
      id: 2,
      blockId: "#quizQuestion02",
      text: QUIZ_Q2_TXT,
      btn01: QUIZ_Q2_ANS01,
      btn01On: QUIZ_Q2_ANS01_PRS,
      btn01Id: "quizQuestionBtnQ2-01",
      btn01Img: "quizQuestionImgQ2-01",
      btn01ImgOn: "quizQuestionImgQ2-01On",
      btn02: QUIZ_Q2_ANS02,
      btn02On: QUIZ_Q2_ANS02_PRS,
      btn02Id: "quizQuestionBtnQ2-02",
      btn02Img: "quizQuestionImgQ2-02",
      btn02ImgOn: "quizQuestionImgQ2-02On",
      btn03: QUIZ_Q2_ANS03,
      btn03On: QUIZ_Q2_ANS03_PRS,
      btn03Id: "quizQuestionBtnQ2-03",
      btn03Img: "quizQuestionImgQ2-03",
      btn03ImgOn: "quizQuestionImgQ2-03On",
      btn04: QUIZ_Q2_ANS04,
      btn04On: QUIZ_Q2_ANS04_PRS,
      btn04Id: "quizQuestionBtnQ2-04",
      btn04Img: "quizQuestionImgQ2-04",
      btn04ImgOn: "quizQuestionImgQ2-04On",
    },
    {
      id: 3,
      blockId: "#quizQuestion03",
      text: QUIZ_Q3_TXT,
      btn01: QUIZ_Q3_ANS01,
      btn01On: QUIZ_Q3_ANS01_PRS,
      btn01Id: "quizQuestionBtnQ3-01",
      btn01Img: "quizQuestionImgQ3-01",
      btn01ImgOn: "quizQuestionImgQ3-01On",
      btn02: QUIZ_Q3_ANS02,
      btn02On: QUIZ_Q3_ANS02_PRS,
      btn02Id: "quizQuestionBtnQ3-02",
      btn02Img: "quizQuestionImgQ3-02",
      btn02ImgOn: "quizQuestionImgQ3-02On",
      btn03: QUIZ_Q3_ANS03,
      btn03On: QUIZ_Q3_ANS03_PRS,
      btn03Id: "quizQuestionBtnQ3-03",
      btn03Img: "quizQuestionImgQ3-03",
      btn03ImgOn: "quizQuestionImgQ3-03On",
      btn04: QUIZ_Q3_ANS04,
      btn04On: QUIZ_Q3_ANS04_PRS,
      btn04Id: "quizQuestionBtnQ3-04",
      btn04Img: "quizQuestionImgQ3-04",
      btn04ImgOn: "quizQuestionImgQ3-04On",
    },
  ];
  for (let i = 0; i < 3; i++) {
    const quiz = `${quizBtnJson[i].blockId}`;
    $(quiz).append(`
      <img src=${quizBtnJson[i].text} class="quizQuestionText">
      <div class="quizQuestionFlex">
        <button type="button" id="${quizBtnJson[i].btn01Id}" onclick="checkQuizAnswer(${i},1)">
          <img src=${quizBtnJson[i].btn01} id=${quizBtnJson[i].btn01Img}>
          <img src=${quizBtnJson[i].btn01On} id=${quizBtnJson[i].btn01ImgOn}>
        </button>
        <button type="button" id="${quizBtnJson[i].btn02Id}" onclick="checkQuizAnswer(${i},2)">
          <img src=${quizBtnJson[i].btn02} id=${quizBtnJson[i].btn02Img}>
          <img src=${quizBtnJson[i].btn02On} id=${quizBtnJson[i].btn02ImgOn}>
        </button>
      </div>
      <div class="quizQuestionFlex">
        <button type="button" id="${quizBtnJson[i].btn03Id}" onclick="checkQuizAnswer(${i},3)">
          <img src=${quizBtnJson[i].btn03} id=${quizBtnJson[i].btn03Img}>
          <img src=${quizBtnJson[i].btn03On} id=${quizBtnJson[i].btn03ImgOn}>
        </button>
        <button type="button" id="${quizBtnJson[i].btn04Id}" onclick="checkQuizAnswer(${i},4)">
          <img src=${quizBtnJson[i].btn04} id=${quizBtnJson[i].btn04Img}>
          <img src=${quizBtnJson[i].btn04On} id=${quizBtnJson[i].btn04ImgOn}>
        </button>
      </div>
    `);
    $(`#${quizBtnJson[i].btn01ImgOn}`).hide();
    $(`#${quizBtnJson[i].btn02ImgOn}`).hide();
    $(`#${quizBtnJson[i].btn03ImgOn}`).hide();
    $(`#${quizBtnJson[i].btn04ImgOn}`).hide();
  }
  $("#quizAnswerContents").hide();
  $("#quizAnswerCorrect").attr("src", QUIZ_CORRECT).hide();
  $("#quizAnswerInCorrect").attr("src", QUIZ_INCORRECT).hide();
  $("#quizAnswerCloseBtnImg").attr("src", QUIZ_CLOSE_BTN);
  $("#quizAnswerCloseBtnImgOn").attr("src", QUIZ_CLOSE_BTN_PRS).hide();
  $("#quizResultBackground").attr("src", QUIZ_RESULT_BG);
  $("#quizResultCount").attr("src", QUIZ_RESULT_CNT0);
  $("#quizResultAnswer").attr("src", QUIZ_RESULT_ANSWER);
  $("#quizResultTopBtnImg").attr("src", QUIZ_RETURN_BTN);
  $("#quizResultTopBtnImgOn").attr("src", QUIZ_RETURN_BTN_PRS).hide();
  $("#backBtnQuizImg").attr("src", BACK_BTN);
  $("#backBtnQuizImgOn").attr("src", BACK_BTN_PRS).hide();
  $("#langBtnImgQuiz").attr("src", LANG_BTN);
  $("#langBtnImgOnQuiz").attr("src", LANG_BTN_PRS).hide();
}
function setStampRallyImg() {
  $("#stampRallyBackground").attr("src", STAMP_BG);
  $("#stampRallyCompleteImg").attr("src", STAMP_COMPLETE_IMG);
  $("#closeBtnImg").attr("src", CLOSE_BTN);
  $("#closeBtnImgOn").attr("src", CLOSE_BTN_PRS).hide();
  $("#enqueteBtnImg").attr("src", STAMP_ENQUETE_BTN);
  $("#enqueteBtnImgOn").attr("src", STAMP_ENQUETE_BTN_PRS).hide();
  setBackBtn();
  setChangeLangBtn();

  var stampJson = [
    { x: "488%", y: "322%" },
    { x: "78%", y: "316%" },
    { x: "488%", y: "602%" },
    { x: "78%", y: "417%" },
    { x: "487%", y: "829%" },
    { x: "78%", y: "829%" },
    { x: "78%", y: "602%" },
  ];

  var list = getCookie("stampList");
  for (let i = 0; i < stampJson.length; i++) {
    if(list != null && list[i] == true){
      $("#stampRallyStampContents").append(
        `<img src=${(i == 2 || i == 3)? STAMP_IMG_EARLY : STAMP_IMG_LATE} class="stampRallyStamp" style="transform:translate(${stampJson[i].x},${stampJson[i].y});">`
      );
    }
  }
}
// function setXRContentsImg() {
//   $("#xrContentsSelectImg01").attr("src", XR_BTN01);
//   $("#xrContentsSelectImg02").attr("src", XR_BTN02).hide();
//   $("#xrContentsSelectImg03").attr("src", XR_BTN03);
//   $("#xrContentsSelectImg01On").attr("src", XR_BTN01_PRS).hide();
//   $("#xrContentsSelectImg02On").attr("src", XR_BTN02_PRS);
//   $("#xrContentsSelectImg03On").attr("src", XR_BTN03_PRS).hide();
//   $("#xrContentsSelectTextImg01").attr("src", XR_TEXT01).hide();
//   $("#xrContentsSelectTextImg02").attr("src", XR_TEXT02);
//   $("#xrContentsSelectTextImg03").attr("src", XR_TEXT03).hide();
//   $("#xrContentsSelectImgLock").attr("src", XR_BTN_LOCK);
//   $("#xrContentsPhotoFrameImg").attr("src", XR_BTN_PHOTOFRAME);
//   $("#xrContentsCameraBtnImg").attr("src", XR_CAMERA_BTN);
//   $("#xrContentsCameraBtnImgOn").attr("src", XR_CAMERA_BTN_PRS).hide();
//   $("#captureText").attr("src", XR_CAPTURE_TEXT);
//   $("#captureBackBtnImg").attr("src", XR_CAPTURE_CLOSE);
//   $("#captureBackBtnImgOn").attr("src", XR_CAPTURE_CLOSE_PRS).hide();
//   setBackBtn();
//   setChangeLangBtn();
// }



function setContentsExplanation(){
  $("#kominkaArLogo").attr("src", CONTENTS_EXPLANATION_KOMINKA_AR_LOGO);
  $("#pageBack").attr(     "src", CONTENTS_EXPLANATION_PAGE_BACK_BTN);
  $("#pageBackOn").attr(   "src", CONTENTS_EXPLANATION_PAGE_BACK_BTN_PRS).hide();
  $("#topPageBack").attr(  "src", CONTENTS_EXPLANATION_TOP_PAGE_BACK_BTN);
  $("#topPageBackOn").attr("src", CONTENTS_EXPLANATION_TOP_PAGE_BACK_BTN_PRS).hide();
}

function setInHouseMapImg(){
  $("#inHouseMapBackgroud").attr(     "src", IN_HOUSE_MAP_BG);
  $("#inHouseMapExplanation").attr(   "src", IN_HOUSE_MAP_EXPLANATION);
  $("#inHouseMapImg").attr(           "src", IN_HOUSE_MAP_IMG);
  $("#inHouseMapScaleUpDownImg").attr("src", IN_HOUSE_MAP_SCALE_UP_DOWN_IMG);
  $("#kominkaArLogo").attr(           "src", IN_HOUSE_MAP_KOMINKA_AR_LOGO);
  $("#msgRotationImg").attr(          "src", IN_HOUSE_MAP_MSG_ROTATION);
  $("#scaleDownBtn").attr(            "src", SCALE_DOWN_BTN);
  $("#scaleDownBtnOn").attr(          "src", SCALE_DOWN_BTN_PRS).hide();
  $("#scaleUpBtn").attr(              "src", SCALE_UP_BTN);
  $("#scaleUpBtnOn").attr(            "src", SCALE_UP_BTN_PRS).hide();
  $("#topPageBack").attr(             "src", IN_HOUSE_MAP_TOP_PAGE_BACK_BTN);
  $("#topPageBackOn").attr(           "src", IN_HOUSE_MAP_TOP_PAGE_BACK_BTN_PRS).hide();

  $("#komeguraOfDozima").attr(           "src", KOMEGURA_OF_DOZIMA);
  $("#magariyaOfNanbu").attr(            "src", MAGARIYA_OF_NANBU);
  $("#minkaOfEtizenSuruga").attr(        "src", MINKA_OF_ETIZEN_SURUGA);
  $("#minkaOfHidanSirakawa").attr(       "src", MINKA_OF_HIDAN_SIRAKAWA);
  $("#minkaOfHyugaSiba").attr(           "src", MINKA_OF_HYUGA_SIBA);
  $("#minkaOfSettunose").attr(           "src", MINKA_OF_SETTUNOSE);
  $("#minkaOfSinanoAkiyama").attr(       "src", MINKA_OF_SINANO_AKIYAMA);
  $("#minkaOfYamatoTotugawa").attr(      "src", MINKA_OF_YAMATO_TOTUGAWA);
  $("#nagayamonOfKawatihuse").attr(      "src", NAGAYAMON_OF_KAWATIHUSE);
  $("#nosonKabukiButaiOfAzukizima").attr("src", NOSON_KABUKI_BUTAI_OF_AZUKIZIMA);
  $("#takakuraOfAmamiosima").attr(       "src", TAKAKURA_OF_AMAMIOSIMA);
  $("#tyasituOfKitakawauti").attr(       "src", TYASITU_OF_KITA_KAWAUTI);
}

function setLanguageBtn() {
  $("#englishBtn").attr(  "src", ENGLISH_BTN);
  $("#englishBtnOn").attr("src", ENGLISH_BTN_PRS).hide();
}

function setMenuImg() {
  $("#menuAboutSite").attr(               "src", ABOUT_SITE_BTN);
  $("#menuAboutSiteOn").attr(             "src", ABOUT_SITE_BTN_PRS).hide();
  $("#menuBackgroud").attr(               "src", MENU_BG);
  $("#menuCompletePhotoFrame").attr(      "src", COMPLETE_PHOTO_FRAME_BTN);
  $("#menuCompletePhotoFrameOn").attr(    "src", COMPLETE_PHOTO_FRAME_BTN_PRS).hide();
  $("#menuExplanation").attr(             "src", MENU_EXPLANATION);
  $("#menuKominkaOfficialWebsite").attr(  "src", KOMINKA_OFFICIAL_WEBSITE_BTN);
  $("#menuKominkaOfficialWebsiteOn").attr("src", KOMINKA_OFFICIAL_WEBSITE_BTN_PRS).hide();
  $("#menuInHouseMap"  ).attr(            "src", IN_HOUSE_MAP_BTN);
  $("#menuInHouseMapOn").attr(            "src", IN_HOUSE_MAP_BTN_PRS).hide();
  $("#menuStampRally").attr(              "src", STAMPRALLY_BTN);
  $("#menuStampRallyOn").attr(            "src", STAMPRALLY_BTN_PRS).hide();
  $("#menuStopAndLook").attr(             "src", MENU_STOP_AND_LOOK);



  // $("#menuBackgroud").attr("src", MENU_BG);
  // $("#menuFooterBg").attr("src", MENU_FOOTER);
  // $("#menuXR").attr("src", XR_BTN);
  // $("#menuXROn").attr("src", XR_BTN_PRS).hide();
  // $("#menuRecommendSpot").attr("src", SPOT_BTN);
  // $("#menuRecommendSpotOn").attr("src", SPOT_BTN_PRS).hide();
  // $("#menuEnquete").attr("src", ENQUETE_BTN);
  // $("#menuEnqueteOn").attr("src", ENQUETE_BTN_PRS).hide();
  // $("#menuAttendMark").attr("src", ATTEND_MARK);
  // $("#menuViewAR").attr("src", AR_BTN);
  // $("#menuViewAROn").attr("src", AR_BTN_PRS).hide();
  // $("#menuQuiz").attr("src", QUIZ_BTN);
  // $("#menuQuizOn").attr("src", QUIZ_BTN_PRS).hide();
}

function setPageBack(){
  $("#pageBack").attr(  "src", PAGE_BACK_BTN);
  $("#pageBackOn").attr("src", PAGE_BACK_BTN_PRS).hide();
}

function setTopPageBack(){
  $("#topPageBack").attr(  "src", TOP_PAGE_BACK_BTN);
  $("#topPageBackOn").attr("src", TOP_PAGE_BACK_BTN_PRS).hide();
}