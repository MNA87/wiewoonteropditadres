"use client";
import { useEffect, useState } from "react";
import type { Vergunning } from "@/lib/vergunningen";

const KLEUR: Record<string, string> = { aangevraagd: "vg-geel", verleend: "vg-groen", vergunningsvrij: "vg-groen", "beslistermijn verlengd": "vg-blauw", "buiten behandeling": "vg-grijs", ingetrokken: "vg-grijs", geweigerd: "vg-rood" };
const datum = (d: string) => new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short" });

// Permits near the address, loaded after the page (the official source can be slow).
export default function Vergunningen({ slug }: { slug: string }) {
  const [data, setData] = useState<{ gemeente: string; list: Vergunning[] } | null>(null);
  const [err, setErr] = useState(false);
  const [r, setR] = useState(500);
  const [alleenAanvragen, setAlleenAanvragen] = useState(false);
  const [alles, setAlles] = useState(false);
  useEffect(() => {
    fetch(`/api/vergunningen/?adres=${slug}`).then((x) => (x.ok ? x.json() : Promise.reject())).then(setData).catch(() => setErr(true));
  }, [slug]);
  const list = (data?.list ?? []).filter((v) => v.m <= r && (!alleenAanvragen || v.status === "aangevraagd"));
  const shown = alles ? list : list.slice(0, 6);
  return (
    <section className="blok vg" data-blok="vergunningen" data-tool="Vergunningen in de buurt">
      <h2>Vergunningen in de buurt</h2>
      <div className="chips">
        <button type="button" className={r === 500 ? "on" : ""} onClick={() => setR(500)}>Binnen 500 m</button>
        <button type="button" className={r === 1000 ? "on" : ""} onClick={() => setR(1000)}>Binnen 1 km</button>
        <button type="button" className={alleenAanvragen ? "on" : ""} onClick={() => setAlleenAanvragen((x) => !x)}>Alleen aanvragen</button>
      </div>
      {!data && !err ? <p className="muted">Bekendmakingen van de gemeente ophalen…</p> : null}
      {err ? <p className="muted">De bekendmakingen zijn even niet bereikbaar. Probeer het later nog eens.</p> : null}
      {data && !list.length ? <p className="muted">Geen vergunningen gevonden in de laatste 6 maanden binnen {r === 500 ? "500 meter" : "1 km"}.</p> : null}
      {shown.length ? (
        <ul className="vg-list">
          {shown.map((v) => (
            <li key={`${v.adres}${v.m}`}>
              <span className="vg-m">{v.m} m</span>
              <span className="vg-wat"><b>{v.adres}</b><span>{v.wat}</span></span>
              <span className="vg-st"><span className={`vg-pill ${KLEUR[v.status] ?? "vg-grijs"}`}>{v.status}</span><span className="small muted">{datum(v.datum)}{v.berichten.length > 1 ? ` · ${v.berichten.length} berichten` : ""}</span></span>
              <a href={v.berichten[v.berichten.length - 1].url} target="_blank" rel="noopener nofollow" className="vg-link">Bekendmaking ›</a>
            </li>
          ))}
        </ul>
      ) : null}
      {data ? <p className="small muted">Bekendmakingen van de gemeente {data.gemeente} van de laatste 6 maanden (Officiële Bekendmakingen). Geen namen van aanvragers. {list.length > 6 && !alles ? <button type="button" className="linkbtn" onClick={() => setAlles(true)}>Toon alle {list.length} adressen ›</button> : null}</p> : null}
    </section>
  );
}
