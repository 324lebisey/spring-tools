'use client';

import { useState, useRef } from "react";
const CLIMATES=[{id:"cold",label:"쌀쌀한 봄",emoji:"🧣",desc:"5~15°C"},{id:"mild",label:"포근한 봄",emoji:"🌤️",desc:"15~22°C"},{id:"warm",label:"따뜻한 봄",emoji:"☀️",desc:"20~28°C"}];
const STYLES=[{id:"classic",label:"깔끔/기본",emoji:"👔",desc:"무난하고 단정한 스타일"},{id:"casual",label:"편한/자연스러운",emoji:"👕",desc:"일상적이고 편안한"},{id:"minimal",label:"심플/모노톤",emoji:"⬜",desc:"군더더기 없이 깔끔한"},{id:"street",label:"개성/트렌디",emoji:"✨",desc:"힙하고 나만의 스타일"},{id:"romantic",label:"여성스러운/화사한",emoji:"🌸",desc:"부드럽고 사랑스러운"},{id:"preppy",label:"단정/스마트",emoji:"⛵",desc:"깔끔하고 정돈된 느낌"}];
const BUDGETS=[{id:"budget",label:"알뜰",emoji:"💰",desc:"총 20만원 이내",per:"1~3만원/개"},{id:"moderate",label:"적당",emoji:"💳",desc:"총 20~50만원",per:"3~7만원/개"},{id:"premium",label:"투자",emoji:"💎",desc:"총 50만원+",per:"7~15만원+/개"}];
const GENDER=[{id:"women",label:"여성",emoji:"👩"},{id:"men",label:"남성",emoji:"👨"},{id:"neutral",label:"성별 무관",emoji:"🧑"}];

const W_CLASSIC={tops:[{name:"흰색 남방셔츠",essential:true,color:"흰색",tip:"청바지에 넣어 입어도, 자켓 안에 받쳐 입어도 다 어울려요!"},{name:"줄무늬 긴팔 티 (남색+흰색)",essential:true,color:"남색/흰색",tip:"청바지, 치마, 자켓 안에 뭘 입어도 세련돼 보여요."},{name:"기본 둥근목 반팔티 (흰색)",essential:true,color:"흰색",tip:"코디의 기본! 2-3장 있으면 좋아요."},{name:"기본 둥근목 반팔티 (남색)",essential:false,color:"남색",tip:"흰색 대신 번갈아 입기."},{name:"얇은 끈나시 (비치는 소재)",essential:false,color:"베이지/크림",tip:"자켓 안에 받쳐 입으면 저녁 외출 분위기."}],bottoms:[{name:"일자 청바지 (중간 밝기)",essential:true,color:"중간 밝기",tip:"매일 입는 기본 바지. 편하게도 격식 있게도."},{name:"통 넓은 정장 바지",essential:true,color:"카키/베이지",tip:"출근, 브런치, 데이트 — 어디든 활용."},{name:"A라인 중간기장 치마",essential:false,color:"올리브/남색",tip:"반팔티+운동화=편하게, 블라우스+구두=격식 있게."}],layers:[{name:"린넨 자켓 (얇은 정장 자켓)",essential:true,color:"베이지/밝은 갈색",tip:"어떤 옷 위에 걸쳐도 바로 고급스러워요."},{name:"얇은 니트 가디건",essential:true,color:"크림/귀리색",tip:"사무실 냉방, 서늘한 아침저녁에 딱."},{name:"청자켓",essential:false,color:"중간 밝기",tip:"원피스, 치마, 반팔티 위에 걸치기 좋아요."}],shoes:[{name:"흰 가죽 운동화",essential:true,color:"흰색",tip:"청바지, 원피스, 치마 뭐든 다 어울리는 만능 신발."},{name:"살색/밝은 갈색 납작구두",essential:true,color:"살색/밝은 갈색",tip:"깔끔하고 편해요. 다리도 길어 보여요."},{name:"단화 (굽 없는 구두)",essential:false,color:"갈색/검정",tip:"편한 신발과 정장 구두 사이의 중간."}],accessories:[{name:"큰 가방 (출퇴근용)",essential:true,color:"밤색/갈색",tip:"출근, 쇼핑, 여행 — 뭐든 담겨요."},{name:"심플 귀걸이+목걸이+팔찌 세트",essential:true,color:"금색 또는 은색",tip:"작은 고리 귀걸이 + 얇은 목걸이 + 얇은 팔찌."}]};

const W_CASUAL={tops:[{name:"넉넉한 면 반팔티 (흰색)",essential:true,color:"흰색",tip:"앞만 바지에 넣거나, 매듭 짓거나, 그냥 편하게."},{name:"편한 린넨 셔츠",essential:true,color:"하늘색/연두",tip:"나시 위에 걸쳐서, 허리에 묶어서, 반바지에 넣어서."},{name:"그림 있는 반팔티",essential:false,color:"자유",tip:"좋아하는 브랜드나 그림 — 나만의 개성!"},{name:"골지 나시",essential:true,color:"검정/흰색",tip:"기본 받침옷 또는 그냥 입기."},{name:"부드러운 맨투맨",essential:false,color:"회색",tip:"집에서도 나가서도 깔끔해 보여요."}],bottoms:[{name:"하이웨이스트 통 넓은 청바지",essential:true,color:"밝은 워싱",tip:"접어서 신발 보이게, 벨트 해서 — 봄 청바지."},{name:"허리끈 린넨 바지",essential:true,color:"베이지/모래색",tip:"바람 솔솔. 외출부터 바다까지."},{name:"무릎 위 청반바지",essential:false,color:"중간 밝기",tip:"따뜻한 날에. 어떤 상의든 OK."}],layers:[{name:"넉넉한 청자켓",essential:true,color:"중간 밝기",tip:"캐주얼의 왕. 뭘 입어도 위에 걸치면 완성."},{name:"야상 자켓 (카키색)",essential:true,color:"올리브/카키",tip:"반팔티+청바지+이것 = 완벽한 봄 코디."},{name:"가벼운 후드 집업",essential:false,color:"연두/분홍",tip:"아침 산책, 저녁 바람, 여행용."}],shoes:[{name:"캔버스 운동화 (컨버스 같은)",essential:true,color:"흰색/생지",tip:"청바지, 원피스, 반바지 — 편한 클래식."},{name:"슬리퍼 샌들",essential:true,color:"갈색",tip:"따뜻한 날의 가장 쉬운 신발."},{name:"복고풍 운동화",essential:false,color:"회색+포인트 컬러",tip:"편하면서 예쁜 신발."}],accessories:[{name:"천 가방 (에코백)",essential:true,color:"생지/줄무늬",tip:"장보기, 바다, 일상 가방."},{name:"볼캡 또는 벙거지",essential:false,color:"데님/베이지",tip:"자외선 차단 + 스타일."}]};

const W_MINIMAL={tops:[{name:"좋은 소재 흰 반팔티",essential:true,color:"흰색",tip:"매일 입는 유니폼. 소재 좋은 걸로 하나 투자!"},{name:"얇은 검정 목폴라",essential:true,color:"검정",tip:"깔끔한 기본. 바지, 청바지, 치마 다 OK."},{name:"실크 남방",essential:true,color:"아이보리/밝은 회색",tip:"넣어도 빼도 세련돼 보여요."},{name:"골지 긴팔티",essential:false,color:"짙은 회색",tip:"환절기 기본 아이템."}],bottoms:[{name:"일자 검정 바지",essential:true,color:"검정",tip:"가장 많이 입을 아이템. 뭐든 어울려요."},{name:"중간 밝기 청바지",essential:true,color:"중간 남색",tip:"이 청바지 하나면 충분."},{name:"깔끔한 반바지",essential:false,color:"검정/남색",tip:"더운 날에도 같은 깔끔한 느낌."}],layers:[{name:"부드러운 울 자켓",essential:true,color:"짙은 회색/낙타색",tip:"이것 하나만 있으면 어디든 OK."},{name:"캐시미어 둥근목 니트",essential:true,color:"회색/낙타색",tip:"어깨에 걸치거나 그냥 입거나."}],shoes:[{name:"가죽 단화",essential:true,color:"검정",tip:"심플한 사람의 대표 신발."},{name:"흰 가죽 운동화",essential:true,color:"흰색",tip:"깔끔한 라인. 편한 신발은 이것 하나."}],accessories:[{name:"깔끔한 가죽 가방",essential:true,color:"검정",tip:"로고 없는 깔끔한 디자인. 하나로 충분."},{name:"시계 또는 팔찌 하나",essential:true,color:"은색/금색",tip:"액세서리는 딱 하나만. 그게 포인트."}]};

const W_STREET={tops:[{name:"짧은 가디건 (윗옷으로)",essential:true,color:"노란색/보라색",tip:"단추 잠그면 윗옷, 열면 걸침옷."},{name:"골지 반목 티",essential:true,color:"크림/검정",tip:"개성 있는 하의와 잘 어울리는 깔끔한 상의."},{name:"퍼프소매 블라우스 (볼록 소매)",essential:true,color:"흰색/잔꽃",tip:"청바지 위에 입으면 바로 예쁘게."},{name:"짧은 네모 반팔티",essential:false,color:"파스텔/무지",tip:"하이웨이스트 하의와. 배 살짝 보이게."},{name:"시스루 레이어 상의",essential:false,color:"검정",tip:"브라탑 위에 겹쳐 입기. 저녁 외출용."}],bottoms:[{name:"통 넓은 청바지",essential:true,color:"중간/어두운 워싱",tip:"요즘 대세 핏. 딱 맞는 상의와 균형 맞추기."},{name:"광택 중간기장 치마",essential:true,color:"샴페인/연두",tip:"낮에는 캐주얼하게, 밤에는 화려하게."},{name:"깔끔한 무릎 반바지",essential:false,color:"생지/밝은 카키",tip:"자켓+이것 = 봄 힙한 조합."}],layers:[{name:"넉넉한 자켓 (오버핏)",essential:true,color:"체크 또는 튀는 색",tip:"포인트 아이템. 아무 옷이나 위에 걸치면 변신."},{name:"니트 조끼",essential:true,color:"크림/마름모 무늬",tip:"셔츠 위나 반팔티 위에. 레이어링 핵심."}],shoes:[{name:"통굽 운동화",essential:true,color:"흰색/크림",tip:"키도 커지고 편하고 예쁘고."},{name:"가느다란 끈 낮은 구두",essential:true,color:"메탈릭/튀는 색",tip:"청바지 격상시키고, 원피스 완성하고."}],accessories:[{name:"개성 있는 선글라스",essential:true,color:"두꺼운 뿔테 — 독특한 모양",tip:"선글라스 하나로 코디 완성! 얼굴의 액세서리."},{name:"체인 가방 (작은 것)",essential:true,color:"은색/금색",tip:"작지만 임팩트 있는 마무리."}]};

const W_ROMANTIC={tops:[{name:"자수 놓인 블라우스",essential:true,color:"흰색+색실 자수",tip:"사랑스러운 느낌의 대표 아이템. 청바지, 치마에 다."},{name:"레이스 달린 끈나시",essential:true,color:"벽돌색/갈색빨간",tip:"겉옷 안에 받쳐 입거나 단독으로."},{name:"넉넉한 린넨 셔츠",essential:true,color:"생지/미표백",tip:"걸쳐 입기, 허리 묶기, 바지에 넣기 다 가능."},{name:"앞 묶음 짧은 상의",essential:false,color:"겨자색/연두",tip:"높은 허리 치마나 바지와. 자연스러운 느낌."}],bottoms:[{name:"하이웨이스트 나팔 청바지",essential:true,color:"어두운/중간 워싱",tip:"다리가 길어 보이고 흐르는 느낌."},{name:"꽃무늬 긴 치마",essential:true,color:"여러 꽃무늬",tip:"이것만 입으면 눈에 띄어요. 심플 상의면 충분."},{name:"넉넉한 통 바지",essential:false,color:"올리브/벽돌색",tip:"따뜻한 날 바람 솔솔 대안."}],layers:[{name:"술 달린 기모노 (걸침옷)",essential:true,color:"무늬 또는 따뜻한 색",tip:"뭐든 위에 걸치면 분위기 완성."},{name:"뜨개 가디건 (얇은 것)",essential:true,color:"크림/여러 색",tip:"코디를 가리지 않는 가벼운 겉옷."}],shoes:[{name:"가죽 발목 부츠",essential:true,color:"갈색/밤색",tip:"원피스, 청바지, 치마에 필수."},{name:"엮은 슬리퍼 샌들",essential:true,color:"생지/갈색",tip:"따뜻한 날의 수공예 느낌."}],accessories:[{name:"엮은 크로스백 (어깨 가방)",essential:true,color:"생지/여러 색",tip:"양손 자유! 시장, 산책, 여행에."},{name:"겹겹이 목걸이",essential:true,color:"금색+청록/호박색 돌",tip:"사랑스러운 느낌의 시그니처."}]};

const W_PREPPY={tops:[{name:"단정한 남방셔츠",essential:true,color:"하늘색",tip:"니트 안에, 치노 바지와, 치마와 — 기본 중의 기본."},{name:"카라 반팔티 (폴로)",essential:true,color:"흰색/남색",tip:"면바지, 청바지, 테니스 치마와."},{name:"줄무늬 보트넥 티 (넓은 목)",essential:true,color:"남색/흰색 줄무늬",tip:"바다 느낌. 청바지부터 반바지까지."},{name:"파스텔 둥근목 반팔티",essential:false,color:"민트/분홍",tip:"자켓 안에 또는 흰 청바지와."}],bottoms:[{name:"면바지 (치노)",essential:true,color:"카키/낙타색",tip:"단정한 스타일의 핵심 바지."},{name:"어두운 일자 청바지",essential:true,color:"짙은 남색",tip:"격식 있는 데님. 자켓+단화와."},{name:"주름 테니스 치마",essential:false,color:"흰색/남색",tip:"카라티+이것 = 클래식 조합."}],layers:[{name:"면/린넨 자켓",essential:true,color:"남색",tip:"단정한 스타일의 아우터. 뭐든 위에."},{name:"V넥 면 스웨터",essential:true,color:"꽈배기 니트 크림/파스텔",tip:"남방 위에 겹쳐 입기."}],shoes:[{name:"가죽 단화 (페니로퍼)",essential:true,color:"밤색/버건디",tip:"면바지, 청바지, 치마 — 단정한 필수 신발."},{name:"깨끗한 흰색 가죽 운동화",essential:true,color:"흰색",tip:"스포티하면서 단정한."}],accessories:[{name:"가죽 벨트 (금색 버클)",essential:true,color:"밤색",tip:"코디 마무리의 핵심. 빼먹지 마세요!"},{name:"진주 귀걸이 또는 작은 금 고리",essential:true,color:"진주/금색",tip:"절제된 우아함. 매일 착용하기 좋아요."}]};

const M_CLASSIC={tops:[{name:"흰색 옥스포드 남방",essential:true,color:"흰색",tip:"넣어도, 소매 걷어도, 자켓 안에도. 필수!"},{name:"기본 둥근목 반팔티 (흰색)",essential:true,color:"흰색",tip:"기본 중의 기본. 2-3장."},{name:"기본 둥근목 반팔티 (남색)",essential:false,color:"남색",tip:"면바지, 청바지와."},{name:"단추 세 개 긴팔티 (헨리넥)",essential:false,color:"회색",tip:"반팔티보다 한 단계 위. 소매 걷으면 봄 느낌."}],bottoms:[{name:"짙은 색 일자 청바지",essential:true,color:"짙은 남색",tip:"편하게도 격식 있게도. 이거 하나면 충분."},{name:"면바지 (치노)",essential:true,color:"카키/모래색",tip:"출근, 데이트, 주말 — 만능."},{name:"면 반바지",essential:false,color:"남색/카키",tip:"따뜻한 날. 카라티나 반팔티와."}],layers:[{name:"면 자켓 (가벼운 정장)",essential:true,color:"남색",tip:"청바지+반팔티+이것 = 바로 업그레이드."},{name:"얇은 둥근목 니트",essential:true,color:"회색/낙타색",tip:"남방 위에 또는 단독으로. 봄 레이어링의 왕."},{name:"항공점퍼 / 블루종",essential:false,color:"올리브/남색",tip:"캐주얼 봄 아우터."}],shoes:[{name:"흰 가죽 운동화",essential:true,color:"흰색",tip:"면바지, 청바지, 자켓까지."},{name:"스웨이드 사막부츠",essential:true,color:"밝은 갈색",tip:"캐주얼과 격식 사이의 다리."}],accessories:[{name:"가죽 벨트",essential:true,color:"갈색",tip:"신발 색과 대충 맞추면 OK."},{name:"선글라스",essential:true,color:"호피/검정",tip:"기본 모양이 가장 오래가요."}]};

const M_CASUAL={tops:[{name:"부드러운 면 반팔티 (흰색)",essential:true,color:"흰색",tip:"편하고 부드러운 — 매일 입는 유니폼."},{name:"오픈카라 반팔 셔츠",essential:true,color:"연두/연파랑/무늬",tip:"편한 셔츠. 빼입고 자연스럽게."},{name:"린넨 반팔 셔츠",essential:true,color:"생지/연한 올리브",tip:"바람 솔솔. 바다에서 카페까지."},{name:"그림 반팔티 (빈티지)",essential:false,color:"자유",tip:"좋아하는 밴드, 복고풍 — 개성!"},{name:"부드러운 둥근목 맨투맨",essential:false,color:"회색/워싱 남색",tip:"깔끔한 편안함."}],bottoms:[{name:"편한 일자 청바지",essential:true,color:"밝은 워싱/연한 색",tip:"편하면서 의도적인 느낌."},{name:"허리끈 면바지",essential:true,color:"올리브/모래색",tip:"운동복의 편안함+바지의 외형."},{name:"수영겸용 반바지",essential:false,color:"남색/벽돌색",tip:"수영장, 바다, 그냥 놀 때."}],layers:[{name:"청자켓 (트러커)",essential:true,color:"중간 밝기",tip:"캐주얼 일등공신. 반팔티+청바지+이것, 영원히."},{name:"가벼운 후드 집업",essential:true,color:"짙은 회색/올리브",tip:"아침 달리기, 저녁 모닥불, 여행."},{name:"바람막이",essential:false,color:"남색/검정",tip:"비올 때 부담 없이."}],shoes:[{name:"복고풍 운동화",essential:true,color:"회색/남색+고무밑창",tip:"뉴발란스 느낌. 편하고 예쁘고."},{name:"편한 슬립온",essential:true,color:"생지/남색",tip:"힘 안 들이는 신발. 반바지와 반팔티에."}],accessories:[{name:"볼캡",essential:true,color:"워싱 데님/베이지",tip:"머리 안 감은 날 구세주 + 자외선 차단."},{name:"일상 선글라스",essential:true,color:"검정/호피",tip:"고민 말고 매일 쓰세요."}]};

const M_MINIMAL=M_CASUAL; // 남성 미니멀은 캐주얼과 유사하게 처리
const M_STREET={tops:[{name:"넉넉한 그림 반팔티",essential:true,color:"검정/흰색",tip:"스트릿의 기본. 레이어링 베이스."},{name:"워싱 맨투맨",essential:true,color:"빈티지 회색",tip:"격상된 편안함."},{name:"오픈카라 무늬 셔츠",essential:true,color:"대담한 무늬",tip:"눈에 띄는 포인트 아이템."},{name:"줄무늬 긴팔티",essential:false,color:"검정/흰색",tip:"레이어링의 핵심."}],bottoms:[{name:"통 넓은 카고 바지",essential:true,color:"검정/올리브",tip:"스트릿 핏. 주머니 활용."},{name:"일자 청바지",essential:true,color:"남색/검정",tip:"기본 데님."},{name:"나일론 트랙 바지",essential:false,color:"검정",tip:"운동+일상 겸용."}],layers:[{name:"넉넉한 청자켓",essential:true,color:"빈티지 워싱",tip:"패치나 핀으로 꾸미기."},{name:"테크 바람막이",essential:true,color:"검정+네온 포인트",tip:"기능성+스타일."}],shoes:[{name:"통굽 운동화",essential:true,color:"흰색/올블랙",tip:"키+존재감."},{name:"하이탑 운동화",essential:true,color:"검정/흰색",tip:"스트릿 클래식."}],accessories:[{name:"크로스백 (작은 어깨가방)",essential:true,color:"검정",tip:"작지만 필수."},{name:"비니 또는 벙거지",essential:true,color:"검정",tip:"모자로 마무리."}]};

const M_PREPPY={tops:[{name:"옥스포드 남방",essential:true,color:"하늘색",tip:"단정함의 기본. 니트 안에, 면바지와."},{name:"카라 반팔티 (폴로)",essential:true,color:"흰색/남색",tip:"면바지, 반바지와."},{name:"줄무늬 둥근목 티",essential:true,color:"남색/흰색",tip:"바다 느낌 터치."}],bottoms:[{name:"면바지 (치노)",essential:true,color:"카키",tip:"단정한 핵심."},{name:"짙은 일자 청바지",essential:true,color:"짙은 남색",tip:"격식 데님."},{name:"면 반바지",essential:false,color:"남색",tip:"따뜻한 날의 단정함."}],layers:[{name:"V넥 면 스웨터",essential:true,color:"크림/파스텔",tip:"남방 위에."},{name:"누빔 조끼",essential:false,color:"남색/짙은 초록",tip:"주말 활동적인 느낌."}],shoes:[{name:"가죽 단화",essential:true,color:"밤색/버건디",tip:"단정한 필수 신발."},{name:"흰 가죽 운동화",essential:true,color:"흰색",tip:"스포티하면서 깔끔."}],accessories:[{name:"가죽 벨트 (금색 버클)",essential:true,color:"밤색",tip:"코디 마무리."},{name:"기본 선글라스",essential:true,color:"호피",tip:"클래식 모양."}]};

const N_CLASSIC={tops:[{name:"편한 핏 남방셔츠",essential:true,color:"흰색",tip:"넣거나 빼거나 자유롭게."},{name:"기본 둥근목 반팔티 (2장)",essential:true,color:"흰색+검정",tip:"기본 중의 기본."},{name:"줄무늬 티",essential:true,color:"남색/흰색",tip:"누구에게나 어울리는 무늬."}],bottoms:[{name:"일자 청바지",essential:true,color:"중간 밝기",tip:"어떤 체형이든 잘 맞아요."},{name:"편한 면바지",essential:true,color:"카키/올리브",tip:"청바지보다 살짝 격식 있게."}],layers:[{name:"자켓",essential:true,color:"남색/짙은 회색",tip:"뭐든 업그레이드."},{name:"둥근목 니트",essential:true,color:"귀리색/회색",tip:"따뜻하면서 깔끔한 겉옷."}],shoes:[{name:"흰 가죽 운동화",essential:true,color:"흰색",tip:"뭐든 다 어울려요."},{name:"첼시 부츠 (옆에 고무밴드 부츠)",essential:true,color:"검정/갈색",tip:"당겨 신으면 끝. 깔끔하고 멋져요."}],accessories:[{name:"심플 가죽 가방",essential:true,color:"검정/갈색",tip:"크로스백 or 큰 가방. 로고 없이."},{name:"선글라스",essential:true,color:"검정/호피",tip:"기본 모양 — 누구에게나 어울려요."}]};

const CAPSULES={
  women:{classic:W_CLASSIC,casual:W_CASUAL,minimal:W_MINIMAL,street:W_STREET,romantic:W_ROMANTIC,preppy:W_PREPPY},
  men:{classic:M_CLASSIC,casual:M_CASUAL,minimal:M_MINIMAL,street:M_STREET,romantic:M_CLASSIC,preppy:M_PREPPY},
  neutral:{classic:N_CLASSIC,casual:N_CLASSIC,minimal:N_CLASSIC,street:N_CLASSIC,romantic:N_CLASSIC,preppy:N_CLASSIC}
};

const CATS={tops:{label:"상의",emoji:"👕"},bottoms:{label:"하의",emoji:"👖"},layers:{label:"겉옷/걸침옷",emoji:"🧥"},shoes:{label:"신발",emoji:"👟"},accessories:{label:"가방/액세서리",emoji:"👜"}};
const SHOP={budget:"다이소, 유니클로, 지그재그, 에이블리, 당근마켓에서 찾아보세요. 필수 아이템부터!",moderate:"무신사, COS, 에잇세컨즈, 자라 추천. 겉옷과 신발에 돈을 쓰세요!",premium:"마시모두띠, 이자벨마랑, 핸드메이드 브랜드. 소재에 집중: 울, 실크, 가죽이 오래가요."};
const COLD_ADD=[{name:"비니 (니트 모자)",color:"회색/검정",reason:"머리 따뜻하게. 스타일도 챙기고."},{name:"얇은 패딩 조끼",color:"남색/검정",reason:"몸통만 따뜻하게. 팔 자유롭게."},{name:"얇은 내복 상의",color:"검정",reason:"안 보이는 보온 레이어. 두껍지 않아요."}];
const WARM_ADD=[{name:"린넨(마) 소재로 교체",color:"흰색/생지",reason:"면 대신 린넨. 통기성이 핵심."},{name:"챙 넓은 모자",color:"밀짚/밝은 색",reason:"자외선 차단 + 멋."},{name:"땀 흡수 속옷",color:"살색",reason:"땀 방지. 겉옷에 땀 안 배게."}];

function getCapsule(g,s){const d=CAPSULES[g];if(!d)return CAPSULES.neutral.classic;return d[s]||d.classic;}
function countItems(c){return Object.values(c).reduce((s,items)=>s+items.length,0);}

export default function CapsuleWardrobeKR(){
  const[cl,sCl]=useState("");const[st,sSt]=useState("");const[bu,sBu]=useState("");const[ge,sGe]=useState("");
  const[show,sSh]=useState(false);const[owned,sO]=useState({});const[exp,sExp]=useState("tops");const ref=useRef(null);const pdfRef=useRef(null);
  const downloadPDF = (element, filename) => {
    import('html2pdf.js').then((html2pdfModule) => {
      const html2pdf = html2pdfModule.default;
      html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(element).save();
    });
  };
  const gen=()=>{sSh(true);sO({});sExp("tops");setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),150);};
  const tO=(k)=>sO(p=>({...p,[k]:!p[k]}));
  const cap=show?getCapsule(ge,st):null;const tot=cap?countItems(cap):0;const oc=Object.values(owned).filter(Boolean).length;
  const ok=cl&&st&&bu&&ge;

  return(<div style={{minHeight:"100vh",background:"linear-gradient(155deg,#fce4ec 0%,#fff3e0 25%,#fffde7 50%,#f3e5f5 80%,#e8eaf6 100%)",fontFamily:"'Noto Sans KR',sans-serif",overflow:"hidden"}}><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet"/>
  <div style={{maxWidth:780,margin:"0 auto",padding:"32px 20px",position:"relative",zIndex:1}}>
  <div style={{textAlign:"center",marginBottom:36}}><div style={{fontSize:44,marginBottom:8}}>👗🌸✨</div><h1 style={{fontFamily:"'Jua',cursive",fontSize:"clamp(26px,5vw,38px)",color:"#ad1457",margin:"0 0 8px"}}>봄 캡슐 옷장</h1><p style={{color:"#ec407a",fontSize:15,margin:0,fontWeight:600}}>적은 옷으로 더 많은 코디 — 믹스앤매치 옷장 만들기</p></div>

  <S n="1" t="봄 날씨?" c="#ad1457"><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{CLIMATES.map(x=>(<B key={x.id} a={cl===x.id} o={()=>sCl(x.id)} c="#ad1457"><div style={{fontSize:22}}>{x.emoji}</div><div style={{fontWeight:800,fontSize:13}}>{x.label}</div><div style={{fontSize:11,opacity:0.6}}>{x.desc}</div></B>))}</div></S>
  <S n="2" t="어떤 스타일?" c="#ad1457"><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>{STYLES.map(x=>(<B key={x.id} a={st===x.id} o={()=>sSt(x.id)} c="#ad1457"><div style={{fontSize:22}}>{x.emoji}</div><div style={{fontWeight:800,fontSize:13}}>{x.label}</div><div style={{fontSize:11,opacity:0.6}}>{x.desc}</div></B>))}</div></S>
  <S n="3" t="예산?" c="#ad1457">{BUDGETS.map(x=>(<B key={x.id} a={bu===x.id} o={()=>sBu(x.id)} c="#ad1457" w><span style={{fontSize:22,marginRight:12}}>{x.emoji}</span><div><div style={{fontWeight:800}}>{x.label} — {x.desc}</div><div style={{fontSize:12,opacity:0.65}}>~{x.per}</div></div></B>))}</S>
  <S n="4" t="누구를 위한 옷장?" c="#ad1457"><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{GENDER.map(x=>(<B key={x.id} a={ge===x.id} o={()=>sGe(x.id)} c="#ad1457"><div style={{fontSize:24}}>{x.emoji}</div><div style={{fontWeight:800,fontSize:13}}>{x.label}</div></B>))}</div></S>
  {ok&&<button onClick={gen} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#ad1457,#ec407a)",color:"#fff",fontFamily:"'Jua',cursive",fontSize:20,cursor:"pointer",marginBottom:24,boxShadow:"0 4px 20px rgba(173,20,87,0.3)"}}>👗 캡슐 옷장 만들기!</button>}

  {show&&cap&&<div ref={ref}><div ref={pdfRef}>
  <button
    onClick={() => downloadPDF(pdfRef.current, 'capsule-wardrobe.pdf')}
    style={{
      width: "100%",
      marginBottom: 16,
      padding: "14px",
      borderRadius: 14,
      border: "none",
      background: "linear-gradient(135deg, #ad1457, #ec407a)",
      color: "#fff",
      fontWeight: 800,
      fontSize: 15,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "transform 0.15s",
      boxShadow: "0 4px 15px rgba(173,20,87,0.3)",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    📥 PDF 다운로드
  </button>
  <div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"20px 24px",marginBottom:20,border:"2px solid #f8bbd0"}}>
  <div style={{display:"flex",justifyContent:"space-around",flexWrap:"wrap",gap:12,marginBottom:14}}><MS e="👕" v={tot} l="총 아이템"/><MS e="✅" v={oc} l="이미 있는 것"/><MS e="🛒" v={tot-oc} l="사야 할 것"/><MS e="🔄" v={`${Math.round(tot*(tot-1)*0.6)}+`} l="가능한 코디 수"/></div>
  <div style={{background:"#fce4ec",borderRadius:10,height:14,overflow:"hidden"}}><div style={{width:`${tot>0?(oc/tot)*100:0}%`,height:"100%",background:"linear-gradient(90deg,#ec407a,#ad1457)",borderRadius:10,transition:"width 0.4s"}}/></div>
  <p style={{textAlign:"center",fontSize:12,color:"#999",margin:"8px 0 0",fontWeight:600}}>이미 가진 옷을 체크하면 아래에 쇼핑 리스트가 나타나요!</p></div>

  {Object.entries(cap).map(([ck,items])=>{const m=CATS[ck];if(!m||!items?.length)return null;const isE=exp===ck;
  return(<div key={ck} style={{marginBottom:10}}><div onClick={()=>sExp(isE?null:ck)} style={{padding:"14px 18px",borderRadius:isE?"14px 14px 0 0":14,background:isE?"#fce4ec":"rgba(255,255,255,0.88)",border:isE?"2px solid #f48fb1":"2px solid rgba(173,20,87,0.06)",borderBottom:isE?"none":undefined,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:800,color:isE?"#ad1457":"#666",fontSize:16}}>{m.emoji} {m.label} ({items.length}개)</span><span style={{color:"#ccc",transform:isE?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</span></div>
  {isE&&<div style={{border:"2px solid #f48fb1",borderTop:"none",borderRadius:"0 0 14px 14px",padding:"14px 18px",background:"#fffafe"}}>{items.map((item,i)=>{const k=`${ck}-${i}`;const io=owned[k];
  return(<div key={i} style={{padding:"14px 16px",borderRadius:14,background:io?"#f3e5f5":"#fff",border:io?"2px solid #ce93d8":item.essential?"2px solid #f8bbd0":"2px solid #f0f0f0",marginBottom:8}}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{flex:1}}>
  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:800,color:io?"#999":"#333",fontSize:14,textDecoration:io?"line-through":"none"}}>{item.name}</span>{item.essential&&!io&&<span style={{fontSize:10,fontWeight:800,color:"#ad1457",background:"#fce4ec",padding:"2px 8px",borderRadius:6}}>필수</span>}</div>
  <div style={{fontSize:12,color:"#999",marginBottom:4}}><strong>색상:</strong> {item.color}</div>
  <div style={{fontSize:12,color:"#888"}}><strong>이렇게 입어요:</strong> {item.tip}</div></div>
  <button onClick={()=>tO(k)} style={{width:32,height:32,borderRadius:"50%",border:io?"2px solid #ab47bc":"2px dashed #e0e0e0",background:io?"#ab47bc":"#fff",color:io?"#fff":"#ddd",fontSize:14,fontWeight:800,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginLeft:12}}>{io?"✓":""}</button></div></div>)})}</div>}</div>)})}

  {(cl==="cold"||cl==="warm")&&<div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"22px",marginTop:16,border:"2px solid #f8bbd0"}}>
  <h3 style={{fontFamily:"'Jua',cursive",color:"#ad1457",margin:"0 0 12px",fontSize:18}}>{cl==="cold"?"🧣 쌀쌀한 봄에 추가하면 좋은 것":"☀️ 따뜻한 봄에 바꾸면 좋은 것"}</h3>
  <div style={{display:"flex",flexDirection:"column",gap:8}}>{(cl==="cold"?COLD_ADD:WARM_ADD).map((item,i)=>(
  <div key={i} style={{padding:"10px 14px",background:"#fce4ec",borderRadius:10,fontSize:13}}>
  <div style={{fontWeight:800,color:"#ad1457"}}>{item.name} <span style={{fontWeight:600,color:"#999"}}>— {item.color}</span></div>
  <div style={{color:"#888",marginTop:2}}>{item.reason}</div></div>))}</div></div>}

  <div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"22px",marginTop:16,border:"2px solid #e1bee7"}}><h3 style={{fontFamily:"'Jua',cursive",color:"#7b1fa2",margin:"0 0 12px",fontSize:18}}>💡 어디서 사면 좋을까?</h3><div style={{fontSize:13,color:"#555",lineHeight:1.8}}>{SHOP[bu]}</div></div>

  {oc>0&&tot-oc>0&&<div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"22px",marginTop:16,border:"2px solid #f48fb1"}}>
  <h3 style={{fontFamily:"'Jua',cursive",color:"#ad1457",margin:"0 0 4px",fontSize:18}}>🛒 쇼핑 리스트</h3>
  <p style={{color:"#999",fontSize:12,margin:"0 0 14px",fontWeight:600}}>아직 없는 아이템 {tot-oc}개 — 필수 아이템부터 사세요!</p>
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
  {Object.entries(cap).map(([ck,items])=>{const m=CATS[ck];if(!m||!items?.length)return null;
  const needItems=items.map((item,i)=>({...item,idx:i})).filter(item=>!owned[`${ck}-${item.idx}`]);
  if(needItems.length===0)return null;
  return(<div key={ck} style={{marginBottom:10}}>
  <div style={{fontSize:13,fontWeight:800,color:"#ad1457",marginBottom:6}}>{m.emoji} {m.label}</div>
  {needItems.map((item)=>(
  <div key={item.idx} style={{padding:"8px 12px",borderRadius:10,background:item.essential?"#fce4ec":"#fafafa",border:item.essential?"1.5px solid #f8bbd0":"1.5px solid transparent",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
  <div><span style={{fontSize:13,fontWeight:600,color:"#444"}}>{item.name}</span><span style={{fontSize:12,color:"#aaa",marginLeft:8}}>({item.color})</span></div>
  {item.essential&&<span style={{fontSize:10,fontWeight:800,color:"#ad1457",background:"#fce4ec",padding:"2px 8px",borderRadius:6}}>필수</span>}
  </div>))}</div>)})}
  </div></div>}

  {oc>0&&tot-oc===0&&<div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"22px",marginTop:16,border:"2px solid #c8e6c9",textAlign:"center"}}>
  <div style={{fontSize:28,marginBottom:8}}>🎉</div>
  <div style={{fontWeight:800,color:"#43a047",fontSize:16}}>와! 모든 아이템을 이미 가지고 계시네요!</div>
  <div style={{color:"#888",fontSize:13,marginTop:4}}>쇼핑 없이 바로 코디를 시작하세요!</div>
  </div>}

  </div></div>}

  <div style={{textAlign:"center",marginTop:48,padding:"20px 0",color:"#f48fb1",fontSize:13}}><div style={{fontSize:24,marginBottom:8}}>👗🌸✨</div>봄 캡슐 옷장 — 옷장 고민 없이, 매일 예쁘게!</div></div></div>);
}

function S({n,t,c,children}){return(<div style={{background:"rgba(255,255,255,0.85)",borderRadius:20,padding:"22px 24px",marginBottom:20,border:"2px solid rgba(173,20,87,0.08)"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}><div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${c},#ec407a)`,color:"#fff",fontWeight:800,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div><h3 style={{margin:0,color:c,fontWeight:800,fontSize:16}}>{t}</h3></div><div style={{display:"flex",flexDirection:"column",gap:10}}>{children}</div></div>);}
function B({a,o,children,c,w}){return(<button onClick={o} style={{padding:w?"14px 18px":"14px 10px",borderRadius:14,border:a?`2px solid ${c}`:"2px solid #e0e0e0",background:a?`${c}10`:"rgba(255,255,255,0.85)",color:a?c:"#777",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:w?"left":"center",display:w?"flex":"block",alignItems:"center"}}>{children}</button>);}
function MS({e,v,l}){return(<div style={{textAlign:"center",minWidth:70}}><div style={{fontSize:18}}>{e}</div><div style={{fontFamily:"'Jua',cursive",fontSize:20,color:"#ad1457"}}>{v}</div><div style={{fontSize:11,color:"#999",fontWeight:600}}>{l}</div></div>);}
