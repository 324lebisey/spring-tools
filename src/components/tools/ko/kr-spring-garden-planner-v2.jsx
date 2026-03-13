'use client';
import { useState, useRef } from "react";

const REGIONS = {
  seoul: { name: "서울 / 경기", lastFrost: "4월 10일", firstFrost: "10월 25일", climate: "중부" },
  gangwon: { name: "강원도", lastFrost: "4월 25일", firstFrost: "10월 10일", climate: "산간" },
  chungcheong: { name: "충청도", lastFrost: "4월 5일", firstFrost: "10월 28일", climate: "중부" },
  gyeongsang: { name: "경상도", lastFrost: "3월 25일", firstFrost: "11월 5일", climate: "남부" },
  jeolla: { name: "전라도", lastFrost: "3월 20일", firstFrost: "11월 10일", climate: "남부" },
  jeju: { name: "제주도", lastFrost: "3월 5일", firstFrost: "11월 25일", climate: "아열대" },
};

const BALCONY_DIRECTIONS = {
  south: { name: "남향", sunHours: "6시간+", rating: "최고", emoji: "☀️", desc: "대부분의 작물 가능" },
  southeast: { name: "남동향", sunHours: "4-6시간", rating: "좋음", emoji: "🌤️", desc: "오전 햇살, 대부분 작물 가능" },
  southwest: { name: "남서향", sunHours: "4-6시간", rating: "좋음", emoji: "🌤️", desc: "오후 햇살, 여름에 고온 주의" },
  east: { name: "동향", sunHours: "3-4시간", rating: "보통", emoji: "⛅", desc: "엽채류, 허브 위주 추천" },
  west: { name: "서향", sunHours: "3-4시간", rating: "보통", emoji: "⛅", desc: "오후 직사광, 여름 차광 필요" },
  north: { name: "북향", sunHours: "1-2시간", rating: "제한적", emoji: "☁️", desc: "부추, 미나리, 샐러드류만 가능" },
};

const PLANTS = [
  { name: "상추", emoji: "🥬", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, potSize: "직사각 플랜터 (60cm+)", minSun: 3, water: "겉흙 마르면 (주 2-3회)", daysToHarvest: "30-45", difficulty: 1, tips: "2주 간격 파종으로 계속 수확. 베란다 초보 1순위!", prepTip: "배수 구멍 있는 플랜터에 상토를 채우면 끝. 씨앗을 얕게 뿌리고 살짝 덮어주세요." },
  { name: "고추", emoji: "🌶️", type: "채소", weeksBeforeFrost: -3, weeksIndoors: 8, potSize: "원형 화분 (지름 30cm+, 깊이 30cm+)", minSun: 6, water: "겉흙 마르면 (주 2-3회)", daysToHarvest: "80-100", difficulty: 3, tips: "모종 구매 추천. 지지대 필수. 한국 베란다 텃밭의 왕!", prepTip: "깊은 화분 필수. 배수층(자갈)→부직포→상토+펄라이트 순서로 세팅." },
  { name: "방울토마토", emoji: "🍅", type: "채소", weeksBeforeFrost: -2, weeksIndoors: 6, potSize: "원형 화분 (지름 30cm+, 깊이 30cm+)", minSun: 6, water: "겉흙 마르면 (주 2-3회)", daysToHarvest: "55-70", difficulty: 2, tips: "베란다 인기 1위! 곁순 제거하면 열매가 커져요. 지지대 세워주세요.", prepTip: "깊은 화분에 배수층 필수. 토마토 전용 상토 사용 추천." },
  { name: "깻잎 (들깨)", emoji: "🌿", type: "채소", weeksBeforeFrost: -1, weeksIndoors: 4, potSize: "원형 화분 (지름 25cm+)", minSun: 5, water: "주 2-3회", daysToHarvest: "50-70", difficulty: 2, tips: "한국인의 소울 허브. 삼겹살에 필수! 잎 10장 이상 되면 수확.", prepTip: "모종 구매가 편리. 화분에 상토 채우고 모종을 심으면 OK." },
  { name: "쪽파", emoji: "🧅", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, potSize: "직사각 플랜터 (40cm+)", minSun: 4, water: "주 2회", daysToHarvest: "40-60", difficulty: 1, tips: "종구(뿌리) 심으면 빠르게 수확. 파전, 찌개에 바로 활용!", prepTip: "마트에서 산 쪽파 뿌리 부분을 3-4cm 남기고 심어도 자라요." },
  { name: "시금치", emoji: "🥬", type: "채소", weeksBeforeFrost: 6, weeksIndoors: 0, potSize: "직사각 플랜터 (50cm+)", minSun: 3, water: "주 2-3회", daysToHarvest: "30-45", difficulty: 1, tips: "추위에 강해 이른 봄부터 파종 가능. 30일이면 수확!", prepTip: "씨앗을 하루 물에 불린 후 파종하면 발아율 UP." },
  { name: "열무", emoji: "🥗", type: "채소", weeksBeforeFrost: 3, weeksIndoors: 0, potSize: "직사각 플랜터 (50cm+)", minSun: 4, water: "주 3회", daysToHarvest: "25-35", difficulty: 1, tips: "25일이면 수확! 가장 빠른 보람. 열무김치, 비빔국수에 활용.", prepTip: "씨앗을 줄뿌림하고 솎아주면서 키우세요. 솎은 것도 먹을 수 있어요!" },
  { name: "부추", emoji: "🌱", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, potSize: "원형 화분 (지름 20cm+) 또는 플랜터", minSun: 2, water: "주 2회", daysToHarvest: "50-60", difficulty: 1, tips: "한 번 심으면 계속 수확하는 효자 작물. 북향 베란다도 OK!", prepTip: "종근(뿌리) 구매해서 심으면 씨앗보다 훨씬 빠르게 수확." },
  { name: "대파", emoji: "🧅", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, potSize: "깊은 원형 화분 (지름 20cm+, 깊이 25cm+)", minSun: 4, water: "주 2회", daysToHarvest: "60-90", difficulty: 1, tips: "마트 대파 뿌리를 심으면 무한 재생! 가장 실용적인 베란다 작물.", prepTip: "마트에서 산 대파의 뿌리 부분 5cm를 화분에 꽂으면 자라요." },
  { name: "바질", emoji: "🌿", type: "허브", weeksBeforeFrost: -2, weeksIndoors: 6, potSize: "원형 화분 (지름 15-20cm)", minSun: 6, water: "겉흙 마르면 (주 2-3회)", daysToHarvest: "50-75", difficulty: 2, tips: "꽃대가 올라오면 바로 잘라주세요. 파스타, 피자에 활용!", prepTip: "모종 구매 추천. 배수가 잘 되는 화분에 허브용 상토 사용." },
  { name: "민트", emoji: "🍃", type: "허브", weeksBeforeFrost: 2, weeksIndoors: 0, potSize: "원형 화분 (지름 20cm+)", minSun: 3, water: "주 3회 (촉촉하게)", daysToHarvest: "60-90", difficulty: 1, tips: "생명력 최강. 물만 줘도 잘 자라요. 모히또, 차에 활용!", prepTip: "반드시 단독 화분에! 다른 식물과 함께 심으면 민트가 점령합니다." },
  { name: "로즈마리", emoji: "🌿", type: "허브", weeksBeforeFrost: 0, weeksIndoors: 0, potSize: "원형 화분 (지름 20cm+)", minSun: 5, water: "주 1-2회 (건조하게)", daysToHarvest: "90+", difficulty: 2, tips: "과습 주의! 물을 적게 줘야 해요. 요리, 방향제로 활용.", prepTip: "모종 구매. 배수가 매우 중요 — 자갈층을 넉넉히, 마사토 섞어주세요." },
  { name: "루꼴라", emoji: "🥗", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, potSize: "직사각 플랜터 (40cm+)", minSun: 3, water: "주 2-3회", daysToHarvest: "25-40", difficulty: 1, tips: "샐러드에 넣으면 카페 느낌! 서늘할 때 맛이 가장 좋아요.", prepTip: "씨앗을 얕게 뿌리고 흙을 살짝만. 발아 빠르고 수확도 빨라요." },
  { name: "페퍼민트 제라늄", emoji: "🌺", type: "꽃", weeksBeforeFrost: -1, weeksIndoors: 0, potSize: "원형 화분 (지름 20cm+)", minSun: 4, water: "주 1-2회", daysToHarvest: "꽃: 60-90일", difficulty: 1, tips: "모기 퇴치 효과! 베란다에 두면 예쁘고 실용적.", prepTip: "모종 구매. 과습만 조심하면 거의 죽지 않는 식물." },
  { name: "딸기", emoji: "🍓", type: "과일", weeksBeforeFrost: 2, weeksIndoors: 0, potSize: "딸기 전용 화분 또는 원형 (지름 25cm+)", minSun: 5, water: "주 3회 (과실 맺을 때 충분히)", daysToHarvest: "60-90", difficulty: 3, tips: "봄 모종으로 시작 가능. 런너 잘라주면 열매에 집중!", prepTip: "딸기 전용 상토 추천. 화분 밑에 배수 접시 필수. 인공수분 해주면 열매 잘 맺어요." },
];

const TYPE_FILTERS = ["전체", "채소", "허브", "꽃", "과일"];
const DIFFICULTY_LABELS = ["", "쉬움 ★", "보통 ★★", "도전 ★★★"];
const DIFFICULTY_COLORS = ["", "#4caf50", "#ff9800", "#f44336"];

const PREP_STEPS = [
  {
    emoji: "📋",
    title: "베란다 환경 파악하기",
    items: [
      "베란다 방향(남/동/서/북) 확인 — 햇빛 시간 결정",
      "확장 베란다 vs 비확장 확인 — 겨울 온도 차이 큼",
      "배수가 가능한 위치 확인 (배수구 근처 추천)",
      "바닥에 방수 트레이나 신문지 준비 (물 흘림 방지)",
    ],
  },
  {
    emoji: "🪴",
    title: "화분 & 플랜터 준비",
    items: [
      "배수 구멍이 있는 화분 선택 (없으면 드릴로 뚫기)",
      "채소류: 직사각 플랜터 (60cm 이상) 추천",
      "열매류(토마토, 고추): 깊이 30cm 이상 원형 화분",
      "허브류: 지름 15-20cm 원형 화분이면 충분",
      "배수 접시(받침) 꼭 준비 — 실내 물 관리 필수",
    ],
  },
  {
    emoji: "🌍",
    title: "흙 & 배수층 세팅",
    items: [
      "마사토 또는 자갈 (배수층, 화분 바닥 2-3cm)",
      "부직포 (배수층과 상토 사이에 깔기, 선택사항)",
      "분갈이용 상토 (일반 상토 + 펄라이트 7:3 혼합 추천)",
      "채소용 상토는 비료 포함된 것 구매하면 편리",
      "절대 화단/공원 흙 사용 금지 — 병충해, 배수 불량",
    ],
  },
  {
    emoji: "🛠️",
    title: "기본 도구 체크리스트",
    items: [
      "미니 삽, 모종삽 (다이소 가능)",
      "분무기 (씨앗 발아용, 잎 관리용)",
      "물뿌리개 (긴 주둥이형 추천)",
      "지지대 + 끈 (토마토, 고추용)",
      "전지가위 (수확, 가지치기용)",
    ],
  },
  {
    emoji: "🏪",
    title: "어디서 살까?",
    items: [
      "모종/씨앗: 화훼단지, 하나로마트, 온라인(쿠팡, 네이버)",
      "화분/상토: 다이소, 이케아, 화훼단지, 온라인",
      "4~5월 아파트 단지 내 모종 장터 활용 (저렴!)",
      "마트에서 산 대파, 쪽파 뿌리 재활용도 가능!",
    ],
  },
];

function getPlantingDate(region, weeksBeforeFrost) {
  const r = REGIONS[region];
  if (!r) return null;
  const match = r.lastFrost.match(/(\d+)월\s*(\d+)일/);
  if (!match) return null;
  const frostDate = new Date(2026, parseInt(match[1]) - 1, parseInt(match[2]));
  const plantDate = new Date(frostDate);
  plantDate.setDate(plantDate.getDate() - weeksBeforeFrost * 7);
  return plantDate;
}

function formatDate(date) {
  if (!date) return "—";
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function getStatus(plantDate) {
  const now = new Date();
  const diff = (plantDate - now) / (1000 * 60 * 60 * 24);
  if (diff < -14) return { label: "시기 지남", color: "#e74c3c", bg: "#fdeaea" };
  if (diff < 0) return { label: "지금 심으세요!", color: "#27ae60", bg: "#eafaf1" };
  if (diff < 14) return { label: "곧 시작", color: "#f39c12", bg: "#fef9e7" };
  return { label: "예정", color: "#7f8c8d", bg: "#f0f0f0" };
}

function isSuitableForSun(plant, direction) {
  if (!direction) return true;
  const sunHours = BALCONY_DIRECTIONS[direction];
  if (!sunHours) return true;
  const maxSun = parseInt(sunHours.sunHours) || 6;
  return plant.minSun <= maxSun;
}

export default function SpringGardenPlannerKR() {
  const [region, setRegion] = useState("");
  const [direction, setDirection] = useState("");
  const [filter, setFilter] = useState("전체");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gardenList, setGardenList] = useState([]);
  const [showPrep, setShowPrep] = useState(true);
  const [checkedPrep, setCheckedPrep] = useState({});
  const resultsRef = useRef(null);

  const filteredPlants = PLANTS.filter((p) => {
    if (filter !== "전체" && p.type !== filter) return false;
    return true;
  });

  const suitablePlants = filteredPlants.filter((p) => isSuitableForSun(p, direction));
  const unsuitablePlants = filteredPlants.filter((p) => !isSuitableForSun(p, direction));

  const toggleGardenList = (plant) => {
    setGardenList((prev) =>
      prev.includes(plant.name) ? prev.filter((n) => n !== plant.name) : [...prev, plant.name]
    );
  };

  const togglePrepCheck = (stepIdx, itemIdx) => {
    const key = `${stepIdx}-${itemIdx}`;
    setCheckedPrep((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalPrepItems = PREP_STEPS.reduce((sum, s) => sum + s.items.length, 0);
  const checkedCount = Object.values(checkedPrep).filter(Boolean).length;

  const gardenPlants = PLANTS.filter((p) => gardenList.includes(p.name));

  const sectionCard = {
    background: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: "24px 28px",
    marginBottom: 24,
    boxShadow: "0 4px 20px rgba(46,125,50,0.1)",
    border: "2px solid rgba(46,125,50,0.12)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #e8f5e9 0%, #fff9c4 30%, #fff3e0 60%, #fce4ec 100%)", fontFamily: "'Noto Sans KR', 'Nunito', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet" />

      {["🌸", "🪴", "🌷", "🏠", "☘️", "🌻"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 14}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.12, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🪴🏠🌱</div>
          <h1 style={{ fontFamily: "'Jua', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#2e7d32", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            아파트 베란다 텃밭 플래너
          </h1>
          <p style={{ color: "#6d8f3f", fontSize: 15, margin: "0 0 4px", fontWeight: 600 }}>
            화분으로 시작하는 우리 집 베란다 가드닝
          </p>
          <p style={{ color: "#999", fontSize: 13, margin: 0 }}>
            지역 & 베란다 방향을 선택하면 맞춤 추천을 드려요!
          </p>
        </div>

        {/* Step 1: Region & Balcony Direction */}
        <div style={sectionCard}>
          <div style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", fontSize: 18, marginBottom: 16 }}>
            ① 우리 집 환경 설정
          </div>

          <label style={{ fontWeight: 700, color: "#2e7d32", fontSize: 14, display: "block", marginBottom: 8 }}>
            🗺️ 지역
          </label>
          <select value={region} onChange={(e) => { setRegion(e.target.value); }}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #c8e6c9", fontSize: 15, fontFamily: "inherit", background: "#f1f8e9", color: "#333", cursor: "pointer", outline: "none", appearance: "auto", marginBottom: 16 }}>
            <option value="">지역을 선택하세요...</option>
            {Object.entries(REGIONS).map(([key, val]) => (
              <option key={key} value={key}>{val.name} — 마지막 서리: {val.lastFrost}</option>
            ))}
          </select>

          <label style={{ fontWeight: 700, color: "#2e7d32", fontSize: 14, display: "block", marginBottom: 8 }}>
            🧭 베란다 방향
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
            {Object.entries(BALCONY_DIRECTIONS).map(([key, val]) => (
              <button key={key} onClick={() => setDirection(direction === key ? "" : key)}
                style={{
                  padding: "10px 12px", borderRadius: 12, border: direction === key ? "2px solid #43a047" : "2px solid #e0e0e0",
                  background: direction === key ? "#e8f5e9" : "white", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all 0.2s",
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: direction === key ? "#2e7d32" : "#555" }}>
                  {val.emoji} {val.name}
                </div>
                <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                  {val.sunHours} · {val.rating}
                </div>
              </button>
            ))}
          </div>

          {direction && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#f1f8e9", borderRadius: 10, fontSize: 13, color: "#558b2f" }}>
              💡 {BALCONY_DIRECTIONS[direction].name} 베란다: {BALCONY_DIRECTIONS[direction].desc}
            </div>
          )}
        </div>

        {/* Region info bar */}
        {region && (
          <div style={{ background: "linear-gradient(135deg, #a5d6a7 0%, #c5e1a5 100%)", borderRadius: 16, padding: "14px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, fontSize: 14 }}>
            <div><span style={{ fontWeight: 800, color: "#1b5e20" }}>마지막 서리: </span><span style={{ color: "#2e7d32", fontWeight: 600 }}>{REGIONS[region].lastFrost}</span></div>
            <div><span style={{ fontWeight: 800, color: "#1b5e20" }}>첫 서리: </span><span style={{ color: "#2e7d32", fontWeight: 600 }}>{REGIONS[region].firstFrost}</span></div>
            <div><span style={{ fontWeight: 800, color: "#1b5e20" }}>기후대: </span><span style={{ color: "#2e7d32", fontWeight: 600 }}>{REGIONS[region].climate}</span></div>
          </div>
        )}

        {/* Step 2: Preparation Checklist */}
        <div style={sectionCard}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showPrep ? 16 : 0, cursor: "pointer" }} onClick={() => setShowPrep(!showPrep)}>
            <div style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", fontSize: 18 }}>
              ② 심기 전 준비사항
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {checkedCount > 0 && (
                <span style={{ fontSize: 12, color: "#7cb342", fontWeight: 600 }}>
                  {checkedCount}/{totalPrepItems} 완료
                </span>
              )}
              <span style={{ fontSize: 20, color: "#aaa", transition: "transform 0.2s", transform: showPrep ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
            </div>
          </div>

          {showPrep && (
            <>
              {/* Progress bar */}
              <div style={{ height: 6, background: "#e8f5e9", borderRadius: 3, marginBottom: 20, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${totalPrepItems > 0 ? (checkedCount / totalPrepItems) * 100 : 0}%`, background: "linear-gradient(90deg, #66bb6a, #43a047)", borderRadius: 3, transition: "width 0.3s" }} />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {PREP_STEPS.map((step, stepIdx) => (
                  <div key={stepIdx}>
                    <div style={{ fontWeight: 700, color: "#2e7d32", fontSize: 15, marginBottom: 10 }}>
                      {step.emoji} {step.title}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {step.items.map((item, itemIdx) => {
                        const key = `${stepIdx}-${itemIdx}`;
                        const checked = checkedPrep[key];
                        return (
                          <label key={itemIdx} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderRadius: 10, background: checked ? "#f1f8e9" : "#fafafa", cursor: "pointer", transition: "background 0.2s", border: "1px solid " + (checked ? "#c8e6c9" : "#f0f0f0") }}>
                            <input type="checkbox" checked={!!checked} onChange={() => togglePrepCheck(stepIdx, itemIdx)}
                              style={{ marginTop: 2, accentColor: "#43a047", width: 16, height: 16, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: checked ? "#7cb342" : "#555", textDecoration: checked ? "line-through" : "none", lineHeight: 1.5 }}>
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Step 3: Plant Selection */}
        {region && (
          <>
            <div style={sectionCard}>
              <div style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", fontSize: 18, marginBottom: 16 }}>
                ③ 작물 고르기
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {TYPE_FILTERS.map((t) => (
                  <button key={t} onClick={() => setFilter(t)}
                    style={{ padding: "7px 16px", borderRadius: 50, border: "2px solid " + (filter === t ? "#43a047" : "#e0e0e0"), background: filter === t ? "#43a047" : "white", color: filter === t ? "#fff" : "#666", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                    {t === "전체" ? "🌈 전체" : t === "채소" ? "🥬 채소" : t === "허브" ? "🌿 허브" : t === "꽃" ? "🌸 꽃" : "🍓 과일"}
                  </button>
                ))}
              </div>

              {direction && unsuitablePlants.length > 0 && (
                <div style={{ padding: "8px 14px", background: "#fff3e0", borderRadius: 10, fontSize: 12, color: "#e65100", marginBottom: 16 }}>
                  ⚠️ {BALCONY_DIRECTIONS[direction].name} 베란다에서 햇빛이 부족한 작물 {unsuitablePlants.length}개는 아래쪽에 따로 표시됩니다.
                </div>
              )}

              <div ref={resultsRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                {suitablePlants.map((plant) => {
                  const plantDate = getPlantingDate(region, plant.weeksBeforeFrost);
                  const status = getStatus(plantDate);
                  const inGarden = gardenList.includes(plant.name);
                  const isSelected = selectedPlant?.name === plant.name;

                  return (
                    <div key={plant.name} onClick={() => setSelectedPlant(isSelected ? null : plant)}
                      style={{ background: isSelected ? "linear-gradient(135deg, #fff9c4, #ffffff)" : "white", borderRadius: 16, padding: "18px", cursor: "pointer", border: isSelected ? "2px solid #f9a825" : inGarden ? "2px solid #66bb6a" : "2px solid #f0f0f0", boxShadow: isSelected ? "0 6px 24px rgba(249,168,37,0.15)" : "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.25s", position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <span style={{ fontSize: 30 }}>{plant.emoji}</span>
                          <h3 style={{ margin: "6px 0 2px", color: "#2e7d32", fontSize: 16, fontWeight: 800 }}>{plant.name}</h3>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleGardenList(plant); }}
                          style={{ width: 30, height: 30, borderRadius: "50%", border: inGarden ? "2px solid #43a047" : "2px dashed #c8e6c9", background: inGarden ? "#43a047" : "transparent", color: inGarden ? "#fff" : "#c8e6c9", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                          title={inGarden ? "목록에서 제거" : "내 베란다에 추가"}>
                          {inGarden ? "✓" : "+"}
                        </button>
                      </div>

                      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: status.bg, color: status.color, fontSize: 11, fontWeight: 700 }}>{status.label}</span>
                        <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: "#f5f5f5", color: DIFFICULTY_COLORS[plant.difficulty], fontSize: 11, fontWeight: 700 }}>{DIFFICULTY_LABELS[plant.difficulty]}</span>
                      </div>

                      <div style={{ fontSize: 13, color: "#555" }}>
                        <div>🪴 {plant.potSize}</div>
                        <div>📅 파종: {formatDate(plantDate)}</div>
                        {plant.weeksIndoors > 0 && <div style={{ color: "#888", fontSize: 12 }}>🏠 실내 육묘 {plant.weeksIndoors}주 전부터</div>}
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #ddd", fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                          <div>☀️ 최소 {plant.minSun}시간 햇빛</div>
                          <div>💧 {plant.water}</div>
                          <div>📅 수확: {plant.daysToHarvest}일</div>
                          <div style={{ marginTop: 8, padding: "8px 12px", background: "#e3f2fd", borderRadius: 10, color: "#1565c0", fontWeight: 600, fontSize: 12 }}>
                            🪴 화분 팁: {plant.prepTip}
                          </div>
                          <div style={{ marginTop: 6, padding: "8px 12px", background: "#f1f8e9", borderRadius: 10, color: "#558b2f", fontWeight: 600, fontSize: 12 }}>
                            💡 {plant.tips}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Unsuitable plants (not enough sun) */}
              {direction && unsuitablePlants.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#999", marginBottom: 10 }}>
                    ☁️ {BALCONY_DIRECTIONS[direction].name}에서 햇빛 부족한 작물
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14, opacity: 0.55 }}>
                    {unsuitablePlants.map((plant) => {
                      const plantDate = getPlantingDate(region, plant.weeksBeforeFrost);
                      return (
                        <div key={plant.name} style={{ background: "white", borderRadius: 16, padding: "18px", border: "2px solid #f0f0f0" }}>
                          <span style={{ fontSize: 30 }}>{plant.emoji}</span>
                          <h3 style={{ margin: "6px 0 2px", color: "#999", fontSize: 16, fontWeight: 800 }}>{plant.name}</h3>
                          <div style={{ fontSize: 12, color: "#bbb" }}>최소 {plant.minSun}시간 햇빛 필요</div>
                          <div style={{ fontSize: 12, color: "#bbb" }}>파종: {formatDate(plantDate)}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* My Balcony Garden Plan */}
            {gardenPlants.length > 0 && (
              <div style={{ ...sectionCard, border: "2px solid #a5d6a7" }}>
                <div style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", fontSize: 18, marginBottom: 4 }}>
                  🪴 내 베란다 텃밭 계획
                </div>
                <p style={{ color: "#7cb342", margin: "0 0 16px", fontSize: 13, fontWeight: 600 }}>
                  {gardenPlants.length}개 작물 선택 — 파종 일정순으로 정렬
                </p>

                {/* Shopping summary */}
                <div style={{ background: "#fff3e0", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, color: "#e65100", fontSize: 13, marginBottom: 8 }}>🛒 준비물 요약</div>
                  <div style={{ fontSize: 12, color: "#bf360c", lineHeight: 1.8 }}>
                    {(() => {
                      const pots = new Set();
                      gardenPlants.forEach(p => pots.add(p.potSize));
                      return [...pots].map((pot, i) => <div key={i}>• {pot}</div>);
                    })()}
                    <div>• 상토 + 펄라이트 (배합용)</div>
                    <div>• 마사토 또는 자갈 (배수층)</div>
                    {gardenPlants.some(p => p.weeksIndoors > 0) && <div>• 모종 또는 육묘 트레이 (실내 육묘용)</div>}
                    {gardenPlants.some(p => ["고추", "방울토마토"].includes(p.name)) && <div>• 지지대 + 끈</div>}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[...gardenPlants].sort((a, b) => {
                    const dateA = getPlantingDate(region, a.weeksBeforeFrost);
                    const dateB = getPlantingDate(region, b.weeksBeforeFrost);
                    return dateA - dateB;
                  }).map((plant) => {
                    const plantDate = getPlantingDate(region, plant.weeksBeforeFrost);
                    const status = getStatus(plantDate);
                    return (
                      <div key={plant.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: status.bg, borderRadius: 12, border: `1.5px solid ${status.color}22` }}>
                        <span style={{ fontSize: 24 }}>{plant.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: "#333", fontSize: 14 }}>{plant.name}</div>
                          <div style={{ fontSize: 12, color: "#777" }}>
                            {plant.weeksIndoors > 0 ? `모종 준비 ${plant.weeksIndoors}주 전 → ${formatDate(plantDate)} 정식` : `직접 파종: ${formatDate(plantDate)}`}
                          </div>
                          <div style={{ fontSize: 11, color: "#999" }}>🪴 {plant.potSize}</div>
                        </div>
                        <div style={{ padding: "4px 8px", borderRadius: 8, background: status.color + "18", color: status.color, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{status.label}</div>
                        <button onClick={() => toggleGardenList(plant)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18, padding: 4 }}>×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#a5d6a7", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🪴🏠🌱</div>
          아파트 베란다 텃밭 플래너 — 우리 집 베란다에서 시작하는 봄 가드닝!
        </div>
      </div>
    </div>
  );
}
