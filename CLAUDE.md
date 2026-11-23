@AGENTS.md

# Werkafspraken wiewoonteropditadres

- **Taal:** antwoord in het Nederlands, kort en duidelijk.
- **Nooit live zetten zonder sein** van de eigenaar ("push", "zet live"). Valideer met
  `npm run build` én `npx tsc --noEmit` (na de build: de `PageProps`-types maakt Next tijdens de build aan).
- **Deze Next.js is een nieuwe versie** (zie AGENTS.md): lees de gids in `node_modules/next/dist/docs/`.
- **Privacy:** nooit namen van bewoners, nooit gekochte adresdata. Alleen open overheidsdata (BAG/PDOK,
  CBS, Officiële Bekendmakingen), live opgehaald, met het jaar erbij. Ingevulde adressen niet bewaren.
- **Adrespagina's** (`/adres/<postcode>-<huisnummer>/`) zijn noindex en staan niet in de sitemap:
  geen duizenden automatische adrespagina's in Google. Alleen de homepage en vaste pagina's worden geïndexeerd.
- **Verdienblokken:** "Bespaar op deze woning" linkt naar de eigen offertepagina's (offertes.kvinl.nl,
  `bron=wiewoonteropditadres`, keuze per bouwjaar in `src/lib/partners.ts`). WOZ-bezwaar via Railway-variabele
  `PARTNER_WOZ_URL` (leeg = verborgen), alleen februari t/m april, met `rel="sponsored nofollow noopener"`.
- **Railway:** eigen project "wiewoonteropditadres" (service web, Europa). `NOINDEX=1` tot de eigenaar de site
  openzet; `GOOGLE_MAPS_EMBED_KEY` (beperkt tot de eigen domeinen en de Maps Embed API) voor het straatbeeld.
- **Proefversie** staat ook op enqueteplein.nl/proef/wiewoonteropditadres/ (kopie in de enqueteplein-repo).
- **Lokaal testen in deze omgeving:** `NODE_USE_ENV_PROXY=1 npx next start -p 3088` (de server moet via de proxy).
