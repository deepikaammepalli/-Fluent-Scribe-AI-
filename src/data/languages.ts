import { Language, SampleDocument } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    speechCode: 'te-IN',
    fontClass: 'font-telugu',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    speechCode: 'ta-IN',
    fontClass: 'font-tamil',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    speechCode: 'kn-IN',
    fontClass: 'font-kannada',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    speechCode: 'ml-IN',
    fontClass: 'font-malayalam',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    speechCode: 'hi-IN',
    fontClass: 'font-hindi',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    speechCode: 'en-US',
    fontClass: '',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    speechCode: 'ja-JP',
    fontClass: 'font-japanese',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文 (简体)',
    speechCode: 'zh-CN',
    fontClass: 'font-chinese',
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    speechCode: 'ko-KR',
    fontClass: 'font-korean',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    speechCode: 'es-ES',
    fontClass: '',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    speechCode: 'fr-FR',
    fontClass: '',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    speechCode: 'de-DE',
    fontClass: '',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    speechCode: 'ar-SA',
    fontClass: '',
    scriptDirection: 'rtl',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    speechCode: 'bn-IN',
    fontClass: '',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    speechCode: 'mr-IN',
    fontClass: 'font-hindi',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    speechCode: 'gu-IN',
    fontClass: '',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    speechCode: 'pa-IN',
    fontClass: '',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    speechCode: 'ur-PK',
    fontClass: '',
    scriptDirection: 'rtl',
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    speechCode: 'ru-RU',
    fontClass: '',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    speechCode: 'pt-BR',
    fontClass: '',
  },
];

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'telugu-multi-page',
    title: 'సమగ్ర ప్రాజెక్ట్ నివేదిక మరియు కార్యాచరణ ప్రణాళిక (Comprehensive Telugu Report)',
    sourceLang: 'te',
    targetLang: 'en',
    category: 'Multi-Page Report (Ideal for 4 A4 Pages)',
    description: 'A detailed 4-section report in Telugu with background, milestones, budget, and implementation timeline.',
    sourceText: `అధ్యాయం 1: పరిచయం మరియు లక్ష్యాలు
ఈ నివేదిక గ్రామీణ ప్రాంతాలలో డిజిటల్ పరిజ్ఞానం మరియు సాంకేతిక నైపుణ్యాల పెంపుదల కొరకు రూపొందించబడిన సమగ్ర కార్యాచరణను వివరిస్తుంది. 2026 నాటికి ప్రతి గ్రామంలో కనీసం 500 మంది యువతకు ఉచిత కంప్యూటర్ మరియు ఇంటర్నెట్ ఆధారిత నైపుణ్య శిక్షణ అందించడం మా ముఖ్య ఉద్దేశ్యం.

గత దశాబ్ద కాలంలో సాంకేతికత అపారంగా విస్తరించినప్పటికీ, గ్రామీణ విద్యార్థులు మరియు ఉద్యోగార్థులు నూతన డిజిటల్ ఉపకరణాలను సమర్థవంతంగా వినియోగించడంలో ఇంకా వెనుకబడి ఉన్నారు. ఈ అంతరాన్ని పూడ్చడానికి ఈ ప్రాజెక్టు అత్యంత పటిష్టమైన కార్యాచరణను ప్రతిపాదిస్తోంది.

అధ్యాయం 2: కార్యాచరణ మరియు అమలు ప్రణాళిక
ఈ ప్రాజెక్ట్ మూడు ప్రధాన దశలలో అమలు చేయబడుతుంది:
మొదటి దశ: మౌలిక వసతుల కల్పన మరియు ఇంటర్నెట్ అనుసంధానం. ప్రతి మండల కేంద్రంలో ఒక ప్రత్యేక డిజిటల్ లెర్నింగ్ ల్యాబ్ ఏర్పాటు చేయబడుతుంది.
రెండవ దశ: స్థానిక భాషలలో నైపుణ్య పాఠ్య ప్రణాళిక రూపకల్పన. తెలుగు మాధ్యమంలో డిజిటల్ అక్షరాస్యత, బేసిక్ కోడింగ్, మరియు సైబర్ భద్రతపై సమగ్ర శిక్షణ మాడ్యూల్స్ అందించబడతాయి.
మూడవ దశ: ఉపాధి కల్పన మరియు మార్కెట్ అనుసంధానం. శిక్షణ పూర్తి చేసుకున్న అభ్యర్థులకు రిమోట్ ఉద్యోగావకాశాలు మరియు స్థానిక చిన్న తరహా వ్యాపారాలకు డిజిటల్ సహకారం అందించడం.

అధ్యాయం 3: బడ్జెట్ మరియు వనరుల కేటాయింపు
ఈ ప్రాజెక్ట్ విజయవంతం కావడానికి ప్రభుత్వం మరియు ప్రైవేట్ భాగస్వామ్యాల ద్వారా రూ. 12.5 కోట్లు కేటాయించబడ్డాయి.
- హార్డ్‌వేర్ మరియు కంప్యూటర్ వ్యవస్థలు: 45% నిధులు
- అధ్యాపకుల శిక్షణ మరియు గౌరవ వేతనాలు: 25% నిధులు
- పాఠ్య ప్రణాళిక మరియు డిజిటల్ కంటెంట్ అభివృద్ధి: 15% నిధులు
- పర్యవేక్షణ, మూల్యాంకనం మరియు సాంకేతిక నిర్వహణ: 15% నిధులు

ప్రతి రూపాయి పారదర్శకంగా వినియోగించబడుతుందని నిర్ధారించడానికి స్వతంత్ర ఆడిట్ బృందాన్ని నియమించడం జరుగుతుంది. ప్రతి మూడు నెలలకు ఒకసారి ఆర్థిక నివేదిక ప్రజల పరిశీలనకు అందుబాటులో ఉంచబడుతుంది.

అధ్యాయం 4: దీర్ఘకాలిక ప్రభావం మరియు భవిష్యత్ దృష్టి
ఈ కార్యక్రమం ద్వారా కేవలం ఉద్యోగావకాశాలు మాత్రమే కాకుండా గ్రామీణ ఆర్థిక వ్యవస్థ గణనీయంగా పుంజుకుంటుంది. మహిళా సాధికారతకు ప్రాధాన్యతనిస్తూ, కనీసం 60% మహిళా అభ్యర్థులకు శిక్షణ అందించడం లక్ష్యంగా పెట్టుకున్నాము.

డిజిటల్ పరివర్తన అనేది సమకాలీన ప్రపంచంలో ఒక ఆవశ్యకత. ఈ ప్రాజెక్ట్ ద్వారా గ్రామీణ యువత ప్రపంచ స్థాయి అవకాశాలను అందిపుచ్చుకోగలరని మేము విశ్వసిస్తున్నాము. సంబంధిత భాగస్వాములందరూ సహకరించి ఈ బృహత్కార్యాన్ని విజయవంతం చేయవలసిందిగా కోరుతున్నాము.`,
  },
  {
    id: 'telugu-legal-notice',
    title: 'న్యాయపరమైన నోటీసు మరియు ఒప్పంద ప్రకటన (Telugu Legal Notice)',
    sourceLang: 'te',
    targetLang: 'en',
    category: 'Legal Notice (1-2 A4 Pages)',
    description: 'A formal legal declaration regarding land boundary and commercial tenancy terms in Telugu.',
    sourceText: `విషయం: వాణిజ్య లీజు ఒప్పందం మరియు నిబంధనల ఉల్లంఘనపై చట్టపరమైన నోటీసు

తేదీ: 20 అక్టోబర్ 2026
పంపినవారు: న్యాయవాది కె. రంగారావు, హైకోర్టు అడ్వకేట్, హైదరాబాద్
స్వీకర్త: శ్రీమతి ఎం. లక్ష్మి, మేనేజింగ్ డైరెక్టర్, శ్రీ సాయి లాజిస్టిక్స్

గౌరవనీయ అమ్మగారికి,
నా క్లయింట్ అయిన శ్రీ వై. విక్రమ్ గారి ఆదేశానుసారం ఈ క్రింది లీగల్ నోటీసును మీకు తెలియజేస్తున్నాను.

1. తేదీ 15 జనవరి 2024 నాడు కుదుర్చుకున్న రిజిస్టర్డ్ లీజు డీడ్ నెంబర్ 1450/2024 ప్రకారం, మీరు ప్లాట్ నంబర్ 42, ఐటీ పార్క్, మాదాపూర్ నందు ఉన్న ప్రాంగణాన్ని నెలకు రూ. 1,80,000/- అద్దె ప్రాతిపదికన తీసుకున్నారు.
2. సదరు ఒప్పంద నిబంధన 8 ప్రకారం, ప్రతి నెల 5వ తేదీ లోపు అద్దె చెల్లించాల్సి ఉంది. అయితే గత 6 నెలలుగా (మే 2026 నుండి అక్టోబర్ 2026 వరకు) మీరు ఎటువంటి అద్దె బకాయిలు చెల్లించకుండా తీవ్ర జాప్యం చేస్తున్నారు.
3. అంతేకాకుండా, ఒప్పందానికి విరుద్ధంగా సదరు ప్రాంగణంలో అనుమతి లేకుండా మరమ్మతులు మరియు ఉప-లీజు (సబ్-లీజు) చర్యలకు పాల్పడినట్లు గుర్తించబడింది.

కావున, ఈ నోటీసు అందిన 15 రోజుల లోపల మొత్తం బకాయి మొత్తం రూ. 10,80,000/- ను 18% వార్షిక వడ్డీతో సహా నా క్లయింట్‌కు చెల్లించవలసిందిగా కోరడమైనది. లేనియెడల సివిల్ మరియు క్రిమినల్ న్యాయస్థానాలలో తగిన చట్టపరమైన చర్యలు ప్రారంభించబడతాయని హెచ్చరించడమైనది.`,
  },
  {
    id: 'hindi-business-proposal',
    title: 'व्यावसायिक परियोजना प्रस्ताव (Hindi Business Proposal)',
    sourceLang: 'hi',
    targetLang: 'en',
    category: 'Business Proposal',
    description: 'A standard corporate proposal for clean energy adoption across industrial hubs.',
    sourceText: `परियोजना सारांश: औद्योगिक इकाइयों के लिए सौर ऊर्जा समाधान

1. पृष्ठभूमि और औचित्य
वर्तमान ऊर्जा संकट और कार्बन उत्सर्जन की चुनौतियों को ध्यान में रखते हुए, हमारे संस्थान ने औद्योगिक परिसरों के लिए उच्च दक्षता वाले सौर ऊर्जा संयंत्र स्थापित करने का प्रस्ताव तैयार किया है। इससे बिजली की लागत में 40% तक की बचत होगी और कार्बन फुटप्रिंट में 65% तक की कमी आएगी।

2. तकनीकी विनिर्देश
- सौर पैनल: टीयर-1 मोनोक्रिस्टलाइन पीईआरसी 550W मॉड्यूल
- इन्वर्टर: ग्रिड-टाईड 3-फेज स्ट्रिंग इन्वर्टर, 98.7% दक्षता
- मॉनिटरिंग: क्लाउड-आधारित वास्तविक समय आईओटी टेलीमेट्री सिस्टम
- बैटरी स्टोरेज: 200 kWh लिथियम-आयन बैकअप सिस्टम

3. वित्तीय विश्लेषण और वापसी
कुल प्रारंभिक निवेश 45 लाख रुपये अनुमानित है। 3.5 वर्षों के भीतर पूंजी की वसूली संभव है। सरकार द्वारा स्वीकृत 20% त्वरित मूल्यह्रास लाभ भी उपलब्ध है।`,
  },
  {
    id: 'japanese-technical-memo',
    title: '技術仕様書と品質基準 (Japanese Technical Memo)',
    sourceLang: 'ja',
    targetLang: 'en',
    category: 'Technical Memo',
    description: 'Precision engineering specification and quality metrics in Japanese.',
    sourceText: `件名：次世代産業用制御モジュールの品質基準および検査手順書

1. 目的
本技術書は、2026年度第4四半期に出荷を予定している高精度モータードライバ制御ボード（モデル：FS-900）の最終検査基準を定めるものである。

2. 測定環境および動作条件
- 動作保証温度範囲：-20℃ ～ +85℃
- 相対湿度：10% ～ 90% (結露なきこと)
- 入力電圧定格：DC 24V ± 5%
- 最大定格電流：15A

3. 試験項目と許容誤差
- 電源リップルノイズ：50mVp-p以下であること
- 応答遅延時間：12マイクロ秒以内
- 耐振動試験：JIS C 60068-2-6規格に準拠し、加振試験後に異常な接触不良がないことを確認すること。`,
  },
];
