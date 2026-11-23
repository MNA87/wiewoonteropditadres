// Conversion blocks. "Bespaar" goes to the owner's own lead pages (offertes.kvinl.nl), chosen by
// building year; bron/adv let the lead app show where the lead came from. WOZ-bezwaar is a partner
// link (Railway variable PARTNER_WOZ_URL), shown February to April.
const OFFERTE = (process.env.OFFERTE_URL || "https://offertes.kvinl.nl").replace(/\/$/, "");
const lp = (v: number, adv: string) => `${OFFERTE}/aanvraag?v=${v}&bron=wiewoonteropditadres&adv=${adv}`;

export type Knop = { label: string; sub: string; href: string };
export function bespaarFor(bouwjaar: number | null): { tekst: string; knoppen: Knop[] } | null {
  if (bouwjaar == null) return null;
  if (bouwjaar < 1992) return {
    tekst: `Woningen van vóór 1992 zijn vaak nog niet goed geïsoleerd. Nieuwe kozijnen met isolatieglas en zonnepanelen leveren dan vaak de grootste besparing op.`,
    knoppen: [{ label: "Kunststof kozijnen", sub: "Gratis offertes vergelijken", href: lp(40, "bespaar-kozijnen") }, { label: "Zonnepanelen", sub: "Wat bespaar jij?", href: lp(36, "bespaar-zon") }],
  };
  if (bouwjaar < 2015) return {
    tekst: `Woningen uit ${bouwjaar} zijn meestal redelijk geïsoleerd. De grootste besparing zit dan vaak in een (hybride) warmtepomp, met ISDE-subsidie (RVO), of in zonnepanelen.`,
    knoppen: [{ label: "Hybride warmtepomp", sub: "Met subsidie", href: lp(35, "bespaar-warmtepomp") }, { label: "Zonnepanelen", sub: "Wat bespaar jij?", href: lp(36, "bespaar-zon") }],
  };
  return {
    tekst: `Woningen uit ${bouwjaar} zijn meestal goed geïsoleerd. De grootste besparing zit dan vaak in zonnepanelen, eventueel met een thuisaccu.`,
    knoppen: [{ label: "Zonnepanelen", sub: "Wat bespaar jij?", href: lp(36, "bespaar-zon") }, { label: "Thuisaccu", sub: "Gratis offertes vergelijken", href: lp(56, "bespaar-accu") }],
  };
}

export const PARTNERS = { woz: process.env.PARTNER_WOZ_URL || null };
// Preview (enqueteplein /proef/): show the WOZ block all year as an example.
export const PREVIEW = process.env.WW_PREVIEW === "1";
