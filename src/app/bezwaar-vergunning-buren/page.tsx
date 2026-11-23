import type { Metadata } from "next";
import Link from "next/link";
import Zoek from "@/components/Zoek";
import { SITE_URL } from "@/lib/site";

const PATH = "/bezwaar-vergunning-buren/";
const BIJGEWERKT = "2026-11-23";

export const metadata: Metadata = {
  title: { absolute: "Bezwaar maken tegen een vergunning van de buren: zo werkt het (2026)" },
  description: "Bouwen je buren een dakkapel, aanbouw of dakopbouw? Lees binnen welke termijn je bezwaar maakt, wanneer een zienswijze nodig is, wat je in je bezwaarschrift zet en wat je doet als ze al beginnen.",
  alternates: { canonical: PATH },
  openGraph: { title: "Bezwaar maken tegen een vergunning van de buren", url: PATH, type: "article" },
};

const FAQ: [string, string][] = [
  ["Hoe lang heb ik om bezwaar te maken tegen een vergunning van de buren?", "Bij de gewone (reguliere) procedure 6 weken. De termijn begint op de dag na de bekendmaking van het besluit, of nadat de gemeente het besluit naar je buren heeft gestuurd. Kijk in de bekendmaking voor de precieze datum: te laat is in principe te laat."],
  ["Kost bezwaar maken geld?", "Nee, een bezwaarschrift indienen bij de gemeente is gratis. Ga je daarna in beroep bij de rechtbank, dan betaal je griffierecht. Het actuele bedrag staat op rechtspraak.nl."],
  ["Mogen mijn buren al bouwen als ik bezwaar heb gemaakt?", "Ja. Een bezwaar houdt de vergunning niet tegen. Wil je de bouw laten stoppen tot er een beslissing is, dan vraag je de rechter om een voorlopige voorziening. Dat lukt alleen als het spoed heeft, bijvoorbeeld omdat er iets gebouwd wordt dat moeilijk terug te draaien is."],
  ["Wie mag bezwaar maken?", "Alleen een belanghebbende: iemand die er direct last van kan hebben. Bijvoorbeeld omdat je ernaast woont of uitkijkt op de plek waar gebouwd wordt."],
  ["Wat als mijn buren bouwen zonder vergunning?", "Veel kleine bouwwerken, zoals een dakkapel aan de achterkant of een kleine aanbouw, zijn vaak vergunningvrij. Dan is er geen besluit en kun je geen bezwaar maken. Denk je dat het niet vergunningvrij is, dan kun je de gemeente vragen om te handhaven (een handhavingsverzoek)."],
  ["Wat is het verschil tussen bezwaar en een zienswijze?", "Bij de reguliere procedure maak je bezwaar ná het besluit. Bij de uitgebreide procedure (vaak grotere of ingewikkelde plannen) is er eerst een ontwerpbesluit: daar dien je binnen 6 weken een zienswijze in. Daarna is er geen bezwaar, maar ga je direct in beroep bij de rechtbank."],
];

export default function Bezwaar() {
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: "Bezwaar maken tegen een vergunning van de buren", dateModified: BIJGEWERKT, inLanguage: "nl-NL", mainEntityOfPage: `${SITE_URL}${PATH}`, publisher: { "@type": "Organization", name: "Wiewoonteropditadres.nl", url: SITE_URL } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ];
  return (
    <div className="wrap sec tekst gids">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="small muted"><Link href="/">Home</Link> › Bezwaar tegen een vergunning</p>
      <h1>Bezwaar maken tegen een vergunning van de buren</h1>
      <aside className="snel" style={{ margin: "14px 0 20px" }}>
        <span className="kicker">Snel antwoord</span>
        <p>Je hebt <b>6 weken</b> na de bekendmaking om <b>bezwaar</b> te maken bij de gemeente. Het is gratis. Bij grote plannen (uitgebreide procedure) dien je eerst een <b>zienswijze</b> in op het ontwerpbesluit en ga je daarna in beroep. Let op: een bezwaar houdt de bouw <b>niet</b> tegen.</p>
      </aside>

      <h2>Bekijk welke vergunningen er bij jou in de buurt zijn</h2>
      <p>Typ je adres: je ziet de aanvragen en verleende vergunningen in de buurt, met per vergunning tot wanneer bezwaar mogelijk is.</p>
      <Zoek />

      <h2>Stap 1: welke procedure is het?</h2>
      <div className="tabel">
        <table>
          <thead><tr><th></th><th>Reguliere procedure</th><th>Uitgebreide procedure</th></tr></thead>
          <tbody>
            <tr><td>Wanneer</td><td>De meeste verbouwingen: dakkapel, aanbouw, dakopbouw, kappen</td><td>Grotere of ingewikkelde plannen, vaak met een ontwerpbesluit vooraf</td></tr>
            <tr><td>Wat doe jij</td><td><b>Bezwaar</b> na het besluit</td><td><b>Zienswijze</b> op het ontwerpbesluit</td></tr>
            <tr><td>Termijn</td><td>6 weken na de bekendmaking van het besluit</td><td>6 weken terwijl het ontwerp ter inzage ligt</td></tr>
            <tr><td>Bij wie</td><td>De gemeente (college van B&amp;W)</td><td>De gemeente</td></tr>
            <tr><td>Daarna</td><td>Beroep bij de rechtbank (binnen 6 weken)</td><td>Direct beroep bij de rechtbank (binnen 6 weken)</td></tr>
          </tbody>
        </table>
      </div>
      <p>In de bekendmaking staat welke procedure het is en wat je kunt doen. Op onze adrespagina staat bij elke vergunning een link naar de bekendmaking.</p>

      <h2>Stap 2: ben je belanghebbende?</h2>
      <p>Alleen wie er direct last van kan hebben, mag bezwaar maken. Bijvoorbeeld omdat je ernaast woont, uitkijkt op de bouwplek of minder licht krijgt. Woon je verder weg, dan wordt je bezwaar vaak niet behandeld.</p>

      <h2>Stap 3: schrijf je bezwaarschrift</h2>
      <p>Een bezwaarschrift mag een gewone brief of e-mail zijn; veel gemeenten hebben ook een online formulier. Zet erin:</p>
      <ul>
        <li>je naam, adres en de datum;</li>
        <li>om welk besluit het gaat (het adres van de buren, de datum en het kenmerk of zaaknummer uit de bekendmaking);</li>
        <li><b>waarom</b> je het er niet mee eens bent, zo concreet mogelijk: bijvoorbeeld strijd met het omgevingsplan, te hoog, te dicht op de erfgrens, minder licht of privacy;</li>
        <li>je handtekening.</li>
      </ul>
      <p>Heb je nog niet alle redenen op papier? Dien dan binnen de termijn een kort bezwaar in en schrijf erbij dat je de redenen later aanvult.</p>

      <h2>Stap 4: wat gebeurt er daarna?</h2>
      <p>De gemeente bekijkt je bezwaar; vaak mag je het toelichten bij een hoorzitting. Je buren mogen in de tussentijd al bouwen, want een bezwaar houdt de vergunning niet tegen. Wil je dat de bouw stopt tot er een beslissing is, dan kun je de rechter om een <b>voorlopige voorziening</b> vragen. Dat lukt alleen als het spoed heeft.</p>
      <p>Ben je het niet eens met de beslissing op je bezwaar, dan kun je binnen 6 weken in beroep bij de rechtbank. Daarvoor betaal je griffierecht.</p>

      <h2>Bouwen je buren zonder vergunning?</h2>
      <p>Veel kleine bouwwerken zijn vergunningvrij, zoals vaak een dakkapel aan de achterkant of een kleine aanbouw. Dan is er geen besluit en geen bezwaar mogelijk. Denk je dat het niet vergunningvrij is, dan kun je de gemeente vragen om te handhaven. Praat eerst met je buren: dat lost vaak meer op dan een procedure.</p>

      <h2>Veelgestelde vragen</h2>
      <div className="faq">{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>

      <p className="bronnen small muted">Bijgewerkt op 23 november 2026. Dit is algemene informatie, geen juridisch advies: kijk voor jouw situatie in de bekendmaking of vraag het je gemeente of het Juridisch Loket. Bronnen: <a href="https://www.rijksoverheid.nl/documenten/vraag-en-antwoord/bouwregelgeving/kan-ik-bezwaar-maken-tegen-de-bouwplannen-of-omgevingsvergunning-van-mijn-buren" target="_blank" rel="noopener">Rijksoverheid</a>, <a href="https://iplo.nl/regelgeving/overzicht-procedures/inspraak-rechtsbescherming-omgevingswet/" target="_blank" rel="noopener">IPLO (Omgevingswet)</a>, <a href="https://www.juridischloket.nl/wonen-en-buren/buren/bezwaar-omgevingsvergunning-buren/" target="_blank" rel="noopener">Juridisch Loket</a> en <a href="https://www.rechtspraak.nl/onderwerpen/omgevingsvergunning" target="_blank" rel="noopener">Rechtspraak</a>.</p>
    </div>
  );
}
