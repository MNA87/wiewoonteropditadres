import { SITE_URL } from "@/lib/site";

// For AI assistants (llms.txt): what the site is and which pages answer which question.
export function GET() {
  const body = `# Wiewoonteropditadres.nl

> Gratis opzoeken wat openbaar is over een Nederlands adres: de woning (bouwjaar, oppervlakte, gebruik, BAG), de buurt (CBS-cijfers), luchtfoto's, en omgevingsvergunningen in de buurt met de bezwaartermijn. Namen van bewoners zijn niet openbaar en tonen we nooit.

Belangrijkste antwoorden:
- Wie er op een adres woont, is niet openbaar: dat staat alleen in de BRP van de gemeente. Wel openbaar: de eigenaar (via het Kadaster, betaald), bedrijven op het adres (KVK), de WOZ-waarde (WOZ-waardeloket, gratis).
- Bezwaar tegen een vergunning van de buren: 6 weken na de bekendmaking bij de gemeente (reguliere procedure); bij de uitgebreide procedure eerst een zienswijze, daarna beroep. Bezwaar houdt de bouw niet tegen.

## Pagina's
- [Wie woont er op dit adres? (adres zoeken)](${SITE_URL}/): woning, buurt en vergunningen per adres.
- [Bezwaar maken tegen een vergunning van de buren](${SITE_URL}/bezwaar-vergunning-buren/): termijnen, procedure, bezwaarschrift.
- [Eigenaar van een huis opzoeken](${SITE_URL}/eigenaar-huis-opzoeken/): via het Kadaster, € 3,70 online.
- [WOZ-waarde opzoeken](${SITE_URL}/woz-waarde-opzoeken/): gratis via het WOZ-waardeloket, bezwaar binnen 6 weken.
- [Bouwjaar van een huis opzoeken](${SITE_URL}/bouwjaar-huis-opzoeken/): uit de BAG, gratis.
- [Waar komen de gegevens vandaan?](${SITE_URL}/bronnen/)
- [Privacy](${SITE_URL}/privacy/)

## Bronnen
BAG en luchtfoto via PDOK, CBS Kerncijfers wijken en buurten, Officiële Bekendmakingen (omgevingsvergunningen). Live opgehaald, met het jaar erbij.
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" } });
}
