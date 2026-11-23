import Zoek from "@/components/Zoek";

const FAQ: [string, string][] = [
  ["Kan ik opzoeken wie er op een adres woont?", "Nee. Wie er op een adres woont, staat in de Basisregistratie Personen (BRP) van de gemeente en is niet openbaar. Geen enkele site mag die namen laten zien. Wel openbaar zijn de woning, de buurt, de eigenaar (via het Kadaster) en bedrijven die op het adres staan ingeschreven (KVK)."],
  ["Hoe kom ik erachter wie de eigenaar van een woning is?", "Via het Kadaster. Voor een klein bedrag vraag je een uittreksel op met de naam van de eigenaar. Een huurder staat daar niet in; alleen wie de woning bezit."],
  ["Hoe vind ik de WOZ-waarde van een woning?", "Op het WOZ-waardeloket van de overheid. Dat is gratis, voor elke woning in Nederland. Op onze adrespagina zie je ook de gemiddelde WOZ-waarde van de buurt."],
  ["Welke bedrijven zitten er op een adres?", "Dat zie je in het Handelsregister van de KVK. Op de adrespagina staat een knop die de zoekopdracht voor dat adres al invult."],
  ["Waar komen de gegevens vandaan?", "Van de overheid zelf: de Basisregistratie Adressen en Gebouwen (BAG) en de luchtfoto via PDOK, buurtcijfers van het CBS en vergunningen uit Officiële Bekendmakingen. We halen ze live op en tonen bij elk cijfer het jaar."],
  ["Bewaren jullie welk adres ik opzoek?", "Nee. Het adres gebruiken we alleen om de gegevens op te halen. Recent bekeken adressen staan alleen op je eigen apparaat."],
];

export default function Home() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <h1>Wie woont er op dit adres?</h1>
            <p className="lead">Typ een adres en zie direct alles wat openbaar is over de woning en de buurt.</p>
            <Zoek autoFocus />
          </div>
          <aside className="snel">
            <span className="kicker">Snel antwoord</span>
            <p><b>Wie er op een adres woont, is niet openbaar</b> (dat staat alleen in de BRP van de gemeente). Wél openbaar: de woning, de buurt, de eigenaar (Kadaster), bedrijven (KVK) en de WOZ-waarde. Typ een adres en je ziet alles op één plek.</p>
          </aside>
        </div>
      </section>

      <section className="wrap sec">
        <h2>Wat je ziet bij een adres</h2>
        <div className="tegels">
          <div><b>🏠 De woning</b><span>Bouwjaar, oppervlakte, gebruik, hoeveel adressen in het pand, met luchtfoto.</span></div>
          <div><b>👥 Wie woont er in de buurt</b><span>Inwoners, huishoudens en leeftijden (afgerond, per buurt, van het CBS).</span></div>
          <div><b>💶 Wonen en WOZ</b><span>Koop of huur, eengezins of appartement, gemiddelde WOZ-waarde en inkomen.</span></div>
          <div><b>📋 Vergunningen</b><span>Dakkapellen, aanbouwen en verbouwingen in de buurt, uit de bekendmakingen van de gemeente.</span></div>
          <div><b>🔎 Verder opzoeken</b><span>Eigenaar (Kadaster), bedrijven (KVK) en WOZ-waarde: de knoppen staan al voor dit adres klaar.</span></div>
          <div><b>🔒 Privé blijft privé</b><span>Namen van bewoners tonen we nooit. Je zoekopdracht wordt niet bewaard.</span></div>
        </div>
      </section>

      <section className="wrap sec">
        <h2>Wat is wel en niet openbaar?</h2>
        <div className="tabel">
          <table>
            <thead><tr><th>Gegeven</th><th>Openbaar?</th><th>Waar</th></tr></thead>
            <tbody>
              <tr><td>Namen van bewoners</td><td><b>Nee</b></td><td>Alleen in de BRP van de gemeente, niet in te zien</td></tr>
              <tr><td>Eigenaar van de woning</td><td><b>Ja</b>, tegen betaling</td><td>Kadaster</td></tr>
              <tr><td>WOZ-waarde</td><td><b>Ja</b>, gratis</td><td>WOZ-waardeloket</td></tr>
              <tr><td>Bedrijven op het adres</td><td><b>Ja</b></td><td>KVK Handelsregister</td></tr>
              <tr><td>Bouwjaar en oppervlakte</td><td><b>Ja</b></td><td>BAG (op deze site)</td></tr>
              <tr><td>Wie woont er in de buurt (cijfers)</td><td><b>Ja</b>, afgerond</td><td>CBS (op deze site)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap sec">
        <h2>Bouwen je buren iets?</h2>
        <p>Op de adrespagina zie je de vergunningen in de buurt en tot wanneer bezwaar mogelijk is. <a href="/bezwaar-vergunning-buren/">Zo maak je bezwaar tegen een vergunning van de buren ›</a></p>
      </section>

      <section className="wrap sec">
        <h2>Veelgestelde vragen</h2>
        <div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      </section>
    </>
  );
}
