'use client';
import { useState, useRef } from "react";

const ZONES = {
  "3": { name: "Zone 3 (Very Cold)", lastFrost: "May 15", firstFrost: "Sep 15" },
  "4": { name: "Zone 4 (Cold)", lastFrost: "May 10", firstFrost: "Sep 25" },
  "5": { name: "Zone 5 (Moderate Cold)", lastFrost: "Apr 30", firstFrost: "Oct 1" },
  "6": { name: "Zone 6 (Moderate)", lastFrost: "Apr 15", firstFrost: "Oct 15" },
  "7": { name: "Zone 7 (Mild)", lastFrost: "Apr 1", firstFrost: "Oct 30" },
  "8": { name: "Zone 8 (Warm)", lastFrost: "Mar 15", firstFrost: "Nov 15" },
  "9": { name: "Zone 9 (Hot)", lastFrost: "Feb 15", firstFrost: "Dec 1" },
  "10": { name: "Zone 10 (Very Hot)", lastFrost: "Jan 31", firstFrost: "Dec 15" },
};

const PLANTS = [
  {
    name: "Tomatoes",
    emoji: "🍅",
    type: "vegetable",
    weeksBeforeFrost: -2,
    weeksIndoors: 6,
    spacing: "24-36 in",
    water: "1-2 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "60-85",
    tips: "Stake or cage plants early. Pinch suckers for larger fruit.",
  },
  {
    name: "Peppers",
    emoji: "🌶️",
    type: "vegetable",
    weeksBeforeFrost: -2,
    weeksIndoors: 8,
    spacing: "18-24 in",
    water: "1-2 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "60-90",
    tips: "Wait until soil is warm. Mulch to retain moisture.",
  },
  {
    name: "Lettuce",
    emoji: "🥬",
    type: "vegetable",
    weeksBeforeFrost: 4,
    weeksIndoors: 0,
    spacing: "6-12 in",
    water: "1 in/week",
    sunlight: "Partial shade OK",
    daysToHarvest: "30-60",
    tips: "Succession plant every 2 weeks for continuous harvest.",
  },
  {
    name: "Carrots",
    emoji: "🥕",
    type: "vegetable",
    weeksBeforeFrost: 3,
    weeksIndoors: 0,
    spacing: "2-3 in",
    water: "1 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "70-80",
    tips: "Loosen soil 12 inches deep. Thin seedlings to avoid crowding.",
  },
  {
    name: "Cucumbers",
    emoji: "🥒",
    type: "vegetable",
    weeksBeforeFrost: -2,
    weeksIndoors: 3,
    spacing: "36-60 in",
    water: "1-2 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "50-70",
    tips: "Trellis for straighter fruit. Pick frequently to encourage production.",
  },
  {
    name: "Zucchini",
    emoji: "🫛",
    type: "vegetable",
    weeksBeforeFrost: -2,
    weeksIndoors: 3,
    spacing: "24-36 in",
    water: "1-2 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "45-55",
    tips: "One plant produces a LOT. Start with 2-3 plants max.",
  },
  {
    name: "Basil",
    emoji: "🌿",
    type: "herb",
    weeksBeforeFrost: -2,
    weeksIndoors: 6,
    spacing: "12-18 in",
    water: "1 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "50-75",
    tips: "Pinch flowers to keep leaves growing. Harvest from the top.",
  },
  {
    name: "Cilantro",
    emoji: "🌱",
    type: "herb",
    weeksBeforeFrost: 2,
    weeksIndoors: 0,
    spacing: "6-8 in",
    water: "1 in/week",
    sunlight: "Partial shade OK",
    daysToHarvest: "45-70",
    tips: "Bolts fast in heat. Plant in cool weather, succession sow.",
  },
  {
    name: "Peas",
    emoji: "🫛",
    type: "vegetable",
    weeksBeforeFrost: 6,
    weeksIndoors: 0,
    spacing: "2-4 in",
    water: "1 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "55-70",
    tips: "Provide a trellis. Plant as early as soil can be worked.",
  },
  {
    name: "Sunflowers",
    emoji: "🌻",
    type: "flower",
    weeksBeforeFrost: -1,
    weeksIndoors: 0,
    spacing: "12-24 in",
    water: "1 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "70-100",
    tips: "Direct sow after frost. Stake tall varieties. Great for pollinators!",
  },
  {
    name: "Marigolds",
    emoji: "🏵️",
    type: "flower",
    weeksBeforeFrost: -1,
    weeksIndoors: 6,
    spacing: "8-12 in",
    water: "1 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "45-50",
    tips: "Excellent companion plant. Deters pests from veggies.",
  },
  {
    name: "Strawberries",
    emoji: "🍓",
    type: "fruit",
    weeksBeforeFrost: 4,
    weeksIndoors: 0,
    spacing: "12-18 in",
    water: "1-2 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "60-90",
    tips: "Pinch first-year flowers for stronger plants. Mulch heavily.",
  },
  {
    name: "Radishes",
    emoji: "🔴",
    type: "vegetable",
    weeksBeforeFrost: 4,
    weeksIndoors: 0,
    spacing: "1-2 in",
    water: "1 in/week",
    sunlight: "Full sun (6-8h)",
    daysToHarvest: "22-30",
    tips: "Fastest crop! Great for impatient gardeners. Don't let them overgrow.",
  },
  {
    name: "Mint",
    emoji: "🍃",
    type: "herb",
    weeksBeforeFrost: 2,
    weeksIndoors: 0,
    spacing: "18-24 in",
    water: "1-2 in/week",
    sunlight: "Partial shade OK",
    daysToHarvest: "90",
    tips: "ALWAYS grow in a container — it spreads aggressively!",
  },
];

const TYPE_FILTERS = ["all", "vegetable", "herb", "flower", "fruit"];

function getPlantingDate(zone, weeksBeforeFrost) {
  const zoneData = ZONES[zone];
  if (!zoneData) return null;
  const [month, day] = zoneData.lastFrost.split(" ");
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
  const frostDate = new Date(2026, months[month], parseInt(day));
  const plantDate = new Date(frostDate);
  plantDate.setDate(plantDate.getDate() - weeksBeforeFrost * 7);
  return plantDate;
}

function formatDate(date) {
  if (!date) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getStatus(plantDate) {
  const now = new Date();
  const diff = (plantDate - now) / (1000 * 60 * 60 * 24);
  if (diff < -14) return { label: "Overdue!", color: "#e74c3c", bg: "#fdeaea" };
  if (diff < 0) return { label: "Plant now!", color: "#27ae60", bg: "#eafaf1" };
  if (diff < 14) return { label: "Coming up", color: "#f39c12", bg: "#fef9e7" };
  return { label: "Upcoming", color: "#7f8c8d", bg: "#f0f0f0" };
}

const Flower = ({ style }) => (
  <div style={{ position: "absolute", fontSize: "24px", opacity: 0.15, pointerEvents: "none", ...style }}>🌸</div>
);

const Leaf = ({ style }) => (
  <div style={{ position: "absolute", fontSize: "20px", opacity: 0.12, pointerEvents: "none", ...style }}>🌿</div>
);

export default function SpringGardenPlanner() {
  const [zone, setZone] = useState("");
  const [filter, setFilter] = useState("all");
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
    (p) => filter === "all" || p.type === filter
  );

  const toggleGardenList = (plant) => {
    setGardenList((prev) =>
      prev.includes(plant.name) ? prev.filter((n) => n !== plant.name) : [...prev, plant.name]
    );
  };

  const gardenPlants = PLANTS.filter((p) => gardenList.includes(p.name));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(170deg, #e8f5e9 0%, #fff9c4 30%, #fff3e0 60%, #fce4ec 100%)",
        fontFamily: "'Nunito', 'Quicksand', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {/* Decorative elements */}
      <Flower style={{ top: "5%", left: "3%" }} />
      <Flower style={{ top: "12%", right: "5%" }} />
      <Leaf style={{ top: "20%", left: "8%" }} />
      <Flower style={{ top: "35%", right: "3%" }} />
      <Leaf style={{ top: "50%", left: "2%" }} />
      <Flower style={{ top: "65%", right: "7%" }} />
      <Leaf style={{ top: "80%", left: "5%" }} />
      <Flower style={{ top: "90%", right: "4%" }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌱🌷🌻</div>
          <h1
            style={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "clamp(28px, 5vw, 42px)",
              color: "#2e7d32",
              margin: "0 0 8px 0",
              textShadow: "2px 2px 0 rgba(255,255,255,0.7)",
              letterSpacing: "-0.5px",
            }}
          >
            Spring Garden Planner
          </h1>
          <p style={{ color: "#6d8f3f", fontSize: 16, margin: 0, fontWeight: 600 }}>
            Pick your zone, choose your plants, get your personalized planting schedule!
          </p>
        </div>

        {/* Zone Selector */}
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 24,
            boxShadow: "0 4px 20px rgba(46,125,50,0.1)",
            border: "2px solid rgba(46,125,50,0.12)",
          }}
        >
          <label
            style={{
              fontWeight: 700,
              color: "#2e7d32",
              fontSize: 15,
              display: "block",
              marginBottom: 10,
            }}
          >
            🗺️ What's your USDA Hardiness Zone?
          </label>
          <select
            value={zone}
            onChange={(e) => {
              setZone(e.target.value);
              setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: "2px solid #c8e6c9",
              fontSize: 16,
              fontFamily: "inherit",
              background: "#f1f8e9",
              color: "#333",
              cursor: "pointer",
              outline: "none",
              transition: "border-color 0.2s",
              appearance: "auto",
            }}
          >
            <option value="">Select your zone...</option>
            {Object.entries(ZONES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.name} — Last frost: {val.lastFrost}
              </option>
            ))}
          </select>
          <p style={{ fontSize: 13, color: "#888", margin: "8px 0 0 0" }}>
            Not sure? Search "USDA hardiness zone" + your zip code
          </p>
        </div>

        {zone && (
          <>
            {/* Zone info */}
            <div
              ref={resultsRef}
              style={{
                background: "linear-gradient(135deg, #a5d6a7 0%, #c5e1a5 100%)",
                borderRadius: 16,
                padding: "16px 24px",
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <span style={{ fontWeight: 800, color: "#1b5e20" }}>Last Frost: </span>
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>{ZONES[zone].lastFrost}</span>
              </div>
              <div>
                <span style={{ fontWeight: 800, color: "#1b5e20" }}>First Fall Frost: </span>
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>{ZONES[zone].firstFrost}</span>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {TYPE_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 50,
                    border: "2px solid " + (filter === t ? "#43a047" : "#c8e6c9"),
                    background: filter === t ? "#43a047" : "rgba(255,255,255,0.8)",
                    color: filter === t ? "#fff" : "#4a7c4f",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textTransform: "capitalize",
                    transition: "all 0.2s",
                  }}
                >
                  {t === "all" ? "🌈 All" : t === "vegetable" ? "🥕 Vegetables" : t === "herb" ? "🌿 Herbs" : t === "flower" ? "🌸 Flowers" : "🍓 Fruit"}
                </button>
              ))}
            </div>

            {/* Plant cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
              {filteredPlants.map((plant) => {
                const plantDate = getPlantingDate(zone, plant.weeksBeforeFrost);
                const status = getStatus(plantDate);
                const inGarden = gardenList.includes(plant.name);
                const isSelected = selectedPlant?.name === plant.name;

                return (
                  <div
                    key={plant.name}
                    onClick={() => setSelectedPlant(isSelected ? null : plant)}
                    style={{
                      background: isSelected
                        ? "linear-gradient(135deg, #fff9c4, #ffffff)"
                        : "rgba(255,255,255,0.9)",
                      borderRadius: 16,
                      padding: "20px",
                      cursor: "pointer",
                      border: isSelected
                        ? "2px solid #f9a825"
                        : "2px solid rgba(46,125,50,0.08)",
                      boxShadow: isSelected
                        ? "0 6px 24px rgba(249,168,37,0.2)"
                        : "0 2px 12px rgba(0,0,0,0.04)",
                      transition: "all 0.25s ease",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ fontSize: 32 }}>{plant.emoji}</span>
                        <h3 style={{ margin: "8px 0 4px", color: "#2e7d32", fontSize: 17, fontWeight: 800 }}>
                          {plant.name}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGardenList(plant);
                        }}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          border: inGarden ? "2px solid #43a047" : "2px dashed #a5d6a7",
                          background: inGarden ? "#43a047" : "transparent",
                          color: inGarden ? "#fff" : "#a5d6a7",
                          fontSize: 18,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                          flexShrink: 0,
                        }}
                        title={inGarden ? "Remove from garden" : "Add to garden"}
                      >
                        {inGarden ? "✓" : "+"}
                      </button>
                    </div>

                    <div
                      style={{
                        display: "inline-block",
                        padding: "3px 10px",
                        borderRadius: 8,
                        background: status.bg,
                        color: status.color,
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 8,
                      }}
                    >
                      {status.label}
                    </div>

                    <div style={{ fontSize: 14, color: "#555" }}>
                      <div>
                        <strong>Plant outdoors:</strong> {formatDate(plantDate)}
                      </div>
                      {plant.weeksIndoors > 0 && (
                        <div style={{ color: "#888", fontSize: 13 }}>
                          Start indoors {plant.weeksIndoors}wks before
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div
                        style={{
                          marginTop: 14,
                          paddingTop: 14,
                          borderTop: "1px dashed #ddd",
                          fontSize: 13,
                          color: "#555",
                          lineHeight: 1.7,
                        }}
                      >
                        <div>☀️ {plant.sunlight}</div>
                        <div>💧 {plant.water}</div>
                        <div>📏 Spacing: {plant.spacing}</div>
                        <div>📅 Harvest: {plant.daysToHarvest} days</div>
                        <div
                          style={{
                            marginTop: 8,
                            padding: "8px 12px",
                            background: "#f1f8e9",
                            borderRadius: 10,
                            color: "#558b2f",
                            fontWeight: 600,
                            fontSize: 12,
                          }}
                        >
                          💡 {plant.tips}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* My Garden Summary */}
            {gardenPlants.length > 0 && (
              <div
                ref={gardenPlanRef}
                style={{
                  background: "rgba(255,255,255,0.92)",
                  borderRadius: 20,
                  padding: "28px",
                  boxShadow: "0 4px 24px rgba(46,125,50,0.12)",
                  border: "2px solid #a5d6a7",
                }}
              >
                <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#2e7d32", margin: "0 0 4px", fontSize: 22 }}>
                  🪴 My Garden Plan
                </h2>
                <p style={{ color: "#7cb342", margin: "0 0 20px", fontSize: 14, fontWeight: 600 }}>
                  {gardenPlants.length} plant{gardenPlants.length > 1 ? "s" : ""} selected — here's your timeline!
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {gardenPlants
                    .sort((a, b) => {
                      const dateA = getPlantingDate(zone, a.weeksBeforeFrost);
                      const dateB = getPlantingDate(zone, b.weeksBeforeFrost);
                      return dateA - dateB;
                    })
                    .map((plant) => {
                      const plantDate = getPlantingDate(zone, plant.weeksBeforeFrost);
                      const status = getStatus(plantDate);
                      return (
                        <div
                          key={plant.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "12px 16px",
                            background: status.bg,
                            borderRadius: 12,
                            border: `1.5px solid ${status.color}22`,
                          }}
                        >
                          <span style={{ fontSize: 26 }}>{plant.emoji}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: "#333", fontSize: 15 }}>{plant.name}</div>
                            <div style={{ fontSize: 13, color: "#777" }}>
                              {plant.weeksIndoors > 0
                                ? `Start indoors ${plant.weeksIndoors} weeks early → transplant ${formatDate(plantDate)}`
                                : `Direct sow: ${formatDate(plantDate)}`}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              background: status.color + "18",
                              color: status.color,
                              fontSize: 12,
                              fontWeight: 700,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {status.label}
                          </div>
                          <button
                            onClick={() => toggleGardenList(plant)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#ccc",
                              cursor: "pointer",
                              fontSize: 18,
                              padding: 4,
                            }}
                            title="Remove"
                          >
                            ×
                          </button>
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
                  📥 Download as PDF
                </button>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#a5d6a7", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌻🐝🦋</div>
          Spring Garden Planner — Happy growing season!
        </div>
      </div>
    </div>
  );
}
