export interface Tool {
  slug: string;
  emoji: string;
  color: string;       // gradient from
  colorTo: string;     // gradient to
  isFree: boolean;
  en: {
    name: string;
    description: string;
  };
  ko: {
    name: string;
    description: string;
  };
}

export const tools: Tool[] = [
  {
    slug: "garden-planner",
    emoji: "🌱",
    color: "#43a047",
    colorTo: "#66bb6a",
    isFree: true,
    en: {
      name: "Spring Garden Planner",
      description: "Plan your garden by hardiness zone with personalized planting schedules, spacing guides, and care tips.",
    },
    ko: {
      name: "봄 텃밭 플래너",
      description: "지역별 파종 시기, 간격 가이드, 관리 팁으로 나만의 텃밭을 계획하세요.",
    },
  },
  {
    slug: "lawn-care",
    emoji: "🏡",
    color: "#2e7d32",
    colorTo: "#4caf50",
    isFree: true,
    en: {
      name: "Lawn Care Cost Estimator",
      description: "Calculate lawn care costs based on your yard size, services needed, and local rates.",
    },
    ko: {
      name: "정원 관리 비용 계산기",
      description: "마당 크기, 필요한 서비스, 지역 요금을 기반으로 정원 관리 비용을 계산하세요.",
    },
  },
  {
    slug: "spring-cleaning",
    emoji: "🧹",
    color: "#00897b",
    colorTo: "#26a69a",
    isFree: true,
    en: {
      name: "Spring Cleaning Checklist",
      description: "Room-by-room deep cleaning checklist with progress tracking to get your home sparkling.",
    },
    ko: {
      name: "봄맞이 대청소 체크리스트",
      description: "방별 대청소 체크리스트와 진행률 추적으로 깨끗한 집 만들기.",
    },
  },
  {
    slug: "declutter-plan",
    emoji: "📦",
    color: "#f57c00",
    colorTo: "#ff9800",
    isFree: false,
    en: {
      name: "Declutter Plan Generator",
      description: "Get a personalized decluttering plan with daily tasks tailored to your home and schedule.",
    },
    ko: {
      name: "정리정돈 플래너",
      description: "일정에 맞춘 맞춤형 정리정돈 플랜과 일일 미션을 받아보세요.",
    },
  },
  {
    slug: "allergy-prep",
    emoji: "🤧",
    color: "#ec407a",
    colorTo: "#f48fb1",
    isFree: false,
    en: {
      name: "Allergy Season Prep",
      description: "Prepare for allergy season with personalized action plans, medication reminders, and pollen tracking.",
    },
    ko: {
      name: "봄철 알레르기 대비 플래너",
      description: "맞춤형 대비 플랜, 약 복용 알림, 미세먼지/꽃가루 정보로 알레르기 시즌을 대비하세요.",
    },
  },
  {
    slug: "couch-to-5k",
    emoji: "🏃",
    color: "#1e88e5",
    colorTo: "#42a5f5",
    isFree: false,
    en: {
      name: "Couch to 5K Plan",
      description: "Go from couch to 5K with a structured 8-week running plan designed for beginners.",
    },
    ko: {
      name: "소파에서 5K까지",
      description: "초보자를 위한 8주 러닝 플랜으로 소파에서 5K 완주까지 도전하세요.",
    },
  },
  {
    slug: "outdoor-workout",
    emoji: "💪",
    color: "#7b1fa2",
    colorTo: "#ab47bc",
    isFree: false,
    en: {
      name: "Outdoor Workout Generator",
      description: "Generate custom outdoor workouts based on your fitness level, equipment, and time available.",
    },
    ko: {
      name: "아웃도어 운동 생성기",
      description: "체력 수준, 장비, 시간에 맞는 맞춤형 야외 운동 루틴을 만들어보세요.",
    },
  },
  {
    slug: "capsule-wardrobe",
    emoji: "👗",
    color: "#ad1457",
    colorTo: "#e91e63",
    isFree: false,
    en: {
      name: "Spring Capsule Wardrobe",
      description: "Build a curated spring wardrobe with mix-and-match outfit combinations and shopping lists.",
    },
    ko: {
      name: "봄 캡슐 옷장",
      description: "믹스 앤 매치 코디 조합과 쇼핑 리스트로 봄 캡슐 옷장을 완성하세요.",
    },
  },
  {
    slug: "meal-prep",
    emoji: "🥗",
    color: "#e65100",
    colorTo: "#ff8a65",
    isFree: false,
    en: {
      name: "Spring Meal Prep Planner",
      description: "Plan a week of healthy spring meals with recipes, grocery lists, and prep schedules.",
    },
    ko: {
      name: "봄 식단 플래너",
      description: "레시피, 장보기 리스트, 준비 일정이 포함된 일주일 봄 건강 식단을 계획하세요.",
    },
  },
  {
    slug: "pet-care",
    emoji: "🐾",
    color: "#6d4c41",
    colorTo: "#8d6e63",
    isFree: false,
    en: {
      name: "Spring Pet Care Checklist",
      description: "Keep your furry friends healthy this spring with vet visit reminders, grooming schedules, and safety tips.",
    },
    ko: {
      name: "반려동물 봄 케어",
      description: "병원 방문 알림, 그루밍 일정, 안전 팁으로 반려동물의 건강한 봄을 챙기세요.",
    },
  },
];

export function getToolBySlug(slug: string) {
  return tools.find((t) => t.slug === slug);
}
