import { adres, luchtfoto, LAGEN, type Laag } from "@/lib/pdok";

// Aerial photo via our own server: the visitor's address never goes to PDOK, and the image is cached.
export async function GET(req: Request) {
  const u = new URL(req.url);
  const groot = u.searchParams.get("groot") === "1";
  const a = await adres(u.searchParams.get("adres") ?? "").catch(() => null);
  if (!a) return new Response("Niet gevonden", { status: 404 });
  const q = u.searchParams.get("laag") ?? "nu";
  const laag: Laag = q in LAGEN ? (q as Laag) : "nu";
  const f = groot ? luchtfoto(a, 1600, 1066, 240, laag) : luchtfoto(a, 720, 480, 120, laag);
  try {
    const r = await fetch(f.url, { signal: AbortSignal.timeout(15000), next: { revalidate: 30 * 86400 } });
    if (!r.ok) throw new Error(String(r.status));
    return new Response(await r.arrayBuffer(), { headers: { "content-type": laag === "kaart" ? "image/png" : "image/jpeg", "cache-control": "public, max-age=2592000, immutable" } });
  } catch {
    return new Response("Luchtfoto niet bereikbaar", { status: 502 });
  }
}
