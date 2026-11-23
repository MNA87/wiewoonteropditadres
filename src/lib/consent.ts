// Consent for ad measurement (see ADS.md "Cookiemelding"). Only visitors who come from an ad
// (gclid/gbraid/wbraid in the URL) are asked. Choice in cookie ww_gc=yes|no for 180 days.
// Before "Akkoord" the ad click id stays in memory only; after "Akkoord" it is kept for this visit
// (sessionStorage) and passed on to the own lead pages with gc=yes.
export const ADS = ["gclid", "gbraid", "wbraid"] as const;
const mem: Partial<Record<(typeof ADS)[number], string>> = {};

export function consent(): "yes" | "no" | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|; )ww_gc=(yes|no)/);
  return m ? (m[1] as "yes" | "no") : null;
}

// Read the ad click id from the landing URL (into memory; into sessionStorage only with consent).
export function captureAds() {
  try {
    const q = new URLSearchParams(location.search);
    for (const k of ADS) { const v = q.get(k); if (v) mem[k] = v.slice(0, 200); }
    if (consent() === "yes") for (const k of ADS) if (mem[k]) sessionStorage.setItem(`ww-${k}`, mem[k]!);
  } catch {}
}
export const adsId = (k: (typeof ADS)[number]) => { try { return mem[k] ?? sessionStorage.getItem(`ww-${k}`); } catch { return mem[k] ?? null; } };
export const fromAd = () => ADS.some((k) => adsId(k));

export function setConsent(v: "yes" | "no") {
  document.cookie = `ww_gc=${v}; Path=/; Max-Age=${180 * 86400}; SameSite=Lax; Secure`;
  try {
    if (v === "yes") { for (const k of ADS) if (mem[k]) sessionStorage.setItem(`ww-${k}`, mem[k]!); }
    else for (const k of ADS) { sessionStorage.removeItem(`ww-${k}`); delete mem[k]; }
  } catch {}
}
