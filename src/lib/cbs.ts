// Neighbourhood figures from CBS "Kerncijfers wijken en buurten": per field the newest table
// that has a value (population is new each year, income and WOZ follow later).
const TABLES: [string, number][] = [["86358NED", 2026], ["86165NED", 2025], ["85984NED", 2024], ["85618NED", 2023]];
const FIELDS = ["AantalInwoners", "HuishoudensTotaal", "Eenpersoonshuishoudens", "HuishoudensZonderKinderen", "HuishoudensMetKinderen", "GemiddeldeHuishoudensgrootte",
  "k_0Tot15Jaar", "k_15Tot25Jaar", "k_25Tot45Jaar", "k_45Tot65Jaar", "k_65JaarTot80Jaar", "k_80JaarOfOuder",
  "GemiddeldeWOZWaardeVanWoningen", "PercentageEengezinswoning", "PercentageMeergezinswoning", "Koopwoningen", "HuurwoningenTotaal",
  "GemiddeldInkomenPerInwoner", "AfstandTotHuisartsenpraktijk", "AfstandTotGroteSupermarkt", "AfstandTotKinderdagverblijf", "AfstandTotSchool"] as const;
export type CbsField = (typeof FIELDS)[number];
export type Buurt = Partial<Record<CbsField, { v: number; jaar: number }>>;

async function row(table: string, code: string): Promise<Record<string, unknown>> {
  try {
    const r = await fetch(`https://opendata.cbs.nl/ODataApi/odata/${table}/TypedDataSet?$filter=WijkenEnBuurten%20eq%20'${encodeURIComponent(code)}'&$format=json`,
      { signal: AbortSignal.timeout(12000), next: { revalidate: 7 * 86400 } });
    if (!r.ok) return {};
    return (await r.json()).value?.[0] ?? {};
  } catch { return {}; }
}

export async function buurt(code: string): Promise<Buurt> {
  if (!/^BU\d{8}$/.test(code)) return {};
  const rows = await Promise.all(TABLES.map(async ([t, jaar]) => ({ jaar, r: await row(t, code) })));
  const out: Buurt = {};
  for (const f of FIELDS) {
    for (const { jaar, r } of rows) {
      const k = Object.keys(r).find((x) => x.replace(/_\d+$/, "") === f);
      const v = k ? r[k] : null;
      if (typeof v === "number") { out[f] = { v, jaar }; break; }
    }
  }
  return out;
}
