import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
import Tracker from "@/components/Tracker";
import Menu from "@/components/Menu";
import CookieBalk from "@/components/CookieBalk";
import { GIDSEN } from "@/lib/nav";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

// Fonts self-hosted by next/font (downloaded at build time): visitors send nothing to Google.
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-inter" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap", variable: "--font-head" });

// NOINDEX=1 on a temporary address: search engines must not index the test site.
const noindex = process.env.NOINDEX === "1";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Wie woont er op dit adres? Alles over de woning en de buurt", template: "%s | Wiewoonteropditadres.nl" },
  description: "Typ een adres en zie direct wat openbaar is: bouwjaar, oppervlakte, de buurt, de WOZ-waarde, vergunningen in de buurt en waar je de eigenaar opvraagt. Namen van bewoners zijn privé.",
  robots: noindex ? { index: false, follow: false } : undefined,
  openGraph: { type: "website", siteName: "Wiewoonteropditadres.nl", locale: "nl_NL" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        {/* Who is behind the site and what it is (search engines and AI assistants read this). */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": [
          { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Wiewoonteropditadres.nl", inLanguage: "nl-NL", description: "Wat openbaar is over een adres: de woning, de buurt en vergunningen in de buurt." },
        ] }) }} />
        <Menu />
        <main>{children}</main>
        <Tracker />
        <CookieBalk />
        <footer className="foot">
          <div className="wrap">
            <div className="foot-cols">
              <div><b>Wiewoonteropditadres.nl</b><p>Alles wat openbaar is over een woning en de buurt, op één plek. Namen van bewoners tonen we nooit: die zijn privé.</p><p className="small">Geen cookies om je te volgen. Ingevulde adressen worden niet bewaard.</p></div>
              <div><b>Opzoeken</b><Link href="/">Adres zoeken</Link>{GIDSEN.filter((g) => g.href !== "/bezwaar-vergunning-buren/").map((g) => <Link key={g.href} href={g.href}>{g.kort}</Link>)}</div>
              <div><b>Buren en vergunningen</b><Link href="/bezwaar-vergunning-buren/">Bezwaar tegen een vergunning</Link></div>
              <div><b>Over</b><Link href="/bronnen/">Waar komen de gegevens vandaan?</Link><Link href="/privacy/">Privacy</Link></div>
            </div>
            <p className="foot-bottom">Bronnen: BAG en luchtfoto (PDOK), CBS Kerncijfers wijken en buurten, Officiële Bekendmakingen · © {new Date().getFullYear()} Wiewoonteropditadres.nl</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
