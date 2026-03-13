export const locales = ["en", "ko"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export interface Dictionary {
  siteTitle: string;
  siteDescription: string;
  hero: { title: string; subtitle: string; cta: string };
  nav: { home: string; tools: string; pricing: string; langSwitch: string };
  toolsSection: {
    title: string;
    subtitle: string;
    free: string;
    premium: string;
    tryFree: string;
    unlock: string;
  };
  cta: { title: string; subtitle: string; button: string };
  footer: { tagline: string; rights: string };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    siteTitle: "Spring Tools",
    siteDescription: "10 free & premium spring productivity tools to refresh your life",
    hero: {
      title: "Spring Into Productivity",
      subtitle: "10 beautifully crafted tools to help you organize, plan, and thrive this spring season.",
      cta: "Explore Tools",
    },
    nav: {
      home: "Home",
      tools: "Tools",
      pricing: "Pricing",
      langSwitch: "한국어",
    },
    toolsSection: {
      title: "Your Spring Toolkit",
      subtitle: "Everything you need to make this your most productive spring ever.",
      free: "Free",
      premium: "Premium",
      tryFree: "Try Free",
      unlock: "Try Now",
    },
    cta: {
      title: "Ready to Spring Forward?",
      subtitle: "Start with our free tools today. Upgrade anytime for full access.",
      button: "Get Started Free",
    },
    footer: {
      tagline: "Helping you bloom, one tool at a time.",
      rights: "All rights reserved.",
    },
  },
  ko: {
    siteTitle: "스프링 툴즈",
    siteDescription: "당신의 봄을 새롭게 할 10가지 생산성 도구",
    hero: {
      title: "봄과 함께 시작하세요",
      subtitle: "정리, 계획, 건강까지 — 이번 봄을 가장 알차게 보내는 10가지 도구.",
      cta: "도구 살펴보기",
    },
    nav: {
      home: "홈",
      tools: "도구",
      pricing: "요금제",
      langSwitch: "English",
    },
    toolsSection: {
      title: "나만의 봄 툴킷",
      subtitle: "이번 봄, 가장 생산적인 시즌을 위한 모든 것.",
      free: "무료",
      premium: "프리미엄",
      tryFree: "무료 체험",
      unlock: "사용해보기",
    },
    cta: {
      title: "새로운 봄을 시작할 준비 되셨나요?",
      subtitle: "무료 도구부터 시작하세요. 언제든 업그레이드 가능합니다.",
      button: "무료로 시작하기",
    },
    footer: {
      tagline: "한 걸음씩, 당신의 봄을 피워드립니다.",
      rights: "All rights reserved.",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
