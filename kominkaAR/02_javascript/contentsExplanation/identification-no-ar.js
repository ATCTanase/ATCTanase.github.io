// URLパラメータから表示するコンテンツ選別する
// こっちはARなし
const params = new URLSearchParams(window.location.search);
const identificationId = params.get("id");

if(identificationId == "Explanation1"){
    // 河内布施の長屋門(かわちふせ の ながやもん)
    // 背景画像をページに合わせて切り替える
    const explanationBackgroud7 = document.getElementById("explanationBackgroud");
    explanationBackgroud7.setAttribute("id", "explanationBackgroud7");

    // 「河内布施の長屋門」「北河内の茶室」「堂島の米蔵」は他と背景画像の作りが違うので、
    // padding-topを別途指定する
    contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
    contentsHeightLimitErea.setAttribute("style", "padding-top: 55%;");

    // 説明文章を切り替える
    const AR1ExplanationErea = document.getElementById("explanationErea");
    AR1ExplanationErea.innerHTML = "<p>この門は東大阪市から移築されました。" + 
                                   "江戸時代、「長屋門」は農家の中でも村の代表である庄屋だけが建てることを許されていました。" + 
                                   "正面から見て右側には「供部屋」と呼ばれる使用人の部屋があり、当時は6畳の部屋が二つ並んでいました。" + 
                                   "左側は倉庫として使われる「土蔵」です。農家にとって長屋門は、農作物や農具を収納する実用性と権力者の格式を示す役割を兼ね備えていました。</p>";

    // 説明画像を切り替える
    const AR1flickImage1 = document.getElementById("flickImage1");
    const AR1flickImage2 = document.getElementById("flickImage2");
    const AR1flickImage3 = document.getElementById("flickImage3");
    AR1flickImage1.innerText = "イメージ1";
    AR1flickImage2.innerText = "イメージ1";
    AR1flickImage3.innerText = "イメージ1";

    // iframeで表示するYoutubeの動画を切り替える
    // 変数はtoggle-visibility-in-button-press.jsで宣言
    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    // cookieに「Explanation1を見た」という情報を追加する
    document.cookie = "watchedExplanation1=Explanation1; path=/";
}

if(identificationId == "Explanation2"){
    // 堂島の米蔵(どうじま の こめぐら)
    const explanationBackgroud8 = document.getElementById("explanationBackgroud");
    explanationBackgroud8.setAttribute("id", "explanationBackgroud8");

    // 「河内布施の長屋門」「北河内の茶室」「堂島の米蔵」は他と背景画像の作りが違うので、
    // padding-topを別途指定する
    contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
    contentsHeightLimitErea.setAttribute("style", "padding-top: 55%;");

    const AR2ExplanationErea = document.getElementById("explanationErea");
    AR2ExplanationErea.innerHTML = "<p>江戸時代の大阪は「天下の台所」と呼ばれ、日本中から米や特産品が集まる商業の中心地でした。" + 
                                   "堂島川沿いには多くの藩の蔵屋敷が建ち並び、堂島の米相場では、米を売って現金にかえたり、" + 
                                   "米を担保に資金を借りる仕組みが発達したため、全国の米の値段に大きな影響を与えていました。" + 
                                   "この米蔵は、もとは堂島川に沿って建てられていたもので、瓦葺き・土蔵造りで、壁は厚み約30cm、白漆喰で仕上げられています。</p>";

    const AR2flickImage1 = document.getElementById("flickImage1");
    const AR2flickImage2 = document.getElementById("flickImage2");
    const AR2flickImage3 = document.getElementById("flickImage3");
    AR2flickImage1.innerText = "イメージ2";
    AR2flickImage2.innerText = "イメージ2";
    AR2flickImage3.innerText = "イメージ2";

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation2=Explanation2; path=/";
}

if(identificationId == "Explanation3"){
    // 奄美大島の高倉
    const explanationBackgroud9 = document.getElementById("explanationBackgroud");
    explanationBackgroud9.setAttribute("id", "explanationBackgroud9");

    const AR3ExplanationErea = document.getElementById("explanationErea");
    AR3ExplanationErea.innerHTML = "<p>奄美大島に建てられていたこの高倉は、柱がイジュ（ヒメツバキ）という直径37cmの堅い木から造られており、" + 
                                   "ねずみが爪をかけて登ることができないと言われています。高さ約2mの柱の上に、壁が水平になるくらい傾けて設置されており、" + 
                                   "竹を網の目のように編むことで風通しが良く、米や干物、大事な着物などを良い状態で保存することができました。" + 
                                   "強い日差しを避けられる床下は、作業場や子どもの遊び場となっていました。</p>";

    const AR3flickImage1 = document.getElementById("flickImage1");
    const AR3flickImage2 = document.getElementById("flickImage2");
    const AR3flickImage3 = document.getElementById("flickImage3");
    AR3flickImage1.innerText = "イメージ3";
    AR3flickImage2.innerText = "イメージ3";
    AR3flickImage3.innerText = "イメージ3";

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation3=Explanation3; path=/";
}

if(identificationId == "Explanation4"){
    // 大和十津川の民家(やまととつかわ)
    const explanationBackgroud10 = document.getElementById("explanationBackgroud");
    explanationBackgroud10.setAttribute("id", "explanationBackgroud10");

    const AR4ExplanationErea = document.getElementById("explanationErea");
    AR4ExplanationErea.innerHTML = "<p>十津川村は奈良県最南端に位置し、高さ1000ｍ級の山地の多い地域です。" + 
                                   "民家は、山の斜面を削って石積みを造り、その上に建てられました。" + 
                                   "部屋は横一列に配置され、山側の壁は落石等を防ぐため開口部はありません。" + 
                                   "杉の産地であるため、杉のそぎ板や杉皮などで屋根が葺かれました。" + 
                                   "しばしば台風が通過する地域であったため、雨風から軒下を保護する「うちおろし板」と呼ばれる板が屋根の軒から垂直におろされています。</p>";

    const AR4flickImage1 = document.getElementById("flickImage1");
    const AR4flickImage2 = document.getElementById("flickImage2");
    const AR4flickImage3 = document.getElementById("flickImage3");
    AR4flickImage1.innerText = "イメージ4";
    AR4flickImage2.innerText = "イメージ4";
    AR4flickImage3.innerText = "イメージ4";

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation4=Explanation4; path=/";
}

if(identificationId == "Explanation5"){
    // 越前敦賀の民家(えちぜんつるが)
    const explanationBackgroud11 = document.getElementById("explanationBackgroud");
    explanationBackgroud11.setAttribute("id", "explanationBackgroud11");

    const AR5ExplanationErea = document.getElementById("explanationErea");
    AR5ExplanationErea.innerHTML = "<p>湿度を含む雪がよく積もる地域にあったため、雪が滑り落ちやすい勾配の急な屋根とし、" + 
                                   "柱を土壁で塗り込めた外壁や太い梁などで雪の重みに耐えられる造りとなっています。" + 
                                   "「ニュウジ」と呼ばれた台所では、江戸後期までは床を張らず、地面にモミガラとムシロを敷いていました。" + 
                                   "土間に設置された五右衛門風呂は、三分の一程度の湯を入れ、蓋をしてしゃがんで入る蒸し風呂として用いられていました。" + 
                                   "北国街道に近いため、土間では交易用の馬も飼っていました。</p>";

    const AR5flickImage1 = document.getElementById("flickImage1");
    const AR5flickImage2 = document.getElementById("flickImage2");
    const AR5flickImage3 = document.getElementById("flickImage3");
    AR5flickImage1.innerText = "イメージ5";
    AR5flickImage2.innerText = "イメージ5";
    AR5flickImage3.innerText = "イメージ5";

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation5=Explanation5; path=/";
}

if(identificationId == "Explanation6"){
    // 北河内の茶室(きたかわち)
    const explanationBackgroud12 = document.getElementById("explanationBackgroud");
    explanationBackgroud12.setAttribute("id", "explanationBackgroud12");

    // 「河内布施の長屋門」「北河内の茶室」「堂島の米蔵」は他と背景画像の作りが違うので、
    // padding-topを別途指定する
    contentsHeightLimitErea = document.getElementById("contentsHeightLimitErea");
    contentsHeightLimitErea.setAttribute("style", "padding-top: 55%;");

    const AR6ExplanationErea = document.getElementById("explanationErea");
    AR6ExplanationErea.innerHTML = "<p>自然との調和を重視し、簡素な中に美を見出す「わびさび」の精神が反映された「数寄屋造り」という様式で建てられています。" + 
                                   "北側の壁面に、客用の出入口である「にじり口」が設けられています。" + 
                                   "「にじり口」は頭を下げ手をついて入らなければならず、茶室の中ではすべての人が平等であるという考え方を表しています。" + 
                                   "茶室は四畳半の中央に炉が切られており、口伝では大塩平八郎が使用したと言われています。</p>";

    const AR6flickImage1 = document.getElementById("flickImage1");
    const AR6flickImage2 = document.getElementById("flickImage2");
    const AR6flickImage3 = document.getElementById("flickImage3");
    AR6flickImage1.innerText = "イメージ6";
    AR6flickImage2.innerText = "イメージ6";
    AR6flickImage3.innerText = "イメージ6";

    iframeContents = '<iframe id="youtube" width="100%" height="auto" src="https://www.youtube.com/embed/5WrnSDIDWbU?si=YEFY-j-oE01f2aS_?enablejsapi=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    document.cookie = "watchedExplanation6=Explanation6; path=/";
}