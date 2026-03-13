import Link from "next/link";
import type { Locale, Dictionary } from "@/lib/i18n";

interface FooterProps {
  lang: Locale;
  dict: Dictionary;
}

export default function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="bg-spring-green-700 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-lg font-bold">{dict.siteTitle}</span>
          </div>
          <p className="text-spring-green-200 text-sm">{dict.footer.tagline}</p>
          <div className="flex gap-4 text-sm text-spring-green-200">
            <Link href={`/${lang}`} className="hover:text-white transition-colors">
              {dict.nav.home}
            </Link>
            <Link href={`/${lang}#tools`} className="hover:text-white transition-colors">
              {dict.nav.tools}
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-spring-green-600 text-center text-sm text-spring-green-300">
          &copy; {new Date().getFullYear()} {dict.siteTitle}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
