"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale, Dictionary } from "@/lib/i18n";

interface HeaderProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Header({ lang, dict }: HeaderProps) {
  const pathname = usePathname();
  const otherLang = lang === "en" ? "ko" : "en";
  const switchPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const headingFont =
    lang === "ko"
      ? { fontFamily: "'Jua', sans-serif" }
      : { fontFamily: "var(--font-fredoka), sans-serif" };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2 group">
          <span className="text-2xl">🌸</span>
          <span
            className="text-xl font-bold text-spring-green-600 group-hover:text-spring-green-500 transition-colors"
            style={headingFont}
          >
            {dict.siteTitle}
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            href={`/${lang}`}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-spring-green-600 transition-colors rounded-lg hover:bg-spring-green-50"
          >
            {dict.nav.home}
          </Link>
          <Link
            href={`/${lang}#tools`}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-spring-green-600 transition-colors rounded-lg hover:bg-spring-green-50"
          >
            {dict.nav.tools}
          </Link>
          <Link
            href={switchPath}
            className="ml-2 px-3 py-1.5 text-sm font-medium border border-spring-green-300 text-spring-green-600 rounded-full hover:bg-spring-green-50 transition-colors"
          >
            {dict.nav.langSwitch}
          </Link>
        </nav>
      </div>
    </header>
  );
}
