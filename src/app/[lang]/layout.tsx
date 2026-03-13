import { Fredoka, Nunito, Noto_Sans_KR } from "next/font/google";
import type { Locale } from "@/lib/i18n";
import { locales, getDictionary } from "@/lib/i18n";
import { SITE_URL } from "@/lib/constants";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-kr",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = getDictionary(params.lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${dict.siteTitle} — ${dict.siteDescription}`,
      template: `%s | ${dict.siteTitle}`,
    },
    description: dict.siteDescription,
    alternates: {
      canonical: `${SITE_URL}/${params.lang}`,
      languages: {
        en: `${SITE_URL}/en`,
        ko: `${SITE_URL}/ko`,
      },
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const lang = params.lang;
  const isKo = lang === "ko";
  const dict = getDictionary(lang);

  // For Korean: use Noto Sans KR (body) + we'll load Jua via <link> since next/font/google
  // doesn't always have Jua. For English: Fredoka (headings) + Nunito (body).
  const fontClasses = `${fredoka.variable} ${nunito.variable} ${notoSansKR.variable}`;
  const bodyFont = isKo ? "font-[family-name:var(--font-noto-kr)]" : "font-[family-name:var(--font-nunito)]";

  return (
    <html lang={lang}>
      <head>
        {/* Load Jua font for Korean headings */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jua&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${fontClasses} ${bodyFont} antialiased bg-white text-gray-900`}>
        <Header lang={lang} dict={dict} />
        <main className="min-h-screen">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
