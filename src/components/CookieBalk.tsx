"use client";
import { useEffect, useState } from "react";
import { captureAds, consent, fromAd, setConsent } from "@/lib/consent";

// Cookie notice (ADS.md): a bar at the bottom, only for visitors who came from an ad, two equal buttons,
// nothing pre-selected. Without a choice nothing is passed on.
export default function CookieBalk() {
  const [show, setShow] = useState(false);
  useEffect(() => { captureAds(); setShow(fromAd() && consent() === null); }, []);
  if (!show) return null;
  const kies = (v: "yes" | "no") => { setConsent(v); setShow(false); };
  return (
    <div className="cookiebalk" role="dialog" aria-label="Cookies" data-notrack="">
      <div className="wrap cookiebalk-in">
        <p><b>Wij gebruiken cookies</b> We gebruiken cookies om te meten welke advertenties werken, zodat we ze kunnen verbeteren. <a href="/privacy/#cookies">Meer info</a></p>
        <div className="cookiebalk-knoppen">
          <button type="button" onClick={() => kies("yes")}>Akkoord</button>
          <button type="button" onClick={() => kies("no")}>Alleen noodzakelijk</button>
        </div>
      </div>
    </div>
  );
}
