"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ADS, adsId, captureAds, consent } from "@/lib/consent";

// Visitor statistics, sent to the owner's dashboard on enqueteplein.nl (Beheer → Statistiek →
// wiewoonteropditadres.nl): page views, where visitors come from, clicks, tools, scroll depth and
// time on page. No cookies; the session id lives in sessionStorage (gone when the tab closes).
// Privacy: an address page is counted as "/adres/<gemeente>/" (never the street or house number),
// and nothing typed in the search box is sent. The owner: open the site once with ?notrack=1.

type Ev = Record<string, string | number | boolean | undefined>;
const SKIP = /^\/(wp-|xmlrpc)/;
const API = "https://enqueteplein.nl/api/s/";
// The page as counted: address pages only by municipality (data-ww-pad on the address page).
const pad = (p: string) => (p.startsWith("/adres/") ? (document.querySelector("[data-ww-pad]")?.getAttribute("data-ww-pad") ?? "/adres/") : p);
const queue: Ev[] = [];

function store(get: () => string | null) { try { return get(); } catch { return null; } }
// Robots that run a real browser (Puppeteer, Playwright, Selenium) say so in navigator.webdriver.
const notrack = () => (typeof navigator !== "undefined" && navigator.webdriver) || (typeof window !== "undefined" && window.self !== window.top) || store(() => localStorage.getItem("ep-notrack")) === "1";

function session() {
  const now = Date.now();
  const last = Number(store(() => sessionStorage.getItem("ep-last")) ?? 0);
  let sid = store(() => sessionStorage.getItem("ep-sid"));
  let fresh = false;
  if (!sid || now - last > 30 * 60_000) {
    sid = Math.random().toString(36).slice(2, 10) + now.toString(36);
    fresh = true;
    try { sessionStorage.setItem("ep-sid", sid); } catch {}
  }
  try { sessionStorage.setItem("ep-last", String(now)); } catch {}
  return { sid, fresh };
}

function flush() {
  if (!queue.length) return;
  const { sid } = session();
  let z: string | undefined;
  try { z = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch {}
  const body = JSON.stringify({ s: sid, z, w: "wwoda", ev: queue.splice(0, 30) });
  // text/plain: a "simple" cross-site request, so the browser sends it without a preflight.
  try {
    if (!navigator.sendBeacon?.(API, new Blob([body], { type: "text/plain" }))) {
      fetch(API, { method: "POST", body, keepalive: true, mode: "cors", headers: { "content-type": "text/plain" } }).catch(() => {});
    }
  } catch {}
  if (queue.length) flush();
}

function send(ev: Ev, now = false) {
  queue.push(ev);
  if (now || queue.length >= 10) flush();
}

// Google Ads: the ad click id goes along to the own lead pages, only with consent (cookie notice,
// src/lib/consent.ts), together with gc=yes so the visitor is not asked twice.
function tagLead(a: HTMLAnchorElement) {
  try {
    const u = new URL(a.href, location.href);
    if (u.hostname !== "offertes.kvinl.nl" || consent() !== "yes") return;
    for (const k of ADS) { const v = adsId(k); if (v && !u.searchParams.has(k)) u.searchParams.set(k, v); }
    u.searchParams.set("gc", "yes");
    a.href = u.href;
  } catch {}
}

const text = (el: Element) => (el.getAttribute("aria-label") || el.getAttribute("title") || (el as HTMLElement).innerText || el.getAttribute("alt") || "").replace(/\s+/g, " ").trim().slice(0, 120);

// Name of a tool (calculator, keuzehulp, adres-check…): data-tool, else the heading of its block, else the page title.
function toolName(el: Element) {
  const own = el.closest("[data-tool]")?.getAttribute("data-tool");
  if (own) return own;
  const box = el.closest(".card, section, article");
  const h = box?.querySelector("h2, h3") ?? document.querySelector("h1");
  return (h?.textContent ?? "Tool").replace(/\s+/g, " ").trim().slice(0, 80);
}

function formName(f: HTMLFormElement) {
  return f.getAttribute("data-form") || f.getAttribute("name") || f.id || f.getAttribute("aria-label") || f.className.split(" ")[0] || "formulier";
}

export default function Tracker() {
  const path = usePathname();
  const page = useRef({ path: "", start: 0, visible: 0, shownAt: 0, depth: 0 });
  const forms = useRef(new Set<string>());
  const tools = useRef(new Set<string>());

  // One page view per page, plus time and scroll depth when leaving it.
  useEffect(() => {
    captureAds();
    try { if (new URLSearchParams(location.search).get("notrack") === "1") localStorage.setItem("ep-notrack", "1"); } catch {}
    if (SKIP.test(path)) return;
    if (notrack()) return;
    // Pages that don't exist are counted apart (not as a visit), so the figures stay clean.
    if (document.querySelector("[data-notfound]")) { send({ t: "notfound", p: path.startsWith("/adres/") ? "/adres/(niet gevonden)" : path, h: document.referrer || undefined }, true); return; }
    const { fresh } = session();
    const ev: Ev = { t: "pv", p: pad(path) };
    if (fresh) {
      const q = new URLSearchParams(location.search);
      Object.assign(ev, { e: true, r: document.referrer, us: q.get("utm_source") ?? undefined, um: q.get("utm_medium") ?? undefined, uc: q.get("utm_campaign") ?? undefined, g: q.has("gclid") || q.has("gbraid") || q.has("wbraid") });
    }
    send(ev, true);
    // A sign of a person (once per session): scroll, mouse, touch, key, or 5 s visible.
    const sid = session().sid;
    let human = store(() => sessionStorage.getItem("ep-human")) === sid;
    const SIGNS = ["scroll", "pointermove", "pointerdown", "touchstart", "keydown", "wheel"] as const;
    const isHuman = () => {
      if (human) return;
      human = true;
      try { sessionStorage.setItem("ep-human", sid); } catch {}
      send({ t: "human", p: pad(path) }, true);
      SIGNS.forEach((s) => removeEventListener(s, isHuman));
    };
    if (!human) SIGNS.forEach((s) => addEventListener(s, isHuman, { passive: true, once: true }));
    const humanTimer = human ? 0 : window.setTimeout(() => { if (document.visibilityState === "visible") isHuman(); }, 5000);
    page.current = { path: pad(path), start: Date.now(), visible: 0, shownAt: Date.now(), depth: 0 };
    forms.current = new Set();
    tools.current = new Set();

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      const d = h > 0 ? Math.min(100, Math.round((scrollY / h) * 100)) : 100;
      if (d > page.current.depth) page.current.depth = d;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    const leave = () => {
      const p = page.current;
      if (!p.path) return;
      const secs = (p.visible + (p.shownAt ? Date.now() - p.shownAt : 0)) / 1000;
      send({ t: "leave", p: p.path, v: secs, h: String(p.depth) }, true);
      p.path = "";
    };
    const vis = () => {
      const p = page.current;
      if (document.visibilityState === "hidden") {
        if (p.shownAt) { p.visible += Date.now() - p.shownAt; p.shownAt = 0; }
        // Send what we have; if the visitor comes back, a later leave adds nothing double.
        const secs = p.visible / 1000;
        if (p.path) send({ t: "leave", p: p.path, v: secs, h: String(p.depth) }, true);
        p.visible = 0;
      } else if (!p.shownAt) p.shownAt = Date.now();
    };
    document.addEventListener("visibilitychange", vis);
    addEventListener("pagehide", leave);
    return () => { clearTimeout(humanTimer); SIGNS.forEach((s) => removeEventListener(s, isHuman)); removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", vis); removeEventListener("pagehide", leave); leave(); };
  }, [path]);

  // Clicks on links and buttons, and forms (started / sent).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const lead = (e.target as Element | null)?.closest("a[href]");
      if (lead) tagLead(lead as HTMLAnchorElement);
      if (notrack() || SKIP.test(location.pathname)) return;
      const el = (e.target as Element | null)?.closest("a[href], button, summary, [data-track]");
      if (!el) return;
      if (el.tagName === "A") tagLead(el as HTMLAnchorElement);
      // Never store what visitors typed or searched (e.g. addresses in the adres-check).
      const quiet = el.closest("[data-notrack]");
      const a = el.tagName === "A" ? (el as HTMLAnchorElement) : null;
      let kind = "knop", href = el.getAttribute("data-track") || "";
      if (a) {
        const u = new URL(a.href, location.href);
        const rel = a.getAttribute("rel") ?? "";
        // Own lead pages (offertes.kvinl.nl) and partner links count as partner clicks.
        if (u.hostname === "offertes.kvinl.nl" || /sponsored/.test(rel)) kind = "partner";
        else if (u.protocol === "mailto:" || u.protocol === "tel:") kind = "contact";
        else if (u.hostname !== location.hostname) kind = "extern";
        else kind = u.hash && u.pathname === location.pathname ? "anker" : "intern";
        href = u.hostname === location.hostname ? pad(u.pathname) + u.hash : u.href;
      } else if (el.tagName === "SUMMARY") kind = "uitklap";
      // A button inside a tool (keuzehulp answers, calculate buttons) = using that tool.
      if (!a && el.closest("[data-tool]")) {
        const name = toolName(el);
        if (!tools.current.has(name)) { tools.current.add(name); send({ t: "tool", p: pad(location.pathname), h: name }, true); }
      }
      send({ t: "click", p: pad(location.pathname), h: quiet ? href.split("?")[0] : href, k: quiet ? (kind === "knop" ? "adres gekozen" : "") : text(el), kd: kind }, kind === "partner" || kind === "extern");
    };
    const onFocus = (e: FocusEvent) => {
      // Only real forms (data-form: offerte, bureau, contact, ervaring); calculators count as tools.
      const f = (e.target as Element | null)?.closest("form[data-form]") as HTMLFormElement | null;
      if (!f || notrack() || SKIP.test(location.pathname)) return;
      const name = formName(f);
      if (forms.current.has(name)) return;
      forms.current.add(name);
      send({ t: "form_start", p: pad(location.pathname), h: name }, true);
    };
    const onSubmit = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement;
      if (notrack() || SKIP.test(location.pathname) || f.hasAttribute("data-form")) return;
      // A tool with a button (e.g. a calculator in a form): counts as using that tool.
      const name = toolName(f);
      if (tools.current.has(name)) return;
      tools.current.add(name);
      send({ t: "tool", p: pad(location.pathname), h: name }, true);
    };
    // Tools: the first time a visitor fills in or changes something in a tool on this page = 1 use.
    // Real forms (offerte, contact, ervaring…) are counted as forms instead.
    const onTool = (e: Event) => {
      const el = e.target as Element | null;
      if (!el || notrack() || SKIP.test(location.pathname)) return;
      if (!el.matches("input, select, textarea") || el.closest("form[data-form], header, nav, footer")) return;
      // "Lees meer" and similar show/hide switches are reading, not using a tool.
      if (el.matches(".intro-toggle")) return;
      // Reviews and experiences (searching, filtering, sorting them) are not a tool, but we do
      // want to see what people use there: counted as a click ("Waar op geklikt wordt"), once per
      // control per page. Never what someone typed in the search box.
      if (el.closest("[data-notool]")) {
        const what = el.matches("input[type=search]") ? "Zoeken in ervaringen"
          : el.matches("select") ? `Sorteren: ${((el as HTMLSelectElement).selectedOptions[0]?.text ?? "").trim()}`
          : el.matches("input[type=checkbox]") ? `Filter: ${(el.closest("label")?.textContent ?? "").replace(/\d+%$/, "").replace(/\s+/g, " ").trim()}`
          : (el.getAttribute("aria-label") ?? "Ervaringen");
        const key = `notool|${what}`;
        if (tools.current.has(key)) return;
        tools.current.add(key);
        send({ t: "click", p: pad(location.pathname), h: "", k: what.slice(0, 120), kd: "knop" }, true);
        return;
      }
      const f = el.closest("form");
      if (f && !el.closest("[data-tool]") && f.getAttribute("method")?.toLowerCase() === "post") return;
      const name = toolName(el);
      if (tools.current.has(name)) return;
      tools.current.add(name);
      send({ t: "tool", p: pad(location.pathname), h: name }, true);
    };
    document.addEventListener("input", onTool, true);
    document.addEventListener("change", onTool, true);
    document.addEventListener("click", onClick, true);
    // Heatmap (Beheer → Heatmap): where on the page people click, as a position only (x in thousandths
    // of the window width, y in pixels from the top of the page) and phone/desktop. Never what was clicked or typed.
    const onHeat = (e: MouseEvent) => {
      if (notrack() || SKIP.test(location.pathname) || !e.isTrusted) return;
      send({ t: "hm", p: pad(location.pathname), h: String(Math.round((e.clientX / Math.max(1, innerWidth)) * 1000)), v: Math.round(e.pageY), kd: innerWidth < 768 ? "m" : "d" });
    };
    document.addEventListener("click", onHeat, true);
    // Middle click / "open in new tab" with the mouse wheel: also a click on a link.
    const onAux = (e: MouseEvent) => { if (e.button === 1) onClick(e); };
    document.addEventListener("auxclick", onAux, true);
    const onCtx = (e: MouseEvent) => { const a = (e.target as Element | null)?.closest("a[href]"); if (a) tagLead(a as HTMLAnchorElement); };
    document.addEventListener("contextmenu", onCtx, true);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("submit", onSubmit, true);
    addEventListener("pagehide", flush);
    return () => { document.removeEventListener("input", onTool, true); document.removeEventListener("change", onTool, true); document.removeEventListener("click", onClick, true); document.removeEventListener("click", onHeat, true); document.removeEventListener("auxclick", onAux, true); document.removeEventListener("contextmenu", onCtx, true); document.removeEventListener("focusin", onFocus); document.removeEventListener("submit", onSubmit, true); removeEventListener("pagehide", flush); };
  }, []);

  return null;
}
