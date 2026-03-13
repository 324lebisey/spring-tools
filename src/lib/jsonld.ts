import type { Tool } from "./tools";
import type { Locale } from "./i18n";
import { SITE_URL } from "./constants";

export function buildWebSiteJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: lang === "ko" ? "스프링 툴즈" : "Spring Tools",
    url: `${SITE_URL}/${lang}`,
    inLanguage: lang === "ko" ? "ko-KR" : "en-US",
    description:
      lang === "ko"
        ? "당신의 봄을 새롭게 할 10가지 생산성 도구"
        : "10 free & premium spring productivity tools to refresh your life",
  };
}

export function buildToolJsonLd(tool: Tool, lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool[lang].name,
    description: tool[lang].description,
    url: `${SITE_URL}/${lang}/tools/${tool.slug}`,
    inLanguage: lang === "ko" ? "ko-KR" : "en-US",
    applicationCategory: "LifestyleApplication",
    offers: {
      "@type": "Offer",
      price: tool.isFree ? "0" : "9.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    operatingSystem: "All",
  };
}
