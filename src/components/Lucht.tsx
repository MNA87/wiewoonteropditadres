"use client";
import { useEffect, useState } from "react";

type Tab = "nu" | "vroeger" | "kaart" | "straat";
const TABS: [Tab, string][] = [["nu", "Luchtfoto"], ["vroeger", "Vroeger (2016)"], ["kaart", "Kaart"], ["straat", "Straat"]];

// Aerial photo with the building outlined; a click opens a large pop-up with tabs: aerial photo now,
// in 2016, a map and the street view. Street View (Google) loads only after a click: until then
// nothing goes to Google. Without a Maps key it opens Google Maps in a new tab.
export default function Lucht({ slug, pts, grootPts, w, h, alt, lat, lon, mapsKey, api = "/api/luchtfoto/" }:
  { slug: string; pts: string; grootPts: string; w: number; h: number; alt: string; lat: number; lon: number; mapsKey?: string | null; api?: string }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("nu");
  const [sv, setSv] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);
  const img = (laag: string, groot = false) => `${api}?adres=${slug}&laag=${laag}${groot ? "&groot=1" : ""}`;
  const pano = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lon}`;
  return (
    <>
      <button type="button" className="lucht" data-tool="Luchtfoto, kaart en straatbeeld" onClick={() => setOpen(true)} title="Luchtfoto, kaart en straatbeeld">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img("nu")} width={w} height={h} alt={alt} />
        {pts ? <svg viewBox={`0 0 ${w} ${h}`} aria-hidden><polygon points={pts} /></svg> : null}
        <span>⤢ Groter · kaart · straat</span>
      </button>
      {open ? (
        <div className="pop" data-tool="Luchtfoto, kaart en straatbeeld" role="dialog" aria-modal="true" aria-label={alt} onClick={() => setOpen(false)}>
          <div className="pop-in" onClick={(e) => e.stopPropagation()}>
            <div className="pop-tabs">
              {TABS.map(([k, l]) => <button key={k} type="button" className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
              <button type="button" className="pop-x" onClick={() => setOpen(false)} aria-label="Sluiten">✕</button>
            </div>
            {tab !== "straat" ? (
              <div className="pop-foto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img(tab, true)} alt={`${TABS.find(([k]) => k === tab)?.[1]}: ${alt}`} />
                {grootPts ? <svg viewBox="0 0 1600 1066" aria-hidden><polygon points={grootPts} /></svg> : null}
              </div>
            ) : sv && mapsKey ? (
              <div className="pop-foto"><iframe title="Straatbeeld" src={`https://www.google.com/maps/embed/v1/streetview?key=${mapsKey}&location=${lat},${lon}&fov=80`} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
            ) : (
              <div className="pop-foto pop-sv">
                <div>
                  <b>Bekijk het straatbeeld</b>
                  <p>Het straatbeeld komt van Google Street View. Als je het opent, laadt Google zijn eigen inhoud en cookies. Daarom gebeurt dat pas als jij erop klikt.</p>
                  {mapsKey
                    ? <button type="button" className="btn btn-cta" onClick={() => setSv(true)}>Toon straatbeeld van Google</button>
                    : <a className="btn btn-cta" href={pano} target="_blank" rel="noopener">Open straatbeeld in Google Maps ›</a>}
                  <small>Zonder klik: geen Google, geen cookies.</small>
                </div>
              </div>
            )}
            <p className="pop-cap">{tab === "kaart" ? "Kaart: TOP10NL (Kadaster)." : tab === "straat" ? "Straatbeeld: Google Street View." : `Luchtfoto${tab === "vroeger" ? " uit 2016" : ""}: Beeldmateriaal Nederland (PDOK).`} {tab !== "straat" ? "Het pand is geel omlijnd." : ""}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
