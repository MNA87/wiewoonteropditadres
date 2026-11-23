import Link from "next/link";
import Zoek from "@/components/Zoek";
import { GIDSEN } from "@/lib/nav";
import { SITE_URL } from "@/lib/site";

// Shared layout of a guide: breadcrumb, quick answer, the address search, the text, FAQ (also as
// structured data), sources, and links to the other guides.
export default function Gids({ path, h1, kruimel, snel, faq, bronnen, bijgewerkt, zoekKop, zoekTekst, children }: {
  path: string; h1: string; kruimel: string; snel: React.ReactNode; faq: [string, string][]; bronnen: React.ReactNode; bijgewerkt: string;
  zoekKop: string; zoekTekst: string; children: React.ReactNode;
}) {
  const ld = [
    { "@context": "https://schema.org", "@type": "Article", headline: h1, dateModified: bijgewerkt, inLanguage: "nl-NL", mainEntityOfPage: `${SITE_URL}${path}`, publisher: { "@type": "Organization", name: "Wiewoonteropditadres.nl", url: SITE_URL } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` }, { "@type": "ListItem", position: 2, name: kruimel, item: `${SITE_URL}${path}` }] },
  ];
  const datum = new Date(bijgewerkt).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="wrap sec tekst gids">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <p className="small muted"><Link href="/">Home</Link> › {kruimel}</p>
      <h1>{h1}</h1>
      <aside className="snel" style={{ margin: "14px 0 20px" }}><span className="kicker">Snel antwoord</span><p>{snel}</p></aside>
      <h2>{zoekKop}</h2>
      <p>{zoekTekst}</p>
      <Zoek />
      {children}
      <h2>Veelgestelde vragen</h2>
      <div className="faq">{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
      <h2>Meer gidsen</h2>
      <ul>{GIDSEN.filter((g) => g.href !== path).map((g) => <li key={g.href}><Link href={g.href}>{g.titel}</Link></li>)}</ul>
      <p className="bronnen small muted">Bijgewerkt op {datum}. Dit is algemene informatie. Bronnen: {bronnen}.</p>
    </div>
  );
}
