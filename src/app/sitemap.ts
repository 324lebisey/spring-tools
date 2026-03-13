import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { tools } from "@/lib/tools";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Landing pages
  for (const lang of locales) {
    entries.push({
      url: `${SITE_URL}/${lang}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}`])
        ),
      },
    });
  }

  // Tool pages
  for (const lang of locales) {
    for (const tool of tools) {
      entries.push({
        url: `${SITE_URL}/${lang}/tools/${tool.slug}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}/tools/${tool.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
