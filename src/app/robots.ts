import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Google Ads checks landing pages with AdsBot: always allowed, also while the site is closed for search engines.
  const ads = [{ userAgent: "AdsBot-Google", allow: "/" }, { userAgent: "AdsBot-Google-Mobile", allow: "/" }];
  if (process.env.NOINDEX === "1") return { rules: [...ads, { userAgent: "*", disallow: "/" }] };
  return { rules: [...ads, { userAgent: "*", allow: "/", disallow: ["/api/"] }], sitemap: `${SITE_URL}/sitemap.xml` };
}
