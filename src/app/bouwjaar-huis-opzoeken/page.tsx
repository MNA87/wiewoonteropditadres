import type { Metadata } from "next";
import Gids from "@/components/Gids";

const PATH = "/bouwjaar-huis-opzoeken/";
export const metadata: Metadata = {
  title: { absolute: "Bouwjaar van een huis opzoeken: gratis per adres (2026)" },
  description: "Het bouwjaar van elke woning staat in de BAG en is gratis te zien. Typ een adres en zie het bouwjaar, de oppervlakte en wat dat zegt over isolatie en asbest.",
  alternates: { canonical: PATH },
  openGraph: { title: "Bouwjaar van een huis opzoeken", url: PATH, type: "article" },
};
const FAQ: [string, string][] = [
  ["Waar vind ik het bouwjaar van een huis?", "In de Basisregistratie Adressen en Gebouwen (BAG). Op onze adrespagina zie je het direct, gratis. Ook op het WOZ-waardeloket en in de BAG-viewer van het Kadaster."],
  ["Klopt het bouwjaar in de BAG altijd?", "Meestal wel. Het is het jaar waarin het pand oorspronkelijk is opgeleverd. Bij een grote verbouwing blijft het oorspronkelijke bouwjaar vaak staan, en bij oude panden is het soms een schatting."],
  ["Wat zegt het bouwjaar over isolatie?", "Woningen van vóór ongeveer 1975 zijn vaak slecht geïsoleerd, tenzij er later is na-geïsoleerd. Vanaf de jaren negentig gelden strengere eisen. Het energielabel zegt meer dan het bouwjaar alleen."],
  ["Kan er asbest in mijn huis zitten?", "In woningen die vóór 1994 zijn gebouwd, kan asbest zitten, bijvoorbeeld in daken, golfplaten, vloerbedekking of rond leidingen. Sinds 1994 is asbest verboden. Laat het bij twijfel onderzoeken voordat je gaat verbouwen."],
];
export default function Page() {
  return (
    <Gids path={PATH} h1="Bouwjaar van een huis opzoeken" kruimel="Bouwjaar opzoeken" bijgewerkt="2026-11-23" faq={FAQ}
      snel={<>Het bouwjaar van elke woning staat in de <b>BAG</b> (Basisregistratie Adressen en Gebouwen) en is <b>gratis</b> te zien. Typ hieronder een adres en je ziet het bouwjaar, de oppervlakte en het gebruik.</>}
      zoekKop="Bekijk het bouwjaar" zoekTekst="Typ een postcode met huisnummer, of een straat en plaats."
      bronnen={<><a href="https://www.kadaster.nl/zakelijk/registraties/basisregistraties/bag" target="_blank" rel="noopener">Kadaster: BAG</a> en <a href="https://www.rijksoverheid.nl/onderwerpen/asbest" target="_blank" rel="noopener">Rijksoverheid: asbest</a></>}>
      <h2>Wat het bouwjaar je vertelt</h2>
      <div className="tabel"><table>
        <thead><tr><th>Bouwjaar</th><th>Waar je op let</th></tr></thead>
        <tbody>
          <tr><td>Vóór 1945</td><td>Vaak karakteristiek, maar ook enkel glas, houten vloeren en weinig isolatie. Fundering kan een punt zijn.</td></tr>
          <tr><td>1945 – 1975</td><td>Veel naoorlogse woningen: vaak spouwmuur zonder isolatie. Na-isoleren loont vaak.</td></tr>
          <tr><td>1975 – 1994</td><td>Meer isolatie, maar er kan nog asbest zijn verwerkt (verboden sinds 1994).</td></tr>
          <tr><td>Na 1994</td><td>Geen asbest meer. Steeds strengere eisen voor isolatie en energie.</td></tr>
        </tbody>
      </table></div>
      <p>Dit zijn vuistregels: wat er later is verbouwd of geïsoleerd, verschilt per huis. Het energielabel en een bouwkundige keuring geven het echte beeld.</p>
      <h2>Andere manieren om het bouwjaar te zien</h2>
      <ul>
        <li>Het <a href="https://www.wozwaardeloket.nl/" target="_blank" rel="noopener">WOZ-waardeloket</a> toont het bouwjaar bij de WOZ-waarde.</li>
        <li>De BAG-viewer van het Kadaster toont het per pand op de kaart.</li>
      </ul>
    </Gids>
  );
}
