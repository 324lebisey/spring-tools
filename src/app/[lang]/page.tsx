import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";
import { buildWebSiteJsonLd } from "@/lib/jsonld";
import ToolCard from "@/components/ToolCard";
import Link from "next/link";

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const dict = getDictionary(params.lang);
  const title = `${dict.siteTitle} — ${dict.siteDescription}`;
  const description = dict.siteDescription;
  const canonical = `${SITE_URL}/${params.lang}`;
  const ogImage = `${SITE_URL}/api/og?lang=${params.lang}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en`,
        ko: `${SITE_URL}/ko`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Spring Tools",
      locale: params.lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: params.lang === "ko" ? "en_US" : "ko_KR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: dict.siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function LandingPage({ params }: { params: { lang: Locale } }) {
  const lang = params.lang;
  const dict = getDictionary(lang);
  const isKo = lang === "ko";

  const headingFont = isKo
    ? { fontFamily: "'Jua', sans-serif" }
    : { fontFamily: "var(--font-fredoka), sans-serif" };

  const jsonLd = buildWebSiteJsonLd(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative spring-gradient-hero overflow-hidden">
        {/* Decorative floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <span className="absolute top-20 left-[10%] text-4xl animate-float opacity-60">🌸</span>
          <span className="absolute top-32 right-[15%] text-3xl animate-float-slow opacity-50">🌿</span>
          <span className="absolute bottom-24 left-[20%] text-3xl animate-float-slow opacity-40">🦋</span>
          <span className="absolute top-16 right-[30%] text-2xl animate-float opacity-50">🌷</span>
          <span className="absolute bottom-16 right-[10%] text-4xl animate-float-slow opacity-40">🌻</span>
          <span className="absolute top-40 left-[40%] text-2xl animate-float opacity-30">🐝</span>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-spring-green-600 mb-6 border border-spring-green-200">
            <span>🌱</span>
            {isKo ? "10가지 봄 생산성 도구" : "10 Spring Productivity Tools"}
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            style={headingFont}
          >
            {dict.hero.title}
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </p>

          <Link
            href={`/${lang}#tools`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-spring-green-600 text-white font-bold rounded-full text-lg hover:bg-spring-green-500 transition-colors shadow-lg shadow-spring-green-600/25"
            style={headingFont}
          >
            {dict.hero.cta}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="spring-gradient py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
              style={headingFont}
            >
              {dict.toolsSection.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              {dict.toolsSection.subtitle}
            </p>
          </div>

          {/* Free tools */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-spring-green-50 px-3 py-1.5 rounded-full text-sm font-semibold text-spring-green-600 mb-6">
              <span>✨</span>
              {isKo ? "무료 도구" : "Free Tools"}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
            {tools
              .filter((t) => t.isFree)
              .map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  lang={lang}
                  freeLabel={dict.toolsSection.free}
                  premiumLabel={dict.toolsSection.premium}
                  ctaFree={dict.toolsSection.tryFree}
                  ctaPaid={dict.toolsSection.unlock}
                />
              ))}
          </div>

          {/* Premium tools */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-spring-pink-50 px-3 py-1.5 rounded-full text-sm font-semibold text-spring-pink-500 mb-6">
              <span>💎</span>
              {isKo ? "프리미엄 도구" : "Premium Tools"}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools
              .filter((t) => !t.isFree)
              .map((tool) => (
                <ToolCard
                  key={tool.slug}
                  tool={tool}
                  lang={lang}
                  freeLabel={dict.toolsSection.free}
                  premiumLabel={dict.toolsSection.premium}
                  ctaFree={dict.toolsSection.tryFree}
                  ctaPaid={dict.toolsSection.unlock}
                />
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-spring-green-600 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={headingFont}
          >
            {dict.cta.title}
          </h2>
          <p className="text-spring-green-100 text-lg mb-8">
            {dict.cta.subtitle}
          </p>
          <Link
            href={`/${lang}#tools`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-spring-green-600 font-bold rounded-full text-lg hover:bg-spring-green-50 transition-colors shadow-lg"
            style={headingFont}
          >
            {dict.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
