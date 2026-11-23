import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { GIDSEN } from "@/lib/nav";

// Only the real pages; address pages are noindex and not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }, ...GIDSEN.map((g) => ({ url: `${SITE_URL}${g.href}`, changeFrequency: "monthly" as const, priority: 0.8 })), { url: `${SITE_URL}/bronnen/`, priority: 0.4 }, { url: `${SITE_URL}/privacy/`, priority: 0.2 }];
}
