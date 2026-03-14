'use client';
import { useState, useRef } from "react";

const REGIONS = {
  northeast: { name: "Northeast", seedMult: 1.1, laborMult: 1.2 },
  southeast: { name: "Southeast", seedMult: 0.95, laborMult: 1.0 },
  midwest: { name: "Midwest", seedMult: 1.0, laborMult: 0.95 },
  southwest: { name: "Southwest", seedMult: 1.15, laborMult: 1.1 },
  west: { name: "West Coast", seedMult: 1.25, laborMult: 1.3 },
  northwest: { name: "Pacific Northwest", seedMult: 1.1, laborMult: 1.15 },
};

const CONDITIONS = {
  good: { name: "Good shape — just needs a refresh", mult: 0.6, label: "🌿 Good" },
  fair: { name: "Fair — some bare patches, weeds", mult: 1.0, label: "🌾 Fair" },
  rough: { name: "Rough — mostly weeds or bare dirt", mult: 1.5, label: "🏜️ Rough" },
};

const YARD_PRESETS = [
  { label: "Small", sqft: 2000, desc: "~2,000 sq ft" },
  { label: "Medium", sqft: 5000, desc: "~5,000 sq ft" },
  { label: "Large", sqft: 10000, desc: "~10,000 sq ft" },
  { label: "XL", sqft: 20000, desc: "~20,000 sq ft" },
];

const SERVICES = [
  { id: "seed", name: "Overseeding", emoji: "🌱", baseCostPer1k: 8, desc: "Fill in thin/bare areas" },
  { id: "fertilizer", name: "Fertilizer (spring)", emoji: "🧪", baseCostPer1k: 5, desc: "Balanced NPK for spring green-up" },
  { id: "weed", name: "Weed Control", emoji: "🚫", baseCostPer1k: 4, desc: "Pre-emergent + spot treatment" },
  { id: "aeration", name: "Aeration", emoji: "🕳️", baseCostPer1k: 7, desc: "Core aeration for compacted soil" },
  { id: "dethatch", name: "Dethatching", emoji: "🪮", baseCostPer1k: 6, desc: "Remove dead grass buildup" },
  { id: "mowing", name: "Weekly Mowing (season)", emoji: "🏗️", baseCostPer1k: 3.5, desc: "~26 weeks of mowing" },
  { id: "lime", name: "Lime Treatment", emoji: "⚪", baseCostPer1k: 3, desc: "Balance soil pH" },
  { id: "topdress", name: "Topdressing", emoji: "🪨", baseCostPer1k: 10, desc: "Compost/soil layer for leveling" },
];

function calcCost(basePer1k, sqft, regionMult, conditionMult) {
  return Math.round(basePer1k * (sqft / 1000) * regionMult * conditionMult);
}

export default function LawnCareEstimator() {
  const [region, setRegion] = useState("");
  const [condition, setCondition] = useState("");
  const [sqft, setSqft] = useState(5000);
  const [customSqft, setCustomSqft] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [selectedServices, setSelectedServices] = useState(["seed", "fertilizer", "weed"]);
  const [diyVsPro, setDiyVsPro] = useState("diy");

  const estimateRef = useRef(null);

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

  const activeSqft = useCustom ? parseInt(customSqft) || 0 : sqft;
  const regionData = REGIONS[region];
  const conditionData = CONDITIONS[condition];
  const proMultiplier = diyVsPro === "pro" ? 2.2 : 1;

  const toggleService = (id) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const getEstimate = (service) => {
    if (!regionData || !conditionData || activeSqft <= 0) return null;
    return calcCost(service.baseCostPer1k, activeSqft, regionData.seedMult, conditionData.mult) * proMultiplier;
  };

  const totalEstimate = SERVICES.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => {
    const est = getEstimate(s);
    return sum + (est || 0);
  }, 0);

  const showResults = region && condition && activeSqft > 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #c8e6c9 0%, #e8f5e9 25%, #fffde7 55%, #fff8e1 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {/* Background deco */}
      {["4%", "18%", "35%", "55%", "72%", "88%"].map((top, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top,
            [i % 2 === 0 ? "left" : "right"]: `${2 + (i % 3) * 2}%`,
            fontSize: 22,
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          {["🌿", "🦗", "🌻", "🐛", "☘️", "🌾"][i]}
        </div>
      ))}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏡🌿✂️</div>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(26px, 5vw, 40px)",
              color: "#33691e",
              margin: "0 0 8px",
              textShadow: "2px 2px 0 rgba(255,255,255,0.7)",
            }}
          >
            Lawn Care Cost Estimator
          </h1>
          <p style={{ color: "#689f38", fontSize: 15, margin: 0, fontWeight: 600 }}>
            Find out what it'll cost to get your yard spring-ready
          </p>
        </div>

        {/* Step 1: Region */}
        <Section number="1" title="Where are you?">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {Object.entries(REGIONS).map(([key, val]) => (
              <PillButton key={key} active={region === key} onClick={() => setRegion(key)}>
                {val.name}
              </PillButton>
            ))}
          </div>
        </Section>

        {/* Step 2: Condition */}
        <Section number="2" title="How's your lawn looking?">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {Object.entries(CONDITIONS).map(([key, val]) => (
              <PillButton key={key} active={condition === key} onClick={() => setCondition(key)} wide>
                <span style={{ marginRight: 8 }}>{val.label.split(" ")[0]}</span>
                <span>{val.name}</span>
              </PillButton>
            ))}
          </div>
        </Section>

        {/* Step 3: Size */}
        <Section number="3" title="Yard size">
          {!useCustom ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {YARD_PRESETS.map((p) => (
                <PillButton key={p.label} active={sqft === p.sqft && !useCustom} onClick={() => { setSqft(p.sqft); setUseCustom(false); }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{p.desc}</div>
                </PillButton>
              ))}
            </div>
          ) : null}
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setUseCustom(!useCustom)}
              style={{
                background: "none",
                border: "none",
                color: "#689f38",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 13,
                textDecoration: "underline",
                padding: 0,
              }}
            >
              {useCustom ? "← Use presets" : "Enter custom size"}
            </button>
            {useCustom && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  value={customSqft}
                  onChange={(e) => setCustomSqft(e.target.value)}
                  placeholder="e.g. 7500"
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "2px solid #c5e1a5",
                    fontSize: 16,
                    fontFamily: "inherit",
                    width: 140,
                    background: "#f9fbe7",
                    outline: "none",
                  }}
                />
                <span style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>sq ft</span>
              </div>
            )}
          </div>
        </Section>

        {/* Step 4: Services */}
        <Section number="4" title="What does your lawn need?">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {SERVICES.map((s) => {
              const active = selectedServices.includes(s.id);
              const est = getEstimate(s);
              return (
                <div
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: active ? "2px solid #7cb342" : "2px solid #e0e0e0",
                    background: active ? "#f1f8e9" : "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 20 }}>{s.emoji}</span>
                    <span style={{ fontWeight: 700, color: active ? "#33691e" : "#666", fontSize: 14 }}>{s.name}</span>
                    {active && (
                      <span style={{ marginLeft: "auto", color: "#7cb342", fontWeight: 800, fontSize: 13 }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#999", marginBottom: est ? 6 : 0 }}>{s.desc}</div>
                  {est !== null && active && (
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#558b2f" }}>
                      ${est.toLocaleString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Step 5: DIY vs Pro */}
        <Section number="5" title="DIY or hire a pro?">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <PillButton active={diyVsPro === "diy"} onClick={() => setDiyVsPro("diy")}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🧤</div>
              <div style={{ fontWeight: 800 }}>DIY</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Materials only</div>
            </PillButton>
            <PillButton active={diyVsPro === "pro"} onClick={() => setDiyVsPro("pro")}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>👷</div>
              <div style={{ fontWeight: 800 }}>Hire a Pro</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Materials + labor</div>
            </PillButton>
          </div>
        </Section>

        {/* Results */}
        {showResults && selectedServices.length > 0 && (
          <div
            ref={estimateRef}
            style={{
              background: "rgba(255,255,255,0.93)",
              borderRadius: 22,
              padding: "28px",
              boxShadow: "0 6px 30px rgba(51,105,30,0.12)",
              border: "2px solid #aed581",
              marginTop: 8,
            }}
          >
            <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#33691e", margin: "0 0 6px", fontSize: 24 }}>
              💰 Your Estimate
            </h2>
            <p style={{ color: "#7cb342", fontSize: 13, fontWeight: 600, margin: "0 0 20px" }}>
              {REGIONS[region].name} · {CONDITIONS[condition].label} · {activeSqft.toLocaleString()} sq ft · {diyVsPro === "pro" ? "Professional" : "DIY"}
            </p>

            <button
              onClick={() => downloadPDF(estimateRef.current, 'lawn-care-estimate.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #558b2f, #7cb342)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(85,139,47,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>

            <button
              onClick={() => {
                setRegion("");
                setCondition("");
                setSqft(5000);
                setCustomSqft("");
                setUseCustom(false);
                setSelectedServices(["seed", "fertilizer", "weed"]);
                setDiyVsPro("diy");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "12px",
                borderRadius: 12,
                border: "2px solid #e0e0e0",
                background: "#fff",
                color: "#888",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#555"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#888"; }}
            >
              🔄 Start Over
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {SERVICES.filter((s) => selectedServices.includes(s.id)).map((s) => {
                const est = getEstimate(s);
                return (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 14px",
                      background: "#f9fbe7",
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#555", fontSize: 14 }}>
                      {s.emoji} {s.name}
                    </span>
                    <span style={{ fontWeight: 800, color: "#33691e", fontSize: 16 }}>
                      ${est?.toLocaleString() || "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                background: "linear-gradient(135deg, #33691e, #558b2f)",
                borderRadius: 14,
                color: "#fff",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 16 }}>Estimated Total</span>
              <span style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28 }}>
                ${totalEstimate.toLocaleString()}
              </span>
            </div>

            <p style={{ fontSize: 12, color: "#aaa", margin: "14px 0 0", textAlign: "center" }}>
              * Estimates are approximate and vary by provider, soil conditions, and season. Get 2-3 local quotes for best pricing.
            </p>
            <button
              onClick={() => downloadPDF(estimateRef.current, 'lawn-care-estimate.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #558b2f, #7cb342)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(85,139,47,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#aed581", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌿🦋🏡</div>
          Lawn Care Cost Estimator — Get that curb appeal!
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.85)",
        borderRadius: 20,
        padding: "22px 24px",
        marginBottom: 20,
        boxShadow: "0 3px 16px rgba(51,105,30,0.07)",
        border: "2px solid rgba(51,105,30,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7cb342, #9ccc65)",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {number}
        </div>
        <h3 style={{ margin: 0, color: "#33691e", fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function PillButton({ active, onClick, children, wide }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: wide ? "12px 18px" : "12px 14px",
        borderRadius: 14,
        border: active ? "2px solid #7cb342" : "2px solid #e0e0e0",
        background: active ? "#e8f5e9" : "rgba(255,255,255,0.85)",
        color: active ? "#33691e" : "#777",
        fontWeight: 700,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        textAlign: wide ? "left" : "center",
        display: wide ? "flex" : "block",
        alignItems: "center",
      }}
    >
      {children}
    </button>
  );
}
