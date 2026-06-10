# Dealwijs — Masterplan

**Dit is hét afvinkdocument.** Eén plek voor het grote plaatje en de weekplanning.
Details staan in de gelinkte documenten; hier wordt afgevinkt.

- Concept & ontwerp: [product/concept-en-ontwerp.md](product/concept-en-ontwerp.md)
- Data-feasibility (Fase 0): [product/data-feasibility-altum.md](product/data-feasibility-altum.md)
- Go-to-market: [groei/go-to-market.md](groei/go-to-market.md)
- **Acties voor Quinn (blokkeert de rest): [actielijst-quinn.md](actielijst-quinn.md)**

---

## 1. Noord-ster

> **€50.000 per maand terugkerende omzet (MRR), binnen 1 à 2 jaar.**
> Streefdatum: **juni 2027** · uiterste datum: **juni 2028**.

Wat dat concreet betekent bij de huidige pricing-hypothese:

| Gemiddelde omzet per klant | Aantal betalende klanten nodig |
|---|---|
| €39/mnd (alleen Pro) | ~1.280 |
| €49/mnd (mix Pro + €99-tier) | ~1.020 |

Geen flashy bedrijf nodig — wél een groeiend product met terugkerende omzet,
gebouwd met AI als hefboom op een echt gat in de markt (NL-accurate
vastgoed-deal-analyse die Amerikaanse tools en kale ChatGPT niet kunnen).

**Bewaak de unit-economics:** datakosten ~€0,94 per analyse (Altum). Cache +
gratis-limiet beschermen de marge; abonnement moet ruim boven datakosten per
gebruiker blijven.

## 2. Waar we staan (10 juni 2026)

- ✅ Fase 0 — datapad gevalideerd (Altum AVM + WOZ, GO)
- ✅ Fase 1 — MVP feature-complete: reken-engine 2026, WWS-moat, AI-laag, rapport-UI, rate limit. 23/23 tests groen.
- ⏳ Nog niet: live deployment, domein, AI-key, eerste vreemde gebruikers, omzet.

## 3. Mijlpalenpad naar €50k

| Wanneer | Mijlpaal | Bewijs |
|---|---|---|
| jun 2026 | Live op dealwijs.nl | werkende analyse voor iedereen |
| jul 2026 | Gevalideerd | 10+ vreemden draaiden echte deals; ≥5× "ja, ik zou betalen" |
| aug 2026 | Eerste omzet | betaalmuur live, eerste 5–10 betalende klanten |
| sep 2026 | **Beslismoment #1** | ≥10 betalende + retentie → opschalen; anders aanscherpen |
| dec 2026 | ~€2.000 MRR | ~60 betalende, contentmotor draait |
| mrt 2027 | ~€6.000 MRR | sourcing (€99-tier) in bèta |
| jun 2027 | ~€12.500 MRR | 1-jaars-checkpoint (streefpad: doorgroeien) |
| dec 2027 | ~€30.000 MRR | uitbreiding doelgroepen + kanalen |
| jun 2028 | **€50.000 MRR** | noord-ster behaald |

## 4. Weekplanning (afvinken)

Werkritme: ~24 u/week. De komende 4–6 weken staan concreet; daarna per maand
grof. Elke week wordt de eerstvolgende maand-regel uitgewerkt naar weekregels.

### Week 24 · 8–14 jun — Fundament af
- [x] MVP feature-complete (engine, WWS, AI-laag, UI, tests groen)
- [x] Go-to-market-plan v1
- [x] Map opgeruimd + masterplan opgesteld
- [x] Eerste git-commit (versiebeheer aan)
- [x] SEO-basics: robots, sitemap, metadata, JSON-LD (klaar vóór deploy)
- [x] Validatie-kit + "Deal van de week"-draaiboek voorbereid ([groei/](groei/))
- [x] Voorbeeldrapport-flow: demo zonder Altum-kosten (beschermt unit-economics)
- [ ] `dealwijs.nl` registreren (+ `.com` indien vrij) — ~€10/jr, 5 min → [actielijst](actielijst-quinn.md)

### Week 25 · 15–21 jun — Live
- [ ] Vercel-account + deploy
- [ ] Domein koppelen + Vercel Analytics aan (meet: bezoek → analyse → kopieer/deel)
- [ ] `AI_GATEWAY_API_KEY` instellen → AI-verbouwschatting + samenvatting live
- [ ] Altum-key roteren (stond in chat) vóór publieke launch
- [ ] 3 testdeals zelf draaien + screenshots (contentvoorraad)

### Week 26 · 22–28 jun — Validatie starten
- [ ] Validatie-DM naar 20 mensen → doel: 10 testers (berichten + tracker klaar in [validatie-kit](groei/validatie-kit.md))
- [ ] Eerste "Deal van de week"-video met marketingvriend ([draaiboek](groei/deal-van-de-week-draaiboek.md))
- [ ] Per tester de 4 leervragen vastleggen in de [validatie-kit](groei/validatie-kit.md)

### Week 27 · 29 jun–5 jul — Leren & verbeteren
- [ ] Feedback verwerken; één gerichte verbeterronde
- [ ] Betaalbereidheid peilen: ≥5× "ja, neem mijn geld" = GO voor betaalmuur
- [ ] Content-cadans vasthouden: 2 video's + 1 LinkedIn-post per week (vanaf nu standaard)

### Week 28–29 · 6–19 jul — Betalen bouwen
- [ ] Accounts (magic link) + Stripe-abonnement, Pro €29–49/mnd
- [ ] Gratis tier begrenzen op funnel-logica (proeven, niet professioneel gebruiken)
- [ ] Funnel meten: bezoek → analyse → registratie → betaald

### Week 30–31 · 20 jul–2 aug — Eerste omzet
- [ ] Testers converteren naar betaald
- [ ] Doel: eerste 5–10 betalende klanten
- [ ] Rate limit → Redis zodra verkeer dat vraagt

### Augustus (maand 3) — Tractie
- [ ] ≥10 betalende klanten (~€400+ MRR)
- [ ] Contentmotor stabiel (2 video's + 1 post/wk, vol te houden)
- [ ] Lichte SEO-start (tool-pagina's op koopintentie, geen longreads)

### September (maand 4) — Beslismoment #1
- [ ] Review tegen beslisregels (§5): opschalen of aanscherpen
- [ ] Doel: €750–1.000 MRR

### Okt–dec 2026 — Groeimachine
- [ ] €2.000 MRR eind 2026
- [ ] Fase-2-product starten: deal-sourcing / buy-box-alerts (€99-tier)
- [ ] Investeerder-update sturen (loopt + groeit een paar maanden = zijn instapcriterium)

### 2027 — Schalen
- [ ] Q1: sourcing bèta live · ~€6.000 MRR
- [ ] Q2: 1-jaars-checkpoint · ~€12.500 MRR
- [ ] H2: doelgroep verbreden (buy-and-hold, beginners, hold-vs-sell) · €30.000 MRR richting €50.000

## 5. Ritueel & beslisregels

**Wekelijkse review (zondag, 30 min):** vink af, schuif door wat niet af is,
maak de komende week concreet. Het plan is rollend — alleen de eerstvolgende
weken zijn hard.

**Momentum-regel:** elke week minimaal één zichtbaar resultaat naar buiten
(deploy, video, gesprek, feature). Geen weken die alleen "intern" zijn —
zichtbare voortgang is de brandstof.

**Pivot-trigger (beslismoment #1, sep 2026):** minder dan 10 betalende klanten
óf testers zien de waarde niet → niet harder duwen, maar concept aanscherpen
(segment, held-feature of prijs) bínnen de NL-vastgoeddata-moat. De engine,
data-laag en distributiekanalen blijven herbruikbaar.

**Niet doen (v1):** geen sourcing vóór tractie, geen buitenland, geen mobiele
app, geen SEO-longreads, geen accounts-complexiteit vóór de betaalmuur —
zie [concept §17](product/concept-en-ontwerp.md) en [go-to-market](groei/go-to-market.md).
