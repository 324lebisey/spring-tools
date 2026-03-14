'use client';

import { useState, useRef, useEffect } from "react";

const HOME_TYPES = [
  { id: "oneroom", label: "원룸 / 오피스텔", emoji: "🏠", rooms: ["bedroom_living", "bathroom", "kitchen"] },
  { id: "apartment_sm", label: "아파트 (20-30평)", emoji: "🏢", rooms: ["master_bed", "bedroom2", "bathroom", "bathroom2", "kitchen", "living"] },
  { id: "apartment_lg", label: "아파트 (30평+)", emoji: "🏢", rooms: ["master_bed", "bedroom2", "bedroom3", "bathroom", "bathroom2", "kitchen", "living", "veranda"] },
  { id: "house", label: "단독주택 / 빌라", emoji: "🏡", rooms: ["master_bed", "bedroom2", "bedroom3", "bathroom", "bathroom2", "kitchen", "living", "veranda", "garage", "entrance"] },
];

const EXTRAS = [
  { id: "pets", label: "반려동물", emoji: "🐾" },
  { id: "kids", label: "아이 있음", emoji: "🧸" },
  { id: "ondol", label: "온돌/바닥난방", emoji: "🔥" },
  { id: "veranda_garden", label: "베란다 텃밭", emoji: "🌱" },
];

const DEPTH = [
  { id: "quick", label: "가볍게", emoji: "⚡", desc: "1-2시간, 기본 정리", timeMult: 0.5 },
  { id: "standard", label: "꼼꼼하게", emoji: "🧹", desc: "반나절, 제대로 청소", timeMult: 1 },
  { id: "deep", label: "대청소", emoji: "✨", desc: "구석구석 완벽하게", timeMult: 1.6 },
];

const ROOM_DATA = {
  bedroom_living: { name: "방 / 거실 (원룸)", emoji: "🛏️", tasks: {
    quick: ["침구 세탁 (이불, 베개 커버)", "먼지 닦기 — 책상, 선반, TV", "청소기 돌리기", "창문 열어 환기 30분"],
    standard: ["침구 전체 세탁 (이불솜 포함)", "매트리스 뒤집기 또는 회전", "모든 표면 물걸레질", "창문, 거울 닦기", "옷장 정리 — 6개월 안 입은 옷 분리", "가구 밑 청소기", "걸레받이 닦기", "리모컨, 스위치 소독"],
    deep: ["침구 + 매트리스 전체 세탁/청소", "매트리스 청소기로 진드기 제거", "천장 선풍기, 조명, 환기구 먼지 제거", "커튼 세탁 또는 블라인드 닦기", "가구 뒤, 밑 완전 청소", "벽면 얼룩 닦기", "창문 안팎 닦기 + 방충망 세척", "옷장 완전 비우고 정리", "에어컨 필터 세척", "화재경보기 배터리 확인"],
  }},
  master_bed: { name: "안방", emoji: "🛏️", tasks: {
    quick: ["침구 세탁", "표면 먼지 닦기", "청소기 돌리기", "환기"],
    standard: ["침구 전체 세탁", "매트리스 회전", "모든 표면, 선반 닦기", "창문, 거울 닦기", "옷장 정리 — 계절옷 교체", "가구 밑 청소기", "걸레받이 닦기", "화장대 정리"],
    deep: ["침구 + 매트리스 완전 세탁", "매트리스 진드기 청소기", "천장, 조명, 환기구 먼지 제거", "커튼 세탁", "가구 전체 이동 후 청소", "벽면 + 걸레받이 닦기", "옷장 완전 비우고 재정리", "에어컨 필터 세척", "창틀, 레일 청소"],
  }},
  bedroom2: { name: "작은방 1", emoji: "🛌", tasks: {
    quick: ["침구 세탁", "먼지 닦기", "청소기", "환기"],
    standard: ["침구 전체 세탁", "매트리스 회전", "모든 표면 닦기", "창문 닦기", "옷장/수납장 정리", "가구 밑 청소", "걸레받이 닦기"],
    deep: ["침구 + 매트리스 세탁", "천장 조명, 환기구 청소", "커튼 세탁", "가구 이동 후 바닥 청소", "벽면, 걸레받이 닦기", "옷장 완전 정리", "창틀, 방충망 세척"],
  }},
  bedroom3: { name: "작은방 2", emoji: "🛌", tasks: {
    quick: ["침구 세탁", "먼지 닦기", "청소기", "환기"],
    standard: ["침구 전체 세탁", "모든 표면 닦기", "창문 닦기", "수납 정리", "걸레받이 닦기"],
    deep: ["전체 침구 + 매트리스 세탁", "천장, 조명 청소", "가구 이동 후 바닥 청소", "창틀, 방충망 세척", "수납 전체 정리"],
  }},
  bathroom: { name: "화장실 (메인)", emoji: "🚿", tasks: {
    quick: ["변기 안팎 닦기", "세면대, 거울 닦기", "바닥 물걸레질", "환풍기 가동 확인"],
    standard: ["변기 깊은 청소 (안쪽 + 뒤쪽)", "세면대, 수전 물때 제거", "샤워 부스/욕조 타일 청소", "거울 닦기", "수건, 발매트 세탁", "배수구 머리카락 제거 + 세정", "선반/수납장 정리 — 유통기한 지난 제품 버리기", "환풍기 커버 세척", "바닥 구석구석 닦기"],
    deep: ["변기 물탱크 내부까지 청소", "수전, 샤워기 식초 담금 (물때 제거)", "타일 줄눈 솔로 문질러 청소", "샤워 커튼 세탁 또는 교체", "수납장 전체 비우고 닦고 재정리", "환풍기 분해 세척", "벽면, 걸레받이 닦기", "배수구 완전 세척 + 탈취", "실리콘 곰팡이 확인 — 필요시 재시공", "조명 커버 세척"],
  }},
  bathroom2: { name: "화장실 2", emoji: "🚽", tasks: {
    quick: ["변기 닦기", "세면대 닦기", "바닥 닦기"],
    standard: ["변기 안팎 청소", "세면대 + 수전 닦기", "거울 닦기", "수건 세탁", "바닥 물걸레질", "배수구 세척"],
    deep: ["변기 + 물탱크 청소", "수전 물때 제거", "타일 줄눈 청소", "수납 정리", "환풍기 세척", "바닥 구석 청소", "실리콘 상태 확인"],
  }},
  kitchen: { name: "주방", emoji: "🍳", tasks: {
    quick: ["조리대 닦기", "가스레인지/인덕션 표면 닦기", "냉장고 외부 닦기", "설거지 마무리", "바닥 쓸기 + 닦기", "음식물 쓰레기통 비우기"],
    standard: ["조리대 + 타일벽 닦기", "가스레인지 버너/인덕션 깊은 청소", "전자레인지 안팎 닦기", "냉장고 외부 + 윗면 닦기", "냉장고 안 정리 — 유통기한 확인, 버리기", "싱크대 + 수전 청소", "수납장 앞면 + 손잡이 닦기", "바닥 물걸레질", "소형가전 (밥솥, 에어프라이어, 커피머신) 닦기", "분리수거 정리"],
    deep: ["조리대, 타일벽, 가스레인지 주변 벽 닦기", "가스레인지/인덕션 분해 청소 + 기름때 제거", "레인지후드 + 필터 기름때 세척", "전자레인지 깊은 청소", "냉장고 완전 비우고 선반, 서랍 세척", "냉동실 정리 + 필요시 해동", "수납장 전체 비우고 안팎 닦기, 재정리", "식기세척기 세정 (구연산 코스)", "밥솥, 전기포트 스케일 제거", "바닥 + 가전 밑 청소", "팬트리/식료품장 정리 — 유통기한 전수 확인"],
  }},
  living: { name: "거실", emoji: "🛋️", tasks: {
    quick: ["쿠션 정리, 담요 개기", "TV 선반, 테이블 먼지 닦기", "청소기 돌리기", "리모컨, 조명 스위치 닦기"],
    standard: ["소파 쿠션 청소기 + 커버 세탁", "모든 표면, 선반, 장식물 먼지 닦기", "TV 화면 + 전자기기 닦기", "가구 밑 청소기", "창문, 거울 닦기", "리모컨 소독", "담요, 쿠션 커버 세탁", "케이블 정리"],
    deep: ["소파 깊은 청소 (커버 세탁 또는 스팀 청소)", "천장 선풍기, 조명, 환기구 먼지 제거", "창문 안팎 + 방충망 세척", "가구 전체 이동 후 바닥 청소", "걸레받이, 문틀, 창틀 닦기", "벽걸이 그림, 액자 먼지 제거", "에어컨 필터 세척", "카펫 스팀 청소 또는 바닥 왁스"],
  }},
  veranda: { name: "베란다", emoji: "🌿", tasks: {
    quick: ["바닥 쓸기", "빨래 건조대 닦기", "창문 안쪽 닦기"],
    standard: ["바닥 물걸레질", "창문 안팎 닦기", "선반, 수납장 정리", "세탁기/건조기 외부 닦기", "화분 정리 — 죽은 잎 제거", "빨래 건조대 + 세탁 용품 정리"],
    deep: ["바닥 깊은 청소 (물 뿌려 솔질)", "창문 전체 + 방충망 세척", "세탁기 통세척 (과탄산소다 코스)", "건조기 먼지 필터 + 배기구 청소", "모든 수납 비우고 정리", "배수구 청소", "외벽 쪽 곰팡이 확인", "보일러 배관 점검 요청"],
  }},
  garage: { name: "차고 / 창고", emoji: "🚗", tasks: {
    quick: ["바닥 쓸기", "눈에 보이는 쓰레기 정리", "통로 확보"],
    standard: ["바닥 쓸고 물청소", "물건 분류: 보관 / 버리기 / 기부", "공구 정리", "선반 닦기", "시즌 용품 정리 (겨울 용품 보관)"],
    deep: ["전체 비우고 바닥 깊은 청소", "모든 물건 분류 + 재정리", "공구 점검 + 정리", "선반/수납장 닦기", "2년 이상 안 쓴 물건 처분", "환기 확인"],
  }},
  entrance: { name: "현관", emoji: "🚪", tasks: {
    quick: ["신발장 정리", "현관 바닥 쓸기", "우산꽂이 정리"],
    standard: ["신발장 전체 정리 — 안 신는 신발 분리", "현관 바닥 물걸레질", "현관문 안팎 닦기", "신발장 안 닦기 + 탈취", "우산, 장갑 등 시즌 용품 정리"],
    deep: ["신발장 완전 비우고 세척 + 정리", "현관 타일 깊은 청소", "현관문 + 도어록 닦기", "인터폰 화면 닦기", "조명 교체 확인", "우편함 정리"],
  }},
};

const EXTRA_TASKS = {
  pets: { label: "🐾 반려동물 관련", tasks: {
    quick: ["가구, 바닥 털 청소기 돌리기", "밥그릇, 물그릇 세척"],
    standard: ["집 전체 반려동물 털 청소", "밥그릇, 물그릇 소독", "반려동물 침구 세탁", "화장실/배변패드 영역 청소", "걸레받이 코 자국 닦기 (강아지 집사라면 공감!)"],
    deep: ["집 전체 대청소 — 털 완전 제거", "반려동물 침구, 장난감 전체 세탁", "카펫/소파 스팀 청소 (냄새 제거)", "장난감 소독", "케이지/캐리어 세척", "반려동물 용품 재고 확인"],
  }},
  kids: { label: "🧸 아이 관련", tasks: {
    quick: ["장난감 빠르게 정리", "유아 의자/식탁 닦기", "자주 만지는 장난감 소독"],
    standard: ["장난감 분류 — 안 쓰는 것 기부/폐기", "자주 만지는 장난감 전체 소독", "아이 가구, 놀이매트 닦기", "아이 옷장 정리 — 작아진 옷 분리", "학용품/미술용품 정리"],
    deep: ["장난감 전체 점검: 정리, 세척, 기부, 폐기", "인형 세탁 (세탁기 또는 손세탁)", "모든 장난감, 리모컨 소독", "아이 가구, 놀이매트 깊은 청소", "옷장 사이즈별 재정리", "학용품/미술용품 전체 정리", "벽 크레파스/낙서 자국 닦기"],
  }},
  ondol: { label: "🔥 온돌/바닥 관련", tasks: {
    quick: ["바닥 물걸레질 (한 번 쭉)", "매트/러그 털기"],
    standard: ["바닥 전체 물걸레질 (방마다)", "매트, 러그 세탁 또는 세탁소", "바닥 얼룩 집중 청소", "보일러 설정 봄철로 변경"],
    deep: ["바닥 왁스/코팅 (장판 또는 마루)", "모든 매트, 러그 세탁", "가구 밑 바닥 완전 청소", "보일러 점검 — 난방수 교체 여부 확인", "바닥 긁힘, 들뜸 확인 + 보수"],
  }},
  veranda_garden: { label: "🌱 베란다 텃밭 관련", tasks: {
    quick: ["죽은 잎, 마른 가지 정리", "화분 물주기 상태 확인"],
    standard: ["겨울 지난 화분 정리 — 죽은 식물 처분", "흙 교체 또는 퇴비 추가", "화분 배수구 확인", "봄 모종/씨앗 준비", "물주기 일정 재설정"],
    deep: ["모든 화분 비우고 세척", "흙 전체 교체", "화분 받침 청소", "해충 확인 (진딧물 등)", "베란다 바닥 배수구 청소", "새 텃밭 배치 계획", "봄 작물 파종 시작!"],
  }},
};

const TIME_PER_TASK = { quick: 4, standard: 7, deep: 12 };

export default function SpringCleaningKR() {
  const [homeType, setHomeType] = useState("");
  const [extras, setExtras] = useState([]);
  const [depth, setDepth] = useState("");
  const [checklist, setChecklist] = useState(null);
  const [checked, setChecked] = useState({});
  const resultRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("kr-spring-cleaning-checked");
      if (saved) setChecked(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kr-spring-cleaning-checked", JSON.stringify(checked));
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

  const toggleExtra = (id) => setExtras((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);

  const generate = () => {
    const home = HOME_TYPES.find((h) => h.id === homeType);
    if (!home || !depth) return;
    const rooms = home.rooms.map((roomId) => {
      const room = ROOM_DATA[roomId];
      return { id: roomId, name: room.name, emoji: room.emoji, tasks: room.tasks[depth] || room.tasks.standard };
    });
    const extraSections = extras.map((exId) => {
      const ex = EXTRA_TASKS[exId];
      return { id: exId, name: ex.label, tasks: ex.tasks[depth] || ex.tasks.standard };
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
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #e1f5fe 0%, #e8f5e9 30%, #fff9c4 60%, #fce4ec 100%)", fontFamily: "'Noto Sans KR', sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800&family=Jua&display=swap" rel="stylesheet" />
      {["🧹", "🪣", "✨", "🧤", "🫧", "🪟"].map((e, i) => (
        <div key={i} style={{ position: "absolute", top: `${8 + i * 15}%`, [i % 2 ? "right" : "left"]: `${2 + i % 3 * 2}%`, fontSize: 22, opacity: 0.1, pointerEvents: "none" }}>{e}</div>
      ))}
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🧹✨🪟</div>
          <h1 style={{ fontFamily: "'Jua', cursive", fontSize: "clamp(26px, 5vw, 40px)", color: "#1565c0", margin: "0 0 8px", textShadow: "2px 2px 0 rgba(255,255,255,0.7)" }}>봄맞이 대청소 체크리스트</h1>
          <p style={{ color: "#4fc3f7", fontSize: 15, margin: 0, fontWeight: 600 }}>집 유형을 알려주시면 방별 맞춤 청소 계획을 만들어드려요!</p>
        </div>

        <Section num="1" title="어떤 집에 사시나요?" color="#1565c0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
            {HOME_TYPES.map((h) => (
              <Btn key={h.id} active={homeType === h.id} onClick={() => setHomeType(h.id)} color="#1565c0">
                <div style={{ fontSize: 28, marginBottom: 4 }}>{h.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{h.label}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{h.rooms.length}개 공간</div>
              </Btn>
            ))}
          </div>
        </Section>

        <Section num="2" title="해당되는 항목이 있나요?" color="#1565c0">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {EXTRAS.map((e) => (
              <Btn key={e.id} active={extras.includes(e.id)} onClick={() => toggleExtra(e.id)} color="#1565c0">
                <span style={{ fontSize: 22, marginRight: 6 }}>{e.emoji}</span><span style={{ fontWeight: 700 }}>{e.label}</span>
              </Btn>
            ))}
          </div>
        </Section>

        <Section num="3" title="얼마나 깊이 청소할까요?" color="#1565c0">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEPTH.map((d) => (
              <Btn key={d.id} active={depth === d.id} onClick={() => setDepth(d.id)} color="#1565c0" wide>
                <span style={{ fontSize: 22, marginRight: 10 }}>{d.emoji}</span>
                <div><div style={{ fontWeight: 800 }}>{d.label}</div><div style={{ fontSize: 12, opacity: 0.6 }}>{d.desc}</div></div>
              </Btn>
            ))}
          </div>
        </Section>

        {homeType && depth && (
          <button onClick={generate} style={{ width: "100%", padding: "16px", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #1565c0, #42a5f5)", color: "#fff", fontFamily: "'Jua', cursive", fontSize: 20, cursor: "pointer", marginBottom: 24, boxShadow: "0 4px 20px rgba(21,101,192,0.3)" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            🧹 체크리스트 만들기!
          </button>
        )}

        {checklist && (
          <div ref={resultRef}>
            <button
              onClick={() => downloadPDF(resultRef.current, 'spring-cleaning-checklist.pdf')}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(21,101,192,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 PDF 다운로드
            </button>
            <button
              onClick={() => { setHomeType(""); setExtras([]); setDepth(""); setChecklist(null); setChecked({}); }}
              style={{
                width: "100%",
                marginBottom: 16,
                padding: "14px",
                borderRadius: 14,
                border: "2px dashed #ccc",
                background: "rgba(255,255,255,0.7)",
                color: "#888",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = "#1565c0"; e.currentTarget.style.color = "#1565c0"; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = "#ccc"; e.currentTarget.style.color = "#888"; }}
            >
              🔄 처음부터 다시
            </button>
            <div style={{ background: "rgba(255,255,255,0.9)", borderRadius: 16, padding: "18px 22px", marginBottom: 20, border: "2px solid #bbdefb", position: "sticky", top: 16, zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontWeight: 800, color: "#1565c0", fontSize: 15 }}>진행률: {doneTasks}/{totalTasks}개</span>
                <span style={{ fontSize: 13, color: "#90a4ae", fontWeight: 600 }}>예상 ~{totalHours}시간</span>
              </div>
              <div style={{ background: "#e3f2fd", borderRadius: 10, height: 14, overflow: "hidden" }}>
                <div style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%`, height: "100%", background: doneTasks === totalTasks && totalTasks > 0 ? "linear-gradient(90deg, #66bb6a, #43a047)" : "linear-gradient(90deg, #42a5f5, #1565c0)", borderRadius: 10, transition: "width 0.4s ease" }} />
              </div>
              {doneTasks === totalTasks && totalTasks > 0 && (
                <div style={{ textAlign: "center", marginTop: 10, fontSize: 16, fontWeight: 800, color: "#43a047" }}>🎉 청소 완료! 반짝반짝 깨끗한 우리 집!</div>
              )}
            </div>

            {allSections.map((section) => (
              <div key={section.id} style={{ background: "rgba(255,255,255,0.88)", borderRadius: 18, padding: "20px 22px", marginBottom: 14, border: "2px solid rgba(21,101,192,0.08)" }}>
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
                      <div key={i} onClick={() => toggleCheck(section.id, i)}
                        style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 14px", borderRadius: 12, background: done ? "#e8f5e9" : "#fafafa", cursor: "pointer", transition: "all 0.2s", border: done ? "1.5px solid #a5d6a7" : "1.5px solid transparent" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: done ? "2px solid #66bb6a" : "2px solid #ccc", background: done ? "#66bb6a" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#fff", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{done ? "✓" : ""}</div>
                        <span style={{ fontSize: 14, color: done ? "#999" : "#444", textDecoration: done ? "line-through" : "none", lineHeight: 1.5, fontWeight: done ? 400 : 600 }}>{task}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              onClick={() => downloadPDF(resultRef.current, 'spring-cleaning-checklist.pdf')}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "14px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #1565c0, #42a5f5)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "transform 0.15s",
                boxShadow: "0 4px 15px rgba(21,101,192,0.3)",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📥 PDF 다운로드
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 48, padding: "20px 0", color: "#90caf9", fontSize: 13 }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>🫧🧹✨</div>
          봄맞이 대청소 체크리스트 — 새 봄, 새 집!
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
    <button onClick={onClick} style={{
      padding: wide ? "14px 18px" : "14px", borderRadius: 14,
      border: active ? `2px solid ${color}` : "2px solid #e0e0e0",
      background: active ? `${color}10` : "rgba(255,255,255,0.85)",
      color: active ? color : "#777", fontWeight: 700, fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
      textAlign: wide ? "left" : "center", display: wide ? "flex" : "block", alignItems: "center",
    }}>{children}</button>
  );
}
