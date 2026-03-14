'use client';
import { useState, useRef, useEffect } from "react";

const REGIONS = [
  { id: "northeast", name: "Northeast", emoji: "🍂", peak: "Apr–Jun", topAllergens: ["Tree pollen (oak, birch, maple)", "Grass pollen (May–Jul)", "Mold spores (spring rain)"] },
  { id: "southeast", name: "Southeast", emoji: "🌺", peak: "Mar–Jun", topAllergens: ["Tree pollen (oak, pine, cedar)", "Grass pollen (Apr–Jun)", "Mold (high humidity)"] },
  { id: "midwest", name: "Midwest", emoji: "🌾", peak: "Apr–Jun", topAllergens: ["Tree pollen (oak, elm, ash)", "Grass pollen (May–Jul)", "Ragweed (late summer preview)"] },
  { id: "southwest", name: "Southwest", emoji: "🌵", peak: "Feb–May", topAllergens: ["Desert pollen (mesquite, palo verde)", "Dust & wind-borne particles", "Juniper/cedar (early spring)"] },
  { id: "west", name: "West Coast", emoji: "🌊", peak: "Mar–Jun", topAllergens: ["Tree pollen (alder, oak, olive)", "Grass pollen (Apr–Jul)", "Mold (coastal fog)"] },
  { id: "northwest", name: "Pacific NW", emoji: "🌲", peak: "Apr–Jul", topAllergens: ["Tree pollen (alder, birch, cedar)", "Grass pollen (May–Aug)", "Mold spores (rain + damp)"] },
];

const SYMPTOMS = [
  { id: "sneezing", name: "Sneezing", emoji: "🤧" },
  { id: "congestion", name: "Congestion", emoji: "😤" },
  { id: "itchy_eyes", name: "Itchy / watery eyes", emoji: "👁️" },
  { id: "runny_nose", name: "Runny nose", emoji: "💧" },
  { id: "scratchy_throat", name: "Scratchy throat", emoji: "😖" },
  { id: "headache", name: "Sinus headaches", emoji: "🤕" },
  { id: "fatigue", name: "Fatigue / brain fog", emoji: "😴" },
  { id: "cough", name: "Cough", emoji: "😷" },
  { id: "skin", name: "Skin irritation / hives", emoji: "🔴" },
  { id: "asthma", name: "Asthma flare-ups", emoji: "🫁" },
];

const SEVERITY = [
  { id: "mild", label: "Mild", emoji: "🟢", desc: "Annoying but manageable", color: "#43a047" },
  { id: "moderate", label: "Moderate", emoji: "🟡", desc: "Affects daily life", color: "#f9a825" },
  { id: "severe", label: "Severe", emoji: "🔴", desc: "Debilitating — need serious help", color: "#e53935" },
];

const MED_TIMING = [
  { id: "before", label: "Start meds before season", emoji: "⏰", desc: "2-4 weeks before your peak" },
  { id: "during", label: "Take when symptoms start", emoji: "🤧", desc: "Reactive approach" },
  { id: "unsure", label: "Not sure what to do", emoji: "🤷", desc: "I need guidance" },
];

const SYMPTOM_REMEDIES = {
  sneezing: {
    otc: ["Non-drowsy antihistamine (e.g., cetirizine, loratadine) — take daily during season", "Nasal saline spray to flush out pollen"],
    home: ["Shower and change clothes immediately after being outside", "Keep windows closed on high pollen days"],
    avoid: ["Going outside during peak pollen hours (5am–10am)", "Hanging laundry outside to dry"],
  },
  congestion: {
    otc: ["Nasal corticosteroid spray (e.g., fluticasone) — most effective for congestion", "Decongestant (short-term only, max 3 days for sprays)"],
    home: ["Steam inhalation — hot shower or bowl of hot water with towel", "Elevate head while sleeping with an extra pillow", "Use a humidifier at 40-50% humidity"],
    avoid: ["Overusing nasal decongestant sprays (rebound congestion)", "Dairy if it thickens your mucus (varies by person)"],
  },
  itchy_eyes: {
    otc: ["Antihistamine eye drops (e.g., ketotifen)", "Oral antihistamine for overall relief"],
    home: ["Cold compress on closed eyes for 5-10 minutes", "Wear wrap-around sunglasses outdoors", "Wash face and eyelids after being outside"],
    avoid: ["Rubbing your eyes (makes it worse!)", "Wearing contact lenses on high pollen days if possible"],
  },
  runny_nose: {
    otc: ["Non-drowsy antihistamine (cetirizine or loratadine)", "Nasal corticosteroid spray for ongoing relief"],
    home: ["Nasal saline rinse (neti pot or squeeze bottle)", "Stay hydrated — water, tea, broth", "Apply a thin layer of petroleum jelly inside nostrils to trap pollen"],
    avoid: ["Blowing your nose too hard (can cause sinus pressure)", "Strong perfumes or scented candles that add irritation"],
  },
  scratchy_throat: {
    otc: ["Antihistamine to reduce post-nasal drip", "Throat lozenges or honey-based cough drops"],
    home: ["Warm water with honey and lemon", "Gargle with warm salt water", "Run a humidifier in your bedroom at night"],
    avoid: ["Very cold drinks (can irritate further)", "Whispering (actually strains your throat more than talking softly)"],
  },
  headache: {
    otc: ["Nasal corticosteroid spray (reduces sinus inflammation)", "Pain reliever + decongestant combo if needed"],
    home: ["Warm compress across forehead and nose bridge", "Steam inhalation to relieve sinus pressure", "Stay well hydrated — dehydration worsens headaches"],
    avoid: ["Bending over for long periods (increases sinus pressure)", "Skipping meals — blood sugar drops worsen headaches"],
  },
  fatigue: {
    otc: ["Switch to non-drowsy antihistamine if current one causes sleepiness", "Consider nasal spray as primary treatment (less systemic fatigue)"],
    home: ["Prioritize 7-9 hours of sleep during allergy season", "Light exercise (boosts energy, but indoors on bad days)", "Stay hydrated — fatigue is often dehydration in disguise"],
    avoid: ["First-gen antihistamines like diphenhydramine (very drowsy)", "Overcommitting your schedule during peak season — pace yourself"],
  },
  cough: {
    otc: ["Antihistamine to reduce post-nasal drip (common cough cause)", "Nasal corticosteroid spray"],
    home: ["Honey (1 tbsp) — proven cough suppressant", "Elevate your head at night to reduce post-nasal drip", "Stay hydrated to thin mucus"],
    avoid: ["Lying flat (worsens post-nasal drip cough)", "Dry indoor air — use a humidifier"],
  },
  skin: {
    otc: ["Non-drowsy oral antihistamine", "Hydrocortisone cream 1% for localized irritation", "Calamine lotion for itching"],
    home: ["Cool oatmeal bath for widespread irritation", "Fragrance-free moisturizer immediately after bathing", "Cool compress on affected areas"],
    avoid: ["Hot showers (strip protective oils from skin)", "Scented soaps, lotions, and detergents during flares"],
  },
  asthma: {
    otc: ["⚠️ Talk to your doctor before allergy season about an updated action plan", "Keep rescue inhaler accessible at all times"],
    home: ["Monitor local pollen counts daily and limit outdoor time on high days", "Use air purifier with HEPA filter in bedroom", "Keep windows closed and use AC with a clean filter"],
    avoid: ["Exercising outdoors on high pollen days", "Skipping controller medications — consistency is key", "Ignoring early warning signs (don't tough it out)"],
  },
};

const HOME_PREP_TASKS = [
  { task: "Replace HVAC air filter with MERV 11-13 rated filter", emoji: "🏠", category: "air" },
  { task: "Set up HEPA air purifier in bedroom", emoji: "💨", category: "air" },
  { task: "Wash all bedding in hot water", emoji: "🛏️", category: "bedroom" },
  { task: "Vacuum with HEPA filter vacuum (mattress, upholstery, floors)", emoji: "🧹", category: "clean" },
  { task: "Dust all surfaces with damp cloth (dry dusting spreads allergens)", emoji: "✨", category: "clean" },
  { task: "Check and clean bathroom exhaust fans (mold prevention)", emoji: "🚿", category: "clean" },
  { task: "Wash or replace pillow covers with allergen-proof covers", emoji: "🛌", category: "bedroom" },
  { task: "Stock up on saline nasal spray and tissues", emoji: "🧴", category: "supplies" },
  { task: "Set up a 'decontamination zone' at entryway for shoes and jackets", emoji: "🚪", category: "home" },
  { task: "Clean window screens and seals", emoji: "🪟", category: "clean" },
  { task: "Check that dryer vents to outside (not into attic/crawlspace)", emoji: "🌀", category: "home" },
  { task: "Designate indoor-only clothes for high pollen days", emoji: "👕", category: "routine" },
];

const DAILY_ROUTINE = {
  morning: [
    { task: "Check today's pollen forecast before going outside", emoji: "📱" },
    { task: "Take antihistamine with breakfast (if daily regimen)", emoji: "💊" },
    { task: "Apply nasal spray if part of your routine", emoji: "👃" },
    { task: "Wear sunglasses when heading out", emoji: "🕶️" },
  ],
  afternoon: [
    { task: "If you've been outside, change clothes when you get home", emoji: "👕" },
    { task: "Wash hands and face after outdoor time", emoji: "🧼" },
    { task: "Keep windows closed if pollen count is medium-high", emoji: "🪟" },
    { task: "Run air purifier in main living space", emoji: "💨" },
  ],
  evening: [
    { task: "Shower before bed to rinse pollen from hair and skin", emoji: "🚿" },
    { task: "Do a nasal saline rinse to clear the day's allergens", emoji: "💧" },
    { task: "Ensure bedroom air purifier is running", emoji: "😴" },
    { task: "Keep bedroom windows closed overnight", emoji: "🌙" },
  ],
};

export default function AllergyPrepTool() {
  const [region, setRegion] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [severity, setSeverity] = useState("");
  const [timing, setTiming] = useState("");
  const [plan, setPlan] = useState(false);
  const [checked, setChecked] = useState({});
  const [expandedSymptom, setExpandedSymptom] = useState({});
  const resultRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("allergy-prep-checked");
    if (saved) { try { setChecked(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    if (Object.keys(checked).length > 0) {
      localStorage.setItem("allergy-prep-checked", JSON.stringify(checked));
    }
  }, [checked]);

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

  const toggleSymptom = (id) => {
    setSymptoms((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleCheck = (key) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const generate = () => {
    setPlan(true);
    setChecked({});
    setExpandedSymptom(symptoms[0] ? {[symptoms[0]]: true} : {});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const regionData = REGIONS.find((r) => r.id === region);
  const canGenerate = region && symptoms.length > 0 && severity && timing;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e8eaf6 0%, #e1f5fe 25%, #f1f8e9 55%, #fffde7 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {["🌸", "🤧", "🌳", "💐", "🐝", "🌼"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🤧🌸💊</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 38px)", color: "#5c6bc0", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            Allergy Season Prep Tool
          </h1>
          <p style={{ color: "#7986cb", fontSize: 15, margin: 0, fontWeight: 600 }}>
            Get a personalized action plan to survive — and thrive — through allergy season
          </p>
        </div>

        {/* Region */}
        <Section num="1" title="Where do you live?" color="#5c6bc0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {REGIONS.map((r) => (
              <Btn key={r.id} active={region === r.id} onClick={() => setRegion(r.id)} color="#5c6bc0">
                <div style={{ fontSize: 22 }}>{r.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{r.name}</div>
              </Btn>
            ))}
          </div>
          {regionData && (
            <div style={{ marginTop: 14, padding: "14px 18px", background: "#e8eaf6", borderRadius: 14 }}>
              <div style={{ fontWeight: 800, color: "#3949ab", fontSize: 14, marginBottom: 8 }}>
                📅 Peak season: {regionData.peak}
              </div>
              <div style={{ fontSize: 13, color: "#5c6bc0", fontWeight: 600 }}>
                Top allergens in your area:
              </div>
              {regionData.topAllergens.map((a, i) => (
                <div key={i} style={{ fontSize: 13, color: "#666", marginTop: 3, paddingLeft: 12 }}>• {a}</div>
              ))}
            </div>
          )}
        </Section>

        {/* Symptoms */}
        <Section num="2" title="What symptoms hit you hardest?" color="#5c6bc0" subtitle="Select all that apply">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 10 }}>
            {SYMPTOMS.map((s) => (
              <Btn key={s.id} active={symptoms.includes(s.id)} onClick={() => toggleSymptom(s.id)} color="#5c6bc0">
                <span style={{ fontSize: 20, marginRight: 6 }}>{s.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: 12 }}>{s.name}</span>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Severity */}
        <Section num="3" title="How bad does it get?" color="#5c6bc0">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SEVERITY.map((s) => (
              <Btn key={s.id} active={severity === s.id} onClick={() => setSeverity(s.id)} color="#5c6bc0" wide>
                <span style={{ fontSize: 24, marginRight: 12 }}>{s.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{s.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>{s.desc}</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Timing */}
        <Section num="4" title="Medication approach?" color="#5c6bc0">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MED_TIMING.map((t) => (
              <Btn key={t.id} active={timing === t.id} onClick={() => setTiming(t.id)} color="#5c6bc0" wide>
                <span style={{ fontSize: 22, marginRight: 12 }}>{t.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{t.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>{t.desc}</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Generate */}
        {canGenerate && (
          <button
            onClick={generate}
            style={{
              width: "100%", padding: "16px", borderRadius: 16, border: "none",
              background: "linear-gradient(135deg, #5c6bc0, #7986cb)", color: "#fff",
              fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer",
              marginBottom: 24, boxShadow: "0 4px 20px rgba(92,107,192,0.3)",
              transition: "transform 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🌸 Build My Allergy Action Plan!
          </button>
        )}

        {/* Results */}
        {plan && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'allergy-action-plan.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #5c6bc0, #7986cb)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(92,107,192,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>

            <button
              onClick={() => {
                setRegion("");
                setSymptoms([]);
                setSeverity("");
                setTiming("");
                setPlan(false);
                setChecked({});
                setExpandedSymptom({});
                localStorage.removeItem("allergy-prep-checked");
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

            {/* Alert banner */}
            {severity === "severe" && (
              <div style={{ background: "#ffebee", border: "2px solid #ef9a9a", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 24 }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 800, color: "#c62828", fontSize: 15 }}>See an allergist</div>
                  <div style={{ fontSize: 13, color: "#d32f2f", lineHeight: 1.6 }}>
                    With severe symptoms, over-the-counter remedies may not be enough. Consider seeing an allergist for prescription options, allergy testing, or immunotherapy (allergy shots). Start the process now — appointments fill up fast in spring!
                  </div>
                </div>
              </div>
            )}

            {timing === "before" && regionData && (
              <div style={{ background: "#e8eaf6", border: "2px solid #9fa8da", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 24 }}>⏰</span>
                <div>
                  <div style={{ fontWeight: 800, color: "#3949ab", fontSize: 15 }}>Start meds early!</div>
                  <div style={{ fontSize: 13, color: "#5c6bc0", lineHeight: 1.6 }}>
                    Your peak season is <strong>{regionData.peak}</strong>. For best results, start daily antihistamines and/or nasal corticosteroid spray <strong>2-4 weeks before</strong> your peak. That means starting NOW if you haven't already. It takes time for these medications to build up effectiveness.
                  </div>
                </div>
              </div>
            )}

            {timing === "unsure" && (
              <div style={{ background: "#fff8e1", border: "2px solid #ffe082", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{ fontSize: 24 }}>💡</span>
                <div>
                  <div style={{ fontWeight: 800, color: "#f9a825", fontSize: 15 }}>Our recommendation</div>
                  <div style={{ fontSize: 13, color: "#f57f17", lineHeight: 1.6 }}>
                    The most effective approach is to start a daily non-drowsy antihistamine + nasal corticosteroid spray <strong>2-4 weeks before</strong> your peak season. This prevents the inflammatory cascade before it starts. Once symptoms are in full swing, it's much harder to get them under control.
                  </div>
                </div>
              </div>
            )}

            {/* Symptom-specific remedies */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "24px", marginBottom: 20, border: "2px solid #c5cae9", boxShadow: "0 3px 16px rgba(92,107,192,0.08)" }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#5c6bc0", margin: "0 0 6px", fontSize: 22 }}>
                💊 Your Symptom-Specific Plan
              </h2>
              <p style={{ color: "#9fa8da", fontSize: 13, fontWeight: 600, margin: "0 0 18px" }}>
                Targeted remedies for each of your symptoms
              </p>

              {/* Expand All / Collapse All */}
              {(() => {
                const allExpanded = symptoms.length > 0 && symptoms.every((id) => !!expandedSymptom[id]);
                return (
                  <button
                    onClick={() => {
                      if (allExpanded) {
                        setExpandedSymptom({});
                      } else {
                        const expanded = {};
                        symptoms.forEach((id) => { expanded[id] = true; });
                        setExpandedSymptom(expanded);
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 10,
                      border: "2px solid #e0e0e0",
                      background: "#fafafa",
                      color: "#888",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      marginBottom: 12,
                    }}
                  >
                    {allExpanded ? "🔽 Collapse All" : "🔼 Expand All"}
                  </button>
                );
              })()}

              {symptoms.map((symId) => {
                const sym = SYMPTOMS.find((s) => s.id === symId);
                const remedies = SYMPTOM_REMEDIES[symId];
                const isExpanded = !!expandedSymptom[symId];
                if (!remedies) return null;

                return (
                  <div key={symId} style={{ marginBottom: 10 }}>
                    <div
                      onClick={() => setExpandedSymptom(prev => ({...prev, [symId]: !prev[symId]}))}
                      style={{
                        padding: "14px 18px", borderRadius: isExpanded ? "14px 14px 0 0" : 14,
                        background: isExpanded ? "#e8eaf6" : "#f5f5f5", cursor: "pointer",
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        border: isExpanded ? "2px solid #9fa8da" : "2px solid transparent",
                        borderBottom: isExpanded ? "none" : undefined,
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{ fontWeight: 800, color: isExpanded ? "#3949ab" : "#666", fontSize: 15 }}>
                        {sym.emoji} {sym.name}
                      </span>
                      <span style={{ color: "#bbb", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "16px 18px", border: "2px solid #9fa8da", borderTop: "none", borderRadius: "0 0 14px 14px", background: "#fafafe" }}>
                        <RemedySection title="OTC Remedies" emoji="💊" items={remedies.otc} color="#5c6bc0" checkPrefix={`${symId}-otc`} checked={checked} toggleCheck={toggleCheck} />
                        <RemedySection title="Home Remedies" emoji="🏠" items={remedies.home} color="#43a047" checkPrefix={`${symId}-home`} checked={checked} toggleCheck={toggleCheck} />
                        <RemedySection title="Things to Avoid" emoji="🚫" items={remedies.avoid} color="#e53935" checkPrefix={`${symId}-avoid`} checked={checked} toggleCheck={toggleCheck} isAvoid />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Home prep checklist */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "24px", marginBottom: 20, border: "2px solid #c5cae9", boxShadow: "0 3px 16px rgba(92,107,192,0.08)" }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#5c6bc0", margin: "0 0 6px", fontSize: 22 }}>
                🏠 Home Prep Checklist
              </h2>
              <p style={{ color: "#9fa8da", fontSize: 13, fontWeight: 600, margin: "0 0 18px" }}>
                Get your home allergy-ready before peak season
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {HOME_PREP_TASKS.map((item, i) => {
                  const key = `home-${i}`;
                  const done = checked[key];
                  return (
                    <CheckItem key={i} done={done} onClick={() => toggleCheck(key)}>
                      <span style={{ marginRight: 8 }}>{item.emoji}</span> {item.task}
                    </CheckItem>
                  );
                })}
              </div>
            </div>

            {/* Daily routine */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: "24px", marginBottom: 20, border: "2px solid #c5cae9", boxShadow: "0 3px 16px rgba(92,107,192,0.08)" }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "#5c6bc0", margin: "0 0 6px", fontSize: 22 }}>
                🔄 Daily Allergy Routine
              </h2>
              <p style={{ color: "#9fa8da", fontSize: 13, fontWeight: 600, margin: "0 0 18px" }}>
                Follow this every day during peak season
              </p>

              {[
                { key: "morning", label: "🌅 Morning", items: DAILY_ROUTINE.morning },
                { key: "afternoon", label: "☀️ Afternoon", items: DAILY_ROUTINE.afternoon },
                { key: "evening", label: "🌙 Evening", items: DAILY_ROUTINE.evening },
              ].map((block) => (
                <div key={block.key} style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, color: "#3949ab", fontSize: 15, marginBottom: 8 }}>{block.label}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {block.items.map((item, i) => {
                      const key = `daily-${block.key}-${i}`;
                      const done = checked[key];
                      return (
                        <CheckItem key={i} done={done} onClick={() => toggleCheck(key)}>
                          <span style={{ marginRight: 8 }}>{item.emoji}</span> {item.task}
                        </CheckItem>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#fff8e1", borderRadius: 14, padding: "14px 18px", fontSize: 12, color: "#f57f17", lineHeight: 1.6 }}>
              <strong>⚠️ Disclaimer:</strong> This tool provides general wellness information, not medical advice. Always consult with a healthcare provider before starting new medications. If you experience severe reactions, difficulty breathing, or anaphylaxis, call emergency services immediately.
            </div>
            <button
              onClick={() => downloadPDF(resultRef.current, 'allergy-action-plan.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #5c6bc0, #7986cb)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(92,107,192,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#9fa8da", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🌸🤧💪</div>
          Allergy Season Prep Tool — Breathe easier this spring!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, subtitle, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(92,107,192,0.06)", border: "2px solid rgba(92,107,192,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #7986cb)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
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

function RemedySection({ title, emoji, items, color, checkPrefix, checked, toggleCheck, isAvoid }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontWeight: 800, color, fontSize: 13, marginBottom: 6 }}>{emoji} {title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item, i) => {
          const key = `${checkPrefix}-${i}`;
          const done = checked[key];
          return (
            <CheckItem key={i} done={done} onClick={() => toggleCheck(key)} isAvoid={isAvoid}>
              {item}
            </CheckItem>
          );
        })}
      </div>
    </div>
  );
}

function CheckItem({ done, onClick, children, isAvoid }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px",
        borderRadius: 10, background: done ? (isAvoid ? "#ffebee" : "#e8f5e9") : "#fafafa",
        cursor: "pointer", transition: "all 0.2s",
        border: done ? `1.5px solid ${isAvoid ? "#ef9a9a" : "#a5d6a7"}` : "1.5px solid transparent",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: 5,
        border: done ? `2px solid ${isAvoid ? "#e53935" : "#66bb6a"}` : "2px solid #ddd",
        background: done ? (isAvoid ? "#e53935" : "#66bb6a") : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0, marginTop: 1,
      }}>{done ? "✓" : ""}</div>
      <span style={{ fontSize: 13, color: done ? "#999" : "#444", textDecoration: done ? "line-through" : "none", fontWeight: done ? 400 : 600, lineHeight: 1.5 }}>
        {children}
      </span>
    </div>
  );
}
