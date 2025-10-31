// URLパラメータから表示するコンテンツ選別する
// こっちはARなし
const params = new URLSearchParams(window.location.search);
const identificationId = params.get("id");

// 河内布施の長屋門
if(identificationId == "Explanation1"){
    const title1 = document.getElementById("title");
    title1.innerText = "河内布施の長屋門（大阪府） | 古民家AR";

    // 背景画像をページに合わせて切り替える
    const explanationBackgroud7 = document.getElementById("explanationBackgroud");
    explanationBackgroud7.setAttribute("id", "explanationBackgroud7");

    // 説明文章を切り替える
    const AR1ExplanationErea = document.getElementById("explanationErea");
    AR1ExplanationErea.innerHTML = "<p>この門は東大阪市から移築されました。" + 
                                   "江戸時代、「長屋門」は農家の中でも村の代表である庄屋だけが建てることを許されていました。" + 
                                   "正面から見て右側には「供部屋」と呼ばれる使用人の部屋があり、当時は6畳の部屋が二つ並んでいました。" + 
                                   "左側は倉庫として使われる「土蔵」です。農家にとって長屋門は、農作物や農具を収納する実用性と権力者の格式を示す役割を兼ね備えていました。</p>";

    // 説明画像を切り替える
    const explain1ExplainImage1 = document.getElementById("explainImage1");
    const explain1ExplainImage2 = document.getElementById("explainImage2");
    const explain1ExplainImage3 = document.getElementById("explainImage3");
    explain1ExplainImage1.setAttribute("src", "../../../image/explain/explanation1/1_河内布施の長屋門.jpg");
    explain1ExplainImage2.setAttribute("src", "../../../image/explain/explanation1/2_河内布施の長屋門.jpg");
    explain1ExplainImage3.setAttribute("src", "../../../image/explain/explanation1/3_河内布施の長屋門_平面図.jpg");

    // iframeで表示するYoutubeの動画を切り替える
    // 変数はtoggle-visibility-in-button-press.jsで宣言
    iframeContents = '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/UouzGSFMDfU?si=9oePOu8lOAykEK-O" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // cookieに「Explanation1を見た」という情報を追加する
    document.cookie = "watchedExplanation1=Explanation1; path=/";

    window.addEventListener("load", function () {
        const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");

        const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
        backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
    });
}

// 堂島の米蔵
if(identificationId == "Explanation2"){
    const title2 = document.getElementById("title");
    title2.innerText = "堂島の米蔵（大阪府） | 古民家AR";

    const explanationBackgroud8 = document.getElementById("explanationBackgroud");
    explanationBackgroud8.setAttribute("id", "explanationBackgroud8");

    const AR2ExplanationErea = document.getElementById("explanationErea");
    AR2ExplanationErea.innerHTML = "<p>江戸時代の大阪は「天下の台所」と呼ばれ、日本中から米や特産品が集まる商業の中心地でした。" + 
                                   "堂島川沿いには多くの藩の蔵屋敷が建ち並び、堂島の米相場では、米を売って現金にかえたり、" + 
                                   "米を担保に資金を借りる仕組みが発達したため、全国の米の値段に大きな影響を与えていました。" + 
                                   "この米蔵は、もとは堂島川に沿って建てられていたもので、瓦葺き・土蔵造りで、壁は厚み約30cm、白漆喰で仕上げられています。</p>";

    const explain2ExplainImage1 = document.getElementById("explainImage1");
    const explain2ExplainImage2 = document.getElementById("explainImage2");
    const explain2ExplainImage3 = document.getElementById("explainImage3");
    explain2ExplainImage1.setAttribute("src", "../../../image/explain/explanation2/1_堂島の米蔵.jpg");
    explain2ExplainImage2.setAttribute("src", "../../../image/explain/explanation2/2_堂島の米蔵.jpg");
    explain2ExplainImage3.setAttribute("src", "../../../image/explain/explanation2/3_堂島の米蔵_平面図.jpg");

    iframeContents = '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/Exo4cw7s9hI?si=J5fGuue924QwlNqF" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation2=Explanation2; path=/";

    window.addEventListener("load", function () {
        const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");

        const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
        backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
    });
}

// 奄美大島の高倉
if(identificationId == "Explanation3"){
    const title3 = document.getElementById("title");
    title3.innerText = "奄美大島の高倉（鹿児島県） | 古民家AR";

    const explanationBackgroud9 = document.getElementById("explanationBackgroud");
    explanationBackgroud9.setAttribute("id", "explanationBackgroud9");

    const AR3ExplanationErea = document.getElementById("explanationErea");
    AR3ExplanationErea.innerHTML = "<p>奄美大島に建てられていたこの高倉は、柱がイジュ（ヒメツバキ）という直径37cmの堅い木から造られており、" + 
                                   "ねずみが爪をかけて登ることができないと言われています。高さ約2mの柱の上に、壁が水平になるくらい傾けて設置されており、" + 
                                   "竹を網の目のように編むことで風通しが良く、米や干物、大事な着物などを良い状態で保存することができました。" + 
                                   "強い日差しを避けられる床下は、作業場や子どもの遊び場となっていました。</p>";

    const explain3ExplainImage1 = document.getElementById("explainImage1");
    const explain3ExplainImage2 = document.getElementById("explainImage2");
    const explain3ExplainImage3 = document.getElementById("explainImage3");
    explain3ExplainImage1.setAttribute("src", "../../../image/explain/explanation3/1_奄美大島の高倉.jpg");
    explain3ExplainImage2.setAttribute("src", "../../../image/explain/explanation3/2_奄美大島の高倉.jpg");
    explain3ExplainImage3.setAttribute("src", "../../../image/explain/explanation3/3_奄美大島の高倉_平面図.jpg");

    iframeContents = '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/gLsGV4m_k-E?si=vQKIfA0TJLdMBhSR" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation3=Explanation3; path=/";

    window.addEventListener("load", function () {
        const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");

        const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
        backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
    });
}

// 大和十津川の民家
if(identificationId == "Explanation4"){
    const title4 = document.getElementById("title");
    title4.innerText = "大和十津川の民家（奈良県） | 古民家AR";

    const explanationBackgroud10 = document.getElementById("explanationBackgroud");
    explanationBackgroud10.setAttribute("id", "explanationBackgroud10");

    const AR4ExplanationErea = document.getElementById("explanationErea");
    AR4ExplanationErea.innerHTML = "<p>十津川村は奈良県最南端に位置し、高さ1000ｍ級の山地の多い地域です。" + 
                                   "民家は、山の斜面を削って石積みを造り、その上に建てられました。" + 
                                   "部屋は横一列に配置され、山側の壁は落石等を防ぐため開口部はありません。" + 
                                   "杉の産地であるため、杉のそぎ板や杉皮などで屋根が葺かれました。" + 
                                   "しばしば台風が通過する地域であったため、雨風から軒下を保護する「うちおろし板」と呼ばれる板が屋根の軒から垂直におろされています。</p>";

    const explain4ExplainImage1 = document.getElementById("explainImage1");
    const explain4ExplainImage2 = document.getElementById("explainImage2");
    const explain4ExplainImage3 = document.getElementById("explainImage3");
    explain4ExplainImage1.setAttribute("src", "../../../image/explain/explanation4/1_大和十津川の民家.jpg");
    explain4ExplainImage2.setAttribute("src", "../../../image/explain/explanation4/2_大和十津川の民家.jpg");
    explain4ExplainImage3.setAttribute("src", "../../../image/explain/explanation4/3_大和十津川の民家_平面図.jpg");

    iframeContents = '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/_zOudeMlwE8?si=EuLezFKKmGLBjnTi" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation4=Explanation4; path=/";

    window.addEventListener("load", function () {
        const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");

        const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
        backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
    });
}

// 越前敦賀の民家
if(identificationId == "Explanation5"){
    const title5 = document.getElementById("title");
    title5.innerText = "越前敦賀の民家（福井県） | 古民家AR";

    const explanationBackgroud11 = document.getElementById("explanationBackgroud");
    explanationBackgroud11.setAttribute("id", "explanationBackgroud11");

    const AR5ExplanationErea = document.getElementById("explanationErea");
    AR5ExplanationErea.innerHTML = "<p>湿度を含む雪がよく積もる地域にあったため、雪が滑り落ちやすい勾配の急な屋根とし、" + 
                                   "柱を土壁で塗り込めた外壁や太い梁などで雪の重みに耐えられる造りとなっています。" + 
                                   "「ニュウジ」と呼ばれた台所では、江戸後期までは床を張らず、地面にモミガラとムシロを敷いていました。" + 
                                   "土間に設置された五右衛門風呂は、三分の一程度の湯を入れ、蓋をしてしゃがんで入る蒸し風呂として用いられていました。" + 
                                   "北国街道に近いため、土間では交易用の馬も飼っていました。</p>";

    const explain5ExplainImage1 = document.getElementById("explainImage1");
    const explain5ExplainImage2 = document.getElementById("explainImage2");
    const explain5ExplainImage3 = document.getElementById("explainImage3");
    explain5ExplainImage1.setAttribute("src", "../../../image/explain/explanation5/1_越前敦賀の民家.jpg");
    explain5ExplainImage2.setAttribute("src", "../../../image/explain/explanation5/2_越前敦賀の民家.jpg");
    explain5ExplainImage3.setAttribute("src", "../../../image/explain/explanation5/3_越前敦賀の民家_平面図.jpg");

    iframeContents = '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/NMOYfV4UnvQ?si=nVCTWtdhGaVU2bqw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation5=Explanation5; path=/";

    window.addEventListener("load", function () {
        const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");

        const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
        backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
    });
}

// 北河内の茶室
if(identificationId == "Explanation6"){
    const title6 = document.getElementById("title");
    title6.innerText = "北河内の茶室（大阪府） | 古民家AR";

    const explanationBackgroud12 = document.getElementById("explanationBackgroud");
    explanationBackgroud12.setAttribute("id", "explanationBackgroud12");

    const AR6ExplanationErea = document.getElementById("explanationErea");
    AR6ExplanationErea.innerHTML = "<p>自然との調和を重視し、簡素な中に美を見出す「わびさび」の精神が反映された「数寄屋造り」という様式で建てられています。" + 
                                   "北側の壁面に、客用の出入口である「にじり口」が設けられています。" + 
                                   "「にじり口」は頭を下げ手をついて入らなければならず、茶室の中ではすべての人が平等であるという考え方を表しています。" + 
                                   "茶室は四畳半の中央に炉が切られており、口伝では大塩平八郎が使用したと言われています。</p>";

    const explain6ExplainImage1 = document.getElementById("explainImage1");
    const explain6ExplainImage2 = document.getElementById("explainImage2");
    const explain6ExplainImage3 = document.getElementById("explainImage3");
    explain6ExplainImage1.setAttribute("src", "../../../image/explain/explanation6/1_北河内の茶室.jpg");
    explain6ExplainImage2.setAttribute("src", "../../../image/explain/explanation6/2_北河内の茶室.jpg");
    // explain6ExplainImage3.setAttribute("src", "../../../image/explain/explanation6/3_北河内の茶室_平面図.jpg");

    iframeContents = '<iframe width="100%" height="auto" src="https://www.youtube.com/embed/L3rf1xddAro?si=2DF1nZVr1xFV-B2L" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation6=Explanation6; path=/";
    
    window.addEventListener("load", function () {
        const contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");

        const backgroundHiddenErea = document.getElementById("backgroundHiddenErea");
        backgroundHiddenErea.setAttribute("style", "height:" + (contentsHeightLimitErea.offsetHeight + 30) + "px");
    });
}