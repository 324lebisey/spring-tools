import { useState, useRef } from "react";

const HOME_TYPES = [
  { id: "studio", label: "Studio / 1BR", emoji: "🏠", rooms: ["bedroom", "bathroom", "kitchen", "living"] },
  { id: "apartment", label: "Apartment (2-3BR)", emoji: "🏢", rooms: ["bedroom", "bedroom2", "bathroom", "kitchen", "living", "dining"] },
  { id: "house_sm", label: "Small House", emoji: "🏡", rooms: ["bedroom", "bedroom2", "bathroom", "bathroom2", "kitchen", "living", "dining", "garage"] },
  { id: "house_lg", label: "Large House", emoji: "🏘️", rooms: ["bedroom", "bedroom2", "bedroom3", "bathroom", "bathroom2", "bathroom3", "kitchen", "living", "dining", "office", "garage", "basement", "laundry"] },
];

const EXTRAS = [
  { id: "pets", label: "Pets", emoji: "🐾" },
  { id: "kids", label: "Kids", emoji: "🧸" },
  { id: "wfh", label: "Work from home", emoji: "💻" },
  { id: "outdoor", label: "Outdoor space", emoji: "🌳" },
];

const DEPTH = [
  { id: "quick", label: "Quick Refresh", emoji: "⚡", desc: "Surface-level, 1-2 hours", timeMult: 0.5 },
  { id: "standard", label: "Standard Clean", emoji: "🧹", desc: "Thorough, half a day", timeMult: 1 },
  { id: "deep", label: "Deep Clean", emoji: "✨", desc: "Every nook & cranny", timeMult: 1.6 },
];

const ROOM_DATA = {
  bedroom: { name: "Main Bedroom", emoji: "🛏️", tasks: {
    quick: [
      "Strip bed & wash all bedding (sheets, pillowcases, duvet cover)",
      "Dust nightstands and dresser tops",
      "Vacuum / mop floors",
      "Wipe light switches and door handles",
    ],
    standard: [
      "Strip bed & wash all bedding including mattress protector",
      "Flip or rotate mattress",
      "Dust all surfaces, shelves, and decor",
      "Clean mirrors and windows",
      "Vacuum under bed and furniture",
      "Declutter nightstands — toss old receipts, wrappers",
      "Wipe baseboards",
      "Organize closet — donate clothes not worn in 6+ months",
    ],
    deep: [
      "Strip bed & wash ALL bedding, pillows, and mattress protector",
      "Flip or rotate mattress, spot-clean stains",
      "Vacuum mattress surface",
      "Dust ceiling fan, light fixtures, and vents",
      "Clean all mirrors, windows inside and out",
      "Vacuum under bed, furniture, and in all corners",
      "Wipe baseboards, door frames, and windowsills",
      "Deep clean closet — pull everything out, wipe shelves, reorganize",
      "Dust behind furniture and wall art",
      "Steam clean carpets or deep mop hard floors",
      "Wash curtains or dust blinds slat by slat",
      "Check and replace smoke detector batteries",
    ],
  }},
  bedroom2: { name: "Bedroom 2", emoji: "🛌", tasks: {
    quick: ["Strip bed & wash bedding", "Dust surfaces", "Vacuum floors", "Quick declutter"],
    standard: ["Strip bed & wash all bedding", "Rotate mattress", "Dust all surfaces and shelves", "Clean mirror and windows", "Vacuum thoroughly including under furniture", "Declutter and organize", "Wipe baseboards"],
    deep: ["Full bedding wash including pillows", "Vacuum mattress", "Dust ceiling fixtures and vents", "Deep clean windows", "Move furniture and vacuum behind", "Wipe all baseboards, frames, sills", "Deep closet cleanout", "Steam/deep clean floors", "Wash curtains or clean blinds"],
  }},
  bedroom3: { name: "Bedroom 3", emoji: "🛌", tasks: {
    quick: ["Strip bed & wash bedding", "Dust surfaces", "Vacuum floors", "Quick declutter"],
    standard: ["Strip bed & wash all bedding", "Rotate mattress", "Dust all surfaces and shelves", "Clean mirror and windows", "Vacuum thoroughly", "Declutter and organize", "Wipe baseboards"],
    deep: ["Full bedding wash including pillows", "Vacuum mattress", "Dust ceiling fixtures", "Deep clean windows", "Move furniture and vacuum behind", "Wipe all baseboards and frames", "Deep closet cleanout", "Steam/deep clean floors"],
  }},
  bathroom: { name: "Main Bathroom", emoji: "🚿", tasks: {
    quick: ["Scrub toilet inside and out", "Wipe down sink and countertop", "Clean mirror", "Wipe shower/tub surfaces", "Sweep and mop floor"],
    standard: ["Deep scrub toilet, base, and behind", "Clean sink, faucet, and countertop", "Scrub shower/tub with tile cleaner", "Clean mirror and any glass", "Wash bath mat and towels", "Wipe cabinet fronts and handles", "Mop floor including corners", "Declutter under sink — toss expired products", "Clean exhaust fan cover"],
    deep: ["Deep scrub toilet including tank interior", "Descale faucets and showerhead (vinegar soak)", "Scrub grout lines with brush", "Clean shower door tracks / curtain (wash or replace)", "Pull everything from cabinets, wipe and reorganize", "Wash all towels, bathmats, and shower curtain", "Clean exhaust fan", "Wipe walls and baseboards", "Deep mop floor, clean behind toilet", "Check caulking — recaulk if mildewed", "Clean light fixtures"],
  }},
  bathroom2: { name: "Bathroom 2", emoji: "🛁", tasks: {
    quick: ["Scrub toilet", "Wipe sink and counter", "Clean mirror", "Quick shower wipe", "Sweep floor"],
    standard: ["Deep scrub toilet", "Clean sink and faucet", "Scrub shower/tub", "Clean mirror", "Wash towels and mat", "Wipe cabinets", "Mop floor", "Declutter products"],
    deep: ["Deep scrub toilet and tank", "Descale faucets and showerhead", "Scrub all grout", "Deep clean cabinets inside and out", "Wash everything fabric", "Clean exhaust fan", "Wipe walls and baseboards", "Deep mop and clean behind toilet"],
  }},
  bathroom3: { name: "Half Bath", emoji: "🚽", tasks: {
    quick: ["Scrub toilet", "Wipe sink", "Clean mirror", "Sweep floor"],
    standard: ["Deep scrub toilet", "Clean sink and faucet", "Clean mirror", "Wipe cabinet", "Mop floor", "Restock supplies"],
    deep: ["Deep scrub toilet and behind", "Descale faucet", "Clean cabinet inside", "Wipe walls and baseboards", "Deep mop", "Check caulking"],
  }},
  kitchen: { name: "Kitchen", emoji: "🍳", tasks: {
    quick: ["Wipe all countertops", "Clean stovetop", "Wipe down fridge exterior", "Wash dishes / empty dishwasher", "Sweep and mop floor", "Take out trash and recycling"],
    standard: ["Wipe all countertops and backsplash", "Deep clean stovetop and drip pans", "Clean microwave inside and out", "Wipe fridge exterior and top", "Clean out fridge — toss expired food", "Wipe cabinet fronts and handles", "Clean sink and faucet", "Sweep and mop floor thoroughly", "Wipe small appliances (toaster, coffee maker)", "Take out trash, clean trash can", "Organize one junk drawer"],
    deep: ["Wipe all countertops, backsplash, and walls near stove", "Pull out stove — clean behind and underneath", "Deep clean oven interior", "Degrease range hood and filter", "Deep clean microwave", "Empty entire fridge, clean all shelves and drawers", "Empty freezer, defrost if needed", "Clean inside all cabinets, declutter dishes and food", "Deep clean dishwasher (vinegar cycle)", "Descale coffee maker", "Clean light fixtures", "Degrease cabinet fronts", "Deep mop including under appliances", "Clean and organize pantry — check all expiration dates"],
  }},
  living: { name: "Living Room", emoji: "🛋️", tasks: {
    quick: ["Fluff and straighten cushions", "Dust coffee table and TV stand", "Quick vacuum", "Tidy up — put items in their place"],
    standard: ["Vacuum all upholstery and cushions", "Dust all surfaces, shelves, and decor", "Clean TV screen and electronics", "Vacuum thoroughly including under furniture", "Clean windows and mirrors", "Wipe light switches and remotes", "Fluff pillows, fold throw blankets", "Declutter surfaces and shelves"],
    deep: ["Vacuum all upholstery, remove and wash cushion covers", "Deep clean / shampoo carpet or couch", "Dust ceiling fan, light fixtures, and vents", "Clean all windows inside and out", "Move all furniture and vacuum behind/under", "Wipe all baseboards and door frames", "Dust wall art, frames, and shelving", "Clean electronics and organize cables", "Wash throw blankets and pillow covers", "Steam clean carpet or deep mop floors"],
  }},
  dining: { name: "Dining Room", emoji: "🍽️", tasks: {
    quick: ["Wipe table and chairs", "Dust sideboard / buffet", "Vacuum or sweep floor"],
    standard: ["Clean and polish table", "Wipe all chairs including legs", "Dust all furniture and decor", "Clean windows", "Vacuum or mop thoroughly", "Wipe light fixture", "Declutter and organize sideboard"],
    deep: ["Deep clean and condition wood furniture", "Clean upholstered chair seats", "Dust chandelier / light fixture piece by piece", "Clean windows and treatments", "Move furniture and clean floors underneath", "Wipe baseboards and walls", "Polish any silverware or display pieces", "Deep clean area rug"],
  }},
  office: { name: "Home Office", emoji: "💼", tasks: {
    quick: ["Clear desk surface and wipe down", "Organize papers into a pile", "Dust monitor and keyboard", "Quick vacuum"],
    standard: ["Deep clean desk — remove everything, wipe, reorganize", "Clean monitor, keyboard, and mouse", "Organize and file papers, shred old docs", "Dust shelves, books, and decor", "Vacuum thoroughly", "Wipe light switches and door handles", "Organize cables"],
    deep: ["Full desk teardown — clean and reorganize everything", "Deep clean all electronics and peripherals", "Shred and recycle old papers and files", "Dust every shelf and book spine", "Clean windows and blinds", "Move furniture and vacuum behind", "Wipe baseboards and walls", "Reorganize supply drawers", "Clean light fixtures"],
  }},
  garage: { name: "Garage", emoji: "🚗", tasks: {
    quick: ["Sweep floor", "Quick sort — trash obvious junk", "Clear walkways"],
    standard: ["Sweep and hose down floor", "Sort into keep / donate / trash piles", "Organize tools and supplies", "Wipe shelving", "Clean cobwebs", "Check for expired chemicals, dispose properly", "Organize seasonal items"],
    deep: ["Full garage cleanout — empty everything", "Power wash floor", "Sort all items: keep, donate, trash, sell", "Install or reorganize shelving and storage", "Clean all tools and equipment", "Wipe walls and clear cobwebs", "Check and organize hazardous materials", "Lubricate garage door", "Organize by zone (tools, sports, seasonal, auto)"],
  }},
  basement: { name: "Basement", emoji: "🏚️", tasks: {
    quick: ["Quick sweep", "Check for moisture or leaks", "Tidy stored items"],
    standard: ["Sweep or vacuum floor", "Check for moisture, leaks, or mold", "Organize storage boxes — label clearly", "Dust shelves and surfaces", "Clear cobwebs", "Declutter — remove items to donate or trash"],
    deep: ["Full sweep and mop", "Inspect for moisture, mold, and cracks", "Pull out all storage, sort and reorganize", "Wipe all shelving and surfaces", "Clear all cobwebs including ceiling", "Check sump pump if applicable", "Dehumidifier check and clean", "Organize into labeled zones", "Dispose of anything unused for 2+ years"],
  }},
  laundry: { name: "Laundry Room", emoji: "🧺", tasks: {
    quick: ["Wipe washer and dryer exteriors", "Clear lint trap", "Quick sweep"],
    standard: ["Clean washer drum (vinegar cycle)", "Clean dryer lint trap and exhaust", "Wipe exteriors of both machines", "Wipe counters and shelving", "Sweep and mop floor", "Organize supplies"],
    deep: ["Deep clean washer — drum, gasket, detergent tray", "Deep clean dryer — lint trap, exhaust vent, drum", "Pull machines out and clean behind/under", "Wipe all shelving and cabinets", "Declutter supplies — toss old products", "Deep mop floor", "Check hoses for wear"],
  }},
};

const EXTRA_TASKS = {
  pets: {
    label: "🐾 Pet Tasks",
    tasks: {
      quick: ["Vacuum pet hair from furniture and floors", "Wash food and water bowls"],
      standard: ["Vacuum all pet hair from furniture, floors, and corners", "Wash and sanitize food/water bowls", "Wash pet bedding", "Clean litter box area or outdoor waste", "Wipe pet-accessible baseboards (nose prints!)"],
      deep: ["Deep vacuum everywhere — use lint rollers on upholstery", "Wash all pet bedding, blankets, and toys", "Deep clean litter box or waste station", "Steam clean carpets and upholstery for odor", "Clean pet crate or carrier", "Check and restock pet supplies", "Wipe down all baseboards and walls at pet height"],
    },
  },
  kids: {
    label: "🧸 Kid Tasks",
    tasks: {
      quick: ["Quick toy pickup and sort", "Wipe high chairs / booster seats", "Sanitize most-used toys"],
      standard: ["Sort toys — donate outgrown items", "Sanitize all frequently touched toys", "Wipe high chair, booster, and kids' furniture", "Organize kids' closets — remove outgrown clothes", "Clean art supply area"],
      deep: ["Full toy audit — sort, clean, donate, trash", "Deep clean all stuffed animals (wash or surface clean)", "Sanitize every toy, game piece, and remote", "Deep clean kids' furniture and play mats", "Organize closets and drawers by size", "Clean and organize art/craft supplies", "Check and childproof as needed", "Wipe walls for crayon marks and fingerprints"],
    },
  },
  wfh: {
    label: "💻 WFH Tasks",
    tasks: {
      quick: ["Wipe desk and monitors", "Organize loose papers and cables"],
      standard: ["Deep clean desk setup — keyboard, mouse, monitors", "Organize cables with ties or clips", "File or shred old documents", "Clean webcam and headset", "Wipe desk lamp and accessories"],
      deep: ["Full workstation teardown and deep clean", "Clean inside desk drawers, reorganize", "Sanitize all peripherals", "Professional cable management", "Clean and reorganize reference materials", "Evaluate ergonomics — adjust chair and monitor height"],
    },
  },
  outdoor: {
    label: "🌳 Outdoor Tasks",
    tasks: {
      quick: ["Sweep porch / patio", "Wipe outdoor furniture", "Clear debris from entrance"],
      standard: ["Sweep and hose down patio/deck", "Wipe all outdoor furniture", "Clean front door and entrance area", "Clear gutters if accessible", "Tidy planters and garden beds", "Clean outdoor light fixtures"],
      deep: ["Power wash deck, patio, or walkways", "Deep clean all outdoor furniture", "Clean windows exterior", "Full gutter cleanout", "Clean and organize shed or outdoor storage", "Prep garden beds — pull weeds, add mulch", "Clean grill thoroughly", "Check and repair outdoor lighting", "Wash outdoor cushion covers"],
    },
  },
};

const TIME_PER_TASK = { quick: 4, standard: 7, deep: 12 };

export default function SpringCleaningGenerator() {
  const [homeType, setHomeType] = useState("");
  const [extras, setExtras] = useState([]);
  const [depth, setDepth] = useState("");
  const [checklist, setChecklist] = useState(null);
  const [checked, setChecked] = useState({});
  const resultRef = useRef(null);

  const toggleExtra = (id) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const generate = () => {
    const home = HOME_TYPES.find((h) => h.id === homeType);
    if (!home || !depth) return;

    const rooms = home.rooms.map((roomId) => {
      const room = ROOM_DATA[roomId];
      return {
        id: roomId,
        name: room.name,
        emoji: room.emoji,
        tasks: room.tasks[depth] || room.tasks.standard,
      };
    });

    const extraSections = extras.map((exId) => {
      const ex = EXTRA_TASKS[exId];
      return {
        id: exId,
        name: ex.label,
        tasks: ex.tasks[depth] || ex.tasks.standard,
      };
    });

    setChecklist({ rooms, extras: extraSections });
    setChecked({});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const toggleCheck = (sectionId, taskIdx) => {
    const key = `${sectionId}-${taskIdx}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allSections = checklist ? [...checklist.rooms, ...checklist.extras] : [];
  const totalTasks = allSections.reduce((s, sec) => s + sec.tasks.length, 0);
  const doneTasks = Object.values(checked).filter(Boolean).length;
  const totalMinutes = totalTasks * TIME_PER_TASK[depth || "standard"];
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e1f5fe 0%, #e8f5e9 30%, #fff9c4 60%, #fce4ec 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {["🧹", "🪣", "✨", "🧤", "🫧", "🪟"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${8 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + i % 3 * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🧹✨🪟</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#1565c0", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            Spring Cleaning Checklist
          </h1>
          <p style={{ color: "#4fc3f7", fontSize: 15, margin: 0, fontWeight: 600 }}>
            Tell us about your home and we'll build your custom room-by-room plan!
          </p>
        </div>

        {/* Home Type */}
        <Section num="1" title="What's your home like?" color="#1565c0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {HOME_TYPES.map((h) => (
              <Btn key={h.id} active={homeType === h.id} onClick={() => setHomeType(h.id)} color="#1565c0">
                <div style={{ fontSize: 28, marginBottom: 4 }}>{h.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{h.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{h.rooms.length} areas</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Extras */}
        <Section num="2" title="Any of these apply?" color="#1565c0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {EXTRAS.map((e) => (
              <Btn key={e.id} active={extras.includes(e.id)} onClick={() => toggleExtra(e.id)} color="#1565c0">
                <span style={{ fontSize: 22, marginRight: 6 }}>{e.emoji}</span>
                <span style={{ fontWeight: 700 }}>{e.label}</span>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Depth */}
        <Section num="3" title="How deep are we going?" color="#1565c0">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEPTH.map((d) => (
              <Btn key={d.id} active={depth === d.id} onClick={() => setDepth(d.id)} color="#1565c0" wide>
                <span style={{ fontSize: 22, marginRight: 10 }}>{d.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{d.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.6 }}>{d.desc}</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Generate button */}
        {homeType && depth && (
          <button
            onClick={generate}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #1565c0, #42a5f5)",
              color: "#fff",
              fontFamily: "'Fredoka One', cursive",
              fontSize: 20,
              cursor: "pointer",
              marginBottom: 24,
              boxShadow: "0 4px 20px rgba(21,101,192,0.3)",
              transition: "transform 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🧹 Generate My Checklist!
          </button>
        )}

        {/* Checklist Results */}
        {checklist && (
          <div ref={resultRef}>
            {/* Progress bar */}
            <div
              style={{
                background: "rgba(255,255,255,0.9)",
                borderRadius: 16,
                padding: "18px 22px",
                marginBottom: 20,
                border: "2px solid #bbdefb",
                boxShadow: "0 3px 16px rgba(21,101,192,0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 800, color: "#1565c0", fontSize: 15 }}>
                  Progress: {doneTasks}/{totalTasks} tasks
                </span>
                <span style={{ fontSize: 13, color: "#90a4ae", fontWeight: 600 }}>
                  ~{totalHours} hours total
                </span>
              </div>
              <div style={{ background: "#e3f2fd", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%`,
                    height: "100%",
                    background: doneTasks === totalTasks && totalTasks > 0
                      ? "linear-gradient(90deg, #66bb6a, #43a047)"
                      : "linear-gradient(90deg, #42a5f5, #1565c0)",
                    borderRadius: 10,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              {doneTasks === totalTasks && totalTasks > 0 && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 16, fontWeight: 800, color: "#43a047" }}>
                  🎉 Your home is sparkling clean! Amazing job!
                </div>
              )}
            </div>

            {/* Room sections */}
            {allSections.map((section) => (
              <div
                key={section.id}
                style={{
                  background: "rgba(255,255,255,0.88)",
                  borderRadius: 18,
                  padding: "20px 22px",
                  marginBottom: 14,
                  border: "2px solid rgba(21,101,192,0.08)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                }}
              >
                <h3 style={{ margin: "0 0 14px", color: "#1565c0", fontWeight: 800, fontSize: 17 }}>
                  {section.emoji || ""} {section.name}
                  <span style={{ fontSize: 12, color: "#90a4ae", fontWeight: 600, marginLeft: 10 }}>
                    {section.tasks.filter((_, i) => checked[`${section.id}-${i}`]).length}/{section.tasks.length}
                  </span>
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {section.tasks.map((task, i) => {
                    const key = `${section.id}-${i}`;
                    const done = checked[key];
                    return (
                      <div
                        key={i}
                        onClick={() => toggleCheck(section.id, i)}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 12,
                          padding: "10px 14px",
                          borderRadius: 12,
                          background: done ? "#e8f5e9" : "#fafafa",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          border: done ? "1.5px solid #a5d6a7" : "1.5px solid transparent",
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            border: done ? "2px solid #66bb6a" : "2px solid #ccc",
                            background: done ? "#66bb6a" : "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 13,
                            color: "#fff",
                            fontWeight: 800,
                            flexShrink: 0,
                            marginTop: 1,
                            transition: "all 0.2s",
                          }}
                        >
                          {done ? "✓" : ""}
                        </div>
                        <span
                          style={{
                            fontSize: 14,
                            color: done ? "#999" : "#444",
                            textDecoration: done ? "line-through" : "none",
                            lineHeight: 1.5,
                            fontWeight: done ? 400 : 600,
                            transition: "all 0.2s",
                          }}
                        >
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#90caf9", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🫧🧹✨</div>
          Spring Cleaning Checklist — A fresh start for your home!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(21,101,192,0.06)", border: "2px solid rgba(21,101,192,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #42a5f5)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Btn({ active, onClick, children, color, wide }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: wide ? "14px 18px" : "14px",
        borderRadius: 14,
        border: active ? `2px solid ${color}` : "2px solid #e0e0e0",
        background: active ? `${color}10` : "rgba(255,255,255,0.85)",
        color: active ? color : "#777",
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
