"use client";
import { useEffect, useState } from "react";
import type { Vergunning } from "@/lib/vergunningen";
import { lpUrl, OVERIG, SOORTEN, type Soort } from "@/lib/soorten";
const soortByKey = (k: string) => SOORTEN.find(([, s]) => s.key === k)?.[1] ?? OVERIG;

const KLEUR: Record<string, string> = { aangevraagd: "vg-geel", verleend: "vg-groen", vergunningsvrij: "vg-groen", "beslistermijn verlengd": "vg-blauw", "buiten behandeling": "vg-grijs", ingetrokken: "vg-grijs", geweigerd: "vg-rood" };
const datum = (d: string | Date) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });
// Objection period: 6 weeks after the announcement of a granted permit (Awb). Shown as a guide only.
const bezwaarTot = (d: string) => new Date(new Date(d).getTime() + 42 * 86400000);

// Permits near the address, loaded after the page (the official source can be slow):
// a summary, the kind of work (label + filter), the objection period for granted permits,
// and one "Ook een …?" block to the owner's own lead page for the most common kind nearby.
export default function Vergunningen({ slug }: { slug: string }) {
  const [data, setData] = useState<{ gemeente: string; list: Vergunning[]; vanaf?: string } | null>(null);
  const [err, setErr] = useState(false);
  const [r, setR] = useState(500);
  const [soort, setSoort] = useState<string | null>(null);
  const [alles, setAlles] = useState(false);
  useEffect(() => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 40000);
    fetch(`/api/vergunningen/?adres=${slug}`, { signal: ctl.signal }).then((x) => (x.ok ? x.json() : Promise.reject())).then(setData).catch(() => setErr(true)).finally(() => clearTimeout(t));
    return () => { clearTimeout(t); ctl.abort(); };
  }, [slug]);
  const inR = (data?.list ?? []).filter((v) => v.m <= r).map((v) => ({ ...v, s: soortByKey(v.soort) }));
  const tel = new Map<string, { s: Soort; n: number }>();
  for (const v of inR) tel.set(v.s.key, { s: v.s, n: (tel.get(v.s.key)?.n ?? 0) + 1 });
  const soorten = [...tel.values()].sort((a, b) => b.n - a.n);
  const list = inR.filter((v) => !soort || v.s.key === soort);
  const shown = alles ? list : list.slice(0, 6);
  const top = soorten.filter((x) => x.s.key !== "overig");
  const sum = top.slice(0, 4).map((x) => (x.n === 1 ? `1 ${x.s.label.toLowerCase()}` : `${x.n} ${x.s.meervoud}`));
  const rest = inR.length - top.slice(0, 4).reduce((s, x) => s + x.n, 0);
  const cta = soorten.find((x) => x.s.lp && x.s.kop);
  const now = Date.now();
  // Large municipalities: we read the newest messages only, so say from which date.
  const zesMaanden = new Date(now - 6 * 30.5 * 86400000).toISOString().slice(0, 10);
  const periode = data?.vanaf && data.vanaf > zesMaanden ? `Sinds ${datum(data.vanaf)}` : "Laatste 6 maanden";
  const heeftVerleend = list.some((v) => v.status === "verleend");
  return (
    <section className="blok vg" data-blok="vergunningen" data-tool="Vergunningen in de buurt">
      <h2>Vergunningen in de buurt</h2>
      {data && inR.length ? <p className="vg-sum">{periode} binnen {r === 500 ? "500 m" : "1 km"}: {sum.length ? <>{sum.map((x, i) => <span key={i}>{i ? (i === sum.length - 1 && rest <= 0 ? " en " : ", ") : ""}<b>{x}</b></span>)}{rest > 0 ? <> en {rest} andere</> : null}</> : <b>{inR.length} {inR.length === 1 ? "bekendmaking" : "bekendmakingen"}</b>}.</p> : null}
      <div className="chips">
        <button type="button" className={r === 500 ? "on" : ""} onClick={() => setR(500)}>Binnen 500 m</button>
        <button type="button" className={r === 1000 ? "on" : ""} onClick={() => setR(1000)}>Binnen 1 km</button>
        {soorten.length > 1 ? <>
          <span className="vg-sep" aria-hidden>|</span>
          <button type="button" className={!soort ? "on" : ""} onClick={() => setSoort(null)}>Alles ({inR.length})</button>
          {soorten.map((x) => <button key={x.s.key} type="button" className={soort === x.s.key ? "on" : ""} onClick={() => setSoort(soort === x.s.key ? null : x.s.key)}>{x.s.icon} {x.s.label} ({x.n})</button>)}
        </> : null}
      </div>
      {!data && !err ? <p className="muted">Bekendmakingen van de gemeente ophalen…</p> : null}
      {err ? <p className="muted">De bekendmakingen zijn even niet bereikbaar. Probeer het later nog eens.</p> : null}
      {data && !list.length ? <p className="muted">Geen vergunningen gevonden ({periode.toLowerCase()}) binnen {r === 500 ? "500 meter" : "1 km"}.</p> : null}
      {shown.length ? (
        <ul className="vg-list">
          {shown.map((v) => {
            const tot = v.status === "verleend" ? bezwaarTot(v.datum) : null;
            return (
              <li key={`${v.adres}${v.m}`}>
                <span className="vg-m">{v.m} m</span>
                <span className="vg-wat"><span className="vg-tag">{v.s.icon} {v.s.label}</span><b>{v.adres}</b><span>{v.wat}</span></span>
                <span className="vg-st">
                  <span className={`vg-pill ${KLEUR[v.status] ?? "vg-grijs"}`}>{v.status}</span>
                  <span className="small muted">{datum(v.datum)}{v.berichten.length > 1 ? ` · ${v.berichten.length} berichten` : ""}</span>
                  {tot ? <span className={`vg-bz${tot.getTime() < now ? " off" : ""}`}>{tot.getTime() < now ? `bezwaartermijn verlopen (${datum(tot)})` : `bezwaar mogelijk tot ${datum(tot)}`}</span> : null}
                </span>
                <a href={v.berichten[v.berichten.length - 1].url} target="_blank" rel="noopener nofollow" className="vg-link">Bekendmaking ›</a>
              </li>
            );
          })}
        </ul>
      ) : null}
      {data ? <p className="small muted">Bekendmakingen van de gemeente {data.gemeente}, {periode.toLowerCase()} (Officiële Bekendmakingen). Geen namen van aanvragers. {list.length > 6 && !alles ? <button type="button" className="linkbtn" onClick={() => setAlles(true)}>Toon alle {list.length} adressen ›</button> : null}</p> : null}
      {heeftVerleend ? <p className="vg-uitleg">ⓘ <b>Bezwaar maken?</b> Tegen een verleende vergunning kun je tot 6 weken na de bekendmaking bezwaar maken (bij een uitgebreide procedure: beroep). De precieze termijn staat in de bekendmaking zelf. <a href="/bezwaar-vergunning-buren/">Zo werkt bezwaar maken ›</a></p> : null}
      {cta && cta.s.lp ? (
        <div className="vg-cta">
          <span className="vg-cta-ic" aria-hidden>{cta.s.icon}</span>
          <div><b>{cta.s.kop!(cta.n)}</b><p>{cta.s.vraag} Vergelijk gratis offertes van specialisten bij jou in de buurt.</p></div>
          <a className="btn btn-cta" href={lpUrl(cta.s.lp, cta.s.key)} rel="nofollow noopener" target="_blank">Bekijk prijzen ›</a>
        </div>
      ) : null}
    </section>
  );
}
