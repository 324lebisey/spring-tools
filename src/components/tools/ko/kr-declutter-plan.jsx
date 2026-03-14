'use client';

import { useState, useRef } from "react";

const ROOMS = [
  { id: "bedroom", name: "침실", emoji: "🛏️" },
  { id: "closet", name: "옷장/드레스룸", emoji: "👗" },
  { id: "kitchen", name: "주방", emoji: "🍳" },
  { id: "bathroom", name: "화장실", emoji: "🚿" },
  { id: "living", name: "거실", emoji: "🛋️" },
  { id: "study", name: "서재/작업실", emoji: "💼" },
  { id: "kids", name: "아이 방", emoji: "🧸" },
  { id: "veranda", name: "베란다/다용도실", emoji: "🌿" },
  { id: "entrance", name: "현관/신발장", emoji: "🚪" },
  { id: "storage", name: "창고/수납공간", emoji: "📦" },
];

const TIME_OPTIONS = [
  { id: "15", label: "15분/일", emoji: "⚡", desc: "짧은 시간 조금씩" },
  { id: "30", label: "30분/일", emoji: "🕐", desc: "꾸준히 정리" },
  { id: "60", label: "1시간/일", emoji: "💪", desc: "확실하게" },
  { id: "120", label: "2시간+/일", emoji: "🔥", desc: "올인!" },
];

const CLUTTER_LEVELS = [
  { id: "light", label: "가벼움", emoji: "🌤️", desc: "대체로 정돈, 약간의 튜닝 필요", mult: 0.6 },
  { id: "moderate", label: "보통", emoji: "⛅", desc: "물건이 쌓여있고 서랍이 꽉 참", mult: 1.0 },
  { id: "heavy", label: "심각", emoji: "🌧️", desc: "어디서부터 시작해야 할지 모르겠음", mult: 1.5 },
];

const ROOM_TASKS = {
  bedroom: { zones: [
    { name: "침대 주변", tasks: ["협탁 위 모든 물건 꺼내기", "매일 쓰는 것만 남기기 (충전기, 조명, 책 1권)", "쓰레기, 영수증, 오래된 물건 버리기", "협탁 서랍: 취침 필수품만 남기기", "표면 닦고 물건 되돌려놓기"] },
    { name: "침대 밑", tasks: ["침대 밑 모든 물건 꺼내기", "보관/기부/버리기로 분류", "침대 밑 청소기 돌리기", "의도적인 수납만 되돌려놓기 (뚜껑 있는 수납함)", "있는 줄도 몰랐던 물건은 기부하세요"] },
    { name: "서랍장", tasks: ["서랍 하나씩 침대 위에 비우기", "얼룩진 것, 찢어진 것, 안 맞는 것 제거", "남은 옷 정리해서 다시 넣기 (곤마리 접기 추천)", "서랍장 위는 2-3개 물건만", "모든 서랍 반복"] },
  ]},
  closet: { zones: [
    { name: "걸린 옷", tasks: ["옷걸이 모두 한 방향으로 돌리기 (옷걸이 트릭 시작!)", "12개월 이상 안 입은 옷 빼기", "안 맞는 옷 솔직하게 빼기", "손상된 옷, 변색된 옷 제거", "종류별 정리: 상의, 하의, 원피스, 외투"] },
    { name: "선반/접힌 옷", tasks: ["선반 위 모든 물건 내리기", "보관/기부/버리기 분류", "깔끔하게 재정리", "비시즌 옷 따로 보관 (압축팩 추천)", "자주 쓰는 것을 눈높이에"] },
    { name: "신발/액세서리", tasks: ["신발 모두 꺼내기", "불편한 것, 닳은 것, 1년 이상 안 신은 것 버리기", "짝 없는 신발 처분", "액세서리 정리: 벨트, 스카프, 모자", "수납함이나 문 뒤 정리함 활용"] },
  ]},
  kitchen: { zones: [
    { name: "조리대", tasks: ["조리대 위 모든 물건 치우기", "매일 쓰는 가전만 되돌리기 (커피머신, 밥솥)", "가끔 쓰는 가전은 수납장 안으로", "장식품 중 기름때 잘 타는 것 치우기", "깨끗한 조리대를 즐기기!"] },
    { name: "식료품/팬트리", tasks: ["식료품 전부 꺼내기", "유통기한 확인 — 지난 것 바로 버리기", "중복 제품 합치기 (쌀 3봉지 → 1개로)", "종류별 정리: 양념, 통조림, 간식, 곡물", "투명 용기 활용하면 한눈에 보임"] },
    { name: "수납장/식기", tasks: ["수납장마다 열어서 실제로 쓰는 것 확인", "이 빠진 컵, 짝 없는 뚜껑, 1회용 도구 제거", "자주 쓰는 식기 앞에, 명절 그릇 뒤에", "'다시 살 의향이 있나?' 테스트: 아니면 기부", "밀폐용기 — 뚜껑과 본체 매칭, 고아는 버리기"] },
    { name: "싱크대 밑/잡동사니 서랍", tasks: ["싱크대 밑 모든 물건 꺼내기", "오래된 수세미, 유통기한 지난 세제 버리기", "작은 수납함으로 정리", "잡동사니 서랍: 완전히 비우기", "남길 것: 가위, 테이프, 펜. 나머지: 버리기"] },
  ]},
  bathroom: { zones: [
    { name: "세면대/수납장", tasks: ["약장/수납장 모든 물건 꺼내기", "유통기한 확인 — 약, 화장품 모두!", "다 쓴 것, 거의 빈 것, 오래된 것 버리기", "세면대 위는 필수품만: 비누, 칫솔꽂이", "선반 닦고 다시 정리"] },
    { name: "샤워/욕조", tasks: ["샤워 부스 안 모든 용기 꺼내기", "거의 빈 것, 안 쓰는 것 버리기", "실제로 쓰는 것만 남기기 — 최대 4-5개", "샤워 선반 청소", "수건, 샤워볼 교체 필요한 것 교체"] },
    { name: "수건/린넨", tasks: ["수건, 세면타월 모두 꺼내기", "1인당 대형 수건 2장 + 핸드타월 2-3장만 남기기", "오래되고 낡은 수건은 기부 (유기견 보호소에서 좋아해요!)", "깔끔하게 접어서 종류별 정리", "여분은 별도 수납"] },
  ]},
  living: { zones: [
    { name: "테이블/표면", tasks: ["거실 테이블 위 모든 물건 치우기", "최대 2-3개만 남기기: 화분, 리모컨 수납, 캔들", "리모컨, 잡지 등 정리", "사이드 테이블, 콘솔도 동일하게", "평평한 표면은 잡동사니 자석 — 적을수록 좋아요"] },
    { name: "TV/오디오 영역", tasks: ["케이블 정리 (케이블타이 활용)", "안 쓰는 DVD, 게임기 정리", "전자기기 먼지 닦기", "리모컨 통합 — 정말 4개 다 필요한가요?", "TV 선반 위 잡동사니 치우기"] },
    { name: "책장/수납", tasks: ["책 모두 내려서 선반 먼지 제거", "책 정리: 좋아하는 것만 남기고 기부", "소품 큐레이션 — 덜 채운 선반이 더 예뻐요", "하나 들이면 하나 내보내기 규칙 적용", "색상 또는 크기별 정리"] },
    { name: "소파/숨은 공간", tasks: ["쿠션 사이, 밑 확인 (보물찾기!)", "가구 뒤, 구석 숨은 물건 꺼내기", "담요, 쿠션은 2-3개만", "소파 밑 청소기", "수납 오토만 있다면 안도 정리"] },
  ]},
  study: { zones: [
    { name: "책상 위", tasks: ["책상 위 모든 물건 치우기", "깨끗한 책상 잠시 즐기기", "되돌릴 것: 컴퓨터, 조명, 펜꽂이, 개인 소품 1개", "나머지는 서랍이나 선반으로", "매일 쓰지 않으면 책상 위에 둘 필요 없음"] },
    { name: "서류/파일", tasks: ["흩어진 서류 모두 한 곳에 모으기", "처리 필요 / 보관 / 파쇄로 분류", "오래된 고지서, 문서 파쇄", "중요 서류는 스캔해서 디지털 보관", "간단한 파일 시스템 만들기: 5-10개 카테고리"] },
    { name: "디지털 정리", tasks: ["컴퓨터 바탕화면 정리", "안 읽는 뉴스레터 구독 해지 10개", "안 쓰는 앱, 북마크 삭제", "다운로드 폴더 정리 (또는 전부 삭제)", "휴지통 비우기 — 모든 기기에서"] },
  ]},
  kids: { zones: [
    { name: "장난감/게임", tasks: ["장난감 모두 방 가운데로 모으기", "활발히 갖고 노는 것, 나이 지난 것, 부서진 것 분류", "나이 지난 장난감 기부 (아이와 함께!)", "부서진 장난감, 조각 빠진 게임 버리기", "사진 라벨 수납함으로 정리 (어린 아이용)"] },
    { name: "옷/신발", tasks: ["모든 옷 입혀보기 (또는 사이즈 확인) — 아이는 빨리 커요!", "작아진 것, 얼룩진 것, 손상된 것 빼기", "종류별, 시즌별 정리", "물려줄 옷은 라벨 붙여 보관", "일상복 7-10벌이면 충분"] },
    { name: "인형/컬렉션", tasks: ["대대적 인형 감사 — 최애 10개만 남기기", "아이가 직접 '팀' 고르게 하기", "컬렉션 한 상자 제한 (돌, 카드, 피규어 등)", "장난감 월 1회 로테이션 — 신선한 느낌!", "안녕 상자 만들기 — 1달 내 안 찾으면 기부"] },
  ]},
  veranda: { zones: [
    { name: "세탁 구역", tasks: ["세탁용품 점검 — 빈 것, 안 쓰는 것 버리기", "중복 제품 합치기", "선반 닦고 재정리", "세탁기 위/옆 잡동사니 정리", "짝 없는 양말 더미? 이제 보내줄 때입니다"] },
    { name: "수납 물건", tasks: ["수납함 라벨 확인 — 내용물과 맞는지", "2년 이상 안 쓴 물건 정리", "시즌 용품 분류 (여름/겨울)", "캠핑용품, 여행가방 점검", "빈 박스, 빈 봉투 정리 — 정말 그만큼 필요한가요?"] },
    { name: "화분/원예", tasks: ["죽은 식물 처분", "화분 상태 점검 — 배수 확인", "빈 화분, 깨진 화분 정리", "원예 도구 정리", "봄맞이 새 식물 계획!"] },
  ]},
  entrance: { zones: [
    { name: "신발/외투", tasks: ["신발장에서 모든 신발 꺼내기", "현재 시즌 신발만 여기에 (1인 3-4켤레 최대)", "비시즌 신발은 다른 곳에 보관", "코트/재킷 정리 — 현재 시즌만", "닳은 신발, 안 신는 것 기부/처분"] },
    { name: "열쇠/우편/잡동사니", tasks: ["열쇠 두는 곳 하나로 정하기 (훅 또는 트레이)", "쌓인 우편물 정리 — 전단지 바로 재활용", "외출 필수품 '발사대' 만들기: 열쇠, 지갑, 가방", "반품/보낼 물건 작은 수납함", "현관 닦기 — 첫인상이 중요해요!"] },
  ]},
  storage: { zones: [
    { name: "수납함/박스", tasks: ["라벨 없는 박스 모두 꺼내기", "하나씩 열어서 결정: 보관/기부/버리기", "내용물 라벨 다시 붙이기", "카테고리별 정리", "3년 이상 안 연 박스는 진지하게 재고하기"] },
    { name: "추억의 물건", tasks: ["전부 남기지 않아도 괜찮다는 걸 스스로에게 허락하기", "최고의 10-20%만 남기기", "물건 사진 찍어두면 기억은 남아요", "가족 구성원별 '추억 상자' 1개로 제한", "졸업앨범, 트로피 — 하이라이트만 남기기"] },
    { name: "오래된 전자기기", tasks: ["오래된 전자기기 모으기: 폰, 케이블, 충전기", "전자폐기물 수거함에 버리기 (일반쓰레기 금지!)", "안 쓰는 가전, 가구 당근마켓에 올리기", "정체불명 물건: 뭔지 모르면 필요 없는 거예요", "중고나라, 번개장터 활용해서 처분"] },
  ]},
};

function generatePlan(selectedRooms, minutesPerDay, clutterLevel) {
  const clutter = CLUTTER_LEVELS.find((c) => c.id === clutterLevel);
  const minsPerZone = Math.round(25 * clutter.mult);
  const mins = parseInt(minutesPerDay);
  const allZones = [];
  selectedRooms.forEach((roomId) => {
    const room = ROOMS.find((r) => r.id === roomId);
    const roomData = ROOM_TASKS[roomId];
    if (!roomData) return;
    roomData.zones.forEach((zone) => {
      allZones.push({ roomId, roomEmoji: room.emoji, roomName: room.name, ...zone });
    });
  });
  const days = [];
  let currentDay = [], currentDayMins = 0;
  allZones.forEach((zone) => {
    if (currentDayMins + minsPerZone > mins && currentDay.length > 0) {
      days.push([...currentDay]); currentDay = []; currentDayMins = 0;
    }
    currentDay.push(zone); currentDayMins += minsPerZone;
  });
  if (currentDay.length > 0) days.push(currentDay);
  const weeks = [];
  for (let i = 0; i < days.length; i += 5) weeks.push(days.slice(i, i + 5));
  return { weeks, totalDays: days.length, totalWeeks: weeks.length, totalZones: allZones.length };
}

export default function DeclutterPlanKR() {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [time, setTime] = useState("");
  const [clutter, setClutter] = useState("");
  const [plan, setPlan] = useState(null);
  const [checked, setChecked] = useState({});
  const [expandedDay, setExpandedDay] = useState({});
  const resultRef = useRef(null);

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

  const toggleRoom = (id) => setSelectedRooms((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
  const toggleCheck = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const generate = () => {
    if (selectedRooms.length === 0 || !time || !clutter) return;
    const result = generatePlan(selectedRooms, time, clutter);
    setPlan(result); setChecked({}); setExpandedDay({"w0-d0": true});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const totalTasks = plan ? plan.weeks.flat().flat().reduce((s, zone) => s + zone.tasks.length, 0) : 0;
  const doneTasks = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(155deg, #fff3e0 0%, #fff9c4 25%, #e8f5e9 55%, #e0f7fa 100%)", fontFamily: "'Noto Sans KR', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet" />
      {["📦", "🗑️", "💝", "🧹", "🌿", "🎁"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${6 + i * 14}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 4)}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>📦✨🌸</div>
          <h1 style={{ fontFamily: "'Jua', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#e65100", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>정리정돈 플래너</h1>
          <p style={{ color: "#ff8a65", fontSize: 15, margin: 0, fontWeight: 600 }}>공간을 선택하고, 페이스를 정하면 체계적인 정리 계획을 만들어드려요!</p>
        </div>

        <Section num="1" title="어떤 공간을 정리할까요?" color="#e65100" subtitle="해당하는 것 모두 선택">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {ROOMS.map((r) => (
              <Btn key={r.id} active={selectedRooms.includes(r.id)} onClick={() => toggleRoom(r.id)} color="#e65100">
                <div style={{ fontSize: 24, marginBottom: 2 }}>{r.emoji}</div><div style={{ fontWeight: 700, fontSize: 12 }}>{r.name}</div>
              </Btn>
            ))}
          </div>
          {selectedRooms.length > 0 && <div style={{ marginTop: 10, fontSize: 13, color: "#bf360c", fontWeight: 700 }}>{selectedRooms.length}개 공간 선택됨</div>}
        </Section>

        <Section num="2" title="하루에 얼마나 투자할 수 있나요?" color="#e65100">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {TIME_OPTIONS.map((t) => (
              <Btn key={t.id} active={time === t.id} onClick={() => setTime(t.id)} color="#e65100">
                <div style={{ fontSize: 22 }}>{t.emoji}</div><div style={{ fontWeight: 800, fontSize: 14 }}>{t.label}</div><div style={{ fontSize: 11, opacity: 0.6 }}>{t.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        <Section num="3" title="얼마나 어지러운가요?" color="#e65100">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CLUTTER_LEVELS.map((c) => (
              <Btn key={c.id} active={clutter === c.id} onClick={() => setClutter(c.id)} color="#e65100" wide>
                <span style={{ fontSize: 24, marginRight: 12 }}>{c.emoji}</span>
                <div><div style={{ fontWeight: 800 }}>{c.label}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{c.desc}</div></div>
              </Btn>
            ))}
          </div>
        </Section>

        {selectedRooms.length > 0 && time && clutter && (
          <button onClick={generate} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #e65100, #ff8a65)", color: "#fff", fontFamily: "'Jua', cursive", fontSize: 20, cursor: "pointer", marginBottom: 24, boxShadow: "0 4px 20px rgba(230,81,0,0.3)" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            📋 정리 계획 만들기!
          </button>
        )}

        {plan && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'declutter-plan.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #e65100, #ff8a65)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(230,81,0,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 PDF 다운로드
            </button>
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, border: "2px solid #ffcc80" }}>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <Stat label="총 일수" value={plan.totalDays} emoji="📅" />
                <Stat label="주" value={plan.totalWeeks} emoji="🗓️" />
                <Stat label="구역" value={plan.totalZones} emoji="📍" />
                <Stat label="할 일" value={totalTasks} emoji="✅" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 800, color: "#e65100", fontSize: 14 }}>진행률: {doneTasks}/{totalTasks}</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>({totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%)</span>
              </div>
              <div style={{ background: "#fff3e0", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%`, height: "100%", background: doneTasks === totalTasks && totalTasks > 0 ? "linear-gradient(90deg, #66bb6a, #43a047)" : "linear-gradient(90deg, #ff8a65, #e65100)", borderRadius: 10, transition: "width 0.4s ease" }} />
              </div>
              {doneTasks === totalTasks && totalTasks > 0 && (
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 16, fontWeight: 800, color: "#43a047" }}>🎉 정리 완료! 깔끔한 공간에서 새 봄을 즐기세요!</div>
              )}
            </div>

            {plan.weeks.map((week, wi) => (
              <div key={wi} style={{ marginBottom: 20 }}>
                <h3 style={{ fontFamily: "'Jua', cursive", color: "#e65100", fontSize: 20, margin: "0 0 12px" }}>
                  <span style={{ background: "#fff3e0", borderRadius: 10, padding: "4px 12px", fontSize: 14 }}>{wi + 1}주차</span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {week.map((day, di) => {
                    const dayKey = `w${wi}-d${di}`;
                    const isExpanded = !!expandedDay[dayKey];
                    return (
                      <div key={di} style={{ background: "rgba(255,255,255,0.88)", borderRadius: 16, border: isExpanded ? "2px solid #ffcc80" : "2px solid rgba(230,81,0,0.06)", overflow: "hidden" }}>
                        <div onClick={() => setExpandedDay(prev => ({...prev, [dayKey]: !prev[dayKey]}))}
                          style={{ padding: "14px 18px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontWeight: 800, color: "#e65100", fontSize: 15 }}>{wi * 5 + di + 1}일차</span>
                            <span style={{ fontSize: 13, color: "#999" }}>{day.map((z) => z.roomEmoji).filter((v, i, a) => a.indexOf(v) === i).join("")} {day.map((z) => z.name).join(" → ")}</span>
                          </div>
                          <span style={{ fontSize: 18, color: "#ccc", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                        </div>
                        {isExpanded && (
                          <div style={{ padding: "0 18px 18px" }}>
                            {day.map((zone, zi) => (
                              <div key={zi} style={{ marginBottom: zi < day.length - 1 ? 16 : 0 }}>
                                <div style={{ fontSize: 14, fontWeight: 800, color: "#bf360c", marginBottom: 8 }}>{zone.roomEmoji} {zone.roomName} — {zone.name}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {zone.tasks.map((task, ti) => {
                                    const key = `${dayKey}-z${zi}-t${ti}`;
                                    const done = checked[key];
                                    return (
                                      <div key={ti} onClick={() => toggleCheck(key)}
                                        style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderRadius: 10, background: done ? "#e8f5e9" : "#fafafa", cursor: "pointer", border: done ? "1.5px solid #a5d6a7" : "1.5px solid transparent" }}>
                                        <div style={{ width: 20, height: 20, borderRadius: 5, border: done ? "2px solid #66bb6a" : "2px solid #ddd", background: done ? "#66bb6a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{done ? "✓" : ""}</div>
                                        <span style={{ fontSize: 13, color: done ? "#999" : "#444", textDecoration: done ? "line-through" : "none", fontWeight: done ? 400 : 600, lineHeight: 1.5 }}>{task}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={() => downloadPDF(resultRef.current, 'declutter-plan.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #e65100, #ff8a65)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(230,81,0,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 PDF 다운로드
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#ffcc80", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📦💝🌸</div>
          정리정돈 플래너 — 물건은 줄이고, 행복은 늘리고!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, subtitle, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(230,81,0,0.06)", border: "2px solid rgba(230,81,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #ff8a65)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {subtitle && <p style={{ margin: "0 0 14px 38px", fontSize: 12, color: "#aaa", fontWeight: 600 }}>{subtitle}</p>}
      {children}
    </div>
  );
}

function Btn({ active, onClick, children, color, wide }) {
  return (
    <button onClick={onClick} style={{
      padding: wide ? "14px 18px" : "14px 10px", borderRadius: 14,
      border: active ? `2px solid ${color}` : "2px solid #e0e0e0",
      background: active ? `${color}10` : "rgba(255,255,255,0.85)",
      color: active ? color : "#777", fontWeight: 700, fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      textAlign: wide ? "left" : "center", display: wide ? "flex" : "block", alignItems: "center",
    }}>{children}</button>
  );
}

function Stat({ label, value, emoji }) {
  return (
    <div style={{ textAlign: "center", flex: 1, minWidth: 80 }}>
      <div style={{ fontSize: 20 }}>{emoji}</div>
      <div style={{ fontFamily: "'Jua', cursive", fontSize: 22, color: "#e65100" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
