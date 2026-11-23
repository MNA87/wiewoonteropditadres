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
- Status: GEPAUZEERD. Gaat pas aan na "zet aan" van de eigenaar.

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

## Cookiemelding (eigenaar 23 nov: "zoals we al hebben voor laadpalen")
Zelfde melding als op de laadpaalpagina's van offertes.kvinl.nl:
- **Tekst**: "Wij gebruiken cookies" — "We gebruiken cookies om te meten welke advertenties werken, zodat we
  ze kunnen verbeteren. Meer info" (link naar /privacy).
- **Knoppen**: "Akkoord" en "Alleen noodzakelijk" (of "Weigeren"), **even groot en even makkelijk**, geen
  vooraf aangevinkte keuze.
- **Plek**: als balk **onderin beeld**, zodat de zoekbalk en de eerste antwoorden zichtbaar blijven (op de
  laadpaal bleek een melding midden over de vraag bezoekers te kosten). Alleen tonen aan bezoekers die via een
  advertentie komen (gclid/gbraid/wbraid in de URL); anderen zien hem niet zolang de site geen
  advertentiecookies zet.
- **Onthouden**: keuze 180 dagen, cookie `ww_gc=yes|no` (SameSite=Lax). Bij "Alleen noodzakelijk" niets van
  Google laden en de gclid niet meegeven.
- **Doorgeven aan de offertepagina** (zodat de bezoeker niet twee keer gevraagd wordt): bij "Akkoord" in de
  link naar offertes.kvinl.nl ook `&gc=yes` meegeven. ⚠️ De leads-app moet `gc=yes` nog overnemen als
  toestemming — dat bouwt de Ads-sessie in solvari-leads, en de privacytekst van offertes.kvinl.nl moet dat
  noemen (eigenaar beslist over die tekst). Tot dat klaar is: `&gc=yes` mag al mee, het wordt genegeerd.
- **Privacyverklaring** van wiewoonteropditadres.nl: noemen dat er bij akkoord een advertentie-klik-ID wordt
  bewaard/doorgegeven aan offertes.kvinl.nl om te meten welke advertenties werken.

## Te doen
- [x] YOOST: zet je eigen voorstel voor de Google-advertentie (koppen, beschrijvingen, zoekwoorden, ideeën) hieronder in een kopje "Voorstel YOOST". De Ads-sessie heeft het nog niet gezien en vergelijkt het met de campagne die nu klaarstaat.
- [ ] Bouwsessie: cookiemelding zoals hierboven, privacyverklaring aanvullen. Laat het de eigenaar zien voor live.
- [ ] Ads-sessie: `gc=yes` overnemen in de leads-app (na akkoord eigenaar over de privacytekst).
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
