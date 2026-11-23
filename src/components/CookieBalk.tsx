"use client";
import { useEffect, useRef, useState } from "react";
import { captureAds, consent, fromAd, setConsent } from "@/lib/consent";

// Cookie notice (ADS.md; owner 23 nov: in the middle, like the lead pages, but the search box and its
// button must stay visible). Only for visitors who came from an ad. A card centred horizontally, placed
// right under the search box (no dark layer over the page), two equal filled buttons, nothing pre-selected.
export default function CookieBalk() {
  const [show, setShow] = useState(false);
  const [top, setTop] = useState<number | null>(null);
  const [klein, setKlein] = useState(false);
  const [grijs, setGrijs] = useState(0);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => { captureAds(); setShow(fromAd() && consent() === null); }, []);
  useEffect(() => {
    if (!show) return;
    const place = () => {
      const h = card.current?.offsetHeight ?? 300;
      // The search box that is visible on screen (the one on the page first, else the one in the menu).
      const zichtbaar = (s: string) => [...document.querySelectorAll(s)].find((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && r.bottom > 0 && r.top < innerHeight; });
      const zoek = zichtbaar(".zoek-form") ?? zichtbaar(".nav-zoek");
      const onder = zoek ? zoek.getBoundingClientRect().bottom + 12 : (innerHeight - h) / 2;
      // Small screens: too little room under the search box → a compact card (buttons side by side).
      if (!klein && h > innerHeight - onder - 8) { setKlein(true); return; }
      // Under the search box if it fits; otherwise as low as possible, but never off screen.
      const y = Math.max(8, Math.min(Math.max(onder, (innerHeight - h) / 2), innerHeight - h - 8));
      setTop(y);
      // Grey layer like the lead pages, but starting under the search box: search and its button stay clear and usable.
      setGrijs(Math.max(0, Math.min(onder - 6, y - 6)));
    };
    const raf = requestAnimationFrame(place);
    addEventListener("resize", place);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", place); };
  }, [show, klein]);
  if (!show) return null;
  const kies = (v: "yes" | "no") => { setConsent(v); setShow(false); };
  return (
    <>
    <div className="cookiegrijs" style={{ top: grijs }} aria-hidden />
    <div ref={card} className={`cookiekaart${klein ? " klein" : ""}`} role="dialog" aria-label="Cookies" data-notrack="" style={{ top: top ?? undefined, visibility: top == null ? "hidden" : undefined }}>
      <b>Wij gebruiken cookies</b>
      <p>We gebruiken cookies om te meten welke advertenties werken, zodat we ze kunnen verbeteren. <a href="/privacy/#cookies">Meer info</a></p>
      <div className="cookiekaart-knoppen">
        <button type="button" onClick={() => kies("yes")}>Akkoord</button>
        <button type="button" onClick={() => kies("no")}>{klein ? "Weigeren" : "Alleen noodzakelijk"}</button>
      </div>
    </div>
    </>
  );
}
