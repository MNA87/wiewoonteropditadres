export const metadata = { title: "Privacy" };

export default function Privacy() {
  return (
    <div className="wrap sec tekst">
      <h1>Privacy</h1>
      <p>Wiewoonteropditadres.nl toont alleen openbare gegevens over woningen en buurten. Namen van bewoners laten we nooit zien.</p>
      <h2>Wat we niet doen</h2>
      <ul>
        <li>We bewaren niet welk adres je opzoekt. Het adres gebruiken we alleen om de gegevens bij de bron op te halen.</li>
        <li>We plaatsen geen advertentiecookies en verkopen geen gegevens.</li>
      </ul>
      <h2>Op je eigen apparaat</h2>
      <p>De laatst bekeken adressen staan in je eigen browser (localStorage), zodat je ze snel terugvindt. Die gaan niet naar ons. Je wist ze door de websitegegevens in je browser te verwijderen.</p>
      <h2 id="cookies">Cookies bij advertenties</h2>
      <p>Kom je via een advertentie van Google, dan vragen we of we mogen meten welke advertentie werkte. Kies je <b>Akkoord</b>, dan bewaren we de code van de advertentieklik (gclid) tijdens je bezoek en geven we die mee als je doorklikt naar een offertepagina van offertes.kvinl.nl. Zo kunnen we zien welke advertenties tot een aanvraag leiden. Je keuze onthouden we 180 dagen in de cookie <code>ww_gc</code>.</p>
      <p>Kies je <b>Alleen noodzakelijk</b>, of kies je niets, dan geven we die code niet door en laden we niets van Google. Je kunt je keuze wijzigen door de cookies van deze site in je browser te verwijderen.</p>
      <h2>Bronnen</h2>
      <p>BAG en luchtfoto via PDOK, CBS Kerncijfers wijken en buurten, Officiële Bekendmakingen. Ook de luchtfoto halen we zelf bij PDOK op: jouw browser maakt geen verbinding met andere partijen.</p>
    </div>
  );
}
