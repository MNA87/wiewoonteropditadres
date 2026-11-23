import type { Metadata } from "next";
import Gids from "@/components/Gids";

const PATH = "/woz-waarde-opzoeken/";
export const metadata: Metadata = {
  title: { absolute: "WOZ-waarde opzoeken van elk huis: gratis (2026)" },
  description: "De WOZ-waarde van elke woning zie je gratis op het WOZ-waardeloket. Lees hoe je hem opzoekt, wat hij betekent en hoe je binnen 6 weken bezwaar maakt als hij te hoog is.",
  alternates: { canonical: PATH },
  openGraph: { title: "WOZ-waarde opzoeken", url: PATH, type: "article" },
};
const FAQ: [string, string][] = [
  ["Waar zie ik de WOZ-waarde van een huis?", "Gratis op wozwaardeloket.nl. Je ziet daar de WOZ-waarde van elke woning in Nederland, ook die van je buren."],
  ["Wat is de WOZ-waarde?", "De waarde die de gemeente elk jaar vaststelt voor een woning. Hij wordt gebruikt voor de OZB, de waterschapsbelasting en het eigenwoningforfait in je aangifte."],
  ["Wanneer krijg ik mijn nieuwe WOZ-waarde?", "Meestal eind februari, samen met de aanslag gemeentelijke belastingen. De waarde geldt voor de peildatum 1 januari van het jaar ervoor."],
  ["Hoe lang heb ik om bezwaar te maken tegen de WOZ-waarde?", "6 weken na de datum op de WOZ-beschikking (de dagtekening op het aanslagbiljet). Bezwaar maken is gratis."],
  ["Is de WOZ-waarde gelijk aan de verkoopprijs?", "Nee. De WOZ-waarde is een schatting op een peildatum. De echte verkoopprijs kan hoger of lager zijn."],
];
export default function Page() {
  return (
    <Gids path={PATH} h1="WOZ-waarde opzoeken" kruimel="WOZ-waarde opzoeken" bijgewerkt="2026-11-23" faq={FAQ}
      snel={<>De WOZ-waarde van elke woning zie je <b>gratis</b> op het <b>WOZ-waardeloket</b>. Vind je jouw WOZ-waarde te hoog? Dan maak je binnen <b>6 weken</b> na de dagtekening van je aanslag gratis bezwaar bij de gemeente.</>}
      zoekKop="Vergelijk met de buurt" zoekTekst="Typ het adres: je ziet de gemiddelde WOZ-waarde van de buurt, met het bouwjaar en de oppervlakte van de woning."
      bronnen={<><a href="https://www.wozwaardeloket.nl/" target="_blank" rel="noopener">WOZ-waardeloket</a>, <a href="https://www.waarderingskamer.nl/woz-wijzer/bezwaar-maken" target="_blank" rel="noopener">Waarderingskamer</a> en <a href="https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/waardering-onroerende-zaken-woz/bezwaar-woz-beschikking" target="_blank" rel="noopener">Rijksoverheid</a></>}>
      <h2>Zo zoek je de WOZ-waarde op</h2>
      <ol>
        <li>Ga naar <a href="https://www.wozwaardeloket.nl/" target="_blank" rel="noopener">wozwaardeloket.nl</a>.</li>
        <li>Typ de postcode en het huisnummer.</li>
        <li>Je ziet de WOZ-waarde van de afgelopen jaren, het bouwjaar en de oppervlakte.</li>
      </ol>
      <h2>Is jouw WOZ-waarde te hoog?</h2>
      <p>Vergelijk je woning met vergelijkbare huizen in de buurt: zelfde type, bouwjaar en oppervlakte. Zijn die duidelijk lager getaxeerd, dan kan bezwaar lonen.</p>
      <ul>
        <li><b>Termijn:</b> 6 weken na de dagtekening van de WOZ-beschikking (het aanslagbiljet).</li>
        <li><b>Kosten:</b> gratis. Er zijn ook bureaus die het voor je doen op basis van no cure, no pay; zij krijgen een vergoeding van de gemeente als het lukt.</li>
        <li><b>Hoe:</b> per brief of online via de gemeente, vaak met DigiD. Vraag eerst het taxatieverslag op: daarin staat met welke woningen de gemeente heeft vergeleken.</li>
      </ul>
      <p>Te laat? Dan ligt de waarde meestal vast. Alleen als hij duidelijk te hoog is (meer dan 20%), moet de gemeente hem toch aanpassen.</p>
    </Gids>
  );
}
