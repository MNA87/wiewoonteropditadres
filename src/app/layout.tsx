import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_URL } from "@/lib/site";
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
        <header className="top">
          <div className="wrap top-in">
            <Link href="/" className="logo"><span aria-hidden>⌂</span> wiewoonteropditadres<span>.nl</span></Link>
          </div>
        </header>
        <main>{children}</main>
        <footer className="foot">
          <div className="wrap">
            <p><strong>Wiewoonteropditadres.nl</strong> toont alleen openbare gegevens over woningen en buurten. · <Link href="/privacy/">Privacy</Link></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
