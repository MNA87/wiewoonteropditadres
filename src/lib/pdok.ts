// Public address data, no personal data: PDOK Locatieserver (finding the address)
// and the BAG (Basisregistratie Adressen en Gebouwen) for the building. Free open government data.
const LS = "https://api.pdok.nl/bzk/locatieserver/search/v3_1";
const WFS = "https://service.pdok.nl/lv/bag/wfs/v2_0?service=WFS&version=2.0.0&request=GetFeature&outputFormat=application/json&srsName=EPSG:28992";

async function get(url: string, revalidate = 86400) {
  const r = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { accept: "application/json" }, next: { revalidate } });
  if (!r.ok) throw new Error(`PDOK ${r.status}`);
  return r.json();
}

export type Suggestie = { slug: string; naam: string };

// Address in the URL: /adres/1336mk-81/ (postcode + house number, letter and addition).
export const slugFor = (pc: string, nr: string | number, letter?: string | null, toev?: string | null) =>
  `${pc.replace(/\s/g, "").toLowerCase()}-${nr}${letter ? letter.toLowerCase() : ""}${toev ? `-${toev.toLowerCase()}` : ""}`;
export const SLUG = /^(\d{4}[a-z]{2})-(\d{1,5})([a-z]?)(?:-([a-z0-9]{1,4}))?$/;

type Doc = Record<string, string | number | undefined>;
const toSlug = (d: Doc) => slugFor(String(d.postcode ?? ""), String(d.huisnummer ?? ""), d.huisletter as string, d.huisnummertoevoeging as string);

export async function suggest(q: string): Promise<Suggestie[]> {
  const j = await get(`${LS}/suggest?q=${encodeURIComponent(q)}&fq=type:adres&rows=7&fl=weergavenaam,postcode,huisnummer,huisletter,huisnummertoevoeging`, 3600);
  return (j.response?.docs ?? []).filter((d: Doc) => d.postcode).map((d: Doc) => ({ slug: toSlug(d), naam: String(d.weergavenaam) }));
}

export type Adres = {
  slug: string; naam: string; straat: string; huisnummer: string; postcode: string; plaats: string; gemeente: string; gemeentecode: string;
  provincie: string; buurt: string; buurtcode: string; wijk: string; lat: number; lon: number; rdX: number; rdY: number;
  bouwjaar: number | null; oppervlakte: number | null; gebruiksdoel: string | null; status: string | null; adressenInPand: number | null;
  pand: [number, number][]; // outline of the building (RD coordinates)
};

const point = (s: unknown) => String(s ?? "").replace(/POINT\(|\)/g, "").split(" ").map(Number);
const eq = (k: string, v: string) => encodeURIComponent(`<Filter><PropertyIsEqualTo><PropertyName>${k}</PropertyName><Literal>${v}</Literal></PropertyIsEqualTo></Filter>`);

export async function adres(slug: string): Promise<Adres | null> {
  const m = slug.match(SLUG);
  if (!m) return null;
  const [, pc, nr, letter, toev] = m;
  const j = await get(`${LS}/free?q=*&fq=type:adres&fq=postcode:${pc.toUpperCase()}&fq=huisnummer:${nr}&rows=50&fl=*`);
  const docs: Doc[] = j.response?.docs ?? [];
  const d = docs.find((x) => toSlug(x) === slug) ?? (!letter && !toev ? docs[0] : undefined);
  if (!d) return null;
  const [lon, lat] = point(d.centroide_ll);
  const [rdX, rdY] = point(d.centroide_rd);
  const a: Adres = {
    slug: toSlug(d), naam: String(d.weergavenaam), straat: String(d.straatnaam ?? ""), postcode: String(d.postcode ?? ""),
    huisnummer: `${d.huisnummer ?? ""}${d.huisletter ?? ""}${d.huisnummertoevoeging ? `-${d.huisnummertoevoeging}` : ""}`,
    plaats: String(d.woonplaatsnaam ?? ""), gemeente: String(d.gemeentenaam ?? ""), gemeentecode: String(d.gemeentecode ?? ""), provincie: String(d.provincienaam ?? ""),
    buurt: String(d.buurtnaam ?? ""), buurtcode: String(d.buurtcode ?? ""), wijk: String(d.wijknaam ?? ""), lat, lon, rdX, rdY,
    bouwjaar: null, oppervlakte: null, gebruiksdoel: null, status: null, adressenInPand: null, pand: [],
  };
  try {
    const vbo = (await get(`${WFS}&typeName=bag:verblijfsobject&filter=${eq("identificatie", String(d.adresseerbaarobject_id))}`)).features?.[0]?.properties;
    if (vbo) {
      a.bouwjaar = vbo.bouwjaar ?? null;
      a.oppervlakte = vbo.oppervlakte ?? null;
      a.gebruiksdoel = vbo.gebruiksdoel ?? null;
      a.status = vbo.status ?? null;
      const [pand, inPand] = await Promise.all([
        get(`${WFS}&typeName=bag:pand&filter=${eq("identificatie", vbo.pandidentificatie)}`),
        get(`${WFS}&typeName=bag:verblijfsobject&count=1000&filter=${eq("pandidentificatie", vbo.pandidentificatie)}`).catch(() => null),
      ]);
      a.pand = pand.features?.[0]?.geometry?.coordinates?.[0] ?? [];
      a.adressenInPand = inPand?.features?.length ?? null;
    }
  } catch {
    // building details are a bonus
  }
  return a;
}

// Aerial photo around the address (PDOK luchtfoto, RD bounding box), with the building outline in pixels.
// laag: "nu" (newest aerial photo), "vroeger" (2016) or "kaart" (TOP10NL map).
export const LAGEN = { nu: "Actueel_orthoHR", vroeger: "2016_ortho25", kaart: "top10nl" } as const;
export type Laag = keyof typeof LAGEN;
export function luchtfoto(a: Adres, w = 720, h = 480, meters = 120, laag: Laag = "nu") {
  const mh = (meters * h) / w;
  const bb = [a.rdX - meters / 2, a.rdY - mh / 2, a.rdX + meters / 2, a.rdY + mh / 2];
  const base = laag === "kaart" ? "https://service.pdok.nl/brt/top10nl/wms/v1_0" : "https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0";
  const url = `${base}?service=WMS&version=1.3.0&request=GetMap&layers=${LAGEN[laag]}&styles=&crs=EPSG:28992&bbox=${bb.join(",")}&width=${w}&height=${h}&format=${laag === "kaart" ? "image/png" : "image/jpeg"}`;
  const pts = a.pand.map(([x, y]) => `${(((x - bb[0]) / meters) * w).toFixed(1)},${(((bb[3] - y) / mh) * h).toFixed(1)}`).join(" ");
  return { url, pts, w, h };
}
