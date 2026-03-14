'use client';
import { useState, useRef } from "react";

const FITNESS_LEVELS = [
  { id: "couch", label: "Total Couch Potato", emoji: "🛋️", desc: "Haven't exercised in months (or years)", weeks: 10 },
  { id: "light", label: "Lightly Active", emoji: "🚶", desc: "Walk regularly, some activity", weeks: 8 },
  { id: "moderate", label: "Somewhat Fit", emoji: "🏃", desc: "Exercise sometimes, can jog a little", weeks: 6 },
];

const DAYS_PER_WEEK = [
  { id: "3", label: "3 days/week", emoji: "📅", desc: "Classic C25K schedule" },
  { id: "4", label: "4 days/week", emoji: "📆", desc: "Faster progression" },
];

const GOALS = [
  { id: "finish", label: "Just finish!", emoji: "🏁", desc: "Cross the line, no matter what" },
  { id: "sub35", label: "Under 35 min", emoji: "⏱️", desc: "Comfortable but steady" },
  { id: "sub30", label: "Under 30 min", emoji: "🔥", desc: "Ambitious — let's push it" },
];

const TERRAIN = [
  { id: "flat", label: "Flat roads / track", emoji: "🛣️" },
  { id: "mixed", label: "Mixed / some hills", emoji: "⛰️" },
  { id: "treadmill", label: "Treadmill", emoji: "🏋️" },
  { id: "trail", label: "Trails", emoji: "🌲" },
];

const WEEK_PLANS = {
  couch: [
    {
      week: 1, title: "Baby Steps", summary: "Mostly walking with short jog bursts",
      sessions: [
        { type: "run", title: "Walk/Jog Intervals", warmup: "5 min brisk walk", main: "Alternate 60 sec jog / 90 sec walk × 8", cooldown: "5 min easy walk", totalMin: 25, effort: "Easy — conversational pace" },
        { type: "run", title: "Walk/Jog Intervals", warmup: "5 min brisk walk", main: "Alternate 60 sec jog / 90 sec walk × 8", cooldown: "5 min easy walk", totalMin: 25, effort: "Easy — same as Day 1" },
        { type: "run", title: "Walk/Jog Intervals", warmup: "5 min brisk walk", main: "Alternate 60 sec jog / 2 min walk × 7", cooldown: "5 min easy walk", totalMin: 26, effort: "Easy — enjoy it!" },
      ],
    },
    {
      week: 2, title: "Building Rhythm", summary: "Slightly longer jogs, same walk breaks",
      sessions: [
        { type: "run", title: "Extended Intervals", warmup: "5 min brisk walk", main: "Alternate 90 sec jog / 90 sec walk × 8", cooldown: "5 min easy walk", totalMin: 29, effort: "Easy to moderate" },
        { type: "run", title: "Extended Intervals", warmup: "5 min brisk walk", main: "Alternate 90 sec jog / 90 sec walk × 8", cooldown: "5 min easy walk", totalMin: 29, effort: "Easy to moderate" },
        { type: "run", title: "Progression", warmup: "5 min brisk walk", main: "Alternate 2 min jog / 1 min walk × 7", cooldown: "5 min easy walk", totalMin: 31, effort: "Moderate — push a tiny bit" },
      ],
    },
    {
      week: 3, title: "The Switch Flips", summary: "Longer jog segments — you're getting stronger",
      sessions: [
        { type: "run", title: "Mixed Intervals", warmup: "5 min brisk walk", main: "2 min jog, 1 min walk, 3 min jog, 2 min walk × 3", cooldown: "5 min easy walk", totalMin: 34, effort: "Moderate" },
        { type: "run", title: "Mixed Intervals", warmup: "5 min brisk walk", main: "2 min jog, 1 min walk, 3 min jog, 2 min walk × 3", cooldown: "5 min easy walk", totalMin: 34, effort: "Moderate" },
        { type: "run", title: "Longer Segments", warmup: "5 min brisk walk", main: "3 min jog, 1 min walk × 6", cooldown: "5 min easy walk", totalMin: 34, effort: "Moderate — trust the process" },
      ],
    },
    {
      week: 4, title: "Getting Real", summary: "5-minute jogs enter the chat",
      sessions: [
        { type: "run", title: "Big Intervals", warmup: "5 min brisk walk", main: "3 min jog, 1 min walk, 5 min jog, 2 min walk × 2, 3 min jog", cooldown: "5 min easy walk", totalMin: 35, effort: "Moderate" },
        { type: "run", title: "Big Intervals", warmup: "5 min brisk walk", main: "5 min jog, 2 min walk × 3, 3 min jog", cooldown: "5 min easy walk", totalMin: 34, effort: "Moderate to hard" },
        { type: "run", title: "Endurance Push", warmup: "5 min brisk walk", main: "5 min jog, 1.5 min walk × 4", cooldown: "5 min easy walk", totalMin: 36, effort: "Hard — but you've got this" },
      ],
    },
    {
      week: 5, title: "The Breakthrough Week", summary: "Your first continuous 10+ minute jog!",
      sessions: [
        { type: "run", title: "Building Up", warmup: "5 min brisk walk", main: "5 min jog, 2 min walk, 8 min jog, 2 min walk, 5 min jog", cooldown: "5 min easy walk", totalMin: 32, effort: "Moderate" },
        { type: "run", title: "Halfway Hero", warmup: "5 min brisk walk", main: "10 min jog, 2 min walk, 10 min jog", cooldown: "5 min easy walk", totalMin: 32, effort: "Hard — you can do it" },
        { type: "run", title: "🌟 The Big One", warmup: "5 min brisk walk", main: "20 min continuous jog (no walking!)", cooldown: "5 min easy walk", totalMin: 30, effort: "HARD — this is your breakthrough moment!" },
      ],
    },
    {
      week: 6, title: "Cementing the Habit", summary: "Longer runs with less walking",
      sessions: [
        { type: "run", title: "Interval Refresh", warmup: "5 min brisk walk", main: "8 min jog, 2 min walk, 8 min jog, 2 min walk, 5 min jog", cooldown: "5 min easy walk", totalMin: 35, effort: "Moderate" },
        { type: "run", title: "Steady Effort", warmup: "5 min brisk walk", main: "12 min jog, 2 min walk, 12 min jog", cooldown: "5 min easy walk", totalMin: 36, effort: "Moderate to hard" },
        { type: "run", title: "Long Run", warmup: "5 min brisk walk", main: "22 min continuous jog", cooldown: "5 min easy walk", totalMin: 32, effort: "Hard — new record!" },
      ],
    },
    {
      week: 7, title: "Runner Mode", summary: "Mostly continuous running now",
      sessions: [
        { type: "run", title: "Steady State", warmup: "5 min brisk walk", main: "25 min continuous jog", cooldown: "5 min easy walk", totalMin: 35, effort: "Moderate — find your rhythm" },
        { type: "run", title: "Tempo Taste", warmup: "5 min brisk walk", main: "10 min easy jog, 5 min slightly faster, 10 min easy", cooldown: "5 min easy walk", totalMin: 35, effort: "Moderate" },
        { type: "run", title: "Long Run", warmup: "5 min brisk walk", main: "28 min continuous jog", cooldown: "5 min easy walk", totalMin: 38, effort: "Hard — longest yet!" },
      ],
    },
    {
      week: 8, title: "Almost There", summary: "30 minutes? Easy. (Well, easier.)",
      sessions: [
        { type: "run", title: "Confidence Run", warmup: "5 min brisk walk", main: "28 min continuous jog", cooldown: "5 min easy walk", totalMin: 38, effort: "Moderate — you know this" },
        { type: "run", title: "Speed Play", warmup: "5 min brisk walk", main: "25 min jog with 4 × 30 sec pickups (faster pace) mixed in", cooldown: "5 min easy walk", totalMin: 35, effort: "Moderate to hard" },
        { type: "run", title: "Long Run", warmup: "5 min brisk walk", main: "30 min continuous jog", cooldown: "5 min easy walk", totalMin: 40, effort: "Hard — but you're ready!" },
      ],
    },
    {
      week: 9, title: "Race Prep", summary: "Fine-tuning and building confidence",
      sessions: [
        { type: "run", title: "Race Pace Practice", warmup: "5 min brisk walk", main: "30 min jog at your target race pace", cooldown: "5 min easy walk", totalMin: 40, effort: "Moderate — practice your goal pace" },
        { type: "run", title: "Easy Shakeout", warmup: "5 min brisk walk", main: "20 min easy jog — keep it light", cooldown: "5 min easy walk", totalMin: 30, effort: "Easy — recovery run" },
        { type: "run", title: "Dress Rehearsal", warmup: "5 min brisk walk", main: "32 min continuous jog (slightly over 5K time)", cooldown: "5 min easy walk", totalMin: 42, effort: "Moderate — simulate race day" },
      ],
    },
    {
      week: 10, title: "🏁 Race Week!", summary: "Taper, rest, and GO!",
      sessions: [
        { type: "run", title: "Easy Shakeout", warmup: "5 min brisk walk", main: "15 min very easy jog", cooldown: "5 min easy walk", totalMin: 25, effort: "Very easy — save your legs" },
        { type: "rest", title: "Rest Day", main: "Complete rest or light stretching. Hydrate well. Lay out race outfit.", totalMin: 0, effort: "Rest — you've earned it" },
        { type: "race", title: "🎉 RACE DAY!", warmup: "10 min easy walk + dynamic stretches", main: "Run your 5K! Start easy, build into it, give it everything the last kilometer.", cooldown: "5 min walk + stretch + CELEBRATE!", totalMin: 40, effort: "ALL OUT — this is YOUR moment!" },
      ],
    },
  ],
};

function generatePlan(fitness, daysPerWeek, goal, terrain) {
  let basePlan = JSON.parse(JSON.stringify(WEEK_PLANS.couch));

  if (fitness === "light") basePlan = basePlan.slice(2);
  else if (fitness === "moderate") basePlan = basePlan.slice(4);

  basePlan = basePlan.map((week, i) => ({ ...week, week: i + 1 }));

  if (daysPerWeek === "4") {
    basePlan = basePlan.map((week) => {
      const crossTrain = {
        type: "cross",
        title: "Cross-Training",
        main: "30 min low-impact: cycling, swimming, yoga, or brisk walking. Keep it easy — active recovery!",
        totalMin: 30,
        effort: "Easy — different muscles, same benefits",
      };
      return { ...week, sessions: [...week.sessions.slice(0, 2), crossTrain, week.sessions[2]] };
    });
  }

  let terrainTip = "";
  if (terrain === "trail") terrainTip = "Trail running: pace will be slower than road — that's normal. Watch your footing and shorten your stride on descents.";
  else if (terrain === "treadmill") terrainTip = "Treadmill: set 1% incline to simulate outdoor effort. Use the same walk/jog intervals — speed settings make it easy to be precise.";
  else if (terrain === "mixed") terrainTip = "Hills: walk the uphills if needed — no shame. Focus on effort, not pace. Hills build strength fast!";

  return { weeks: basePlan, terrainTip, totalWeeks: basePlan.length };
}

export default function CouchTo5K() {
  const [fitness, setFitness] = useState("");
  const [days, setDays] = useState("");
  const [goal, setGoal] = useState("");
  const [terrain, setTerrain] = useState("");
  const [plan, setPlan] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState({});
  const [completed, setCompleted] = useState({});
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

  const generate = () => {
    if (!fitness || !days || !goal || !terrain) return;
    const result = generatePlan(fitness, days, goal, terrain);
    setPlan(result);
    setCompleted({});
    setExpandedWeek({0: true});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const toggleComplete = (weekIdx, sessionIdx) => {
    const key = `w${weekIdx}-s${sessionIdx}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSessions = plan ? plan.weeks.reduce((s, w) => s + w.sessions.length, 0) : 0;
  const doneSessions = Object.values(completed).filter(Boolean).length;
  const canGenerate = fitness && days && goal && terrain;

  const typeColors = { run: "#43a047", cross: "#1e88e5", rest: "#9e9e9e", race: "#e53935" };
  const typeEmojis = { run: "🏃", cross: "🚴", rest: "😴", race: "🏁" };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 25%, #fffde7 50%, #fff3e0 80%, #fce4ec 100%)",
        fontFamily: "'Nunito', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Fredoka+One&display=swap" rel="stylesheet" />

      {["🏃", "🌳", "☀️", "💪", "🎯", "🏅"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${5 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + (i % 3) * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🛋️➡️🏃</div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#2e7d32", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>
            Couch to 5K Plan
          </h1>
          <p style={{ color: "#66bb6a", fontSize: 15, margin: 0, fontWeight: 600 }}>
            From zero to 5K — your personalized running journey starts here
          </p>
        </div>

        {/* Fitness Level */}
        <Section num="1" title="Where are you starting from?" color="#2e7d32">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FITNESS_LEVELS.map((f) => (
              <Btn key={f.id} active={fitness === f.id} onClick={() => setFitness(f.id)} color="#2e7d32" wide>
                <span style={{ fontSize: 26, marginRight: 12 }}>{f.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{f.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>{f.desc} — {f.weeks} week plan</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Days per week */}
        <Section num="2" title="How many days can you commit?" color="#2e7d32">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {DAYS_PER_WEEK.map((d) => (
              <Btn key={d.id} active={days === d.id} onClick={() => setDays(d.id)} color="#2e7d32">
                <div style={{ fontSize: 22, marginBottom: 4 }}>{d.emoji}</div>
                <div style={{ fontWeight: 800 }}>{d.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{d.desc}</div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Goal */}
        <Section num="3" title="What's your 5K goal?" color="#2e7d32">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GOALS.map((g) => (
              <Btn key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)} color="#2e7d32" wide>
                <span style={{ fontSize: 22, marginRight: 12 }}>{g.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800 }}>{g.label}</div>
                  <div style={{ fontSize: 12, opacity: 0.65 }}>{g.desc}</div>
                </div>
              </Btn>
            ))}
          </div>
        </Section>

        {/* Terrain */}
        <Section num="4" title="Where will you run?" color="#2e7d32">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {TERRAIN.map((t) => (
              <Btn key={t.id} active={terrain === t.id} onClick={() => setTerrain(t.id)} color="#2e7d32">
                <div style={{ fontSize: 22 }}>{t.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{t.label}</div>
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
              background: "linear-gradient(135deg, #2e7d32, #66bb6a)", color: "#fff",
              fontFamily: "'Fredoka One', cursive", fontSize: 20, cursor: "pointer",
              marginBottom: 24, boxShadow: "0 4px 20px rgba(46,125,50,0.3)",
              transition: "transform 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🏃 Generate My Plan!
          </button>
        )}

        {/* Plan Results */}
        {plan && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'couch-to-5k-plan.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #2e7d32, #66bb6a)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(46,125,50,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 Download as PDF
            </button>
            {/* Summary bar */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, border: "2px solid #a5d6a7", boxShadow: "0 3px 16px rgba(46,125,50,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <MiniStat emoji="📅" value={`${plan.totalWeeks} weeks`} label="Duration" />
                <MiniStat emoji="🏃" value={`${totalSessions} sessions`} label="Total" />
                <MiniStat emoji="✅" value={`${doneSessions}/${totalSessions}`} label="Completed" />
                <MiniStat emoji="🔥" value={`${totalSessions > 0 ? Math.round((doneSessions / totalSessions) * 100) : 0}%`} label="Progress" />
              </div>
              <div style={{ background: "#e8f5e9", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{
                  width: `${totalSessions > 0 ? (doneSessions / totalSessions) * 100 : 0}%`,
                  height: "100%",
                  background: doneSessions === totalSessions && totalSessions > 0 ? "linear-gradient(90deg, #ffd54f, #ff6f00)" : "linear-gradient(90deg, #66bb6a, #2e7d32)",
                  borderRadius: 10, transition: "width 0.4s ease",
                }} />
              </div>
              {doneSessions === totalSessions && totalSessions > 0 && (
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 18, fontWeight: 800, color: "#ff6f00" }}>
                  🏅 YOU DID IT! You're a runner now! 🎉
                </div>
              )}
            </div>

            {/* Terrain tip */}
            {plan.terrainTip && (
              <div style={{ background: "#f1f8e9", borderRadius: 14, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#558b2f", fontWeight: 600, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <span>{plan.terrainTip}</span>
              </div>
            )}

            {/* Week cards */}
            {plan.weeks.map((week, wi) => {
              const isExpanded = !!expandedWeek[wi];
              const weekDone = week.sessions.filter((_, si) => completed[`w${wi}-s${si}`]).length;
              const weekComplete = weekDone === week.sessions.length;

              return (
                <div key={wi} style={{ marginBottom: 10 }}>
                  <div
                    onClick={() => setExpandedWeek(prev => ({...prev, [wi]: !prev[wi]}))}
                    style={{
                      padding: "16px 20px",
                      borderRadius: isExpanded ? "16px 16px 0 0" : 16,
                      background: weekComplete ? "linear-gradient(135deg, #e8f5e9, #f1f8e9)" : "rgba(255,255,255,0.88)",
                      border: isExpanded ? "2px solid #a5d6a7" : weekComplete ? "2px solid #81c784" : "2px solid rgba(46,125,50,0.06)",
                      borderBottom: isExpanded ? "none" : undefined,
                      cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontFamily: "'Fredoka One', cursive", color: "#2e7d32", fontSize: 16 }}>
                          Week {week.week}
                        </span>
                        <span style={{ fontWeight: 800, color: "#555", fontSize: 14 }}>— {week.title}</span>
                        {weekComplete && <span style={{ fontSize: 16 }}>✅</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#999", marginTop: 2, fontWeight: 600 }}>{week.summary}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>{weekDone}/{week.sessions.length}</span>
                      <span style={{ color: "#ccc", transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ border: "2px solid #a5d6a7", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "16px 20px", background: "#fafff8" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {week.sessions.map((session, si) => {
                          const key = `w${wi}-s${si}`;
                          const done = completed[key];
                          const color = typeColors[session.type];

                          return (
                            <div
                              key={si}
                              style={{
                                background: done ? "#e8f5e9" : "#fff",
                                borderRadius: 14,
                                padding: "16px 18px",
                                border: done ? "2px solid #a5d6a7" : `2px solid ${color}20`,
                                transition: "all 0.2s",
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 18 }}>{typeEmojis[session.type]}</span>
                                    <span style={{ fontWeight: 800, color: done ? "#999" : color, fontSize: 15, textDecoration: done ? "line-through" : "none" }}>
                                      Day {si + 1}: {session.title}
                                    </span>
                                  </div>
                                  {session.totalMin > 0 && (
                                    <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600, marginLeft: 26 }}>
                                      ~{session.totalMin} min
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => toggleComplete(wi, si)}
                                  style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    border: done ? "2px solid #66bb6a" : "2px dashed #ccc",
                                    background: done ? "#66bb6a" : "#fff",
                                    color: done ? "#fff" : "#ccc",
                                    fontSize: 16, fontWeight: 800, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.2s", flexShrink: 0,
                                  }}
                                >
                                  {done ? "✓" : ""}
                                </button>
                              </div>

                              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8, paddingLeft: 2 }}>
                                {session.warmup && (
                                  <div><span style={{ color: "#f9a825", fontWeight: 700 }}>Warm-up:</span> {session.warmup}</div>
                                )}
                                <div><span style={{ color, fontWeight: 700 }}>Workout:</span> {session.main}</div>
                                {session.cooldown && (
                                  <div><span style={{ color: "#42a5f5", fontWeight: 700 }}>Cool-down:</span> {session.cooldown}</div>
                                )}
                                <div style={{ marginTop: 6, padding: "6px 10px", background: `${color}10`, borderRadius: 8, fontSize: 12, color, fontWeight: 700 }}>
                                  Effort: {session.effort}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tips */}
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "24px", marginTop: 20, border: "2px solid #c8e6c9" }}>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", color: "#2e7d32", margin: "0 0 14px", fontSize: 18 }}>
                🏆 Runner's Tips
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "#555", lineHeight: 1.6 }}>
                {[
                  { emoji: "🐢", tip: "Slow down! If you can't hold a conversation while jogging, you're going too fast." },
                  { emoji: "👟", tip: "Get proper running shoes from a running store. It's the #1 injury prevention tool." },
                  { emoji: "💧", tip: "Hydrate before, during (if 30+ min), and after every run." },
                  { emoji: "🦵", tip: "Rest days are when your body gets stronger. Don't skip them!" },
                  { emoji: "📱", tip: "Use a running app (Strava, Nike Run Club) to track pace and celebrate milestones." },
                  { emoji: "🧘", tip: "Stretch or do yoga on off days. Your legs will thank you." },
                  { emoji: "🎵", tip: "Make a running playlist or try podcasts — whatever keeps you moving." },
                  { emoji: "🌧️", tip: "Bad weather? Adjust but don't skip. A rainy run is still a run (and kinda fun)." },
                ].map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{t.emoji}</span>
                    <span style={{ fontWeight: 600 }}>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#a5d6a7", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🏃🌸🏅</div>
          Couch to 5K Plan — Every runner starts somewhere!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, boxShadow: "0 3px 16px rgba(46,125,50,0.06)", border: "2px solid rgba(46,125,50,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #66bb6a)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
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

function MiniStat({ emoji, value, label }) {
  return (
    <div style={{ textAlign: "center", minWidth: 70 }}>
      <div style={{ fontSize: 18 }}>{emoji}</div>
      <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: 18, color: "#2e7d32" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div>
    </div>
  );
}
