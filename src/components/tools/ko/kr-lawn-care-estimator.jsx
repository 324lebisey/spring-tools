'use client';

import { useState, useRef } from "react";

const HOUSING = {
  apartment: { name: "아파트 (베란다/옥상)", emoji: "🏢", areaMult: 0.3, desc: "베란다 텃밭, 화분 관리 중심" },
  villa: { name: "빌라 / 다세대", emoji: "🏘️", areaMult: 0.6, desc: "작은 마당 또는 옥상" },
  house: { name: "단독주택", emoji: "🏡", areaMult: 1.0, desc: "마당, 정원 있는 주택" },
  country: { name: "전원주택 / 농가", emoji: "🌳", areaMult: 1.5, desc: "넓은 마당과 텃밭" },
};

const AREA_PRESETS = [
  { label: "소형", sqm: 10, desc: "~10㎡ (베란다)" },
  { label: "중형", sqm: 50, desc: "~50㎡ (작은 마당)" },
  { label: "대형", sqm: 150, desc: "~150㎡ (넓은 마당)" },
  { label: "특대", sqm: 300, desc: "~300㎡ (전원주택)" },
];

const CONDITIONS = {
  good: { name: "양호 — 관리가 잘 되어 있음", mult: 0.6, label: "🌿 양호" },
  fair: { name: "보통 — 잡초가 좀 있고 관리 필요", mult: 1.0, label: "🌾 보통" },
  rough: { name: "방치됨 — 잡초 투성이, 손 많이 필요", mult: 1.5, label: "🏜️ 방치" },
};

const SERVICES = [
  { id: "weeding", name: "잡초 제거", emoji: "🌿", baseCostPerSqm: 800, desc: "봄맞이 잡초 정리 및 제초" },
  { id: "pruning", name: "전지·전정", emoji: "✂️", baseCostPerSqm: 1200, desc: "나무, 관목 가지치기" },
  { id: "fertilizer", name: "비료·퇴비 시비", emoji: "🧪", baseCostPerSqm: 500, desc: "봄 웃거름, 퇴비 투입" },
  { id: "lawn", name: "잔디 관리", emoji: "🌱", baseCostPerSqm: 700, desc: "잔디 보수, 씨 뿌리기, 깎기" },
  { id: "pest", name: "병충해 방제", emoji: "🐛", baseCostPerSqm: 600, desc: "진딧물, 깍지벌레 등 방제" },
  { id: "mulching", name: "멀칭·바크 깔기", emoji: "🪵", baseCostPerSqm: 900, desc: "수분 보존, 잡초 억제용 멀칭" },
  { id: "planting", name: "봄꽃·모종 식재", emoji: "🌷", baseCostPerSqm: 1500, desc: "철쭉, 수선화 등 봄꽃 식재" },
  { id: "cleanup", name: "정원 대청소", emoji: "🧹", baseCostPerSqm: 400, desc: "낙엽 정리, 겨울 잔해물 청소" },
];

function calcCost(basePer, sqm, housingMult, condMult) {
  return Math.round(basePer * sqm * housingMult * condMult);
}

function formatWon(n) {
  if (n >= 10000) return `${Math.round(n / 10000)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function LawnCareEstimatorKR() {
  const [housing, setHousing] = useState("");
  const [condition, setCondition] = useState("");
  const [sqm, setSqm] = useState(50);
  const [customSqm, setCustomSqm] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [selectedServices, setSelectedServices] = useState(["weeding", "fertilizer", "cleanup"]);
  const [diyVsPro, setDiyVsPro] = useState("diy");

  const activeSqm = useCustom ? parseInt(customSqm) || 0 : sqm;
  const housingData = HOUSING[housing];
  const condData = CONDITIONS[condition];
  const proMult = diyVsPro === "pro" ? 2.5 : 1;

  const toggleService = (id) => setSelectedServices((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const getEstimate = (service) => {
    if (!housingData || !condData || activeSqm <= 0) return null;
    return calcCost(service.baseCostPerSqm, activeSqm, housingData.areaMult, condData.mult) * proMult;
  };

  const totalEstimate = SERVICES.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + (getEstimate(s) || 0), 0);
  const showResults = housing && condition && activeSqm > 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg, #c8e6c9 0%, #e8f5e9 25%, #fffde7 55%, #fff8e1 100%)", fontFamily: "'Noto Sans KR', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet" />
      {["🌿", "🦗", "🌻", "🐛", "☘️", "🌾"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${4 + i * 15}%`, [i % 2 === 0 ? "left" : "right"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏡🌿✂️</div>
          <h1 style={{ fontFamily: "'Jua', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#33691e", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>정원 관리 비용 계산기</h1>
          <p style={{ color: "#689f38", fontSize: 15, margin: 0, fontWeight: 600 }}>봄맞이 정원·마당 관리, 얼마나 들까요?</p>
        </div>

        <Section number="1" title="주거 형태">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {Object.entries(HOUSING).map(([key, val]) => (
              <PillButton key={key} active={housing === key} onClick={() => setHousing(key)}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>{val.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{val.name}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{val.desc}</div>
              </PillButton>
            ))}
          </div>
        </Section>

        <Section number="2" title="현재 상태">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(CONDITIONS).map(([key, val]) => (
              <PillButton key={key} active={condition === key} onClick={() => setCondition(key)} wide>
                <span style={{ marginRight: 8 }}>{val.label.split(" ")[0]}</span><span>{val.name}</span>
              </PillButton>
            ))}
          </div>
        </Section>

        <Section number="3" title="관리 면적">
          {!useCustom && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {AREA_PRESETS.map((p) => (
                <PillButton key={p.label} active={sqm === p.sqm && !useCustom} onClick={() => { setSqm(p.sqm); setUseCustom(false); }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{p.desc}</div>
                </PillButton>
              ))}
            </div>
          )}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setUseCustom(!useCustom)} style={{ background: "none", border: "none", color: "#689f38", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", padding: 0 }}>
              {useCustom ? "← 프리셋 사용" : "직접 입력"}
            </button>
            {useCustom && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="number" value={customSqm} onChange={(e) => setCustomSqm(e.target.value)} placeholder="예: 100"
                  style={{ padding: "10px 14px", borderRadius: 12, border: "2px solid #c5e1a5", fontSize: 16, fontFamily: "inherit", width: 120, background: "#f9fbe7", outline: "none" }} />
                <span style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>㎡</span>
              </div>
            )}
          </div>
        </Section>

        <Section number="4" title="필요한 서비스">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s.id);
              const est = getEstimate(s);
              return (
                <div key={s.id} onClick={() => toggleService(s.id)}
                  style={{ padding: "14px 16px", borderRadius: 14, border: active ? "2px solid #7cb342" : "2px solid #e0e0e0", background: active ? "#f1f8e9" : "rgba(255,255,255,0.8)", cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <span style={{ fontWeight: 700, color: active ? "#33691e" : "#666", fontSize: 14 }}>{s.name}</span>
                    {active && <span style={{ marginLeft: "auto", color: "#7cb342", fontWeight: 800, fontSize: 13 }}>✓</span>}
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: est ? 6 : 0 }}>{s.desc}</div>
                  {est !== null && active && <div style={{ fontSize: 15, fontWeight: 800, color: "#558b2f" }}>{formatWon(est)}</div>}
                </div>
              );
            })}
          </div>
        </Section>

        <Section number="5" title="직접 하기 vs 전문업체">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PillButton active={diyVsPro === "diy"} onClick={() => setDiyVsPro("diy")}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🧤</div>
              <div style={{ fontWeight: 800 }}>직접 하기 (DIY)</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>재료비만</div>
            </PillButton>
            <PillButton active={diyVsPro === "pro"} onClick={() => setDiyVsPro("pro")}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>👷</div>
              <div style={{ fontWeight: 800 }}>전문업체 의뢰</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>재료비 + 인건비</div>
            </PillButton>
          </div>
        </Section>

        {showResults && selectedServices.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.93)", borderRadius: 22, padding: "28px", boxShadow: "0 6px 30px rgba(51,105,30,0.12)", border: "2px solid #aed581", marginTop: 8 }}>
            <h2 style={{ fontFamily: "'Jua', cursive", color: "#33691e", margin: "0 0 6px", fontSize: 24 }}>💰 예상 비용</h2>
            <p style={{ color: "#7cb342", fontSize: 13, fontWeight: 600, margin: "0 0 20px" }}>
              {HOUSING[housing].name} · {CONDITIONS[condition].label} · {activeSqm}㎡ · {diyVsPro === "pro" ? "전문업체" : "DIY"}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => {
                const est = getEstimate(s);
                return (
                  <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f9fbe7", borderRadius: 10 }}>
                    <span style={{ fontWeight: 600, color: "#555", fontSize: 14 }}>{s.emoji} {s.name}</span>
                    <span style={{ fontWeight: 800, color: "#33691e", fontSize: 16 }}>{formatWon(est || 0)}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "linear-gradient(135deg, #33691e, #558b2f)", borderRadius: 14, color: "#fff" }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>예상 총 비용</span>
              <span style={{ fontFamily: "'Jua', cursive", fontSize: 28 }}>{formatWon(totalEstimate)}</span>
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "14px 0 0", textAlign: "center" }}>
              * 예상 비용은 참고용이며, 업체와 지역에 따라 달라질 수 있습니다. 2-3곳에서 견적을 받아보세요.
            </p>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#aed581", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌿🦋🏡</div>
          정원 관리 비용 계산기 — 아름다운 정원을 가꿔보세요!
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(51,105,30,0.07)", border: "2px solid rgba(51,105,30,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #7cb342, #9ccc65)", color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{number}</div>
        <h3 style={{ margin: 0, color: "#33691e", fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PillButton({ active, onClick, children, wide }) {
  return (
    <button onClick={onClick} style={{
      padding: wide ? "12px 18px" : "12px 14px", borderRadius: 14,
      border: active ? "2px solid #7cb342" : "2px solid #e0e0e0",
      background: active ? "#e8f5e9" : "rgba(255,255,255,0.85)",
      color: active ? "#33691e" : "#777", fontWeight: 700, fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      textAlign: wide ? "left" : "center", display: wide ? "flex" : "block", alignItems: "center",
    }}>{children}</button>
  );
}
