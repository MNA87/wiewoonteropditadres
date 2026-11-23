import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only the real pages; address pages are noindex and not listed.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 }, { url: `${SITE_URL}/privacy/`, priority: 0.2 }];
}
