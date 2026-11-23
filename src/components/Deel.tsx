"use client";
import { useEffect, useState } from "react";
import { rememberAdres } from "@/components/Zoek";

type S = { slug: string; naam: string };
const BEWAARD = "bewaarde-adressen";
const read = (): S[] => { try { return JSON.parse(localStorage.getItem(BEWAARD) ?? "[]"); } catch { return []; } };

// Actions for the address: share (WhatsApp, link), a PDF report (print → save as PDF) and
// "Bewaar" (a list on this device only). The address is remembered as recently viewed.
export default function Deel({ slug, naam }: { slug: string; naam: string }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(location.href.split("?")[0]);
    rememberAdres({ slug, naam });
    setSaved(read().some((x) => x.slug === slug));
  }, [slug, naam]);
  const bewaar = () => {
    const l = read().filter((x) => x.slug !== slug);
    const next = saved ? l : [{ slug, naam }, ...l].slice(0, 20);
    try { localStorage.setItem(BEWAARD, JSON.stringify(next)); } catch {}
    setSaved(!saved);
  };
  const tekst = `Alles over de woning en de buurt van ${naam}: ${url}`;
  return (
    <div className="deel">
      <a className="deel-wa" href={`https://wa.me/?text=${encodeURIComponent(tekst)}`} target="_blank" rel="noopener">Deel via WhatsApp</a>
      <button type="button" onClick={() => { navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {}); }}>{copied ? "✓ Gekopieerd" : "🔗 Kopieer link"}</button>
      <button type="button" onClick={() => window.print()} title="Opslaan als PDF of afdrukken">⬇ PDF-rapport</button>
      <button type="button" onClick={bewaar} className={saved ? "on" : ""}>{saved ? "★ Bewaard" : "☆ Bewaar"}</button>
    </div>
  );
}
