'use client';

import { useState, useRef, useEffect } from "react";

const FITNESS_LEVELS = [
  { id: "couch", label: "완전 초보", emoji: "🛋️", desc: "운동 안 한 지 오래됨", weeks: 10 },
  { id: "light", label: "가벼운 활동", emoji: "🚶", desc: "산책은 자주, 약간의 활동", weeks: 8 },
  { id: "moderate", label: "어느 정도 운동", emoji: "🏃", desc: "가끔 운동, 조깅 조금 가능", weeks: 6 },
];

const DAYS = [
  { id: "3", label: "주 3일", emoji: "📅", desc: "클래식 C25K" },
  { id: "4", label: "주 4일", emoji: "📆", desc: "빠른 진행" },
];

const GOALS = [
  { id: "finish", label: "완주만!", emoji: "🏁", desc: "시간 상관없이 끝까지" },
  { id: "sub35", label: "35분 이내", emoji: "⏱️", desc: "편안하지만 꾸준하게" },
  { id: "sub30", label: "30분 이내", emoji: "🔥", desc: "도전적 — 할 수 있다!" },
];

const TERRAIN = [
  { id: "river", label: "한강/하천 공원", emoji: "🌊" },
  { id: "park", label: "공원/둘레길", emoji: "🌳" },
  { id: "treadmill", label: "러닝머신", emoji: "🏋️" },
  { id: "track", label: "운동장/트랙", emoji: "🏟️" },
];

const WEEKS = [
  { week: 1, title: "첫 걸음", summary: "걷기 위주 + 짧은 조깅",
    sessions: [
      { type: "run", title: "걷기/조깅 인터벌", warmup: "5분 빠른 걸음", main: "60초 조깅 / 90초 걷기 × 8회", cooldown: "5분 천천히 걷기", totalMin: 25, effort: "쉬움 — 대화 가능한 속도" },
      { type: "run", title: "걷기/조깅 인터벌", warmup: "5분 빠른 걸음", main: "60초 조깅 / 90초 걷기 × 8회", cooldown: "5분 천천히 걷기", totalMin: 25, effort: "쉬움 — 1일차와 동일" },
      { type: "run", title: "걷기/조깅 인터벌", warmup: "5분 빠른 걸음", main: "60초 조깅 / 2분 걷기 × 7회", cooldown: "5분 천천히 걷기", totalMin: 26, effort: "쉬움 — 즐기세요!" },
    ]},
  { week: 2, title: "리듬 찾기", summary: "조금 더 긴 조깅",
    sessions: [
      { type: "run", title: "확장 인터벌", warmup: "5분 빠른 걸음", main: "90초 조깅 / 90초 걷기 × 8회", cooldown: "5분 천천히 걷기", totalMin: 29, effort: "쉬움~보통" },
      { type: "run", title: "확장 인터벌", warmup: "5분 빠른 걸음", main: "90초 조깅 / 90초 걷기 × 8회", cooldown: "5분 천천히 걷기", totalMin: 29, effort: "쉬움~보통" },
      { type: "run", title: "진행", warmup: "5분 빠른 걸음", main: "2분 조깅 / 1분 걷기 × 7회", cooldown: "5분 천천히 걷기", totalMin: 31, effort: "보통 — 조금만 더!" },
    ]},
  { week: 3, title: "변화의 시작", summary: "더 긴 조깅 구간 — 강해지고 있어요",
    sessions: [
      { type: "run", title: "혼합 인터벌", warmup: "5분 빠른 걸음", main: "2분 조깅, 1분 걷기, 3분 조깅, 2분 걷기 × 3세트", cooldown: "5분 천천히 걷기", totalMin: 34, effort: "보통" },
      { type: "run", title: "혼합 인터벌", warmup: "5분 빠른 걸음", main: "2분 조깅, 1분 걷기, 3분 조깅, 2분 걷기 × 3세트", cooldown: "5분 천천히 걷기", totalMin: 34, effort: "보통" },
      { type: "run", title: "긴 구간", warmup: "5분 빠른 걸음", main: "3분 조깅, 1분 걷기 × 6회", cooldown: "5분 천천히 걷기", totalMin: 34, effort: "보통 — 과정을 믿으세요" },
    ]},
  { week: 4, title: "본격 시작", summary: "5분 연속 조깅 등장!",
    sessions: [
      { type: "run", title: "큰 인터벌", warmup: "5분 빠른 걸음", main: "3분 조깅, 1분 걷기, 5분 조깅, 2분 걷기 × 2세트, 3분 조깅", cooldown: "5분 천천히 걷기", totalMin: 35, effort: "보통" },
      { type: "run", title: "큰 인터벌", warmup: "5분 빠른 걸음", main: "5분 조깅, 2분 걷기 × 3세트, 3분 조깅", cooldown: "5분 천천히 걷기", totalMin: 34, effort: "보통~힘듦" },
      { type: "run", title: "지구력 도전", warmup: "5분 빠른 걸음", main: "5분 조깅, 1.5분 걷기 × 4회", cooldown: "5분 천천히 걷기", totalMin: 36, effort: "힘듦 — 하지만 할 수 있어요!" },
    ]},
  { week: 5, title: "돌파의 주", summary: "첫 10분 이상 연속 조깅!",
    sessions: [
      { type: "run", title: "빌드업", warmup: "5분 빠른 걸음", main: "5분 조깅, 2분 걷기, 8분 조깅, 2분 걷기, 5분 조깅", cooldown: "5분 천천히 걷기", totalMin: 32, effort: "보통" },
      { type: "run", title: "하프웨이 히어로", warmup: "5분 빠른 걸음", main: "10분 조깅, 2분 걷기, 10분 조깅", cooldown: "5분 천천히 걷기", totalMin: 32, effort: "힘듦 — 할 수 있어요!" },
      { type: "run", title: "🌟 THE BIG ONE", warmup: "5분 빠른 걸음", main: "20분 연속 조깅 (걷기 없이!)", cooldown: "5분 천천히 걷기", totalMin: 30, effort: "매우 힘듦 — 돌파의 순간!" },
    ]},
  { week: 6, title: "습관 굳히기", summary: "더 긴 달리기, 적은 걷기",
    sessions: [
      { type: "run", title: "인터벌 리프레시", warmup: "5분 빠른 걸음", main: "8분 조깅, 2분 걷기, 8분 조깅, 2분 걷기, 5분 조깅", cooldown: "5분 천천히 걷기", totalMin: 35, effort: "보통" },
      { type: "run", title: "꾸준한 달리기", warmup: "5분 빠른 걸음", main: "12분 조깅, 2분 걷기, 12분 조깅", cooldown: "5분 천천히 걷기", totalMin: 36, effort: "보통~힘듦" },
      { type: "run", title: "긴 달리기", warmup: "5분 빠른 걸음", main: "22분 연속 조깅", cooldown: "5분 천천히 걷기", totalMin: 32, effort: "힘듦 — 새 기록!" },
    ]},
  { week: 7, title: "러너 모드", summary: "대부분 연속 달리기",
    sessions: [
      { type: "run", title: "스테디 런", warmup: "5분 빠른 걸음", main: "25분 연속 조깅", cooldown: "5분 천천히 걷기", totalMin: 35, effort: "보통 — 리듬을 찾으세요" },
      { type: "run", title: "템포 맛보기", warmup: "5분 빠른 걸음", main: "10분 이지 → 5분 약간 빠르게 → 10분 이지", cooldown: "5분 천천히 걷기", totalMin: 35, effort: "보통" },
      { type: "run", title: "긴 달리기", warmup: "5분 빠른 걸음", main: "28분 연속 조깅", cooldown: "5분 천천히 걷기", totalMin: 38, effort: "힘듦 — 최장 기록!" },
    ]},
  { week: 8, title: "거의 다 왔어요", summary: "30분? 이제 할 수 있어요!",
    sessions: [
      { type: "run", title: "자신감 런", warmup: "5분 빠른 걸음", main: "28분 연속 조깅", cooldown: "5분 천천히 걷기", totalMin: 38, effort: "보통 — 이제 아시죠" },
      { type: "run", title: "스피드 플레이", warmup: "5분 빠른 걸음", main: "25분 조깅 + 중간중간 30초 빠르게 × 4회", cooldown: "5분 천천히 걷기", totalMin: 35, effort: "보통~힘듦" },
      { type: "run", title: "긴 달리기", warmup: "5분 빠른 걸음", main: "30분 연속 조깅", cooldown: "5분 천천히 걷기", totalMin: 40, effort: "힘듦 — 준비 완료!" },
    ]},
  { week: 9, title: "레이스 준비", summary: "세밀한 조정과 자신감 빌드",
    sessions: [
      { type: "run", title: "레이스 페이스 연습", warmup: "5분 빠른 걸음", main: "30분 목표 페이스로 조깅", cooldown: "5분 천천히 걷기", totalMin: 40, effort: "보통 — 목표 속도 연습" },
      { type: "run", title: "가벼운 런", warmup: "5분 빠른 걸음", main: "20분 가볍게 조깅", cooldown: "5분 천천히 걷기", totalMin: 30, effort: "쉬움 — 회복 런" },
      { type: "run", title: "드레스 리허설", warmup: "5분 빠른 걸음", main: "32분 연속 조깅", cooldown: "5분 천천히 걷기", totalMin: 42, effort: "보통 — 레이스 시뮬레이션" },
    ]},
  { week: 10, title: "🏁 레이스 주간!", summary: "테이퍼, 휴식, 그리고 GO!",
    sessions: [
      { type: "run", title: "가벼운 셰이크아웃", warmup: "5분 빠른 걸음", main: "15분 아주 가볍게 조깅", cooldown: "5분 천천히 걷기", totalMin: 25, effort: "매우 쉬움 — 다리를 아끼세요" },
      { type: "rest", title: "휴식일", main: "완전 휴식 또는 가벼운 스트레칭. 수분 충분히. 레이스 복장 준비.", totalMin: 0, effort: "휴식 — 자격 있어요!" },
      { type: "race", title: "🎉 레이스 데이!", warmup: "10분 가벼운 걷기 + 동적 스트레칭", main: "5K를 달리세요! 천천히 시작, 점점 올리고, 마지막 1km에 전력!", cooldown: "5분 걷기 + 스트레칭 + 축하!", totalMin: 40, effort: "전력 — 이 순간은 당신의 것!" },
    ]},
];

function generatePlan(fitness, daysPerWeek) {
  let plan = JSON.parse(JSON.stringify(WEEKS));
  if (fitness === "light") plan = plan.slice(2);
  else if (fitness === "moderate") plan = plan.slice(4);
  plan = plan.map((w, i) => ({ ...w, week: i + 1 }));
  if (daysPerWeek === "4") {
    plan = plan.map((w) => ({ ...w, sessions: [...w.sessions.slice(0, 2), { type: "cross", title: "크로스 트레이닝", main: "30분 저강도: 자전거, 수영, 요가, 빠른 걷기. 가볍게!", totalMin: 30, effort: "쉬움 — 다른 근육, 같은 효과" }, w.sessions[2]] }));
  }
  return plan;
}

export default function CouchTo5KKR() {
  const [fitness, setFitness] = useState("");
  const [days, setDays] = useState("");
  const [goal, setGoal] = useState("");
  const [terrain, setTerrain] = useState("");
  const [plan, setPlan] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState({});
  const [completed, setCompleted] = useState(() => { try { const s = localStorage.getItem("kr-couch-to-5k-completed"); return s ? JSON.parse(s) : {}; } catch { return {}; } });
  const [allExpanded, setAllExpanded] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => { try { localStorage.setItem("kr-couch-to-5k-completed", JSON.stringify(completed)); } catch {} }, [completed]);

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
    setPlan(generatePlan(fitness, days)); setCompleted({}); setExpandedWeek({0: true});
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  const toggleComplete = (wi, si) => { const key = `w${wi}-s${si}`; setCompleted((prev) => ({ ...prev, [key]: !prev[key] })); };
  const totalSessions = plan ? plan.reduce((s, w) => s + w.sessions.length, 0) : 0;
  const doneSessions = Object.values(completed).filter(Boolean).length;
  const canGenerate = fitness && days && goal && terrain;
  const typeColors = { run: "#43a047", cross: "#1e88e5", rest: "#9e9e9e", race: "#e53935" };
  const typeEmojis = { run: "🏃", cross: "🚴", rest: "😴", race: "🏁" };

  const terrainTips = {
    river: "🌊 한강/하천: 평지라 초보자에게 최적! 거리 표시가 있어 페이스 확인 쉬워요. 바람이 강한 날은 모자 필수.",
    park: "🌳 공원: 자연 속에서 달리면 스트레스 해소 효과 2배! 경사가 있으면 걸어도 OK. 둘레길은 거리 확인 어려울 수 있어요.",
    treadmill: "🏋️ 러닝머신: 경사 1%로 설정하면 야외와 비슷한 강도. 속도 설정이 정확해서 인터벌 연습에 좋아요.",
    track: "🏟️ 트랙: 400m 정확한 거리. 5K = 12.5바퀴. 페이스 연습에 최적이에요.",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #e8f5e9 0%, #f1f8e9 25%, #fffde7 50%, #fff3e0 80%, #fce4ec 100%)", fontFamily: "'Noto Sans KR', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🛋️➡️🏃</div>
          <h1 style={{ fontFamily: "'Jua', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#2e7d32", margin: "0 0 8px" }}>소파에서 5K까지</h1>
          <p style={{ color: "#66bb6a", fontSize: 15, margin: 0, fontWeight: 600 }}>제로에서 5K — 나만의 러닝 여정이 시작됩니다</p>
        </div>

        <Section num="1" title="현재 체력 수준은?" color="#2e7d32">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {FITNESS_LEVELS.map((f) => (<Btn key={f.id} active={fitness === f.id} onClick={() => setFitness(f.id)} color="#2e7d32" wide><span style={{ fontSize: 26, marginRight: 12 }}>{f.emoji}</span><div><div style={{ fontWeight: 800 }}>{f.label}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{f.desc} — {f.weeks}주 플랜</div></div></Btn>))}
          </div>
        </Section>

        <Section num="2" title="주 몇 일 뛸 수 있나요?" color="#2e7d32">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {DAYS.map((d) => (<Btn key={d.id} active={days === d.id} onClick={() => setDays(d.id)} color="#2e7d32"><div style={{ fontSize: 22, marginBottom: 4 }}>{d.emoji}</div><div style={{ fontWeight: 800 }}>{d.label}</div><div style={{ fontSize: 11, opacity: 0.6 }}>{d.desc}</div></Btn>))}
          </div>
        </Section>

        <Section num="3" title="5K 목표는?" color="#2e7d32">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {GOALS.map((g) => (<Btn key={g.id} active={goal === g.id} onClick={() => setGoal(g.id)} color="#2e7d32" wide><span style={{ fontSize: 22, marginRight: 12 }}>{g.emoji}</span><div><div style={{ fontWeight: 800 }}>{g.label}</div><div style={{ fontSize: 12, opacity: 0.65 }}>{g.desc}</div></div></Btn>))}
          </div>
        </Section>

        <Section num="4" title="어디서 달리나요?" color="#2e7d32">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {TERRAIN.map((t) => (<Btn key={t.id} active={terrain === t.id} onClick={() => setTerrain(t.id)} color="#2e7d32"><div style={{ fontSize: 22 }}>{t.emoji}</div><div style={{ fontWeight: 700, fontSize: 13 }}>{t.label}</div></Btn>))}
          </div>
        </Section>

        {canGenerate && (
          <button onClick={generate} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #2e7d32, #66bb6a)", color: "#fff", fontFamily: "'Jua', cursive", fontSize: 20, cursor: "pointer", marginBottom: 24, boxShadow: "0 4px 20px rgba(46,125,50,0.3)" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            🏃 플랜 만들기!
          </button>
        )}

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
              📥 PDF 다운로드
            </button>
            <button onClick={() => { setCompleted({}); setExpandedWeek({0: true}); setAllExpanded(false); }} style={{ width: "100%", marginBottom: 16, padding: "14px", borderRadius: 14, border: "2px solid #e0e0e0", background: "#fff", color: "#888", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit", transition: "transform 0.15s" }} onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")} onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>🔄 처음부터 다시</button>
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "20px 24px", marginBottom: 20, border: "2px solid #a5d6a7", position: "sticky", top: 0, zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <MS emoji="📅" value={`${plan.length}주`} label="기간" />
                <MS emoji="🏃" value={`${totalSessions}회`} label="세션" />
                <MS emoji="✅" value={`${doneSessions}/${totalSessions}`} label="완료" />
                <MS emoji="🔥" value={`${totalSessions > 0 ? Math.round((doneSessions / totalSessions) * 100) : 0}%`} label="진행률" />
              </div>
              <div style={{ background: "#e8f5e9", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{ width: `${totalSessions > 0 ? (doneSessions / totalSessions) * 100 : 0}%`, height: "100%", background: doneSessions === totalSessions && totalSessions > 0 ? "linear-gradient(90deg, #ffd54f, #ff6f00)" : "linear-gradient(90deg, #66bb6a, #2e7d32)", borderRadius: 10, transition: "width 0.4s" }} />
              </div>
              {doneSessions === totalSessions && totalSessions > 0 && (
                <div style={{ textAlign: "center", marginTop: 12, fontSize: 18, fontWeight: 800, color: "#ff6f00" }}>🏅 해냈어요! 당신은 이제 러너입니다! 🎉</div>
              )}
            </div>

            {terrain && terrainTips[terrain] && (
              <div style={{ background: "#f1f8e9", borderRadius: 14, padding: "14px 18px", marginBottom: 20, fontSize: 13, color: "#558b2f", fontWeight: 600 }}>{terrainTips[terrain]}</div>
            )}

            <button onClick={() => { if (allExpanded) { setExpandedWeek({}); setAllExpanded(false); } else { const all = {}; plan.forEach((_, i) => { all[i] = true; }); setExpandedWeek(all); setAllExpanded(true); } }} style={{ width: "100%", marginBottom: 12, padding: "10px", borderRadius: 12, border: "2px solid #a5d6a7", background: "#f1f8e9", color: "#2e7d32", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>{allExpanded ? "🔽 모두 접기" : "🔼 모두 펼치기"}</button>
            {plan.map((week, wi) => {
              const isExpanded = !!expandedWeek[wi];
              const weekDone = week.sessions.filter((_, si) => completed[`w${wi}-s${si}`]).length;
              return (
                <div key={wi} style={{ marginBottom: 10 }}>
                  <div onClick={() => setExpandedWeek(prev => ({...prev, [wi]: !prev[wi]}))}
                    style={{ padding: "16px 20px", borderRadius: isExpanded ? "16px 16px 0 0" : 16, background: weekDone === week.sessions.length ? "linear-gradient(135deg, #e8f5e9, #f1f8e9)" : "rgba(255,255,255,0.88)", border: isExpanded ? "2px solid #a5d6a7" : "2px solid rgba(46,125,50,0.06)", borderBottom: isExpanded ? "none" : undefined, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", fontSize: 16 }}>{week.week}주차</span>
                      <span style={{ fontWeight: 800, color: "#555", fontSize: 14, marginLeft: 8 }}>— {week.title}</span>
                      {weekDone === week.sessions.length && <span style={{ fontSize: 16, marginLeft: 4 }}>✅</span>}
                      <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{week.summary}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 12, color: "#aaa", fontWeight: 700 }}>{weekDone}/{week.sessions.length}</span>
                      <span style={{ color: "#ccc", transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ border: "2px solid #a5d6a7", borderTop: "none", borderRadius: "0 0 16px 16px", padding: "16px 20px", background: "#fafff8" }}>
                      {week.sessions.map((session, si) => {
                        const key = `w${wi}-s${si}`; const done = completed[key]; const color = typeColors[session.type];
                        return (
                          <div key={si} style={{ background: done ? "#e8f5e9" : "#fff", borderRadius: 14, padding: "16px 18px", border: done ? "2px solid #a5d6a7" : `2px solid ${color}20`, marginBottom: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                              <div>
                                <span style={{ fontSize: 18, marginRight: 8 }}>{typeEmojis[session.type]}</span>
                                <span style={{ fontWeight: 800, color: done ? "#999" : color, fontSize: 15, textDecoration: done ? "line-through" : "none" }}>{si + 1}일차: {session.title}</span>
                                {session.totalMin > 0 && <div style={{ fontSize: 12, color: "#aaa", marginLeft: 26 }}>~{session.totalMin}분</div>}
                              </div>
                              <button onClick={() => toggleComplete(wi, si)} style={{ width: 36, height: 36, borderRadius: "50%", border: done ? "2px solid #66bb6a" : "2px dashed #ccc", background: done ? "#66bb6a" : "#fff", color: done ? "#fff" : "#ccc", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{done ? "✓" : ""}</button>
                            </div>
                            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8, paddingLeft: 2 }}>
                              {session.warmup && <div><span style={{ color: "#f9a825", fontWeight: 700 }}>워밍업:</span> {session.warmup}</div>}
                              <div><span style={{ color, fontWeight: 700 }}>운동:</span> {session.main}</div>
                              {session.cooldown && <div><span style={{ color: "#42a5f5", fontWeight: 700 }}>쿨다운:</span> {session.cooldown}</div>}
                              <div style={{ marginTop: 6, padding: "6px 10px", background: `${color}10`, borderRadius: 8, fontSize: 12, color, fontWeight: 700 }}>강도: {session.effort}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "24px", marginTop: 20, border: "2px solid #c8e6c9" }}>
              <h3 style={{ fontFamily: "'Jua', cursive", color: "#2e7d32", margin: "0 0 14px", fontSize: 18 }}>🏆 러닝 팁</h3>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
                {[
                  { emoji: "🐢", tip: "천천히! 대화할 수 있는 속도면 됩니다. 빠르면 오래 못 뛰어요." },
                  { emoji: "👟", tip: "러닝화는 투자하세요. 부상 예방 1순위! 러닝 전문점에서 발 분석 추천." },
                  { emoji: "💧", tip: "달리기 전, 중, 후 수분 섭취. 특히 봄 황사 시즌에는 더!" },
                  { emoji: "🦵", tip: "쉬는 날이 진짜 성장하는 날. 절대 건너뛰지 마세요!" },
                  { emoji: "📱", tip: "러닝 앱 활용 (나이키 런 클럽, 스트라바). 기록이 동기부여!" },
                  { emoji: "😷", tip: "미세먼지 나쁨이면 실내 러닝머신으로! 건강이 우선이에요." },
                  { emoji: "🎵", tip: "러닝 플레이리스트나 팟캐스트 준비. 달리는 시간이 즐거워져요." },
                  { emoji: "🌧️", tip: "비 오는 날? 조정하되 건너뛰지 마세요. 빗속 달리기도 꽤 재밌어요!" },
                ].map((t, i) => (<div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}><span style={{ fontSize: 18, flexShrink: 0 }}>{t.emoji}</span><span style={{ fontWeight: 600 }}>{t.tip}</span></div>))}
              </div>
            </div>
            <button
              onClick={() => downloadPDF(resultRef.current, 'couch-to-5k-plan.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
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
              📥 PDF 다운로드
            </button>
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#a5d6a7", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🏃🌸🏅</div>
          소파에서 5K까지 — 모든 러너는 어딘가에서 시작해요!
        </div>
      </div>
    </div>
  );
}

function Section({ num, title, color, children }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "22px 24px", marginBottom: 20, border: "2px solid rgba(46,125,50,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${color}, #66bb6a)`, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{num}</div>
        <h3 style={{ margin: 0, color, fontWeight: 800, fontSize: 16 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Btn({ active, onClick, children, color, wide }) {
  return (<button onClick={onClick} style={{ padding: wide ? "14px 18px" : "14px 10px", borderRadius: 14, border: active ? `2px solid ${color}` : "2px solid #e0e0e0", background: active ? `${color}10` : "rgba(255,255,255,0.85)", color: active ? color : "#777", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: wide ? "left" : "center", display: wide ? "flex" : "block", alignItems: "center" }}>{children}</button>);
}

function MS({ emoji, value, label }) {
  return (<div style={{ textAlign: "center", minWidth: 70 }}><div style={{ fontSize: 18 }}>{emoji}</div><div style={{ fontFamily: "'Jua', cursive", fontSize: 18, color: "#2e7d32" }}>{value}</div><div style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>{label}</div></div>);
}
