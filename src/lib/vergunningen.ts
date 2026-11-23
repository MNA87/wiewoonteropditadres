// Permits near an address: official municipal announcements (Officiële Bekendmakingen, SRU)
// with a location point. Only what the municipality published; never names of applicants.
const SRU = "https://repository.overheid.nl/sru";

export type Bericht = { datum: string; status: string; url: string };
export type Vergunning = { m: number; adres: string; wat: string; status: string; datum: string; berichten: Bericht[] };

const dist = (la1: number, lo1: number, la2: number, lo2: number) => {
  const r = (x: number) => (x * Math.PI) / 180;
  const a = Math.sin(r(la2 - la1) / 2) ** 2 + Math.cos(r(la1)) * Math.cos(r(la2)) * Math.sin(r(lo2 - lo1) / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(a));
};
const STATUS: [RegExp, string][] = [
  [/verlenging beslistermijn|beslistermijn verlengd/i, "beslistermijn verlengd"], [/buiten behandeling/i, "buiten behandeling"],
  [/vergunningsvrij/i, "vergunningsvrij"], [/intrek|ingetrokken/i, "ingetrokken"], [/geweigerd|weigering/i, "geweigerd"],
  [/verleend|verlenen|verlening|besluit/i, "verleend"], [/aanvraag|aangevraagd|ontvangen/i, "aangevraagd"],
];
const statusOf = (t: string) => STATUS.find(([re]) => re.test(t))?.[1] ?? "bekendmaking";
const tag = (x: string, k: string) => x.match(new RegExp(`<${k}[^>]*>([\\s\\S]*?)</${k}>`))?.[1]?.trim() ?? "";
const clean = (s: string) => s.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

// Titles differ per municipality ("Gemeente Almere - aanvraag omgevingsvergunning - het plaatsen van een dakkapel - Obelixstraat 30",
// "Nieuwe aanvraag omgevingsvergunning, het betreft ..., Maliesingel 74 te Utrecht, HZ_WABO-17-06150",
// "Aanvraag omgevingsvergunning: Folkingestraat 36, 9711 JX Groningen – legaliseren ..."). Split into parts, then
// pick the part that looks like an address and the part that describes the work.
const ADRES = /^(?:(?:aan|op|bij)(?: de| het)? )?([A-Z][\wà-ÿ'./-]*(?:[ -][\wà-ÿ'./-]+){0,4}) (\d{1,5}(?:[ -]?[a-zA-Z]{1,3}\b)?(?:-\d{1,5}[a-zA-Z]?)?(?: t\/m \d+)?)/;
const SKIP = /^gemeente\s|^provincie\s|^(?:\[?\s*(?:nieuwe|ontvangen|verleende|afgehandelde|definitief|besluit|verlenging|intrekking|ingetrokken|kennisgeving|rectificatie|tijdelijke|aanvraag|reguliere|uitgebreide)\b[^,]*)?omgevingsvergunning\b(?:\s*\([^)]*\))?\s*$|^\d{4}\s?[A-Z]{2}\b|HZ_|[A-Z]{1,3}-?Z?\d{4}-\d|^\(?\d{2}-\d{2}-\d{4}|^(?:te|in) [A-Z]/i;
function parse(title: string) {
  const parts = title.replace(/^\[|\]$/g, "").split(/\s+[-–]\s+|,\s+|:\s+/).map((p) => p.replace(/[,.;]+$/, "").trim()).filter(Boolean);
  let adres = "";
  for (const p of parts) { const m = p.match(ADRES); if (m && p.length < 70 && !/vergunning|aanvraag|besluit/i.test(m[1])) { adres = `${m[1]} ${m[2]}`; break; } }
  if (!adres) { const m = title.match(/(?:aan|op)(?: de| het)? ([A-Z][\wà-ÿ'./-]*(?:[ -][\wà-ÿ'./-]+){0,4}) (\d{1,5}[a-zA-Z]?)/); if (m) adres = `${m[1]} ${m[2]}`; }
  let wat = parts.find((p) => p.length >= 12 && !SKIP.test(p) && !ADRES.test(p) && !STATUS.some(([re]) => re.test(p) && p.length < 45)) ?? "";
  wat = wat.replace(/^(?:aanvraag |verlenen |verleende |ontvangen aanvraag )?(?:tijdelijke )?omgevingsvergunning (?:voor )?/i, "").replace(/^(?:het|dit) betreft (?:een )?(?:aanvraag om )?(?:een )?(?:omgevingsvergunning )?(?:voor |ten behoeve van )?/i, "")
    .replace(/^de wijziging betreft /i, "").replace(/\s(?:aan|op|bij) (?:de|het) [A-Z][^,]*\d.*$/, "").replace(/\s+/g, " ").trim();
  if (wat.length > 110) wat = `${wat.slice(0, 107).replace(/\s\S*$/, "")}…`;
  return { adres: adres.replace(/\s+te$/, "").trim(), wat: wat.charAt(0).toUpperCase() + wat.slice(1) };
}

export async function vergunningen(gemeente: string, lat: number, lon: number, radius = 1000, maanden = 6): Promise<Vergunning[]> {
  const since = new Date(Date.now() - maanden * 30.5 * 86400000).toISOString().slice(0, 10);
  const q = `c.product-area==officielepublicaties and dt.creator=="${gemeente.replace(/"/g, "")}" and dt.available>=${since} and dt.title any "vergunning omgevingsvergunning"`;
  const hits: { m: number; titel: string; datum: string; url: string }[] = [];
  for (let start = 1; start < 1500; start += 100) {
    const r = await fetch(`${SRU}?${new URLSearchParams({ query: q, maximumRecords: "100", startRecord: String(start), recordSchema: "gzd" })}`,
      { signal: AbortSignal.timeout(20000), next: { revalidate: 6 * 3600 } });
    if (!r.ok) break;
    const x = await r.text();
    const recs = x.match(/<sru:record>[\s\S]*?<\/sru:record>/g) ?? [];
    for (const rec of recs) {
      const p = rec.match(/<overheidwetgeving:locatiepunt>\s*([\d.]+)\s+([\d.]+)/);
      if (!p) continue;
      const m = dist(lat, lon, Number(p[1]), Number(p[2]));
      if (m <= radius) hits.push({ m: Math.round(m), titel: clean(tag(rec, "dcterms:title")), datum: tag(rec, "dcterms:available").slice(0, 10), url: clean(tag(rec, "gzd:preferredUrl")) });
    }
    const total = Number(x.match(/<sru:numberOfRecords>(\d+)/)?.[1] ?? 0);
    if (!recs.length || start + 100 > total) break;
  }
  // One row per address + project: the newest message sets the status.
  const by = new Map<string, Vergunning>();
  for (const h of hits.sort((a, b) => a.datum.localeCompare(b.datum))) {
    const { adres, wat } = parse(h.titel);
    const key = `${adres}|${h.m}`;
    const b: Bericht = { datum: h.datum, status: statusOf(h.titel), url: h.url };
    const v = by.get(key);
    if (v) { v.berichten.push(b); v.status = b.status; v.datum = b.datum; if (wat && wat.length > v.wat.length) v.wat = wat; }
    else by.set(key, { m: h.m, adres: adres || "Adres onbekend", wat, status: b.status, datum: b.datum, berichten: [b] });
  }
  return [...by.values()].sort((a, b) => a.m - b.m);
}
