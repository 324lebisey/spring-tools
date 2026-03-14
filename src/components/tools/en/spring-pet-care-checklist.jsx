'use client';
import { useState, useRef, useEffect } from "react";

const PET_TYPES = [
  { id: "dog", label: "Dog", emoji: "🐕" },
  { id: "cat", label: "Cat", emoji: "🐈" },
  { id: "both", label: "Both!", emoji: "🐾" },
];

const DOG_SIZES = [
  { id: "small", label: "Small (under 25 lbs)", emoji: "🐕" },
  { id: "medium", label: "Medium (25-60 lbs)", emoji: "🦮" },
  { id: "large", label: "Large (60+ lbs)", emoji: "🐕‍🦺" },
];

const CAT_TYPES = [
  { id: "indoor", label: "Indoor Only", emoji: "🏠" },
  { id: "outdoor", label: "Indoor/Outdoor", emoji: "🌳" },
];

const REGIONS = [
  { id: "north", label: "Northern / Cold", emoji: "❄️", desc: "Long winters, late spring" },
  { id: "mid", label: "Mid-Atlantic / Midwest", emoji: "🌤️", desc: "Classic four seasons" },
  { id: "south", label: "Southern / Warm", emoji: "☀️", desc: "Mild winters, early spring" },
  { id: "west", label: "West Coast", emoji: "🌊", desc: "Mild year-round" },
];

const CONCERNS = [
  { id: "fleas_ticks", label: "Fleas & Ticks", emoji: "🪲" },
  { id: "allergies", label: "Pet Allergies", emoji: "🤧" },
  { id: "shedding", label: "Shedding", emoji: "🧶" },
  { id: "weight", label: "Weight Management", emoji: "⚖️" },
  { id: "senior", label: "Senior Pet Care", emoji: "🩶" },
  { id: "anxiety", label: "Storm / Noise Anxiety", emoji: "⛈️" },
];

const FLEA_TICK_SCHEDULE = {
  north: { start: "April", note: "Start prevention as soon as snow melts and temps hit 40°F+" },
  mid: { start: "March", note: "Begin prevention in early-mid March — ticks emerge early" },
  south: { start: "Year-round", note: "Fleas and ticks are active almost all year in your region" },
  west: { start: "March", note: "Mild weather means early flea/tick activity — don't wait" },
};

const VET_CHECKLIST = {
  dog: [
    { task: "Schedule annual wellness exam (spring is ideal before summer travel)", emoji: "🩺", priority: "high" },
    { task: "Update rabies vaccine if due", emoji: "💉", priority: "high" },
    { task: "Update DHPP (distemper/parvo) booster if due", emoji: "💉", priority: "high" },
    { task: "Bordetella (kennel cough) vaccine if boarding or dog park", emoji: "💉", priority: "medium" },
    { task: "Leptospirosis vaccine — important if near water/wildlife", emoji: "💉", priority: "medium" },
    { task: "Heartworm test (annual blood test)", emoji: "🩸", priority: "high" },
    { task: "Start or renew heartworm prevention for the season", emoji: "💊", priority: "high" },
    { task: "Fecal test for intestinal parasites", emoji: "🔬", priority: "medium" },
    { task: "Discuss flea/tick prevention options with vet", emoji: "🪲", priority: "high" },
    { task: "Update microchip info if you've moved or changed numbers", emoji: "📡", priority: "medium" },
  ],
  cat: [
    { task: "Schedule annual wellness exam", emoji: "🩺", priority: "high" },
    { task: "Update rabies vaccine if due", emoji: "💉", priority: "high" },
    { task: "Update FVRCP (feline distemper combo) if due", emoji: "💉", priority: "high" },
    { task: "FeLV vaccine if goes outdoors or exposed to other cats", emoji: "💉", priority: "medium" },
    { task: "Fecal test for parasites (especially if outdoor access)", emoji: "🔬", priority: "medium" },
    { task: "Discuss flea prevention — even indoor cats can get fleas", emoji: "🪲", priority: "high" },
    { task: "Dental check — spring is a great time for a cleaning", emoji: "🦷", priority: "medium" },
    { task: "Update microchip info", emoji: "📡", priority: "medium" },
    { task: "Blood work panel for cats over 7 years", emoji: "🩸", priority: "medium" },
  ],
};

const GROOMING = {
  dog: {
    small: [
      { task: "Schedule professional grooming — winter coat removal", emoji: "✂️", timing: "Now" },
      { task: "Daily brushing during shedding season (2-4 weeks)", emoji: "🪮", timing: "Daily" },
      { task: "Bath with gentle spring shampoo — wash off winter grime", emoji: "🛁", timing: "This week" },
      { task: "Trim nails — they grow faster in warmer weather", emoji: "💅", timing: "Every 2-3 weeks" },
      { task: "Clean ears — moisture from spring rain can cause infections", emoji: "👂", timing: "Weekly" },
      { task: "Check and clean teeth or start dental chews", emoji: "🦷", timing: "Daily" },
      { task: "Check paw pads for winter salt damage, moisturize if cracked", emoji: "🐾", timing: "Now" },
    ],
    medium: [
      { task: "Deshedding treatment — undercoat rake or FURminator session", emoji: "🪮", timing: "2-3x per week" },
      { task: "Bath with deshedding shampoo and conditioner", emoji: "🛁", timing: "This week" },
      { task: "Professional grooming if double-coated breed", emoji: "✂️", timing: "Schedule now" },
      { task: "Trim nails — check for overgrowth from less winter walking", emoji: "💅", timing: "Every 2-3 weeks" },
      { task: "Clean ears thoroughly — floppy ears especially", emoji: "👂", timing: "Weekly" },
      { task: "Check for hot spots or dry skin patches from winter", emoji: "🔍", timing: "Now" },
      { task: "Paw pad check — trim fur between pads", emoji: "🐾", timing: "Now" },
      { task: "Brush teeth or provide dental chews", emoji: "🦷", timing: "Daily" },
    ],
    large: [
      { task: "MAJOR deshedding session — undercoat blowout time!", emoji: "🪮", timing: "2-3x per week for a month" },
      { task: "Professional grooming for heavy shedders (Huskies, Goldens, etc.)", emoji: "✂️", timing: "Schedule now" },
      { task: "Outdoor bath (if warm enough) — use deshedding shampoo", emoji: "🛁", timing: "This week" },
      { task: "Trim nails — harder to manage on big dogs, don't skip", emoji: "💅", timing: "Every 2-3 weeks" },
      { task: "Clean ears — large breeds prone to ear infections", emoji: "👂", timing: "Weekly" },
      { task: "Check for matting in feathered areas (legs, belly, behind ears)", emoji: "🔍", timing: "Now" },
      { task: "Paw pad and between-toe fur trim", emoji: "🐾", timing: "Now" },
      { task: "Joint supplement check — talk to vet about spring exercise ramp-up", emoji: "💪", timing: "Vet visit" },
    ],
  },
  cat: {
    indoor: [
      { task: "Daily brushing during spring shedding (yes, indoor cats shed too!)", emoji: "🪮", timing: "Daily for 4-6 weeks" },
      { task: "Trim nails — indoor cats don't wear them down naturally", emoji: "💅", timing: "Every 2 weeks" },
      { task: "Hairball prevention — add fiber supplement or hairball treats", emoji: "🧶", timing: "Daily" },
      { task: "Check for mats — especially long-haired breeds", emoji: "🔍", timing: "Weekly" },
      { task: "Clean ears gently with vet-approved cleaner", emoji: "👂", timing: "Monthly" },
      { task: "Dental check — brush teeth or use dental treats", emoji: "🦷", timing: "Daily" },
    ],
    outdoor: [
      { task: "Thorough brushing — remove debris, check for tangles", emoji: "🪮", timing: "Daily" },
      { task: "Full body check for ticks after outdoor time", emoji: "🔍", timing: "Every time they come in" },
      { task: "Check ears for mites and debris", emoji: "👂", timing: "Weekly" },
      { task: "Trim nails if needed (outdoor cats may self-maintain)", emoji: "💅", timing: "Check every 2 weeks" },
      { task: "Check for scratches, bites, or wounds from outdoor adventures", emoji: "🩹", timing: "Weekly" },
      { task: "Flea comb check — part fur and look for flea dirt", emoji: "🪲", timing: "Weekly" },
      { task: "Dental treats or brushing", emoji: "🦷", timing: "Daily" },
    ],
  },
};

const HOME_PREP = {
  dog: [
    { task: "Deep clean and wash all dog beds and blankets", emoji: "🛏️", category: "clean" },
    { task: "Wash all toys — machine wash plush, dishwasher for rubber", emoji: "🧸", category: "clean" },
    { task: "Clean and sanitize food and water bowls", emoji: "🥣", category: "clean" },
    { task: "Vacuum everywhere — furniture, under beds, behind couches (pet hair galore)", emoji: "🧹", category: "clean" },
    { task: "Check the yard for toxic spring plants (lilies, azaleas, daffodils, tulips)", emoji: "🌷", category: "safety" },
    { task: "Secure fencing — winter weather may have damaged sections", emoji: "🏡", category: "safety" },
    { task: "Remove any rodent poison or traps set over winter", emoji: "⚠️", category: "safety" },
    { task: "Check that lawn chemicals and fertilizers are pet-safe", emoji: "🧪", category: "safety" },
    { task: "Set up outdoor water station for warmer days", emoji: "💧", category: "comfort" },
    { task: "Clean or replace crate/kennel bedding", emoji: "🏠", category: "clean" },
    { task: "Inspect leashes, collars, and harnesses for winter wear", emoji: "🦺", category: "gear" },
    { task: "Update ID tags if info has changed", emoji: "🏷️", category: "safety" },
    { task: "Stock up: poop bags, treats, flea/tick meds for the season", emoji: "🛒", category: "supplies" },
  ],
  cat: [
    { task: "Deep clean litter boxes — full scrub, fresh litter", emoji: "🧹", category: "clean" },
    { task: "Wash all cat beds, blankets, and tree covers", emoji: "🛏️", category: "clean" },
    { task: "Clean and sanitize food and water bowls/fountain", emoji: "🥣", category: "clean" },
    { task: "Vacuum all cat-frequented areas and furniture", emoji: "🧹", category: "clean" },
    { task: "Check window screens — cats WILL test them when windows open", emoji: "🪟", category: "safety" },
    { task: "Remove toxic houseplants or move out of reach (lilies are deadly to cats!)", emoji: "🌺", category: "safety" },
    { task: "Secure any balcony or outdoor access points", emoji: "🏠", category: "safety" },
    { task: "Clean scratching posts — vacuum and wipe down", emoji: "🪵", category: "clean" },
    { task: "Inspect toys — replace anything damaged or with loose small parts", emoji: "🧸", category: "safety" },
    { task: "Stock up: litter, food, flea prevention for the season", emoji: "🛒", category: "supplies" },
    { task: "Set up a sunny window perch — cats love spring sunshine", emoji: "☀️", category: "comfort" },
    { task: "Check breakaway collar and ID tags", emoji: "🏷️", category: "safety" },
  ],
};

const CONCERN_TASKS = {
  fleas_ticks: {
    title: "🪲 Flea & Tick Prevention Plan",
    tasks: [
      "Choose a prevention method: oral chew, topical, or collar — ask vet what's best",
      "Set a monthly reminder for application/dosing — consistency is everything",
      "Check your pet for ticks after every outdoor walk or play session",
      "Know how to remove a tick: fine-tip tweezers, pull straight up, clean the area",
      "Treat your yard: keep grass short, clear leaf litter, consider pet-safe yard spray",
      "Wash pet bedding weekly in hot water during peak season",
      "Vacuum frequently — flea eggs hide in carpets and furniture",
      "If you find one flea, treat immediately — one becomes hundreds FAST",
    ],
  },
  allergies: {
    title: "🤧 Pet Allergy Management",
    tasks: [
      "Watch for signs: excessive scratching, paw licking, ear infections, watery eyes",
      "Wipe paws with a damp cloth after every outdoor walk",
      "Bath every 1-2 weeks with vet-recommended hypoallergenic shampoo",
      "Ask vet about antihistamines or allergy meds for your pet (don't self-medicate!)",
      "Keep windows closed on high pollen days — pets get seasonal allergies too",
      "Wash pet bedding more frequently during allergy season",
      "Consider air purifier in the room where pet sleeps",
      "Track symptoms in a log — helps vet identify patterns and triggers",
    ],
  },
  shedding: {
    title: "🧶 Shedding Survival Guide",
    tasks: [
      "Brush daily during the spring 'coat blow' — 10 min a day saves hours of vacuuming",
      "Invest in a deshedding tool (FURminator, undercoat rake, or slicker brush)",
      "Professional grooming session specifically for deshedding",
      "Supplement diet with omega-3 fatty acids (fish oil) — reduces excess shedding",
      "Vacuum 2-3x per week minimum during peak shedding",
      "Use lint rollers everywhere — keep one by the door, in the car, at work",
      "Cover furniture with washable throws during peak shedding weeks",
      "NEVER shave a double-coated breed — it damages their coat permanently",
    ],
  },
  weight: {
    title: "⚖️ Spring Weight Management",
    tasks: [
      "Weigh your pet — if ribs aren't easily felt, time to adjust",
      "Gradually increase exercise as weather warms (don't go from 0 to 60)",
      "Reduce treat calories — treats should be under 10% of daily intake",
      "Measure food with an actual cup — eyeballing usually means overfeeding",
      "Switch to lower-calorie treats: carrots, green beans, or frozen blueberries for dogs",
      "For cats: increase play sessions to 15-20 min 2x daily",
      "Puzzle feeders slow eating and add mental stimulation",
      "Talk to vet about ideal weight and calorie target — every pet is different",
    ],
  },
  senior: {
    title: "🩶 Senior Pet Spring Care",
    tasks: [
      "Schedule senior wellness panel (bloodwork, urinalysis) — catch issues early",
      "Joint supplements: glucosamine, chondroitin, fish oil — ask vet for dosing",
      "Ramp up exercise SLOWLY — stiff joints need gentle warm-up",
      "Provide orthopedic bed if you haven't already — supports aging joints",
      "Keep nails shorter — longer nails are harder on arthritic joints",
      "Dental check is critical — dental disease worsens with age",
      "Watch for changes: more sleeping, less appetite, trouble with stairs",
      "Non-slip mats on hard floors — senior pets slip more easily",
      "Raised food bowls reduce neck strain for older pets",
      "Extra patience and gentle handling — they're doing their best ❤️",
    ],
  },
  anxiety: {
    title: "⛈️ Storm & Noise Anxiety Plan",
    tasks: [
      "Create a safe space: interior room, crate with blankets, or under-desk den",
      "Calming aids: ThunderShirt, calming treats, or pheromone diffuser (Adaptil/Feliway)",
      "Desensitization: play storm sounds quietly and reward calm behavior (start NOW before storm season)",
      "Talk to vet about anti-anxiety medication for severe cases",
      "Close curtains and play white noise or calming music during storms",
      "Don't punish anxious behavior — it makes it worse",
      "Stay calm yourself — pets pick up on your anxiety",
      "Exercise before predicted storms — a tired pet handles stress better",
      "Have a storm kit ready: favorite treats, toys, ThunderShirt, meds if prescribed",
    ],
  },
};

const ACTIVITY_RAMP = {
  dog: [
    { week: "Week 1-2", activity: "Short walks (15-20 min), gentle play", note: "Ease back in — winter muscles are stiff!" },
    { week: "Week 3-4", activity: "Moderate walks (25-35 min), light fetch", note: "Building stamina back up" },
    { week: "Week 5-6", activity: "Normal walks (30-45 min), dog park visits", note: "Watch for overheating as it warms up" },
    { week: "Week 7+", activity: "Full activity: hikes, runs, swimming", note: "Always bring water. Watch paw pads on hot pavement!" },
  ],
  cat: [
    { week: "Ongoing", activity: "15-20 min interactive play 2x daily", note: "Feather wands, laser pointers, crinkle balls" },
    { week: "Ongoing", activity: "Rotate toys weekly to prevent boredom", note: "Cats lose interest fast — novelty is key" },
    { week: "Spring special", activity: "Open windows (with secure screens!) for bird watching", note: "Mental stimulation = happy cat" },
    { week: "Spring special", activity: "Supervised outdoor time or catio if possible", note: "Harness training works for some cats too!" },
  ],
};

export default function PetCareChecklist() {
  const [petType, setPetType] = useState("");
  const [dogSize, setDogSize] = useState("");
  const [catType, setCatType] = useState("");
  const [region, setRegion] = useState("");
  const [concerns, setConcerns] = useState([]);
  const [plan, setPlan] = useState(false);
  const [checked, setChecked] = useState({});
  const [expandedSection, setExpandedSection] = useState({});
  const resultRef = useRef(null);

  // Load checked state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pet-care-checked");
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  // Save checked state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("pet-care-checked", JSON.stringify(checked));
    } catch {}
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

  const toggleConcern = (id) => setConcerns((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  const toggleCheck = (key) => setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const generate = () => {
    setPlan(true);
    setChecked({});
    setExpandedSection({"vet": true});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const hasDog = petType === "dog" || petType === "both";
  const hasCat = petType === "cat" || petType === "both";
  const canGenerate = petType && region && (hasDog ? dogSize : true) && (hasCat ? catType : true);

  const fleaData = FLEA_TICK_SCHEDULE[region] || FLEA_TICK_SCHEDULE.mid;

  let totalTasks = 0;
  const countSection = (items) => { totalTasks += items.length; };

  if (plan) {
    if (hasDog) { countSection(VET_CHECKLIST.dog); countSection(GROOMING.dog[dogSize] || []); countSection(HOME_PREP.dog); }
    if (hasCat) { countSection(VET_CHECKLIST.cat); countSection(GROOMING.cat[catType] || []); countSection(HOME_PREP.cat); }
    concerns.forEach((c) => { if (CONCERN_TASKS[c]) countSection(CONCERN_TASKS[c].tasks); });
  }
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fff3e0 0%, #fffde7 25%, #e8f5e9 50%, #e0f7fa 80%, #fce4ec 100%)",
      fontFamily: "'Nunito', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />
      {["🐕", "🐈", "🌸", "🦴", "🐾", "🌿"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🐾🌸💕</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 38px)", color: "#6d4c41", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>Spring Pet Care Checklist</h1>
          <p style={{ color: "#a1887f", fontSize: 15, margin: 0, fontWeight: 600 }}>Everything your fur baby needs to thrive this spring</p>
        </div>

        <Section num="1" title="Who's the good boy/girl?" color="#6d4c41">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {PET_TYPES.map((p) => (<Btn key={p.id} active={petType === p.id} onClick={() => setPetType(p.id)} color="#6d4c41"><div style={{ fontSize: 28 }}>{p.emoji}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{p.label}</div></Btn>))}
          </div>
        </Section>

        {hasDog && (
          <Section num="2a" title="Dog size?" color="#6d4c41">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {DOG_SIZES.map((d) => (<Btn key={d.id} active={dogSize === d.id} onClick={() => setDogSize(d.id)} color="#6d4c41"><div style={{ fontSize: 22 }}>{d.emoji}</div><div style={{ fontWeight: 700, fontSize: 11 }}>{d.label}</div></Btn>))}
            </div>
          </Section>
        )}

        {hasCat && (
          <Section num={hasDog ? "2b" : "2"} title="Indoor or outdoor cat?" color="#6d4c41">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CAT_TYPES.map((c) => (<Btn key={c.id} active={catType === c.id} onClick={() => setCatType(c.id)} color="#6d4c41"><div style={{ fontSize: 22 }}>{c.emoji}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{c.label}</div></Btn>))}
            </div>
          </Section>
        )}

        <Section num="3" title="Where do you live?" color="#6d4c41">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {REGIONS.map((r) => (<Btn key={r.id} active={region === r.id} onClick={() => setRegion(r.id)} color="#6d4c41"><div style={{ fontSize: 22 }}>{r.emoji}</div><div style={{ fontWeight: 800, fontSize: 13 }}>{r.name}</div><div style={{ fontSize: 11, opacity: 0.6 }}>{r.desc}</div></Btn>))}
          </div>
        </Section>

        <Section num="4" title="Any specific concerns?" color="#6d4c41" subtitle="Select all that apply">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {CONCERNS.map((c) => (<Btn key={c.id} active={concerns.includes(c.id)} onClick={() => toggleConcern(c.id)} color="#6d4c41"><span style={{ fontSize: 20, marginRight: 4 }}>{c.emoji}</span><span style={{ fontWeight: 700, fontSize: 12 }}>{c.label}</span></Btn>))}
          </div>
        </Section>

        {canGenerate && (
          <button onClick={generate} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #6d4c41, #a1887f)", color: "#fff", fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer", marginBottom: 24, boxShadow: "0 4px 20px rgba(109,76,65,0.3)", transition: "transform 0.15s" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            🐾 Build My Pet Care Plan!
          </button>
        )}

        {plan && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'pet-care-checklist.pdf')}
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
              📥 Download as PDF
            </button>
            <button
              onClick={() => {
                setPetType("");
                setDogSize("");
                setCatType("");
                setRegion("");
                setConcerns([]);
                setPlan(false);
                setChecked({});
                setExpandedSection({});
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
            {/* Progress */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, border: "2px solid #d7ccc8", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontWeight: 800, color: "#6d4c41", fontSize: 14 }}>Progress: {doneCount}/{totalTasks} tasks</span>
                <span style={{ fontSize: 12, color: "#aaa" }}>{totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0}%</span>
              </div>
              <div style={{ background: "#efebe9", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{ width: `${totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0}%`, height: "100%", background: doneCount === totalTasks && totalTasks > 0 ? "linear-gradient(90deg, #66bb6a, #43a047)" : "linear-gradient(90deg, #a1887f, #6d4c41)", borderRadius: 10, transition: "width 0.4s" }} />
              </div>
              {doneCount === totalTasks && totalTasks > 0 && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 16, fontWeight: 800, color: "#43a047" }}>🎉 Your pet is spring-ready! Best pet parent ever! 🏆</div>
              )}
            </div>

            {/* Flea/tick alert */}
            <div style={{ background: "#fff8e1", border: "2px solid #ffe082", borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🪲</span>
              <div>
                <div style={{ fontWeight: 800, color: "#f9a825", fontSize: 15 }}>Flea & Tick Prevention: Start {fleaData.start}</div>
                <div style={{ fontSize: 13, color: "#f57f17" }}>{fleaData.note}</div>
              </div>
            </div>

            {/* Expand All / Collapse All */}
            <button
              onClick={() => {
                const sectionIds = [
                  ...(hasDog ? ["vet-dog"] : []),
                  ...(hasCat ? ["vet-cat"] : []),
                  ...(hasDog ? ["groom-dog"] : []),
                  ...(hasCat ? ["groom-cat"] : []),
                  ...(hasDog ? ["home-dog"] : []),
                  ...(hasCat ? ["home-cat"] : []),
                  ...concerns.filter((c) => CONCERN_TASKS[c]).map((c) => `concern-${c}`),
                ];
                const allExpanded = sectionIds.every(id => expandedSection[id]);
                if (allExpanded) {
                  setExpandedSection({});
                } else {
                  const all = {};
                  sectionIds.forEach(id => { all[id] = true; });
                  setExpandedSection(all);
                }
              }}
              style={{
                width: "100%",
                marginBottom: 12,
                padding: "10px",
                borderRadius: 10,
                border: "2px solid #d7ccc8",
                background: "#efebe9",
                color: "#6d4c41",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {(() => {
                const sectionIds = [
                  ...(hasDog ? ["vet-dog"] : []),
                  ...(hasCat ? ["vet-cat"] : []),
                  ...(hasDog ? ["groom-dog"] : []),
                  ...(hasCat ? ["groom-cat"] : []),
                  ...(hasDog ? ["home-dog"] : []),
                  ...(hasCat ? ["home-cat"] : []),
                  ...concerns.filter((c) => CONCERN_TASKS[c]).map((c) => `concern-${c}`),
                ];
                return sectionIds.every(id => expandedSection[id]) ? "🔽 Collapse All" : "🔼 Expand All";
              })()}
            </button>

            {/* Collapsible sections */}
            {[
              ...(hasDog ? [{ id: "vet-dog", title: "🩺 Vet Checklist — Dog", items: VET_CHECKLIST.dog }] : []),
              ...(hasCat ? [{ id: "vet-cat", title: "🩺 Vet Checklist — Cat", items: VET_CHECKLIST.cat }] : []),
              ...(hasDog ? [{ id: "groom-dog", title: "✂️ Grooming — Dog", items: GROOMING.dog[dogSize] || [] }] : []),
              ...(hasCat ? [{ id: "groom-cat", title: "✂️ Grooming — Cat", items: GROOMING.cat[catType] || [] }] : []),
              ...(hasDog ? [{ id: "home-dog", title: "🏠 Home & Yard Prep — Dog", items: HOME_PREP.dog }] : []),
              ...(hasCat ? [{ id: "home-cat", title: "🏠 Home Prep — Cat", items: HOME_PREP.cat }] : []),
              ...concerns.filter((c) => CONCERN_TASKS[c]).map((c) => ({
                id: `concern-${c}`, title: CONCERN_TASKS[c].title,
                items: CONCERN_TASKS[c].tasks.map((t) => ({ task: t, emoji: "→" })),
              })),
            ].map((section) => {
              const isExpanded = !!expandedSection[section.id];
              const sectionDone = section.items.filter((_, i) => checked[`${section.id}-${i}`]).length;

              return (
                <div key={section.id} style={{ marginBottom: 8 }}>
                  <div onClick={() => setExpandedSection(prev => ({...prev, [section.id]: !prev[section.id]}))} style={{
                    padding: "14px 18px", borderRadius: isExpanded ? "14px 14px 0 0" : 14,
                    background: isExpanded ? "#efebe9" : "rgba(255,255,255,0.88)",
                    border: isExpanded ? "2px solid #bcaaa4" : "2px solid rgba(109,76,65,0.06)",
                    borderBottom: isExpanded ? "none" : undefined, cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontWeight: 800, color: isExpanded ? "#5d4037" : "#666", fontSize: 15 }}>{section.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: "#bbb", fontWeight: 700 }}>{sectionDone}/{section.items.length}</span>
                      <span style={{ color: "#ccc", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ border: "2px solid #bcaaa4", borderTop: "none", borderRadius: "0 0 14px 14px", padding: "14px 18px", background: "#faf8f6" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {section.items.map((item, i) => {
                          const key = `${section.id}-${i}`;
                          const done = checked[key];
                          const taskText = typeof item === "string" ? item : item.task;
                          const emoji = typeof item === "string" ? "→" : (item.emoji || "→");
                          const timing = item.timing;
                          const priority = item.priority;

                          return (
                            <div key={i} onClick={() => toggleCheck(key)} style={{
                              display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", borderRadius: 10,
                              background: done ? "#e8f5e9" : "#fff", cursor: "pointer", transition: "all 0.2s",
                              border: done ? "1.5px solid #a5d6a7" : priority === "high" ? "1.5px solid #ffcc80" : "1.5px solid transparent",
                            }}>
                              <div style={{
                                width: 20, height: 20, borderRadius: 5,
                                border: done ? "2px solid #66bb6a" : "2px solid #ddd",
                                background: done ? "#66bb6a" : "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 12, color: "#fff", fontWeight: 800, flexShrink: 0, marginTop: 1,
                              }}>{done ? "✓" : ""}</div>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 13, color: done ? "#999" : "#444", textDecoration: done ? "line-through" : "none", fontWeight: done ? 400 : 600, lineHeight: 1.5 }}>
                                  {emoji !== "→" && <span style={{ marginRight: 6 }}>{emoji}</span>}{taskText}
                                </span>
                                {timing && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2, fontWeight: 600 }}>⏰ {timing}</div>}
                              </div>
                              {priority === "high" && !done && (
                                <span style={{ fontSize: 10, fontWeight: 800, color: "#e65100", background: "#fff3e0", padding: "2px 8px", borderRadius: 6, flexShrink: 0 }}>HIGH</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Activity ramp-up */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "22px", marginTop: 16, border: "2px solid #d7ccc8" }}>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#6d4c41", margin: "0 0 14px", fontSize: 18 }}>
                🏃 Spring Activity Ramp-Up
              </h3>
              {hasDog && (
                <div style={{ marginBottom: hasCat ? 16 : 0 }}>
                  {hasCat && <div style={{ fontWeight: 800, color: "#8d6e63", fontSize: 13, marginBottom: 8 }}>🐕 Dog:</div>}
                  {ACTIVITY_RAMP.dog.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < ACTIVITY_RAMP.dog.length - 1 ? "1px solid #f0ebe8" : "none" }}>
                      <span style={{ fontWeight: 800, color: "#6d4c41", fontSize: 13, minWidth: 80 }}>{w.week}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{w.activity}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{w.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {hasCat && (
                <div>
                  {hasDog && <div style={{ fontWeight: 800, color: "#8d6e63", fontSize: 13, marginBottom: 8 }}>🐈 Cat:</div>}
                  {ACTIVITY_RAMP.cat.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < ACTIVITY_RAMP.cat.length - 1 ? "1px solid #f0ebe8" : "none" }}>
                      <span style={{ fontWeight: 800, color: "#6d4c41", fontSize: 13, minWidth: 100 }}>{w.week}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#555" }}>{w.activity}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{w.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => downloadPDF(resultRef.current, 'pet-care-checklist.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
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
              📥 Download as PDF
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#bcaaa4", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🐾🌸💕</div>
          Spring Pet Care Checklist — Happy pets, happy spring!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, subtitle, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(109,76,65,0.06)", border: "2px solid rgba(109,76,65,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: subtitle ? 4 : 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #a1887f)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
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
