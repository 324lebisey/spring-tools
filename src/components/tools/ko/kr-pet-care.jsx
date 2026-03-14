'use client';

import { useState, useRef } from "react";
const PT=[{id:"dog",label:"강아지",emoji:"🐕"},{id:"cat",label:"고양이",emoji:"🐈"},{id:"both",label:"둘 다!",emoji:"🐾"}];
const DS=[{id:"small",label:"소형 (10kg 미만)",emoji:"🐕"},{id:"medium",label:"중형 (10-25kg)",emoji:"🦮"},{id:"large",label:"대형 (25kg+)",emoji:"🐕‍🦺"}];
const CT=[{id:"indoor",label:"실내만",emoji:"🏠"},{id:"outdoor",label:"실내+외출",emoji:"🌳"}];
const PET_REGIONS=[{id:"north",label:"북부 (강원/경기 북부)",emoji:"❄️",fleaStart:"4월",note:"늦은 봄부터 시작. 기온 10°C 넘으면 예방 시작!"},{id:"central",label:"중부 (서울/충청)",emoji:"🌤️",fleaStart:"3월",note:"3월부터 진드기 활동 시작. 미루지 마세요!"},{id:"south",label:"남부 (경상/전라)",emoji:"☀️",fleaStart:"2-3월",note:"따뜻한 남부는 이른 봄부터. 빨리 시작!"},{id:"jeju",label:"제주도",emoji:"🌺",fleaStart:"연중",note:"온난한 기후로 거의 연중 활동. 꾸준한 예방 필수!"}];
const CON=[{id:"fleas",label:"벼룩/진드기",emoji:"🪲"},{id:"allergies",label:"알레르기",emoji:"🤧"},{id:"shedding",label:"털빠짐",emoji:"🧶"},{id:"weight",label:"체중관리",emoji:"⚖️"},{id:"senior",label:"노령견/묘",emoji:"🩶"},{id:"anxiety",label:"불안/스트레스",emoji:"⛈️"}];
const VET_DOG=[{task:"연간 건강검진 예약 (봄에 하면 여름 여행 전 완료!)",emoji:"🩺",hi:true},{task:"광견병 접종 확인/갱신",emoji:"💉",hi:true},{task:"DHPPL (종합백신) 부스터 확인",emoji:"💉",hi:true},{task:"심장사상충 검사 (연 1회 혈액검사)",emoji:"🩸",hi:true},{task:"심장사상충 예방약 시작/갱신",emoji:"💊",hi:true},{task:"분변검사 (내부기생충)",emoji:"🔬",hi:false},{task:"외부기생충 예방약 상담 (프론트라인/넥스가드 등)",emoji:"🪲",hi:true},{task:"마이크로칩 정보 업데이트 (이사/번호 변경 시)",emoji:"📡",hi:false},{task:"치석제거/구강검진 고려",emoji:"🦷",hi:false}];
const VET_CAT=[{task:"연간 건강검진 예약",emoji:"🩺",hi:true},{task:"광견병 접종 확인",emoji:"💉",hi:true},{task:"FVRCP (종합백신) 확인",emoji:"💉",hi:true},{task:"분변검사 (특히 외출 고양이)",emoji:"🔬",hi:false},{task:"벼룩 예방 상담 — 실내 고양이도 걸려요!",emoji:"🪲",hi:true},{task:"구강검진 — 봄에 스케일링 추천",emoji:"🦷",hi:false},{task:"마이크로칩 정보 업데이트",emoji:"📡",hi:false},{task:"7세 이상 고양이: 혈액검사 패널",emoji:"🩸",hi:false}];
const GROOM_DOG={small:[{task:"전문 미용 예약 — 겨울 털 제거",emoji:"✂️",time:"지금"},{task:"매일 브러싱 (환절기 2-4주)",emoji:"🪮",time:"매일"},{task:"봄 샴푸로 목욕",emoji:"🛁",time:"이번 주"},{task:"발톱 깎기 — 따뜻해지면 더 빨리 자라요",emoji:"💅",time:"2-3주마다"},{task:"귀 청소 — 봄비로 습기 주의",emoji:"👂",time:"매주"},{task:"발바닥 체크 — 겨울 제설제 손상 확인",emoji:"🐾",time:"지금"}],medium:[{task:"언더코트 빗질 — 퍼미네이터 또는 슬리커",emoji:"🪮",time:"주 2-3회"},{task:"털빠짐 전용 샴푸로 목욕",emoji:"🛁",time:"이번 주"},{task:"이중모 품종이면 전문 미용 예약",emoji:"✂️",time:"예약"},{task:"발톱 깎기",emoji:"💅",time:"2-3주마다"},{task:"귀 청소 — 처진 귀 특히 주의",emoji:"👂",time:"매주"},{task:"핫스팟/건조 피부 확인",emoji:"🔍",time:"지금"},{task:"발바닥 털 정리",emoji:"🐾",time:"지금"}],large:[{task:"대대적 언더코트 빗질 시작!",emoji:"🪮",time:"주 2-3회, 한 달간"},{task:"대형견 미용 전문점 예약",emoji:"✂️",time:"예약"},{task:"야외 목욕 (따뜻하면) — 털빠짐 샴푸",emoji:"🛁",time:"이번 주"},{task:"발톱 깎기 — 대형견은 더 어려우니 미루지 말기",emoji:"💅",time:"2-3주마다"},{task:"귀 청소 — 대형견 귀 감염 주의",emoji:"👂",time:"매주"},{task:"관절 영양제 — 봄 운동량 증가 대비",emoji:"💪",time:"수의사 상담"}]};
const GROOM_CAT={indoor:[{task:"매일 브러싱 (봄 털갈이 — 실내 고양이도!)",emoji:"🪮",time:"매일 4-6주"},{task:"발톱 깎기 — 실내 고양이는 자연 마모 안 됨",emoji:"💅",time:"2주마다"},{task:"헤어볼 예방 — 식이섬유 보충 또는 헤어볼 간식",emoji:"🧶",time:"매일"},{task:"귀 청소",emoji:"👂",time:"월 1회"},{task:"치아 관리 — 양치 또는 덴탈 간식",emoji:"🦷",time:"매일"}],outdoor:[{task:"매일 꼼꼼한 브러싱 — 이물질 제거",emoji:"🪮",time:"매일"},{task:"외출 후 진드기 전신 체크",emoji:"🔍",time:"매번 귀가 시"},{task:"귀 진드기/이물질 확인",emoji:"👂",time:"매주"},{task:"상처, 물린 자국 확인",emoji:"🩹",time:"매주"},{task:"벼룩빗으로 확인 — 벼룩 분변 체크",emoji:"🪲",time:"매주"}]};
const HOME_DOG=[{task:"반려견 침구, 담요 전체 세탁",emoji:"🛏️"},{task:"장난감 세탁 — 봉제는 세탁기, 고무는 식기세척기",emoji:"🧸"},{task:"밥그릇, 물그릇 소독",emoji:"🥣"},{task:"집 전체 청소기 — 가구 밑, 소파 뒤 (털!)",emoji:"🧹"},{task:"마당/베란다에 독성 식물 확인 (백합, 철쭉, 튤립, 수선화)",emoji:"🌷"},{task:"베란다/발코니 안전 확인 — 탈출 방지",emoji:"🏡"},{task:"겨울에 놓은 쥐약/덫 제거",emoji:"⚠️"},{task:"잔디 화학약품 반려동물 안전 확인",emoji:"🧪"},{task:"목줄, 하네스, 인식표 상태 점검",emoji:"🦺"},{task:"인식표 정보 업데이트",emoji:"🏷️"},{task:"간식, 배변봉투, 예방약 시즌 물량 비축",emoji:"🛒"}];
const HOME_CAT=[{task:"화장실 대청소 — 완전 세척, 새 모래",emoji:"🧹"},{task:"캣타워, 침구 세탁",emoji:"🛏️"},{task:"밥그릇, 물그릇/자동급수기 소독",emoji:"🥣"},{task:"집 전체 고양이 구역 청소",emoji:"🧹"},{task:"방충망 점검! 창문 열면 고양이가 테스트해요",emoji:"🪟"},{task:"독성 실내식물 확인/치우기 (백합은 고양이에게 치명적!)",emoji:"🌺"},{task:"스크래처 점검 — 닳았으면 교체",emoji:"🪵"},{task:"장난감 점검 — 손상되거나 작은 부품 있는 것 교체",emoji:"🧸"},{task:"모래, 사료, 벼룩 예방약 비축",emoji:"🛒"},{task:"볕 잘 드는 창가에 캣워크/선반 설치 — 봄 햇살 선물!",emoji:"☀️"}];
const CONCERN_TASKS={fleas:{title:"🪲 벼룩/진드기 예방",tasks:["예방 방법 선택: 경구(넥스가드), 바르는약(프론트라인), 목걸이 — 수의사 상담","매월 투약/도포 리마인더 설정 — 꾸준함이 전부","산책 후 매번 진드기 체크 (특히 귀 뒤, 겨드랑이, 발가락 사이)","진드기 제거법: 핀셋으로 수직 당기기, 소독","마당/베란다: 풀 짧게, 낙엽 치우기","반려동물 침구 매주 뜨거운 물 세탁","청소기 자주 — 벼룩 알은 카펫과 가구에 숨어요","벼룩 1마리 발견 = 즉시 전체 처리 (수백 마리가 되기 전에!)"]},
allergies:{title:"🤧 반려동물 알레르기",tasks:["증상 관찰: 과도한 긁기, 발 핥기, 귀 감염, 눈물","산책 후 발바닥 젖은 수건으로 닦기","1-2주에 한 번 저자극 샴푸 목욕","수의사와 항히스타민제 상담 (셀프 투약 금지!)","꽃가루 많은 날 창문 닫기 — 반려동물도 꽃가루 알레르기!","침구 자주 세탁","침실에 공기청정기 고려","증상 기록 — 수의사가 패턴 파악하는 데 도움"]},
shedding:{title:"🧶 털빠짐 서바이벌",tasks:["봄 '코트 블로우' 동안 매일 브러싱 — 하루 10분이 청소기 시간 절약","퍼미네이터, 언더코트 레이크, 슬리커 브러시 투자","전문 미용 — 털빠짐 전문 세션 예약","오메가3 지방산 보충 (피쉬오일) — 과도한 털빠짐 감소","주 2-3회 이상 청소기","돌돌이 필수 — 현관, 차, 직장에!","가구에 세탁 가능한 커버 씌우기","이중모 품종 절대 밀지 마세요 — 영구적 코트 손상!"]},
weight:{title:"⚖️ 봄 체중 관리",tasks:["체중 측정 — 갈비뼈 쉽게 만져지지 않으면 조절 시기","운동 점진적 증가 (갑자기 무리하지 말기)","간식 칼로리 줄이기 — 하루 칼로리의 10% 이내","사료 실제 계량컵으로 측정 — 눈대중은 과식!","강아지 저칼로리 간식: 당근, 사과, 얼린 블루베리","고양이: 놀이 시간 15-20분 하루 2회로 증가","퍼즐 피더로 느리게 먹기 + 두뇌 자극","수의사와 이상 체중, 칼로리 목표 상담"]},
senior:{title:"🩶 노령 반려동물 봄 케어",tasks:["시니어 건강검진 예약 (혈액검사, 소변검사)","관절 영양제: 글루코사민, 콘드로이틴, 피쉬오일 — 수의사와 용량 상담","운동 천천히 시작 — 뻣뻣한 관절에 부드러운 워밍업","정형외과 침대 제공 — 노화된 관절 지지","발톱 짧게 — 긴 발톱은 관절에 부담","구강검진 필수 — 노령 반려동물 치아 질환 악화","변화 관찰: 수면 증가, 식욕 감소, 계단 어려움","미끄럼 방지 매트 — 노령 반려동물은 쉽게 미끄러져요"]},
anxiety:{title:"⛈️ 불안/스트레스 관리",tasks:["안전한 공간 만들기: 내부 방, 담요 덮은 크레이트","진정 보조제: 썬더셔츠, 진정 간식, 페로몬 디퓨저 (어댑틸/펠리웨이)","폭풍 소리 둔감화: 지금부터 작은 볼륨으로 틀고 보상 (폭풍 시즌 전에!)","심한 경우 수의사와 항불안 약물 상담","폭풍 시 커튼 닫고 백색소음/차분한 음악 틀기","불안 행동 벌주지 마세요 — 더 심해져요","당신이 먼저 차분하게 — 반려동물은 당신의 불안을 감지해요","예상되는 폭풍 전 운동시키기 — 피곤한 반려동물이 스트레스 더 잘 견뎌요"]}};
const ACT_DOG=[{w:"1-2주차",act:"짧은 산책 (15-20분), 가벼운 놀이",note:"겨울 근육 뻣뻣해요 — 서서히!"},{w:"3-4주차",act:"보통 산책 (25-35분), 가벼운 공놀이",note:"체력 회복 중"},{w:"5-6주차",act:"정상 산책 (30-45분), 강아지 공원",note:"더워지면 물 꼭 챙기기!"},{w:"7주차+",act:"풀 활동: 하이킹, 달리기, 수영",note:"뜨거운 아스팔트 주의! 손등으로 체크."}];
const ACT_CAT=[{w:"상시",act:"인터랙티브 놀이 15-20분 × 하루 2회",note:"깃털 낚시, 레이저, 공"},{w:"상시",act:"장난감 주 1회 로테이션",note:"고양이는 금방 싫증 — 새로움이 핵심!"},{w:"봄 특별",act:"방충망 확인 후 창문 개방 — 새 구경!",note:"정신적 자극 = 행복한 고양이"},{w:"봄 특별",act:"감독 하에 야외 시간 또는 캣티오",note:"하네스 훈련도 가능한 고양이 있어요!"}];
export default function PetCareKR(){const[pt,sP]=useState("");const[ds,sDS]=useState("");const[ct,sCT]=useState("");const[petRegion,sPR]=useState("");const[con,sCon]=useState([]);const[plan,sPl]=useState(false);const[ch,sCh]=useState({});const[exp,sExp]=useState({});const ref=useRef(null);
const tCon=(id)=>sCon(p=>p.includes(id)?p.filter(c=>c!==id):[...p,id]);const tCh=(k)=>sCh(p=>({...p,[k]:!p[k]}));
const hasDog=pt==="dog"||pt==="both";const hasCat=pt==="cat"||pt==="both";
const ok=pt&&petRegion&&(hasDog?ds:true)&&(hasCat?ct:true);
const fleaData=PET_REGIONS.find(r=>r.id===petRegion)||PET_REGIONS[1];
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
const gen=()=>{sPl(true);sCh({});sExp({"vet": true});setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth"}),150);};
let tot=0;const cnt=(items)=>{tot+=items.length;};
if(plan){if(hasDog){cnt(VET_DOG);cnt(GROOM_DOG[ds]||[]);cnt(HOME_DOG);}if(hasCat){cnt(VET_CAT);cnt(GROOM_CAT[ct]||[]);cnt(HOME_CAT);}con.forEach(c=>{if(CONCERN_TASKS[c])cnt(CONCERN_TASKS[c].tasks);});}
const dc=Object.values(ch).filter(Boolean).length;
return(<div style={{minHeight:"100vh",background:"linear-gradient(160deg,#fff3e0 0%,#fffde7 25%,#e8f5e9 50%,#e0f7fa 80%,#fce4ec 100%)",fontFamily:"'Noto Sans KR',sans-serif",overflow:"hidden"}}><link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet"/>
<div style={{maxWidth:780,margin:"0 auto",padding:"32px 20px",position:"relative",zIndex:1}}>
<div style={{textAlign:"center",marginBottom:36}}><div style={{fontSize:44,marginBottom:8}}>🐾🌸💕</div><h1 style={{fontFamily:"'Jua',cursive",fontSize:"clamp(26px,5vw,38px)",color:"#6d4c41",margin:"0 0 8px"}}>반려동물 봄 케어 체크리스트</h1><p style={{color:"#a1887f",fontSize:15,margin:0,fontWeight:600}}>우리 아이가 건강하게 봄을 맞이할 수 있도록!</p></div>
<S n="1" t="누가 있나요?" c="#6d4c41"><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{PT.map(x=>(<B key={x.id} a={pt===x.id} o={()=>sP(x.id)} c="#6d4c41"><div style={{fontSize:28}}>{x.emoji}</div><div style={{fontWeight:800,fontSize:13}}>{x.label}</div></B>))}</div></S>
{hasDog&&<S n="2a" t="강아지 크기?" c="#6d4c41"><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{DS.map(x=>(<B key={x.id} a={ds===x.id} o={()=>sDS(x.id)} c="#6d4c41"><div style={{fontSize:22}}>{x.emoji}</div><div style={{fontWeight:700,fontSize:11}}>{x.label}</div></B>))}</div></S>}
{hasCat&&<S n={hasDog?"2b":"2"} t="실내? 외출?" c="#6d4c41"><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{CT.map(x=>(<B key={x.id} a={ct===x.id} o={()=>sCT(x.id)} c="#6d4c41"><div style={{fontSize:22}}>{x.emoji}</div><div style={{fontWeight:800,fontSize:13}}>{x.label}</div></B>))}</div></S>}
<S n="3" t="어디에 사시나요?" c="#6d4c41"><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>{PET_REGIONS.map(x=>(<B key={x.id} a={petRegion===x.id} o={()=>sPR(x.id)} c="#6d4c41"><div style={{fontSize:22}}>{x.emoji}</div><div style={{fontWeight:800,fontSize:12}}>{x.label}</div></B>))}</div></S>
<S n="4" t="특별히 걱정되는 것?" c="#6d4c41" su="해당하는 것 모두 선택"><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10}}>{CON.map(x=>(<B key={x.id} a={con.includes(x.id)} o={()=>tCon(x.id)} c="#6d4c41"><span style={{fontSize:20,marginRight:4}}>{x.emoji}</span><span style={{fontWeight:700,fontSize:12}}>{x.label}</span></B>))}</div></S>
{ok&&<button onClick={gen} style={{width:"100%",padding:"16px",borderRadius:16,border:"none",background:"linear-gradient(135deg,#6d4c41,#a1887f)",color:"#fff",fontFamily:"'Jua',cursive",fontSize:20,cursor:"pointer",marginBottom:24,boxShadow:"0 4px 20px rgba(109,76,65,0.3)"}}>🐾 케어 플랜 만들기!</button>}
{plan&&<div ref={ref}>
<button
  onClick={() => downloadPDF(ref.current, 'pet-care-plan.pdf')}
  style={{
    width: "100%",
    marginBottom: 16,
    padding: "14px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #6d4c41, #a1887f)",
    color: "#fff",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "transform 0.15s",
    boxShadow: "0 4px 15px rgba(109,76,65,0.3)",
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  📥 PDF 다운로드
</button>
<div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"20px 24px",marginBottom:20,border:"2px solid #d7ccc8"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontWeight:800,color:"#6d4c41",fontSize:14}}>진행률: {dc}/{tot}개</span><span style={{fontSize:12,color:"#aaa"}}>{tot>0?Math.round((dc/tot)*100):0}%</span></div><div style={{background:"#efebe9",borderRadius:10,height:14,overflow:"hidden"}}><div style={{width:`${tot>0?(dc/tot)*100:0}%`,height:"100%",background:dc===tot&&tot>0?"linear-gradient(90deg,#66bb6a,#43a047)":"linear-gradient(90deg,#a1887f,#6d4c41)",borderRadius:10,transition:"width 0.4s"}}/></div>{dc===tot&&tot>0&&<div style={{textAlign:"center",marginTop:10,fontSize:16,fontWeight:800,color:"#43a047"}}>🎉 완료! 최고의 반려인이에요! 🏆</div>}</div>

<div style={{background:"#fff8e1",border:"2px solid #ffe082",borderRadius:16,padding:"16px 20px",marginBottom:20,display:"flex",alignItems:"flex-start",gap:12}}><span style={{fontSize:24}}>🪲</span><div><div style={{fontWeight:800,color:"#f9a825",fontSize:15}}>벼룩/진드기 예방 시작: {fleaData.fleaStart}</div><div style={{fontSize:13,color:"#f57f17"}}>{fleaData.note}</div></div></div>
{[...(hasDog?[{id:"vet-dog",title:"🩺 수의사 체크 — 강아지",items:VET_DOG}]:[]),...(hasCat?[{id:"vet-cat",title:"🩺 수의사 체크 — 고양이",items:VET_CAT}]:[]),...(hasDog?[{id:"groom-dog",title:"✂️ 그루밍 — 강아지",items:GROOM_DOG[ds]||[]}]:[]),...(hasCat?[{id:"groom-cat",title:"✂️ 그루밍 — 고양이",items:GROOM_CAT[ct]||[]}]:[]),...(hasDog?[{id:"home-dog",title:"🏠 집/환경 준비 — 강아지",items:HOME_DOG}]:[]),...(hasCat?[{id:"home-cat",title:"🏠 집 준비 — 고양이",items:HOME_CAT}]:[]),...con.filter(c=>CONCERN_TASKS[c]).map(c=>({id:`c-${c}`,title:CONCERN_TASKS[c].title,items:CONCERN_TASKS[c].tasks.map(t=>({task:t,emoji:"→"}))}))].map(sec=>{const isE=!!exp[sec.id];const sd=sec.items.filter((_,i)=>ch[`${sec.id}-${i}`]).length;
return(<div key={sec.id} style={{marginBottom:8}}><div onClick={()=>sExp(prev=>({...prev,[sec.id]:!prev[sec.id]}))} style={{padding:"14px 18px",borderRadius:isE?"14px 14px 0 0":14,background:isE?"#efebe9":"rgba(255,255,255,0.88)",border:isE?"2px solid #bcaaa4":"2px solid rgba(109,76,65,0.06)",borderBottom:isE?"none":undefined,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:800,color:isE?"#5d4037":"#666",fontSize:15}}>{sec.title}</span><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,color:"#bbb",fontWeight:700}}>{sd}/{sec.items.length}</span><span style={{color:"#ccc",transform:isE?"rotate(180deg)":"rotate(0)",transition:"transform 0.2s"}}>▼</span></div></div>
{isE&&<div style={{border:"2px solid #bcaaa4",borderTop:"none",borderRadius:"0 0 14px 14px",padding:"14px 18px",background:"#faf8f6"}}>{sec.items.map((item,i)=>{const k=`${sec.id}-${i}`;const d=ch[k];const t=typeof item==="string"?item:item.task;const em=typeof item==="string"?"→":(item.emoji||"→");const ti=item.time;const hi=item.hi;
return(<div key={i} onClick={()=>tCh(k)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:10,background:d?"#e8f5e9":"#fff",cursor:"pointer",marginBottom:4,border:d?"1.5px solid #a5d6a7":hi?"1.5px solid #ffcc80":"1.5px solid transparent"}}><div style={{width:20,height:20,borderRadius:5,border:d?"2px solid #66bb6a":"2px solid #ddd",background:d?"#66bb6a":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#fff",fontWeight:800,flexShrink:0}}>{d?"✓":""}</div><div style={{flex:1}}><span style={{fontSize:13,color:d?"#999":"#444",textDecoration:d?"line-through":"none",fontWeight:d?400:600,lineHeight:1.5}}>{em!=="→"&&<span style={{marginRight:6}}>{em}</span>}{t}</span>{ti&&<div style={{fontSize:11,color:"#aaa",marginTop:2}}>⏰ {ti}</div>}</div>{hi&&!d&&<span style={{fontSize:10,fontWeight:800,color:"#e65100",background:"#fff3e0",padding:"2px 8px",borderRadius:6,flexShrink:0}}>중요</span>}</div>)})}</div>}</div>)})}
<div style={{background:"rgba(255,255,255,0.9)",borderRadius:18,padding:"22px",marginTop:16,border:"2px solid #d7ccc8"}}><h3 style={{fontFamily:"'Jua',cursive",color:"#6d4c41",margin:"0 0 14px",fontSize:18}}>🏃 봄 활동량 늘리기</h3>
{hasDog&&<div style={{marginBottom:hasCat?16:0}}>{hasCat&&<div style={{fontWeight:800,color:"#8d6e63",fontSize:13,marginBottom:8}}>🐕 강아지:</div>}{ACT_DOG.map((w,i)=>(<div key={i} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:i<ACT_DOG.length-1?"1px solid #f0ebe8":"none"}}><span style={{fontWeight:800,color:"#6d4c41",fontSize:13,minWidth:80}}>{w.w}</span><div><div style={{fontSize:13,fontWeight:700,color:"#555"}}>{w.act}</div><div style={{fontSize:12,color:"#aaa"}}>{w.note}</div></div></div>))}</div>}
{hasCat&&<div>{hasDog&&<div style={{fontWeight:800,color:"#8d6e63",fontSize:13,marginBottom:8}}>🐈 고양이:</div>}{ACT_CAT.map((w,i)=>(<div key={i} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:i<ACT_CAT.length-1?"1px solid #f0ebe8":"none"}}><span style={{fontWeight:800,color:"#6d4c41",fontSize:13,minWidth:80}}>{w.w}</span><div><div style={{fontSize:13,fontWeight:700,color:"#555"}}>{w.act}</div><div style={{fontSize:12,color:"#aaa"}}>{w.note}</div></div></div>))}</div>}</div>
</div>}
<div style={{textAlign:"center",marginTop:48,padding:"20px 0",color:"#bcaaa4",fontSize:13}}><div style={{fontSize:24,marginBottom:8}}>🐾🌸💕</div>반려동물 봄 케어 — 행복한 반려생활, 건강한 봄!</div></div></div>);}
function S({n,t,su,c,children}){return(<div style={{background:"rgba(255,255,255,0.85)",borderRadius:20,padding:"22px 24px",marginBottom:20,border:"2px solid rgba(109,76,65,0.08)"}}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:su?4:14}}><div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${c},#a1887f)`,color:"#fff",fontWeight:800,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{n}</div><h3 style={{margin:0,color:c,fontWeight:800,fontSize:16}}>{t}</h3></div>{su&&<p style={{margin:"0 0 14px 38px",fontSize:12,color:"#aaa",fontWeight:600}}>{su}</p>}{children}</div>);}
function B({a,o,children,c}){return(<button onClick={o} style={{padding:"14px 10px",borderRadius:14,border:a?`2px solid ${c}`:"2px solid #e0e0e0",background:a?`${c}10`:"rgba(255,255,255,0.85)",color:a?c:"#777",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",textAlign:"center"}}>{children}</button>);}
