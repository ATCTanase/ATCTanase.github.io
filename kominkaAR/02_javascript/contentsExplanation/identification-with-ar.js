// URLパラメータから表示するコンテンツ選別する
// こっちはARあり
const params = new URLSearchParams(window.location.search);
const identificationId = params.get("id");

if(identificationId == "AR1"){
    // 飛騨白川(ひだしらかわ)の民家
    // 背景画像をページに合わせて切り替える
    const explanationBackgroud1 = document.getElementById("explanationBackgroud");
    explanationBackgroud1.setAttribute("id", "explanationBackgroud1");

    // ARを見るダイアログに表示される地図の位置を調整する
    const ARExperienceErea1 = document.getElementById("ARExperienceErea");
    ARExperienceErea1.setAttribute("style", "left: 6%; top: 14%; width: 88%;");
    // ARを見るダイアログに表示される地図を切り替える
    const ARExperience1 = document.getElementById("ARExperience");
    ARExperience1.setAttribute("id", "ARExperience1");

    // 説明文章を切り替える
    const AR1ExplanationErea = document.getElementById("explanationErea");
    AR1ExplanationErea.innerHTML = "<p>「合掌造り」は屋根裏を広く利用するために切妻造りとした茅葺きの家屋で、" +
                                   "白川郷と五箇山地方にのみ存在しています。屋根裏部屋は、切妻の窓から入る日光と空気、" + 
                                   "囲炉裏から上がってくる熱と煙で暖かく乾燥し、蚕を育てるのに理想的な場所でした。" + 
                                   "養蚕には多くの労働力を必要としたため、白川郷では長男だけが嫁を迎えて跡継ぎとなり、" + 
                                   "弟や妹たちは通い婚で実家に留まって働く「大家族制」と呼ばれる家族制度がありました。</p>";

    // 説明画像を切り替える
    const AR1flickImage1 = document.getElementById("flickImage1");
    const AR1flickImage2 = document.getElementById("flickImage2");
    const AR1flickImage3 = document.getElementById("flickImage3");
    AR1flickImage1.innerText = "イメージ1";
    AR1flickImage2.innerText = "イメージ1";
    AR1flickImage3.innerText = "イメージ1";

    // ARのリンク先を切り替える
    const AR1Invoke = document.getElementById("ARInvoke");
    AR1Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_1.html'");

    // iframeで表示するYoutubeの動画を切り替える
    // 変数はtoggle-visibility-in-button-press.jsで宣言
    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // cookieに「AR1を見た」という情報を追加する
    // document.cookie = "watchedAR1=AR1; path=/";
}

if(identificationId == "AR2"){
    // 日向椎葉(ひゅうがしいば)の民家
    const explanationBackgroud2 = document.getElementById("explanationBackgroud");
    explanationBackgroud2.setAttribute("id", "explanationBackgroud2");

    const ARExperienceErea2 = document.getElementById("ARExperienceErea");
    ARExperienceErea2.setAttribute("style", "left: 6%; top: 14%; width: 90%;");
    const ARExperience2 = document.getElementById("ARExperience");
    ARExperience2.setAttribute("id", "ARExperience2");

    const AR2ExplanationErea = document.getElementById("explanationErea");
    AR2ExplanationErea.innerHTML = "<p>部屋が横一列に並ぶ「椎葉型」と呼ばれる間取りになっています。" + 
                                   "これは山の斜面に沿った細長い宅地に建てられたためだと考えられています。" + 
                                   "12月の夜、いつもは客間である「でい」で神楽が舞われ、寝室である「こざ」が楽屋となります。" + 
                                   "茶の間にあたる「うちね」や「うちえん」・「ほかえん」は観客席として使われました。" + 
                                   "宮崎県では室町時代以前から舞い継がれてきた約200の神楽が今も各地に残っています。</p>";

    const AR2flickImage1 = document.getElementById("flickImage1");
    const AR2flickImage2 = document.getElementById("flickImage2");
    const AR2flickImage3 = document.getElementById("flickImage3");
    AR2flickImage1.innerText = "イメージ2";
    AR2flickImage2.innerText = "イメージ2";
    AR2flickImage3.innerText = "イメージ2";

    const AR2Invoke = document.getElementById("ARInvoke");
    AR2Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_2.html'");

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // document.cookie = "watchedAR2=AR2; path=/";
}

if(identificationId == "AR3"){
    // 摂津能勢(せっつのせ)の民家
    const explanationBackgroud3 = document.getElementById("explanationBackgroud");
    explanationBackgroud3.setAttribute("id", "explanationBackgroud3");

    const ARExperienceErea3 = document.getElementById("ARExperienceErea");
    ARExperienceErea3.setAttribute("style", "left: 6%; top: 20%; width: 87%;");
    const ARExperience3 = document.getElementById("ARExperience");
    ARExperience3.setAttribute("id", "ARExperience3");

    const AR3ExplanationErea = document.getElementById("explanationErea");
    AR3ExplanationErea.innerHTML = "<p>大阪府の最北端の能勢町にあったこの民家は、近畿地方の農家に多い田の字型の間取りとは異なり、" + 
                                   "母屋を半分に割り、片方だけに部屋を集中させ、片方は土間となっています。" + 
                                   "摂津・丹波地方にのみに分布する特徴のある民家で、京都の町家の影響を受けたと考えられています。" + 
                                   "屋根の煙出しに「丸に桔梗」の家紋と魚のうろこを彫刻した木製の妻飾り（<ruby>懸魚<rt>げぎょ</rt></ruby>）がつけられていることから、格式の高い家だったことが分かります。</P>";

    const AR3flickImage1 = document.getElementById("flickImage1");
    const AR3flickImage2 = document.getElementById("flickImage2");
    const AR3flickImage3 = document.getElementById("flickImage3");
    AR3flickImage1.innerText = "イメージ3";
    AR3flickImage2.innerText = "イメージ3";
    AR3flickImage3.innerText = "イメージ3";

    const AR3Invoke = document.getElementById("ARInvoke");
    AR3Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_3.html'");

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // document.cookie = "watchedAR3=AR3; path=/";
}

if(identificationId == "AR4"){
    // 信濃秋山(しなのあきやま)の民家
    const explanationBackgroud4 = document.getElementById("explanationBackgroud");
    explanationBackgroud4.setAttribute("id", "explanationBackgroud4");

    const ARExperienceErea4 = document.getElementById("ARExperienceErea");
    ARExperienceErea4.setAttribute("style", "left: 6%; top: 16%; width: 87%;");
    const ARExperience4 = document.getElementById("ARExperience");
    ARExperience4.setAttribute("id", "ARExperience4");

    const AR4ExplanationErea = document.getElementById("explanationErea");
    AR4ExplanationErea.innerHTML = "<p>長野県と新潟県の県境にある秋山郷は、半年以上も雪に閉ざされる日本有数の豪雪地帯だったため、" + 
                                   "分厚い茅の壁や、母屋からつき出した玄関にうまやや便所を備えた中門によって、雪や寒さを防いでいました。" + 
                                   "床を張らず、地面に直にムシロを敷いた土座は、囲炉裏の熱が地面に伝わり部屋全体を温めることができました。" + 
                                   "囲炉裏には、大量の薪を効率的に保存し使えるように長い薪や丸太をそのままくべて使っていました。</p>";

    const AR4flickImage1 = document.getElementById("flickImage1");
    const AR4flickImage2 = document.getElementById("flickImage2");
    const AR4flickImage3 = document.getElementById("flickImage3");
    AR4flickImage1.innerText = "イメージ4";
    AR4flickImage2.innerText = "イメージ4";
    AR4flickImage3.innerText = "イメージ4";

    const AR4Invoke = document.getElementById("ARInvoke");
    AR4Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_4.html'");

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // document.cookie = "watchedAR4=AR4; path=/";
}

if(identificationId == "AR5"){
    // 小豆島の農村歌舞伎舞台(のうそんかぶきぶたい)
    const explanationBackgroud5 = document.getElementById("explanationBackgroud");
    explanationBackgroud5.setAttribute("id", "explanationBackgroud5");

    const ARExperienceErea5 = document.getElementById("ARExperienceErea");
    ARExperienceErea5.setAttribute("style", "left: 6%; top: 15%; width: 89%;");
    const ARExperience5 = document.getElementById("ARExperience");
    ARExperience5.setAttribute("id", "ARExperience5");

    const AR5ExplanationErea = document.getElementById("explanationErea");
    AR5ExplanationErea.innerHTML = "<p>小豆島では、江戸時代から明治時代にかけて農村歌舞伎が盛んでした。" + 
                                   "神社の境内に建てられた舞台は、多い時で20棟以上、仮設小屋をあわせると150ヶ所もありました。" + 
                                   "この舞台は神様も一緒に芝居を楽しんでいただけるように神社の本殿と向かい合って建てられ、豊作祈願や収穫の感謝のために村人自ら演じていました。" + 
                                   "移築前のおなごり講演では、明智光秀の謀反を題材にした「絵本太功記十段目」などが演じられました。</p>";

    const AR5flickImage1 = document.getElementById("flickImage1");
    const AR5flickImage2 = document.getElementById("flickImage2");
    const AR5flickImage3 = document.getElementById("flickImage3");
    AR5flickImage1.innerText = "イメージ5";
    AR5flickImage2.innerText = "イメージ5";
    AR5flickImage3.innerText = "イメージ5";

    const AR5Invoke = document.getElementById("ARInvoke");
    AR5Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_5.html'");

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // document.cookie = "watchedAR5=AR5; path=/";
}

if(identificationId == "AR6"){
    // 南部の曲家(まがりや)
    const explanationBackgroud6 = document.getElementById("explanationBackgroud");
    explanationBackgroud6.setAttribute("id", "explanationBackgroud6");

    const ARExperienceErea6 = document.getElementById("ARExperienceErea");
    ARExperienceErea6.setAttribute("style", "left: 6%; top: 15%; width: 87%;");
    const ARExperience6 = document.getElementById("ARExperience");
    ARExperience6.setAttribute("id", "ARExperience6");

    const AR6ExplanationErea = document.getElementById("explanationErea");
    AR6ExplanationErea.innerHTML = "<p>江戸時代、岩手県は南部藩に属し、名馬「南部駒」の産地として有名でした。" + 
                                   "曲家は母屋とウマヤをL字型につなげることで、広く暖かい空間で馬を飼うことができました。" + 
                                   "台所には土間に直に切った囲炉裏の周りに板の間が設置され、農作業の合間に履物を脱がずに馬を見ながら食事をとることができました。" + 
                                   "この地域では、農耕馬に感謝し馬の無病息災を祈願するため、馬を華やかな装束と鈴で飾りつけるお祭りが今も開催されています。</p>";

    const AR6flickImage1 = document.getElementById("flickImage1");
    const AR6flickImage2 = document.getElementById("flickImage2");
    const AR6flickImage3 = document.getElementById("flickImage3");
    AR6flickImage1.innerText = "イメージ6";
    AR6flickImage2.innerText = "イメージ6";
    AR6flickImage3.innerText = "イメージ6";

    const AR6Invoke = document.getElementById("ARInvoke");
    AR6Invoke.setAttribute("onclick", "location.href='../3Dof/3Dof_6.html'");

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // document.cookie = "watchedAR6=AR6; path=/";
}