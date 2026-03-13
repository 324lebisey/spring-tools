import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getToolBySlug } from "@/lib/tools";
import type { Locale } from "@/lib/i18n";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");
  const lang = (searchParams.get("lang") as Locale) || "en";

  // Tool-specific OG image
  if (slug) {
    const tool = getToolBySlug(slug);
    if (!tool) {
      return new Response("Tool not found", { status: 404 });
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${tool.color}, ${tool.colorTo})`,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 120, marginBottom: 20 }}>{tool.emoji}</div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              textAlign: "center",
              padding: "0 60px",
              lineHeight: 1.2,
            }}
          >
            {tool[lang].name}
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.85)",
              marginTop: 16,
              textAlign: "center",
              padding: "0 80px",
              lineHeight: 1.4,
            }}
          >
            {tool[lang].description}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              fontSize: 22,
              color: "rgba(255,255,255,0.7)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🌱 Spring Tools
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Default site-level OG image
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #43a047, #66bb6a)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 100, marginBottom: 20 }}>🌱</div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: "white",
            textAlign: "center",
          }}
        >
          Spring Tools
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            marginTop: 16,
            textAlign: "center",
            padding: "0 60px",
          }}
        >
          {lang === "ko"
            ? "당신의 봄을 새롭게 할 10가지 생산성 도구"
            : "10 Free Productivity Tools for Spring"}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
