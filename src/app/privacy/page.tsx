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
      <h2>Bronnen</h2>
      <p>BAG en luchtfoto via PDOK, CBS Kerncijfers wijken en buurten, Officiële Bekendmakingen. Ook de luchtfoto halen we zelf bij PDOK op: jouw browser maakt geen verbinding met andere partijen.</p>
    </div>
  );
}
