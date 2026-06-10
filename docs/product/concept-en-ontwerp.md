# Concept & Ontwerp — *Dealwijs* (werktitel)
### AI-deal-analyse voor Nederlands beleggingsvastgoed

> **Status:** Concept goedgekeurd 2026-06-09. Volgende stap: bouwplan (writing-plans), nadat gebruiker naar plan mode schakelt.
> **Eénregel-pitch:** Plak een woning → krijg binnen seconden een NL-accuraat, na-belasting deal-oordeel (koop, opknappen, verkopen/verhuren) dat Amerikaanse tools en kale ChatGPT niet kunnen geven.

---

## 1. Samenvatting
We bouwen een schaalbaar, low-touch SaaS-product dat (aspirant) vastgoedkopers in Nederland in seconden vertelt of een woning een goede deal is. De eerste versie richt zich op **waarde-toevoegers (flippers en opknap-/BRRRR-kopers)**. Het product combineert legale officiële vastgoeddata (o.a. Altum AI / Kadaster) met een AI-laag die verbouwkosten inschat en het werkelijke rendement ná belasting berekent onder de complexe Nederlandse regels van 2026 (box 3, overdrachtsbelasting, huurpuntenstelsel/WWS). Distributie is content-gedreven. Verdienmodel is freemium-abonnement.

## 2. Visie & doel
Het grootste, best lopende en verdedigbare bedrijf bouwen door dé standaardtool te worden waarmee particuliere vastgoedkopers in Nederland (en later EU) hun aankoopbeslissingen onderbouwen. Korte termijn: een werkend, betalend MVP met zichtbare tractie binnen ~3 maanden. Lange termijn: schaalbaar platform (analyse → sourcing → portfolio).

## 3. Het probleem
Vastgoed kopen om waarde toe te voegen is in NL een rekensom vol valkuilen: aankoopkosten (incl. hoge beleggers-overdrachtsbelasting), verbouwkosten, waarde ná verbouwing, en — sinds 2026 — een sterk veranderd en complex belastingregime (box 3) en huurregulering (Wet betaalbare huur, WWS-puntenstelsel). De meeste kopers rekenen dit handmatig in Excel of op gevoel, en maken dure fouten. Er is geen tool die dit lokaal-accuraat en in seconden doet.

## 4. Waarom nu (timing)
- **Regelcomplexiteit piekt:** box 3 + Wet betaalbare huur maken de rendementsberekening zo ingewikkeld dat een tool die het juist doet acuut waardevol is.
- **Marktverschuiving = deal-flow:** in Q1 2026 werden ~83% meer huurwoningen te koop gezet dan een jaar eerder; gedwongen verkopers creëren koopkansen voor waarde-toevoegers.
- **Gratis aandacht:** het hele land praat over box 3 en vastgoedbeleggen — ideale content-golf voor goedkope distributie.
- **AI maakt solo-bouwen mogelijk:** een enkele oprichter kan nu bouwen wat in 2020 een ML-team vergde.

## 5. Het gat in de markt
- De volwassen deal-analyse/sourcing-tools (DealCheck, Mashvisor, PropStream, DealMachine, Homesage) zijn vrijwel allemaal **VS-gericht**; hun data en regels passen niet op NL.
- De Europese markt voor vastgoed-investeringssoftware is fors (~$1,87 mld in 2026, ~9,6% CAGR) maar voor NL/EU-particulieren grotendeels onbediend.
- De dichtstbijzijnde NL-speler, **Walter Living**, bedient **woningkopers** ("wat moet ik bieden", aankoopmakelaar-fee), **niet** beleggers/rendement/deal-analyse. Het beleggers-/waarde-toevoeg-segment ligt open.

## 6. Doelgroep
**Beachhead (v1): actieve waarde-toevoegers** — flippers en opknap-/BRRRR-kopers.
Waarom: zij kopen ongeacht de huur-neergang, hebben een keiharde ROI-behoefte (één deal = tienduizenden euro's), zijn goed bereikbaar via content, en sluiten aan op de bouwkennis in het netwerk van de oprichter (geloofwaardige verbouwkosten).
**Uitbreiding (later):** buy-and-hold-beleggers, beginnende beleggers (grootste funnel), en "verkopen of houden?" voor uittredende verhuurders.

## 7. Waardepropositie & held-functie
**"Woning erin → direct deal-oordeel."** In v1 voert de gebruiker een **adres + een paar kernvelden** in (vraagprijs, type, m², energielabel); automatisch uitlezen van een listing-URL is een latere uitbreiding (mits legaal, want Funda-scrapen mag niet). De gebruiker krijgt binnen seconden:
- **Echte totale aankoopkost** (incl. beleggers-overdrachtsbelasting — actueel tarief inbouwen, recent verlaagd richting ~8%, te verifiëren),
- **AI-verbouwkosten-inschatting** (op basis van foto's/omschrijving, met bouwkennis ingebakken; start met ranges),
- **Waarde ná verbouwing (ARV) + vergelijkbare verkopen** (via Altum AI AVM/referentie-data),
- **Marge / rendement / yield ná belasting** onder 2026-regels (box 3, WWS-huurpunten),
- **GO / NO-GO-score + de grootste risico's.**

## 8. De verdedigbare voorsprong (moat)
1. **NL-regel-engine** (box 3, overdrachtsbelasting, WWS/huurpunten, energielabel-impact) — VS-spelers kunnen dit niet, kale ChatGPT doet het niet betrouwbaar met echte data.
2. **Verbouwkosten-intelligentie** — gevoed door bouwdomein-kennis; wordt beter met gebruik/data.
3. **Lokale data-integraties** + opgebouwde gebruikersdata over deals.
4. **Distributie-voorsprong** via content (oprichter + marketing/video-contact).

## 9. Product
**MVP (v1) — één stroom, in weken live:** woning erin (handmatige invoer van een paar velden + adres) → deal-rapport eruit. Altum AI voor waarde/vergelijkbare verkopen; AI-laag voor verbouwschatting + leesbare samenvatting + score. Geen account-complexiteit, geen sourcing — puur het magische oordeel.
**Fase 2:** deal-**sourcing** — listings automatisch scannen tegen de "buy box" van de gebruiker en scoren. Daarna: opgeslagen deals, alerts, portfolio-overzicht.

## 10. Data-aanpak (legaal) — en het #1 risico
**Aanpak:** legale officiële bronnen — **Altum AI**-API's (Kadaster-transacties, woningwaarde-AVM, WOZ, referentie), aangevuld met CBS open data en EP-online (energielabels). **Géén commercieel Funda-scrapen** (verboden in hun voorwaarden + technisch geblokkeerd).
**#1 risico:** kosten en dekking van de data-API's kunnen de unit-economics raken. **Mitigatie/eerste actie:** Altum AI-prijzen en dekking valideren vóór serieus bouwen; resultaten cachen; gebruik koppelen aan abonnementstiers. Bij rood licht: bijsturen (meer user-input, alternatieve bronnen, partnerships).

## 11. Verdienmodel
Freemium SaaS.
- **Gratis:** enkele analyses / teaser-score → funnel + deelbaarheid.
- **Pro (~€29-49/mnd):** onbeperkte analyses, volledige rapporten, opgeslagen deals.
- **Hoger (~€99/mnd):** sourcing/buy-box-alerts, portfolio.
Eén goede deal verdient het abonnement jaren terug → makkelijke waardepropositie. Exacte prijzen testen we.

## 12. Distributie / go-to-market
Een schaalbaar product wint of verliest op distributie — dus vanaf **dag 1**, niet als bijzaak.
- **Content** rond NL-vastgoed / box 3 / flippen (TikTok, YouTube, Instagram, LinkedIn) — marketing/video-contact inzetten.
- **Inherente deelbaarheid:** mensen sturen deal-oordelen door.
- **SEO** op koopintentie ("is dit een goede belegging / wat is mijn rendement na box 3").
- Eventueel een **"deal van de week"-serie** aangedreven door de tool zelf.

## 13. Roadmap & eerste-tractie-mijlpalen
- **Week 1-2:** Altum AI prijs/dekking valideren + klikbaar prototype van de held-stroom.
- **Week 3-4:** werkende MVP; 10-20 wildvreemden uit de doelgroep echte deals laten doorrekenen → feedback + betaalbereidheid.
- **Maand 2-3:** eerste betalende gebruikers; content-motor draait.
- **Daarna:** sourcing (fase 2), uitbreiding doelgroep, prijsoptimalisatie.

## 14. Succescriteria / KPI's
- **Validatie (mnd 1):** ≥10 vreemden draaien een echte deal; duidelijk "ja, dit zou ik gebruiken/betalen"-signaal.
- **Tractie (mnd 3):** eerste betalende gebruikers; meetbare wekelijkse actieve gebruikers + groei.
- **Gezondheid:** positieve unit-economics (abonnement > datakosten per gebruiker), retentie, deel-/conversieratio gratis→betaald.

## 15. Risico's & mitigaties
| Risico | Mitigatie |
|---|---|
| Data-API-kosten drukken marge | Vroeg valideren, cachen, koppelen aan tiers |
| Verbouwkosten-nauwkeurigheid | Starten met ranges + bouwnetwerk; verfijnen met data |
| Distributie is de echte strijd | Content vanaf dag 1; deelbaarheid inbouwen |
| Markt-neergang verhuur | Beachhead bewust neergang-bestendig (waarde-toevoegers + deal-jacht) |
| Juridisch (advies-claim) | Positioneren als informatieve tool, niet als financieel/fiscaal advies + disclaimer |
| Solo-oprichter bandbreedte | Smalle MVP-scope; AI als bouwhefboom; YAGNI streng |

## 16. Juridisch & positionering
Het product geeft **informatie en berekeningen**, **geen** financieel of fiscaal advies — duidelijke disclaimer, zodat we buiten gereguleerd advies blijven. Datagebruik uitsluitend via legale bronnen/licenties (AVG-conform).

## 17. Buiten scope (YAGNI, v1)
Geen: deal-sourcing/scanning, accounts/teams, mobiele app, portfolio-beheer, buitenlandse markten, commercieel vastgoed, integraties met makelaarssystemen. Allemaal pas ná bewezen tractie op de held-stroom.

## 18. Open vragen / te valideren (eerste werk)
1. Altum AI: prijsmodel, dekking, snelheid — past dit binnen de unit-economics?
2. Actueel beleggers-overdrachtsbelastingtarief 2026 (recent gewijzigd) bevestigen.
3. Exacte box 3 / WWS-rekenregels die we in de engine bakken.
4. Hoeveel kan de AI-verbouwschatting betrouwbaar uit foto's/omschrijving halen vs. minimale user-input?
5. Werktitel/naam + domein.
