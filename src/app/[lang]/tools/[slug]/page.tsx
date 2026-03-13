import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { tools, getToolBySlug } from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";
import { buildToolJsonLd } from "@/lib/jsonld";
import ToolPageClient from "./ToolPageClient";

interface Props {
  params: { lang: Locale; slug: string };
}

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    tools.map((tool) => ({ lang, slug: tool.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const title = tool[lang].name;
  const description = tool[lang].description;
  const canonical = `${SITE_URL}/${lang}/tools/${slug}`;
  const ogImage = `${SITE_URL}/api/og?slug=${slug}&lang=${lang}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}/en/tools/${slug}`,
        ko: `${SITE_URL}/ko/tools/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | Spring Tools`,
      description,
      url: canonical,
      siteName: "Spring Tools",
      locale: lang === "ko" ? "ko_KR" : "en_US",
      alternateLocale: lang === "ko" ? "en_US" : "ko_KR",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Spring Tools`,
      description,
      images: [ogImage],
    },
  };
}

export default function ToolPage({ params }: Props) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const jsonLd = buildToolJsonLd(tool, params.lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolPageClient />
    </>
  );
}
