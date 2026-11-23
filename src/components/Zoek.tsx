"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type S = { slug: string; naam: string };
const RECENT = "recent-adressen";

// Address search: type a postcode + house number or a street; pick from the list.
// Recently viewed addresses are kept on this device only (never sent to us).
export default function Zoek({ start = "", autoFocus = false }: { start?: string; autoFocus?: boolean }) {
  const router = useRouter();
  const [q, setQ] = useState(start);
  const [list, setList] = useState<S[]>([]);
  const [sel, setSel] = useState(0);
  const [busy, setBusy] = useState(false);
  const [recent, setRecent] = useState<S[]>([]);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { try { setRecent(JSON.parse(localStorage.getItem(RECENT) ?? "[]").slice(0, 3)); } catch {} }, []);
  useEffect(() => {
    if (t.current) clearTimeout(t.current);
    if (q.trim().length < 3 || q === start) { setList([]); return; }
    t.current = setTimeout(async () => {
      try { setList(await (await fetch(`/api/suggest/?q=${encodeURIComponent(q)}`)).json()); setSel(0); } catch { setList([]); }
    }, 180);
  }, [q, start]);
  const go = (s: S) => { setBusy(true); setList([]); setQ(s.naam); router.push(`/adres/${s.slug}/`); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (list[sel]) return go(list[sel]);
    if (q.trim().length < 3) return;
    try { const l: S[] = await (await fetch(`/api/suggest/?q=${encodeURIComponent(q)}`)).json(); if (l[0]) go(l[0]); } catch {}
  };
  return (
    <div className="zoek" data-notrack="" data-tool="Adres zoeken">
      <form onSubmit={submit} role="search" className="zoek-form">
        <label htmlFor="adres" className="sr">Adres</label>
        <input id="adres" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Bijv. 1336 MK 81 of Dorpsstraat 1, Utrecht" autoComplete="off" autoFocus={autoFocus}
          onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); } }}
          role="combobox" aria-expanded={list.length > 0} aria-controls="adres-lijst" />
        <button type="submit" className="btn btn-cta" disabled={busy}>{busy ? "Even zoeken…" : "Bekijk adres"}</button>
        {list.length ? (
          <ul id="adres-lijst" className="zoek-lijst" role="listbox">
            {list.map((s, i) => <li key={s.slug} role="option" aria-selected={i === sel}><button type="button" onClick={() => go(s)} className={i === sel ? "on" : ""}>{s.naam}</button></li>)}
          </ul>
        ) : null}
      </form>
      <p className="zoek-hint">Typ een postcode met huisnummer, of een straat en plaats.</p>
      {recent.length ? <p className="zoek-hint">Eerder bekeken (alleen op dit apparaat): {recent.map((r, i) => <span key={r.slug}>{i ? " · " : ""}<a href={`/adres/${r.slug}/`}>{r.naam}</a></span>)}</p> : null}
    </div>
  );
}

// Remember an address as "recently viewed" (this device only).
export function rememberAdres(s: S) {
  try {
    const l: S[] = JSON.parse(localStorage.getItem(RECENT) ?? "[]").filter((x: S) => x.slug !== s.slug);
    localStorage.setItem(RECENT, JSON.stringify([s, ...l].slice(0, 5)));
  } catch {}
}
