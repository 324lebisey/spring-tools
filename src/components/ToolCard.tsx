import Link from "next/link";
import type { Tool } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";

interface ToolCardProps {
  tool: Tool;
  lang: Locale;
  freeLabel: string;
  premiumLabel: string;
  ctaFree: string;
  ctaPaid: string;
}

export default function ToolCard({
  tool,
  lang,
  freeLabel,
  premiumLabel,
  ctaFree,
  ctaPaid,
}: ToolCardProps) {
  const info = tool[lang];
  const headingFont =
    lang === "ko"
      ? { fontFamily: "'Jua', sans-serif" }
      : { fontFamily: "var(--font-fredoka), sans-serif" };

  return (
    <Link href={`/${lang}/tools/${tool.slug}`} className="block tool-card">
      <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
        {/* Color bar at top */}
        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${tool.color}, ${tool.colorTo})`,
          }}
        />

        <div className="p-6 flex flex-col flex-1">
          {/* Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl">{tool.emoji}</span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                tool.isFree
                  ? "bg-spring-green-50 text-spring-green-600"
                  : "bg-spring-pink-50 text-spring-pink-500"
              }`}
            >
              {tool.isFree ? freeLabel : premiumLabel}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold text-gray-900 mb-2"
            style={headingFont}
          >
            {info.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed flex-1">
            {info.description}
          </p>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-gray-50">
            <span
              className="inline-flex items-center text-sm font-semibold transition-colors"
              style={{ color: tool.color }}
            >
              {tool.isFree ? ctaFree : ctaPaid}
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
