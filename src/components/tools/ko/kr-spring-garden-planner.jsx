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

const PLANTS = [
  { name: "상추", emoji: "🥬", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, spacing: "15-20cm", water: "주 2-3회", sunlight: "반양지 가능", daysToHarvest: "30-45", tips: "2주 간격으로 파종하면 계속 수확 가능. 한국 봄 텃밭의 필수!" },
  { name: "고추", emoji: "🌶️", type: "채소", weeksBeforeFrost: -3, weeksIndoors: 8, spacing: "40-50cm", water: "주 2-3회", sunlight: "양지 (6시간+)", daysToHarvest: "80-100", tips: "모종을 5월 초에 정식. 지지대 필수. 한국 텃밭의 왕!" },
  { name: "토마토", emoji: "🍅", type: "채소", weeksBeforeFrost: -2, weeksIndoors: 6, spacing: "50-60cm", water: "주 2-3회", sunlight: "양지 (6시간+)", daysToHarvest: "60-85", tips: "곁순 제거하면 열매가 커져요. 비가림 재배 추천." },
  { name: "오이", emoji: "🥒", type: "채소", weeksBeforeFrost: -2, weeksIndoors: 3, spacing: "60-80cm", water: "매일", sunlight: "양지 (6시간+)", daysToHarvest: "50-65", tips: "덩굴 유인 필수. 수확을 자주 하면 더 많이 열려요." },
  { name: "깻잎 (들깨)", emoji: "🌿", type: "채소", weeksBeforeFrost: -1, weeksIndoors: 4, spacing: "30-40cm", water: "주 2-3회", sunlight: "양지 (6시간+)", daysToHarvest: "50-70", tips: "한국인의 소울 허브. 삼겹살에 필수! 잎이 10장 이상 되면 수확 시작." },
  { name: "쪽파", emoji: "🧅", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, spacing: "5-10cm", water: "주 2회", sunlight: "양지", daysToHarvest: "40-60", tips: "봄에 종구 심으면 빠르게 수확. 파전, 찌개에 활용!" },
  { name: "시금치", emoji: "🥬", type: "채소", weeksBeforeFrost: 6, weeksIndoors: 0, spacing: "10-15cm", water: "주 2-3회", sunlight: "반양지 가능", daysToHarvest: "30-45", tips: "추위에 강해 이른 봄부터 파종 가능. 더위에는 쉽게 꽃대가 올라요." },
  { name: "열무", emoji: "🥗", type: "채소", weeksBeforeFrost: 3, weeksIndoors: 0, spacing: "5-10cm", water: "주 3회", sunlight: "양지", daysToHarvest: "25-35", tips: "가장 빨리 수확하는 채소 중 하나! 열무김치, 비빔국수에 활용." },
  { name: "부추", emoji: "🌱", type: "채소", weeksBeforeFrost: 4, weeksIndoors: 0, spacing: "15-20cm", water: "주 2회", sunlight: "반양지 가능", daysToHarvest: "50-60", tips: "한 번 심으면 여러 해 수확 가능한 다년생. 부추전 만들어요!" },
  { name: "방울토마토", emoji: "🍒", type: "과일", weeksBeforeFrost: -2, weeksIndoors: 6, spacing: "40-50cm", water: "주 2-3회", sunlight: "양지 (6시간+)", daysToHarvest: "55-70", tips: "아이들도 좋아하는 베란다 텃밭 인기 작물. 화분 재배도 OK!" },
  { name: "딸기", emoji: "🍓", type: "과일", weeksBeforeFrost: 4, weeksIndoors: 0, spacing: "25-30cm", water: "주 3회", sunlight: "양지 (6시간+)", daysToHarvest: "60-90", tips: "가을 정식이 일반적이지만 봄 모종도 가능. 런너 관리가 핵심." },
  { name: "바질", emoji: "🌿", type: "허브", weeksBeforeFrost: -2, weeksIndoors: 6, spacing: "20-30cm", water: "주 2-3회", sunlight: "양지 (6시간+)", daysToHarvest: "50-75", tips: "꽃이 피면 잎 맛이 떨어져요. 꽃대를 미리 잘라주세요." },
  { name: "민트", emoji: "🍃", type: "허브", weeksBeforeFrost: 2, weeksIndoors: 0, spacing: "30cm", water: "주 3회", sunlight: "반양지", daysToHarvest: "60-90", tips: "반드시 화분에서 키우세요! 땅에 심으면 정원을 점령합니다." },
  { name: "해바라기", emoji: "🌻", type: "꽃", weeksBeforeFrost: -1, weeksIndoors: 0, spacing: "30-50cm", water: "주 2회", sunlight: "양지 (6시간+)", daysToHarvest: "70-100", tips: "아이들과 함께 키우기 좋아요. 벌과 나비를 불러들여요!" },
  { name: "봉선화", emoji: "🌺", type: "꽃", weeksBeforeFrost: -1, weeksIndoors: 4, spacing: "20-30cm", water: "주 2-3회", sunlight: "양지~반양지", daysToHarvest: "60-80", tips: "한국 전통 꽃. 손톱 물들이기 추억! 씨앗이 튀어나와 재미있어요." },
];

const TYPE_FILTERS = ["전체", "채소", "허브", "꽃", "과일"];
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
  if (diff < -14) return { label: "시기 지남!", color: "#e74c3c", bg: "#fdeaea" };
  if (diff < 0) return { label: "지금 심으세요!", color: "#27ae60", bg: "#eafaf1" };
  if (diff < 14) return { label: "곧 시작", color: "#f39c12", bg: "#fef9e7" };
  return { label: "예정", color: "#7f8c8d", bg: "#f0f0f0" };
}

export default function SpringGardenPlannerKR() {
  const [region, setRegion] = useState("");
  const [filter, setFilter] = useState("전체");
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [gardenList, setGardenList] = useState([]);
  const resultsRef = useRef(null);
  const gardenPlanRef = useRef(null);

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

  const filteredPlants = PLANTS.filter(
    (p) => filter === "전체" || p.type === filter
  );

  const toggleGardenList = (plant) => {
    setGardenList((prev) =>
      prev.includes(plant.name) ? prev.filter((n) => n !== plant.name) : [...prev, plant.name]
    );
  };

  const gardenPlants = PLANTS.filter((p) => gardenList.includes(p.name));

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(170deg, #e8f5e9 0%, #fff9c4 30%, #fff3e0 60%, #fce4ec 100%)", fontFamily: "'Noto Sans KR', 'Nunito', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet" />

      {["🌸", "🌿", "🌷", "🐝", "☘️", "🌻"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 14}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.12, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌱🌷🌻</div>
          <h1 style={{ fontFamily: "'Jua', cursive", fontSize: "clamp(28px, 5vw, 42px)", color: "#2e7d32", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            봄 텃밭 플래너
          </h1>
          <p style={{ color: "#6d8f3f", fontSize: 16, margin: 0, fontWeight: 600 }}>
            지역을 선택하고, 작물을 고르면 맞춤 파종 일정을 알려드려요!
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "24px 28px", marginBottom: 24, boxShadow: "0 4px 20px rgba(46,125,50,0.1)", border: "2px solid rgba(46,125,50,0.12)" }}>
          <label style={{ fontWeight: 700, color: "#2e7d32", fontSize: 15, display: "block", marginBottom: 10 }}>
            🗺️ 어느 지역에서 키우시나요?
          </label>
          <select value={region} onChange={(e) => { setRegion(e.target.value); setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }}
            style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #c8e6c9", fontSize: 16, fontFamily: "inherit", background: "#f1f8e9", color: "#333", cursor: "pointer", outline: "none", appearance: "auto" }}>
            <option value="">지역을 선택하세요...</option>
            {Object.entries(REGIONS).map(([key, val]) => (
              <option key={key} value={key}>{val.name} — 마지막 서리: {val.lastFrost}</option>
            ))}
          </select>
          <p style={{ fontSize: 13, color: "#888", margin: "8px 0 0 0" }}>
            기상청 평년값 기준 마지막 서리일을 참고합니다
          </p>
        </div>

        {region && (
          <>
            <div ref={resultsRef} style={{ background: "linear-gradient(135deg, #a5d6a7 0%, #c5e1a5 100%)", borderRadius: 16, padding: "16px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div><span style={{ fontWeight: 800, color: "#1b5e20" }}>마지막 서리: </span><span style={{ color: "#2e7d32", fontWeight: 600 }}>{REGIONS[region].lastFrost}</span></div>
              <div><span style={{ fontWeight: 800, color: "#1b5e20" }}>첫 서리: </span><span style={{ color: "#2e7d32", fontWeight: 600 }}>{REGIONS[region].firstFrost}</span></div>
              <div><span style={{ fontWeight: 800, color: "#1b5e20" }}>기후대: </span><span style={{ color: "#2e7d32", fontWeight: 600 }}>{REGIONS[region].climate}</span></div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {TYPE_FILTERS.map((t) => (
                <button key={t} onClick={() => setFilter(t)}
                  style={{ padding: "8px 18px", borderRadius: 50, border: "2px solid " + (filter === t ? "#43a047" : "#c8e6c9"), background: filter === t ? "#43a047" : "rgba(255,255,255,0.8)", color: filter === t ? "#fff" : "#4a7c4f", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                  {t === "전체" ? "🌈 전체" : t === "채소" ? "🥬 채소" : t === "허브" ? "🌿 허브" : t === "꽃" ? "🌸 꽃" : "🍓 과일"}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
              {filteredPlants.map((plant) => {
                const plantDate = getPlantingDate(region, plant.weeksBeforeFrost);
                const status = getStatus(plantDate);
                const inGarden = gardenList.includes(plant.name);
                const isSelected = selectedPlant?.name === plant.name;

                return (
                  <div key={plant.name} onClick={() => setSelectedPlant(isSelected ? null : plant)}
                    style={{ background: isSelected ? "linear-gradient(135deg, #fff9c4, #ffffff)" : "rgba(255,255,255,0.9)", borderRadius: 16, padding: "20px", cursor: "pointer", border: isSelected ? "2px solid #f9a825" : "2px solid rgba(46,125,50,0.08)", boxShadow: isSelected ? "0 6px 24px rgba(249,168,37,0.2)" : "0 2px 12px rgba(0,0,0,0.04)", transition: "all 0.25s", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ fontSize: 32 }}>{plant.emoji}</span>
                        <h3 style={{ margin: "8px 0 4px", color: "#2e7d32", fontSize: 17, fontWeight: 800 }}>{plant.name}</h3>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleGardenList(plant); }}
                        style={{ width: 32, height: 32, borderRadius: "50%", border: inGarden ? "2px solid #43a047" : "2px dashed #a5d6a7", background: inGarden ? "#43a047" : "transparent", color: inGarden ? "#fff" : "#a5d6a7", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}
                        title={inGarden ? "목록에서 제거" : "내 텃밭에 추가"}>
                        {inGarden ? "✓" : "+"}
                      </button>
                    </div>
                    <div style={{ display: "inline-block", padding: "3px 10px", borderRadius: 8, background: status.bg, color: status.color, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{status.label}</div>
                    <div style={{ fontSize: 14, color: "#555" }}>
                      <div><strong>노지 파종:</strong> {formatDate(plantDate)}</div>
                      {plant.weeksIndoors > 0 && <div style={{ color: "#888", fontSize: 13 }}>실내 육묘 {plant.weeksIndoors}주 전부터</div>}
                    </div>
                    {isSelected && (
                      <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #ddd", fontSize: 13, color: "#555", lineHeight: 1.7 }}>
                        <div>☀️ {plant.sunlight}</div>
                        <div>💧 {plant.water}</div>
                        <div>📏 간격: {plant.spacing}</div>
                        <div>📅 수확: {plant.daysToHarvest}일</div>
                        <div style={{ marginTop: 8, padding: "8px 12px", background: "#f1f8e9", borderRadius: 10, color: "#558b2f", fontWeight: 600, fontSize: 12 }}>
                          💡 {plant.tips}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {gardenPlants.length > 0 && (
              <div ref={gardenPlanRef} style={{ background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "28px", boxShadow: "0 4px 24px rgba(46,125,50,0.12)", border: "2px solid #a5d6a7" }}>
                <h2 style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", margin: "0 0 4px", fontSize: 22 }}>🪴 내 텃밭 계획</h2>
                <p style={{ color: "#7cb342", margin: "0 0 20px", fontSize: 14, fontWeight: 600 }}>
                  {gardenPlants.length}개 작물 선택 — 파종 일정순으로 정렬!
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {gardenPlants.sort((a, b) => {
                    const dateA = getPlantingDate(region, a.weeksBeforeFrost);
                    const dateB = getPlantingDate(region, b.weeksBeforeFrost);
                    return dateA - dateB;
                  }).map((plant) => {
                    const plantDate = getPlantingDate(region, plant.weeksBeforeFrost);
                    const status = getStatus(plantDate);
                    return (
                      <div key={plant.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", background: status.bg, borderRadius: 12, border: `1.5px solid ${status.color}22` }}>
                        <span style={{ fontSize: 26 }}>{plant.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: "#333", fontSize: 15 }}>{plant.name}</div>
                          <div style={{ fontSize: 13, color: "#777" }}>
                            {plant.weeksIndoors > 0 ? `실내 육묘 ${plant.weeksIndoors}주 전 시작 → ${formatDate(plantDate)} 정식` : `직파: ${formatDate(plantDate)}`}
                          </div>
                        </div>
                        <div style={{ padding: "4px 10px", borderRadius: 8, background: status.color + "18", color: status.color, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{status.label}</div>
                        <button onClick={() => toggleGardenList(plant)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 18, padding: 4 }}>×</button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => downloadPDF(gardenPlanRef.current, 'my-garden-plan.pdf')}
                  style={{
                    width: "100%",
                    marginTop: 20,
                    padding: "14px",
                    borderRadius: 14,
                    border: "none",
                    background: "linear-gradient(135deg, #43a047, #66bb6a)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 15,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "transform 0.15s",
                    boxShadow: "0 4px 15px rgba(67,160,71,0.3)",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  📥 PDF 다운로드
                </button>
              </div>
            )}
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#a5d6a7", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌻🐝🦋</div>
          봄 텃밭 플래너 — 즐거운 농사 되세요!
        </div>
      </div>
    </div>
  );
}
