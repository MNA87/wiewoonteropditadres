import type { Metadata } from "next";
import Gids from "@/components/Gids";

const PATH = "/eigenaar-huis-opzoeken/";
export const metadata: Metadata = {
  title: { absolute: "Eigenaar van een huis opzoeken: zo werkt het (2026)" },
  description: "Wie is de eigenaar van een huis? Via het Kadaster vraag je dat op voor € 3,70. Lees wat je krijgt, wat het verschil is met de bewoner en wat je gratis kunt zien.",
  alternates: { canonical: PATH },
  openGraph: { title: "Eigenaar van een huis opzoeken", url: PATH, type: "article" },
};
const FAQ: [string, string][] = [
  ["Hoe kom ik erachter wie de eigenaar van een huis is?", "Via het Kadaster. Op kadaster.nl bestel je 'Eigendomsinformatie' voor het adres. Online kost dat € 3,70 en je krijgt direct een document met de naam van de eigenaar."],
  ["Kan ik gratis zien wie de eigenaar is?", "Nee. De naam van de eigenaar staat alleen in het Kadaster en dat vraagt een vergoeding. Gratis zie je wel de woning zelf: bouwjaar, oppervlakte en het perceel."],
  ["Staat de huurder ook in het Kadaster?", "Nee. Het Kadaster laat zien wie de woning bezit, niet wie er woont. Wie er woont, staat in de Basisregistratie Personen van de gemeente en is niet openbaar."],
  ["Is het eigendom van een woningcorporatie of belegger te zien?", "Ja. Dan staat de corporatie of het bedrijf als eigenaar vermeld. Bedrijven op een adres vind je ook in het Handelsregister van de KVK."],
  ["Wat kost een eigendomsakte opvragen?", "Een kopie van de akte bij het Kadaster begint bij € 19,85. Voor alleen de naam van de eigenaar is de goedkopere eigendomsinformatie genoeg."],
];
export default function Page() {
  return (
    <Gids path={PATH} h1="Eigenaar van een huis opzoeken" kruimel="Eigenaar opzoeken" bijgewerkt="2026-11-23" faq={FAQ}
      snel={<>De eigenaar van een huis vraag je op bij het <b>Kadaster</b>: online kost dat <b>€ 3,70</b>. Je ziet dan wie de woning <b>bezit</b>, niet wie er woont: de bewoners zijn niet openbaar.</>}
      zoekKop="Eerst de woning bekijken" zoekTekst="Typ het adres: je ziet gratis het bouwjaar, de oppervlakte, de buurt en vergunningen, met een knop naar het Kadaster."
      bronnen={<><a href="https://www.kadaster.nl/producten/woning/eigendomsinformatie" target="_blank" rel="noopener">Kadaster: eigendomsinformatie</a> en <a href="https://www.kadaster.nl/over-ons/tarieven" target="_blank" rel="noopener">Kadaster: tarieven</a></>}>
      <h2>Zo vraag je de eigenaar op</h2>
      <ol>
        <li>Ga naar <a href="https://www.kadaster.nl/producten/woning/eigendomsinformatie" target="_blank" rel="noopener">kadaster.nl → Eigendomsinformatie</a>.</li>
        <li>Vul het adres in (postcode en huisnummer).</li>
        <li>Betaal online <b>€ 3,70</b>. Je krijgt een link om het document te downloaden.</li>
      </ol>
      <p>Per e-mail of per post (gewaarmerkt) is het duurder. Kijk voor de actuele prijzen op de tarievenpagina van het Kadaster.</p>
      <h2>Wat staat er in de eigendomsinformatie?</h2>
      <ul>
        <li>de naam van de eigenaar (of eigenaren), of de naam van het bedrijf of de corporatie;</li>
        <li>het perceel en de grootte ervan;</li>
        <li>eventuele hypotheken en beperkingen.</li>
      </ul>
      <h2>Eigenaar is niet hetzelfde als bewoner</h2>
      <p>Bij een huurhuis is de eigenaar een verhuurder, belegger of woningcorporatie. Wie er echt woont, staat in de Basisregistratie Personen (BRP) van de gemeente. Die is niet openbaar, ook niet via ons.</p>
      <h2>Wat kun je wel gratis zien?</h2>
      <p>Op de adrespagina zie je zonder kosten het bouwjaar, de oppervlakte, het gebruik, een luchtfoto, cijfers over de buurt en vergunningen in de buurt. Ook staat er een knop naar het Handelsregister van de KVK, voor bedrijven op het adres.</p>
    </Gids>
  );
}
