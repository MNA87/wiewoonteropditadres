"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GIDSEN } from "@/lib/nav";

// Top menu: logo, three items, and a search box on every page. Phone: one menu button.
export default function Menu() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const gids = useRef<HTMLDetailsElement>(null);
  useEffect(() => { setOpen(false); if (gids.current) gids.current.open = false; }, [path]);
  const opGids = GIDSEN.some((g) => g.href === path);
  return (
    <header className="top" data-notrack="">
      <div className="wrap top-in">
        <Link href="/" className="logo"><span aria-hidden>⌂</span> wiewoonteropditadres<span>.nl</span></Link>
        <nav className="nav" aria-label="Menu">
          <Link href="/" className={path === "/" ? "on" : ""}>Adres zoeken</Link>
          <details ref={gids} className="nav-drop">
            <summary className={opGids ? "on" : ""}>Gidsen ▾</summary>
            <div className="nav-panel">{GIDSEN.map((g) => <Link key={g.href} href={g.href}>{g.titel}<small>{g.sub}</small></Link>)}</div>
          </details>
          <Link href="/bezwaar-vergunning-buren/" className={path === "/bezwaar-vergunning-buren/" ? "on" : ""}>Vergunningen</Link>
        </nav>
        {path !== "/" ? <form action="/zoek/" className="nav-zoek" role="search"><input name="q" placeholder="Typ een adres…" aria-label="Adres" autoComplete="off" /><button type="submit">Zoek</button></form> : null}
        <button type="button" className="burger" aria-label={open ? "Menu sluiten" : "Menu openen"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
      </div>
      {open ? (
        <div className="mmenu">
          <form action="/zoek/" role="search"><input name="q" placeholder="Typ een adres…" aria-label="Adres" autoComplete="off" /></form>
          <Link href="/">Adres zoeken</Link>
          <span className="mkop">Gidsen</span>
          {GIDSEN.map((g) => <Link key={g.href} href={g.href}>{g.kort}<small>{g.sub}</small></Link>)}
          <span className="mkop">Meer</span>
          <Link href="/bronnen/">Waar komen de gegevens vandaan?</Link>
          <Link href="/privacy/">Privacy</Link>
        </div>
      ) : null}
    </header>
  );
}
