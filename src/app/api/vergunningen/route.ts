import { adres } from "@/lib/pdok";
import { vergunningen } from "@/lib/vergunningen";

// Permits within 1 km of an address (last 6 months), loaded after the page so the page stays fast.
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("adres") ?? "";
  try {
    const a = await adres(slug);
    if (!a) return Response.json({ error: "Adres niet gevonden" }, { status: 404 });
    const list = await vergunningen(a.gemeente, a.lat, a.lon);
    return Response.json({ gemeente: a.gemeente, list }, { headers: { "cache-control": "public, max-age=3600" } });
  } catch (e) {
    console.error("vergunningen:", (e as Error).message);
    return Response.json({ error: "De bekendmakingen zijn even niet bereikbaar." }, { status: 502 });
  }
}
