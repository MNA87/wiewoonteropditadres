// Kind of work in a permit (dakkapel, uitbouw, bomen kappen…), recognised from the description,
// with the owner's own lead page where there is one ("Ook een dakkapel?"). Client-safe.
export type Soort = { key: string; icon: string; label: string; meervoud: string; lp?: number; kop?: (n: number) => string; vraag?: string };

const S = (key: string, icon: string, label: string, meervoud: string, extra: Partial<Soort> = {}): Soort => ({ key, icon, label, meervoud, ...extra });
export const SOORTEN: [RegExp, Soort][] = [
  [/dakkapel/i, S("dakkapel", "🏠", "Dakkapel", "dakkapellen", { lp: 45, kop: (n) => (n === 1 ? "In jouw buurt komt een nieuwe dakkapel." : `In jouw buurt komen ${n} nieuwe dakkapellen.`), vraag: "Ook een dakkapel?" })],
  [/schuifpui/i, S("schuifpui", "🚪", "Schuifpui", "schuifpuien", { lp: 41, kop: (n) => (n === 1 ? "In jouw buurt komt een nieuwe schuifpui." : `In jouw buurt komen ${n} nieuwe schuifpuien.`), vraag: "Ook een schuifpui?" })],
  [/zonnepane|zonnecollector/i, S("zonnepanelen", "☀️", "Zonnepanelen", "keer zonnepanelen", { lp: 36, kop: (n) => (n === 1 ? "In jouw buurt komen zonnepanelen op een dak." : `In jouw buurt komen op ${n} daken zonnepanelen.`), vraag: "Ook zonnepanelen?" })],
  [/warmtepomp/i, S("warmtepomp", "♨️", "Warmtepomp", "warmtepompen", { lp: 35, kop: (n) => (n === 1 ? "In jouw buurt komt een warmtepomp." : `In jouw buurt komen ${n} warmtepompen.`), vraag: "Ook een warmtepomp?" })],
  [/airco|airconditioning/i, S("airco", "❄️", "Airco", "airco's", { lp: 50, kop: (n) => (n === 1 ? "In jouw buurt komt een airco." : `In jouw buurt komen ${n} airco's.`), vraag: "Ook een airco?" })],
  [/asbest|\bslo(op|pen)\b|sloop/i, S("sloop", "🧱", "Sloop/asbest", "keer sloop of asbest", { lp: 39, kop: (n) => (n === 1 ? "In jouw buurt wordt gesloopt of asbest verwijderd." : `In jouw buurt wordt ${n} keer gesloopt of asbest verwijderd.`), vraag: "Asbest in je huis of schuur?" })],
  [/kozijn|\bramen\b|\braam\b|voordeur|\bdeur(en)?\b|kunststof/i, S("kozijnen", "🪟", "Kozijnen", "keer kozijnen", { lp: 40, kop: (n) => (n === 1 ? "In jouw buurt komen nieuwe kozijnen." : `In jouw buurt komen bij ${n} woningen nieuwe kozijnen.`), vraag: "Ook nieuwe kozijnen?" })],
  [/dakopbouw|opbouw|optopping|verdieping/i, S("dakopbouw", "🏗️", "Dakopbouw", "dakopbouwen")],
  [/uitbouw|aanbouw|uitbreid|uitbreiding/i, S("uitbouw", "📐", "Uit- of aanbouw", "uit- en aanbouwen")],
  [/veranda|overkapping|carport|serre|pergola/i, S("veranda", "☂️", "Veranda/overkapping", "veranda's en overkappingen")],
  [/bijgebouw|schuur|tuinhuis|berging|garage/i, S("bijgebouw", "🛖", "Bijgebouw", "bijgebouwen")],
  [/\bkap(pen)?\b|\bboom\b|\bbomen\b|vellen|houtopstand/i, S("kap", "🌳", "Bomen kappen", "keer bomen kappen")],
  [/splits|kamerverhuur|kamerbewoning|onzelfstandig|omzetten/i, S("splitsen", "🏢", "Splitsen/kamers", "splitsingen")],
  [/uitrit|inrit/i, S("inrit", "🚗", "In- of uitrit", "in- en uitritten")],
  [/reclame|lichtbak/i, S("reclame", "📢", "Reclame", "reclames")],
  [/nieuwbouw|bouwen van (een|\d+) (woning|woningen|bedrijfs)|realiseren van/i, S("nieuwbouw", "🏘️", "Nieuwbouw", "nieuwbouwprojecten")],
  [/verbouw|wijzig|vervang|renov|gevel|interne/i, S("verbouw", "🔨", "Verbouw", "verbouwingen")],
];
export const OVERIG = S("overig", "📄", "Overig", "andere");
export const soortVan = (tekst: string) => SOORTEN.find(([re]) => re.test(tekst))?.[1] ?? OVERIG;
export const lpUrl = (v: number, key: string) => `https://offertes.kvinl.nl/aanvraag?v=${v}&bron=wiewoonteropditadres&adv=vergunning-${key}`;
