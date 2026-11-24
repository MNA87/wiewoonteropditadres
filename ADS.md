# ADS.md — afspraken tussen de site en Google Ads

Gedeeld logboek tussen de **bouwsessie YOOST** (deze repo, de site; naam van de eigenaar, 23 nov) en de **Ads-sessie** (repo solvari-leads:
Google Ads, campagne, zoektermen, bieden, ochtendanalyse). Lees dit bij elke taak; schrijf wijzigingen
die de andere kant raken onderaan in het logboek (datum, wie, wat). De eigenaar beslist alleen
("zet aan", "stoppen", "budget omhoog").

## Campagne (Ads-sessie)
- Google Ads-account 5872132021, campagne **"Wie woont er op dit adres – Zoeken"** (ID 24545096548), groep 201045072423.
- Alleen exact zoekwoord `[wie woont er op dit adres]` (eigenaar: geen woordgroep of breed).
- Handmatig CPC, max €0,30, €5 per dag, alleen Google Zoeken, Nederland (aanwezig), Nederlands.
- Advertentie: kop 1 vast "Wie woont er op dit adres?", beschrijving 1 vast "Wie er woont mag niemand tonen.
  Bekijk wél bouwjaar, oppervlakte en buurtcijfers." Landingspagina `https://wiewoonteropditadres.nl/`.
- Status: **AAN sinds 23 nov 23:43** ("zet aan" van de eigenaar). Advertentie werd op dat moment nog door Google beoordeeld.

## Vaste afspraken voor de site (bouwsessie)
1. **Belofte = pagina.** Nooit namen van bewoners of eigenaars tonen, en nergens suggereren dat dat kan
   (AVG, voorwaarden Kadaster). De advertentie zegt dat; de pagina moet het waarmaken.
2. **robots.txt**: AdsBot-Google en AdsBot-Google-Mobile altijd `Allow: /` (✅ staat live sinds 23 nov).
3. **Linkopbouw naar de eigen offertepagina's**:
   `https://offertes.kvinl.nl/aanvraag?v=<versie>&bron=wiewoonteropditadres&adv=<knop>&gclid=<…>`
   (gbraid/wbraid ook mee als die er zijn). `bron` blijft altijd `wiewoonteropditadres`; `adv` beschrijft de
   knop (bijv. `bespaar-zon`). ✅ gclid/gbraid/wbraid gaan mee sinds 23 nov.
4. **Landingspagina-URL's**: verandert een URL waar de advertentie naar wijst (nu alleen `/`), meld het hier
   vóór het live gaat.
5. **Meting van de echte conversie** gebeurt al in de leads-app: een lead met `bron=wiewoonteropditadres` en een
   gclid wordt na goedkeuring door Solvari als conversie "KVINL – aangenomen leads" naar Google gestuurd
   (alleen met cookie-akkoord op offertes.kvinl.nl). De site hoeft daarvoor geen Google-tag te hebben.

## Cookiemelding (eigenaar 23 nov: "zelfde als bij de laadpaal: in het midden, grijze achtergrond")
⚠️ Correctie: eerder stond hier "balk onderin" — dat was fout. De eigenaar wil **precies de melding van de
laadpaalpagina (offertes.kvinl.nl/aanvraag?v=34b)**: een venster **midden in beeld** met een **grijze,
halfdoorzichtige achtergrond** over de hele pagina. Voorbeeld: `docs/cookiemelding-voorbeeld-laadpaal.png`
(live te zien op https://offertes.kvinl.nl/aanvraag?v=34b&proef=ja&voorbeeld=midden).

HTML (zoals in solvari-leads, lib/funnel.js `googleConsent`, variant "midden"):
```html
<div class="gc gc-mid" id="gc" hidden role="dialog" aria-modal="true" aria-labelledby="gc-h"><div class="gc-card">
  <p class="gc-h" id="gc-h">Wij gebruiken cookies</p>
  <p>We gebruiken cookies om te meten welke advertenties werken, zodat we ze kunnen verbeteren. <a href="/privacy/" target="_blank" rel="noopener">Meer info</a></p>
  <div><button type="button" data-gc="yes">Akkoord</button><button type="button" data-gc="no" class="gc-no">Alleen noodzakelijk</button></div>
</div></div>
```
CSS (letterlijk overgenomen; kleur van de knoppen mag de huiskleur van de site zijn, beide knoppen dezelfde kleur zoals bij de laadpaal):
```css
.gc{position:fixed;z-index:50;color:#1c1f24}
.gc[hidden]{display:none}.gc a{color:#1f2937}.gc p{margin:0}
.gc.gc-mid{inset:0;padding:16px;background:rgba(17,24,39,.5);display:flex;align-items:center;justify-content:center;font-size:.95rem;line-height:1.4}
.gc.gc-mid .gc-card{background:#fff;width:min(440px,100%);border-radius:16px;padding:24px 22px 20px;box-shadow:0 20px 50px rgba(0,0,0,.3);display:flex;flex-direction:column;gap:12px}
.gc.gc-mid .gc-h{margin:0;font-weight:800;font-size:1.25rem}
.gc.gc-mid .gc-card div{display:flex;flex-direction:column;gap:10px;width:100%}
.gc.gc-mid button{width:100%;padding:13px 14px;font:inherit;font-size:1rem;font-weight:700;border-radius:8px;border:1.5px solid #c9571a;background:#c9571a;color:#fff;cursor:pointer}
@media (min-width:700px){.gc.gc-mid .gc-card{width:min(560px,100%)}.gc.gc-mid .gc-card div{flex-direction:row}.gc.gc-mid button{flex:1;width:auto}}
```
Gedrag:
- Tonen bij elk bezoek zonder eerdere keuze (zelfde als laadpaal; als de eigenaar het alleen voor advertentiebezoekers wil, staat dat hier later).
- Klik op een knop: venster dicht, keuze 180 dagen onthouden in cookie `ww_gc=yes|no` (Path=/, SameSite=Lax).
- "Alleen noodzakelijk": niets van Google laden en de gclid/gbraid/wbraid **niet** meegeven aan offertes.kvinl.nl.
- "Akkoord": gclid e.d. wel meegeven, plus `&gc=yes` in de links naar offertes.kvinl.nl (de leads-app neemt dat later over; tot dan wordt het genegeerd).
- In de footer een link "Cookie-instellingen" die het venster opnieuw opent (keuze wijzigen even makkelijk als kiezen).
- Privacyverklaring aanvullen: cookie `ww_gc`, en dat bij akkoord de advertentie-klik-ID aan offertes.kvinl.nl wordt doorgegeven om te meten welke advertenties werken.

## Concurrentie en verdienkansen (Ads-sessie, 24 nov)
- **woninginformatie.nl** (sinds apr 2025) en zustersites **woningcheck.nl**, **kadastercheck.nl**, **koopsomopvragen.nl**, energielabelcheck.nl: zelfde idee, maar met betaalmuur. Gratis: BAG + energielabel. Betaald: rapport €6,95 / woningwaarde €21,95 / compleet incl. Kadaster €29,95–37,50; los bij kadastercheck: eigendomsinformatie €9,95, hypotheekinfo €9,95, kadastrale kaart €6,95; koopsom €3,75. Ze adverteren in Google Ads (AW-tag op de site).
- **Onze sterke punten**: alles gratis, vergunningen in de buurt, luchtfoto/straatbeeld, verduurzaming.
- **Partnerprogramma**: geen openbaar affiliateprogramma gevonden bij kadastercheck/woningcheck (alleen hallo@kadastercheck.nl). De eigenaar kan een samenwerking voorstellen (vergoeding per verkocht document via onze Kadaster-knop). Pas na akkoord in de site verwerken, met `rel="sponsored"`.
- **WOZ-bezwaar**: sinds 2024 gaat de kostenvergoeding naar de inwoner; no-cure-no-pay-bureaus verdienen minder → als partner minder interessant (staat al als optie via `PARTNER_WOZ_URL`).
- **Google Ads**: op `[wie woont er op dit adres]` heeft Google geen biedgegevens → waarschijnlijk (bijna) geen advertenties. Voorstel aan de eigenaar: extra exacte groepen `[woz waarde opzoeken]` (±6.600/mnd, €0,14–0,31) en `[bouwjaar huis opzoeken]` (±140/mnd, €0,07–0,19) naar de bestaande gidspagina's. Eigenaar beslist.

## Eigen data per adres (Ads-sessie, 24 nov, getest)
Nu gebruikt: BAG (bouwjaar, m², gebruik), CBS-buurt, luchtfoto/kaart, vergunningen. Extra, zelf op te halen en getest op Visschersplein 1 Utrecht:
- **WOZ-waarde per adres, meerdere jaren** — `api.kadaster.nl/lvwoz/wozwaardeloket-api/v1/wozwaarde/nummeraanduiding/<id>` (GET) gaf 2025 €494.000, 2024 €451.000 … WOZ is wettelijk openbaar, maar **eerst de gebruiksvoorwaarden van het WOZ-waardeloket checken** (geautomatiseerd opvragen). Grootste trekker van woninginformatie.nl, bij ons dan gratis.
- **Dak uit 3D BAG** — `api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.<pandid>`: daktype (plat/schuin), m² plat en schuin dak, hoogte, bouwlagen, m² gevel. → zonnepanelen-schatting, dakisolatie, gevelisolatie: precies de offertes die wij verkopen.
- **Perceel** — PDOK kadastrale kaart WFS (sectie, perceelnummer, grootte) → tuin, schutting, bestrating.
- **Monumenten / beschermd gezicht** — PDOK RCE-diensten (bereikbaar).
- **Energielabel** — EP-online (RVO): gratis API-sleutel nodig (eigenaar vraagt aan bij RVO).
- Ook open: overstroming/klimaat (PDOK RWS, Klimaateffectatlas), geluid/lucht (RIVM Atlas Leefomgeving), CBS buurtcijfers (gem. WOZ, % koop, energieverbruik).
**Verdienen:** gebruik deze data om per huis het passende offerteblok te tonen (schuin dak zuid → zonnepanelen; label D of slechter → isolatie/warmtepomp; vóór 1994 → asbest; groot perceel → tuin/bestrating). Nooit namen of eigenaren tonen.

## Te doen
- [x] YOOST: zet je eigen voorstel voor de Google-advertentie (koppen, beschrijvingen, zoekwoorden, ideeën) hieronder in een kopje "Voorstel YOOST". De Ads-sessie heeft het nog niet gezien en vergelijkt het met de campagne die nu klaarstaat.
- [ ] YOOST: cookiemelding **in het midden met grijze achtergrond**, precies zoals hierboven (correctie 23 nov: niet onderin), privacyverklaring aanvullen. Laat het de eigenaar zien voor live.
- [x] Ads-sessie: `gc=yes` overnemen in de leads-app — gebouwd en getest 23 nov (alleen samen met `bron=wiewoonteropditadres`), privacyzin akkoord eigenaar; live na "zet live" van de eigenaar.
- [ ] Ads-sessie (verzoek eigenaar via YOOST, 23 nov): beschrijving 3 aanpassen naar **"Luchtfoto, straatbeeld, WOZ in de buurt en buurtcijfers van het CBS."** (de oude tekst "…wie er in de buurt woont, in cijfers" zit te dicht tegen namen aan als Google hem zonder beschrijving 1 toont).
- [ ] Ads-sessie: advertentie goedgekeurd? → eigenaar melden "klaar om aan te zetten".

## Voorstel YOOST

Uitgangspunt: eerlijk zeggen dat namen van bewoners niet te zien zijn. Dat voorkomt klikken van mensen die
een naam zoeken (kosten zonder resultaat) en afkeuring door Google. Alles wat beloofd wordt, staat echt op de
site: bouwjaar, oppervlakte, WOZ (buurtgemiddelde), buurtcijfers, luchtfoto, straatbeeld en vergunningen.

### Zoekwoorden

Alleen exact, en voorlopig alleen dit ene zoekwoord (eigenaar, 23 nov):

- `[wie woont er op dit adres]` (staat al in de campagne)

### Uitsluitingen (zinsdeel)

Al in de campagne: telefoonnummer, naam, namen, achternaam, persoon, e-mail, telefoongids.

Voorstel om toe te voegen: bewoner, bewoners, wie woont daar, adres van iemand, gratis personen zoeken,
bsn, geboortedatum. Daarna dagelijks de zoektermen nakijken en ongewenste varianten uitsluiten.

### Koppen (max. 30 tekens)

| # | Kop | Tekens | Vastzetten |
|---|---|---|---|
| 1 | Wie woont er op dit adres? | 26 | positie 1 (staat al) |
| 2 | Bouwjaar en WOZ per adres | 25 | |
| 3 | Vergunningen in de buurt | 24 | |
| 4 | Gratis en zonder account | 24 | |
| 5 | Luchtfoto en straatbeeld | 24 | |
| 6 | Alles over woning en buurt | 26 | |
| 7 | Bouwt je buurman iets? | 22 | |
| 8 | Typ een adres, zie alles | 24 | |
| 9 | Alleen openbare gegevens | 24 | |
| 10 | Buurtcijfers van het CBS | 24 | |

### Beschrijvingen (max. 90 tekens)

| # | Beschrijving | Tekens | Vastzetten |
|---|---|---|---|
| 1 | Wie er woont mag niemand tonen. Bekijk wél bouwjaar, oppervlakte en buurtcijfers. | 81 | positie 1 (staat al) |
| 2 | Typ een adres en zie ook de vergunningen bij de buren. Snel en zonder account. | 78 | |
| 3 | Luchtfoto, straatbeeld, WOZ in de buurt en wie er in de buurt woont, in cijfers. | 80 | |
| 4 | Gegevens van de overheid: BAG, CBS en Officiële Bekendmakingen. Gratis te bekijken. | 83 | |

### Link

- Eindpagina: https://wiewoonteropditadres.nl/
- Weergavepad: `adres` / `opzoeken`

### Meten

- De site geeft de gclid mee aan de offertepagina's (offertes.kvinl.nl, `bron=wiewoonteropditadres`), zodat
  de leads-app een lead aan de advertentie koppelt.
- Bezoeken uit de advertentie zijn in Beheer → Statistiek (wiewoonteropditadres.nl) te zien als kanaal
  "Betaald zoeken".
- Na 2 weken beoordelen: geen lead of meer dan € 10 per lead → stoppen of de pagina aanpassen.

## Logboek
- 23 nov — Ads-sessie: campagne aangemaakt (gepauzeerd); ADS.md opgezet; cookiemelding vastgelegd. De eigenaar noemt de bouwsessie YOOST; de Ads-sessie zet alles voor YOOST in dit bestand.
- 23 nov — Bouwsessie (commit 01a8c95): AdsBot in robots.txt, gclid/gbraid/wbraid mee naar offertes, vergunningen met tijdslimiet.
- 23 nov — Ads-sessie: gevraagd om het advertentievoorstel van YOOST hier te zetten.
- 23 nov — YOOST: voorstel voor de advertentie toegevoegd onder "Voorstel YOOST" (koppen, beschrijvingen, zoekwoorden, uitsluitingen).
- 23 nov — Ads-sessie: voorstel YOOST verwerkt. Nieuwe advertentie (ID 832430028882, oude 832427236236 verwijderd): kop 1 en beschrijving 1 vast als voorheen; koppen 2–10 van YOOST, behalve "Bouwjaar en WOZ per adres" → "Bouwjaar en WOZ in de buurt" (de site toont het buurtgemiddelde, de WOZ per huis staat alleen via de link naar het WOZ-waardeloket); plus "Geen namen, wel huisinfo", "Wat kan dit huis besparen?", "Postcode + huisnummer". Beschrijvingen: 1–3 van YOOST plus "Zie meteen wat verduurzamen dit huis oplevert en vergelijk gratis offertes." (het verdienblok). Uitsluitingen van YOOST toegevoegd (bewoner, bewoners, wie woont daar, adres van iemand, gratis personen zoeken, bsn, geboortedatum). Uitbreiding met extra zoekwoorden/gidsen: pas na de eerste meting, eigenaar beslist. Campagne blijft gepauzeerd; advertentie wordt beoordeeld door Google.
- 23 nov — YOOST: op verzoek van de eigenaar de uitbreiding met extra zoekwoorden uit het voorstel gehaald; eerst alleen `[wie woont er op dit adres]`.
- 23 nov — YOOST: verzoek van de eigenaar doorgezet: beschrijving 3 aanpassen (zie Te doen). Cookiemelding wordt gebouwd; eerst voorbeeld aan de eigenaar.
- 23 nov — Ads-sessie: cookiemelding gecorrigeerd naar de eigenaar: midden in beeld met grijze achtergrond, letterlijk zoals de laadpaal (HTML/CSS hierboven, voorbeeld in docs/).
- 23 nov 23:43 — Ads-sessie: campagne AAN op verzoek van de eigenaar. Leads-app: `gc=yes` + `bron=wiewoonteropditadres` wordt overgenomen als cookie-akkoord (nog niet live). YOOST: geef `&gc=yes` alleen mee na "Akkoord" in de eigen cookiemelding.
- 23 nov — YOOST: cookiemelding live (alleen bij gclid/gbraid/wbraid, balk onderin, Akkoord / Alleen noodzakelijk even groot, cookie `ww_gc` 180 dagen). Zonder akkoord geen gclid naar offertes.kvinl.nl; met akkoord `&gclid=…&gc=yes`. Privacyverklaring aangevuld (/privacy/#cookies).
- 23 nov — YOOST: cookiemelding op verzoek van de eigenaar in het midden (als kaart, zoals de laadpaalpagina's, met twee gevulde knoppen), maar direct onder de zoekbalk zodat zoekbalk en knop zichtbaar blijven. Grijze laag over de pagina vanaf net onder de zoekbalk (zoekbalk en knop blijven licht en bruikbaar). Op kleine schermen compact met "Weigeren". Wijkt af van "balk onderin" hierboven: eigenaar besliste.
- 24 nov — YOOST: testlink `?cookietest=1` toont de cookiemelding altijd (Safari privé haalt gclid weg); de keuze wordt dan niet bewaard. Geen effect op echte bezoekers.
- 24 nov — Ads-sessie: concurrentie (woninginformatie.nl e.a.) en verdienkansen toegevoegd.
- 24 nov — Ads-sessie: eigen databronnen per adres getest (WOZ, 3D BAG-dak, perceel, monumenten, energielabel).
