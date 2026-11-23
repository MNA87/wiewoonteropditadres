import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Zoek from "@/components/Zoek";
import Deel from "@/components/Deel";
import Vergunningen from "@/components/Vergunningen";
import { adres, luchtfoto, SLUG } from "@/lib/pdok";
import { buurt, type Buurt } from "@/lib/cbs";
import { PARTNERS, PREVIEW, bespaarFor } from "@/lib/partners";
import Lucht from "@/components/Lucht";

// Address page. Not in Google (noindex): no thousands of automatic address pages,
// only shared by visitors themselves. Never names of residents.
export const revalidate = 86400;

const nl = (n: number, d = 0) => n.toLocaleString("nl-NL", { maximumFractionDigits: d, minimumFractionDigits: d });
const pct = (a?: number, b?: number) => (a != null && b ? Math.round((a / b) * 100) : null);

export async function generateMetadata({ params }: PageProps<"/adres/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = SLUG.test(slug) ? await adres(slug).catch(() => null) : null;
  if (!a) return { title: "Adres niet gevonden", robots: { index: false } };
  const titel = `${a.straat} ${a.huisnummer}, ${a.plaats}`;
  const d = [a.bouwjaar ? `bouwjaar ${a.bouwjaar}` : "", a.oppervlakte ? `${a.oppervlakte} m²` : ""].filter(Boolean).join(", ");
  return {
    title: `${titel}: de woning en de buurt`,
    description: `Wat openbaar is over ${titel}${d ? ` (${d})` : ""}: de woning, de buurt, de WOZ-waarde en vergunningen in de buurt. Namen van bewoners zijn privé.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `/adres/${a.slug}/` },
    openGraph: { title: `${titel}: alles over de woning en de buurt`, url: `/adres/${a.slug}/` },
  };
}

export default async function AdresPagina({ params }: PageProps<"/adres/[slug]">) {
  const { slug } = await params;
  if (!SLUG.test(slug)) notFound();
  const a = await adres(slug).catch(() => null);
  if (!a) notFound();
  const b: Buurt = await buurt(a.buurtcode);
  const foto = luchtfoto(a);
  const fotoGroot = luchtfoto(a, 1600, 1066, 240);
  const maand = new Date().getMonth() + 1;
  const wozSeizoen = maand >= 2 && maand <= 4;
  const hh = b.HuishoudensTotaal?.v;
  const leeftijden: [string, number | undefined][] = [["0–15", b.k_0Tot15Jaar?.v], ["15–25", b.k_15Tot25Jaar?.v], ["25–45", b.k_25Tot45Jaar?.v], ["45–65", b.k_45Tot65Jaar?.v], ["65–80", b.k_65JaarTot80Jaar?.v], ["80+", b.k_80JaarOfOuder?.v]];
  const lTot = leeftijden.reduce((s, [, v]) => s + (v ?? 0), 0);
  const lMax = Math.max(1, ...leeftijden.map(([, v]) => v ?? 0));
  const jaren = [...new Set(Object.values(b).map((x) => x?.jaar))].filter(Boolean).sort();
  const q = encodeURIComponent(`${a.straat} ${a.huisnummer}, ${a.postcode} ${a.plaats}`);
  const bespaar = bespaarFor(a.bouwjaar);
  return (
    <div className="wrap adres">
      {/* Statistics count this page only by municipality, never the address (src/components/Tracker.tsx). */}
      <span hidden data-ww-pad={`/adres/${a.gemeente.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "onbekend"}/` } />
      <p className="print-only">Adresrapport · wiewoonteropditadres.nl · {new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}</p>
      <div className="adres-top no-print">
        <div><Zoek start={a.naam} /></div>
        <aside className="snel"><span className="kicker">Snel antwoord</span><p><b>Namen van bewoners zijn niet openbaar.</b> Wél: de woning, de buurt, de eigenaar (Kadaster), bedrijven (KVK) en de WOZ-waarde.</p></aside>
      </div>

      <div className="adres-head">
        <div>
          <h1>{a.straat} {a.huisnummer}, {a.postcode.replace(/(\d{4})(\w{2})/, "$1 $2")} {a.plaats}</h1>
          <p className="muted">{[a.buurt && `Buurt ${a.buurt}`, a.wijk && `wijk ${a.wijk}`, a.gemeente && `gemeente ${a.gemeente}`].filter(Boolean).join(" · ")}</p>
          <Deel slug={a.slug} naam={`${a.straat} ${a.huisnummer}, ${a.plaats}`} />
        </div>
        <Lucht slug={a.slug} lat={a.lat} lon={a.lon} mapsKey={process.env.GOOGLE_MAPS_EMBED_KEY || null} pts={foto.pts} grootPts={fotoGroot.pts} w={foto.w} h={foto.h} alt={`Luchtfoto van ${a.straat} ${a.huisnummer}`} />
      </div>

      <div className="grid">
        <section className="blok" data-blok="woning">
          <h2>De woning</h2>
          <div className="kv">
            <div><b>{a.bouwjaar ?? "–"}</b>bouwjaar</div>
            <div><b>{a.oppervlakte ? `${nl(a.oppervlakte)} m²` : "–"}</b>oppervlakte</div>
            <div><b>{a.gebruiksdoel ? (({ woonfunctie: "Woning", winkelfunctie: "Winkel", kantoorfunctie: "Kantoor", bijeenkomstfunctie: "Bijeenkomst", gezondheidszorgfunctie: "Zorg", onderwijsfunctie: "Onderwijs", industriefunctie: "Bedrijf", logiesfunctie: "Logies", sportfunctie: "Sport", celfunctie: "Cel" } as Record<string, string>)[a.gebruiksdoel.split(",")[0].trim()] ?? a.gebruiksdoel) : "–"}</b>gebruik</div>
            <div><b>{a.adressenInPand ? `${nl(a.adressenInPand)} ${a.adressenInPand === 1 ? "adres" : "adressen"}` : "–"}</b>in dit pand</div>
            <div><b>{a.status ? a.status.replace("Verblijfsobject ", "").replace(/^\w/, (c) => c.toUpperCase()) : "–"}</b>status</div>
          </div>
        </section>

        {bespaar ? (
          <section className="blok blok-groen" data-blok="bespaar">
            <h2>Bespaar op deze woning</h2>
            <p>{bespaar.tekst}</p>
            <div className="bespaar-knoppen">
              {bespaar.knoppen.map((k) => <a key={k.href} className="bespaar-knop" href={k.href} rel="nofollow noopener" target="_blank"><b>{k.label} ›</b><span>{k.sub}</span></a>)}
            </div>
            <ul className="bespaar-punten"><li>Gratis en vrijblijvend</li><li>Specialisten bij jou in de buurt</li><li>Vergelijk en <b>bespaar tot 40%</b></li></ul>
          </section>
        ) : null}

      </div>

      <Vergunningen slug={a.slug} />

      <div className="grid grid-2">
        <section className="blok" data-blok="buurt">
          <h2>Wie woont er in deze buurt?</h2>
          <div className="kv">
            <div><b>{b.AantalInwoners ? nl(b.AantalInwoners.v) : "–"}</b>inwoners</div>
            <div><b>{b.GemiddeldeHuishoudensgrootte ? nl(b.GemiddeldeHuishoudensgrootte.v, 1) : "–"}</b>personen per huishouden</div>
          </div>
          {hh ? (
            <>
              <p className="small muted" style={{ margin: "12px 0 4px" }}>Huishoudens ({nl(hh)})</p>
              <div className="split">
                {([["alleen", b.Eenpersoonshuishoudens?.v, "#4b1a6e"], ["zonder kinderen", b.HuishoudensZonderKinderen?.v, "#7a4fa3"], ["met kinderen", b.HuishoudensMetKinderen?.v, "#b49ad0"]] as const)
                  .map(([l, v, c]) => { const p = pct(v, hh); return p ? <span key={l} style={{ width: `${p}%`, background: c }}>{p >= 12 ? `${p}%` : ""}</span> : null; })}
              </div>
              <p className="small muted">alleenstaand · samen zonder kinderen · met kinderen</p>
            </>
          ) : null}
        </section>

        <section className="blok" data-blok="leeftijden">
          <h2>Leeftijden in de buurt</h2>
          {lTot ? <div className="bars">{leeftijden.map(([l, v]) => <div key={l} className="bar"><span>{l}</span><i style={{ width: `${((v ?? 0) / lMax) * 100}%` }} /><em>{Math.round(((v ?? 0) / lTot) * 100)}%</em></div>)}</div> : <p className="muted">Geen cijfers voor deze buurt.</p>}
        </section>

        <section className="blok" data-blok="wonen">
          <h2>Wonen in de buurt</h2>
          {b.Koopwoningen ? <div className="split split-1"><span style={{ width: `${b.Koopwoningen.v}%`, background: "#1f7a4d" }}>{b.Koopwoningen.v >= 15 ? `${nl(b.Koopwoningen.v)}% koop` : ""}</span><span style={{ width: `${100 - b.Koopwoningen.v}%`, background: "#5fa883" }}>{100 - b.Koopwoningen.v >= 15 ? `${nl(100 - b.Koopwoningen.v)}% huur` : ""}</span></div> : null}
          {b.PercentageEengezinswoning ? <div className="split split-1"><span style={{ width: `${b.PercentageEengezinswoning.v}%`, background: "#4b1a6e" }}>{b.PercentageEengezinswoning.v >= 15 ? `${nl(b.PercentageEengezinswoning.v)}% eengezins` : ""}</span><span style={{ width: `${100 - b.PercentageEengezinswoning.v}%`, background: "#b49ad0" }}>{100 - b.PercentageEengezinswoning.v >= 15 ? `${nl(100 - b.PercentageEengezinswoning.v)}% appartement` : ""}</span></div> : null}
          <div className="kv">
            <div><b>{b.GemiddeldeWOZWaardeVanWoningen ? `€ ${nl(b.GemiddeldeWOZWaardeVanWoningen.v * 1000)}` : "–"}</b>gemiddelde WOZ-waarde{b.GemiddeldeWOZWaardeVanWoningen ? ` (${b.GemiddeldeWOZWaardeVanWoningen.jaar})` : ""}</div>
            <div><b>{b.GemiddeldInkomenPerInwoner ? `€ ${nl(b.GemiddeldInkomenPerInwoner.v * 1000)}` : "–"}</b>gem. inkomen per inwoner{b.GemiddeldInkomenPerInwoner ? ` (${b.GemiddeldInkomenPerInwoner.jaar})` : ""}</div>
          </div>
        </section>

        {(wozSeizoen || PREVIEW) && (PARTNERS.woz || PREVIEW) && b.GemiddeldeWOZWaardeVanWoningen ? (
          <section className="blok blok-geel" data-blok="woz">
            <h2>WOZ-waarde te hoog?</h2>
            <p>Gemiddeld in deze buurt: <b>€ {nl(b.GemiddeldeWOZWaardeVanWoningen.v * 1000)}</b>. Is jouw aanslag hoger dan je verwacht? Laat gratis bezwaar maken: je betaalt alleen als het lukt.</p>
            {PARTNERS.woz ? <a className="btn btn-cta" href={PARTNERS.woz} rel="sponsored nofollow noopener" target="_blank">Check of bezwaar loont ›</a> : <span className="btn btn-cta" aria-disabled>Check of bezwaar loont ›</span>}
            <p className="small muted">{PREVIEW && !wozSeizoen ? "Voorbeeld: dit blok staat alleen van februari t/m april in beeld (als de aanslagen binnenkomen)." : "Partnerlink"}{PREVIEW && !PARTNERS.woz ? " Partnerlink volgt." : ""}</p>
          </section>
        ) : null}

        <section className="blok" data-blok="voorzieningen">
          <h2>Voorzieningen</h2>
          <p className="small muted" style={{ margin: "0 0 10px" }}>Gemiddelde afstand voor de buurt{b.AfstandTotGroteSupermarkt ? ` (CBS ${b.AfstandTotGroteSupermarkt.jaar})` : ""}.</p>
          <div className="kv">
            <div><b>{b.AfstandTotGroteSupermarkt ? `${nl(b.AfstandTotGroteSupermarkt.v, 1)} km` : "–"}</b>grote supermarkt</div>
            <div><b>{b.AfstandTotKinderdagverblijf ? `${nl(b.AfstandTotKinderdagverblijf.v, 1)} km` : "–"}</b>kinderopvang</div>
            <div><b>{b.AfstandTotSchool ? `${nl(b.AfstandTotSchool.v, 1)} km` : "–"}</b>basisschool</div>
            <div><b>{b.AfstandTotHuisartsenpraktijk ? `${nl(b.AfstandTotHuisartsenpraktijk.v, 1)} km` : "–"}</b>huisarts</div>
          </div>
        </section>
      </div>

      <section className="blok" data-blok="verder">
        <h2>Verder opzoeken voor dít adres</h2>
        <div className="knoppen">
          <a href="https://www.kadaster.nl/producten/woning/eigendomsinformatie" target="_blank" rel="noopener">Eigenaar opvragen ›<small>Kadaster · betaald uittreksel</small></a>
          <a href={`https://www.kvk.nl/zoeken/?source=all&q=${encodeURIComponent(`${a.postcode} ${a.huisnummer}`)}`} target="_blank" rel="noopener">Bedrijven op dit adres ›<small>KVK · gratis, al ingevuld</small></a>
          <a href="https://www.wozwaardeloket.nl/" target="_blank" rel="noopener">WOZ-waarde van deze woning ›<small>WOZ-waardeloket · gratis</small></a>
          <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener">Op de kaart ›<small>Google Maps</small></a>
        </div>
      </section>

      <p className="bronnen small muted">Bronnen: woninggegevens uit de Basisregistratie Adressen en Gebouwen (BAG). Buurtcijfers (afgerond) van het CBS, Kerncijfers wijken en buurten{jaren.length ? ` ${jaren.join(", ")}` : ""}: per cijfer het nieuwste jaar dat er is. Vergunningen: Officiële Bekendmakingen. Luchtfoto: PDOK.</p>
    </div>
  );
}
