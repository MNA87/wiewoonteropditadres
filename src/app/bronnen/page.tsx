import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Waar komen de gegevens vandaan?",
  description: "Alle gegevens op Wiewoonteropditadres.nl komen van de overheid zelf: BAG, PDOK, CBS en Officiële Bekendmakingen. Zo werkt het en zo actueel is het.",
  alternates: { canonical: "/bronnen/" },
};

export default function Bronnen() {
  return (
    <div className="wrap sec tekst gids">
      <p className="small muted"><Link href="/">Home</Link> › Bronnen</p>
      <h1>Waar komen de gegevens vandaan?</h1>
      <p>Alles wat je op een adrespagina ziet, halen we op het moment zelf op bij de overheid. We kopen geen adresdata en tonen nooit namen van bewoners.</p>
      <div className="tabel"><table>
        <thead><tr><th>Wat</th><th>Bron</th><th>Hoe actueel</th></tr></thead>
        <tbody>
          <tr><td>Adres, bouwjaar, oppervlakte, gebruik, pand</td><td>Basisregistratie Adressen en Gebouwen (BAG), via PDOK</td><td>Dagelijks bijgewerkt door gemeenten</td></tr>
          <tr><td>Luchtfoto's (nu en 2016), kaart</td><td>Beeldmateriaal Nederland en TOP10NL (Kadaster), via PDOK</td><td>Luchtfoto's jaarlijks</td></tr>
          <tr><td>Buurtcijfers: inwoners, huishoudens, leeftijden, wonen, WOZ, inkomen, voorzieningen</td><td>CBS Kerncijfers wijken en buurten</td><td>Per cijfer het nieuwste jaar; het jaar staat erbij</td></tr>
          <tr><td>Vergunningen in de buurt</td><td>Officiële Bekendmakingen (gemeenteblad)</td><td>Werkdagen; wij halen ze elke paar uur op</td></tr>
          <tr><td>Straatbeeld</td><td>Google Street View, pas na jouw klik</td><td>Verschilt per straat; de opnamedatum staat erbij</td></tr>
        </tbody>
      </table></div>
      <h2>Wat we niet hebben</h2>
      <p>Wie er op een adres woont, staat in de Basisregistratie Personen (BRP) van de gemeente. Die is niet openbaar. De eigenaar staat in het Kadaster (betaald), bedrijven in het Handelsregister van de KVK.</p>
      <h2>Privacy</h2>
      <p>Ingevulde adressen bewaren we niet. Zie onze <Link href="/privacy/">privacyverklaring</Link>.</p>
    </div>
  );
}
