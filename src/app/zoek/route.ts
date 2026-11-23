import { suggest } from "@/lib/pdok";
import { SITE_URL } from "@/lib/site";

// Search box in the menu (works without JavaScript): go to the first matching address.
export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 80);
  const base = process.env.NODE_ENV === "production" ? SITE_URL : new URL(req.url).origin;
  if (q.length >= 3) {
    try { const s = (await suggest(q))[0]; if (s) return Response.redirect(`${base}/adres/${s.slug}/`, 303); } catch {}
  }
  return Response.redirect(`${base}/${q ? `?q=${encodeURIComponent(q)}` : ""}`, 303);
}
