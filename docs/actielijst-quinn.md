# Actielijst Quinn

Bijgewerkt: 10 juni 2026 (laat op de avond). De site is live op
[dealwijs.com](https://dealwijs.com). De AI Gateway-key staat nu op Vercel
(Production + Preview) en productie is herdeployd — **AI werkt live** ✅.
Afgeronde punten zijn verwijderd — wat hieronder staat is alles wat nog
open is.

## ☐ Nog te doen

### 1. Nameservers van `dealwijs.nl` alsnog omzetten — 2 min
`dealwijs.com` staat goed (✅ live), maar **dealwijs.nl wijst nog naar
TransIP** (nogmaals gecheckt 10-6 23:45 — de wijziging is daar nog steeds
niet doorgekomen). Check in het TransIP-controlepaneel: Domeinen →
**dealwijs.nl** → kopje **Domeinbeheer** → **TransIP-instellingen UIT**
(er verschijnt "Geavanceerd domeinbeheer") → **Nameservers** → wijzig in:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
(derde veld leeg laten, opslaan)

### 2. ImprovMX-check — 1 min
De MX-records van dealwijs.com wijzen correct naar ImprovMX ✅ (gecheckt
10-6). Alleen nog even in het ImprovMX-dashboard kijken of de alias
`privacy` heet óf een catch-all (`*`) is — anders bounct mail aan
`privacy@dealwijs.com`. De privacypagina verwijst naar het .com-adres,
dus dealwijs.nl heeft geen mail nodig.

### 3. Optioneel: `ALTUM_API_KEY` ook op Preview — 1 min
Staat nu alleen op Production. Preview-deploys (bijv. van een feature-branch)
kunnen daardoor geen echte woningdata ophalen. Alleen nodig als je
preview-deploys met echte data wilt testen. Zeg "zet de Altum-key ook op
Preview" tegen Claude, of doe het zelf in het Vercel-dashboard.

## ⏸ Geparkeerd (tot het product beter is)

- **Marketingvriend inplannen** voor de eerste "Deal van de week"-video.
  Bewust uitgesteld (besluit 10-6): eerst het product verbeteren. Draaiboek
  ligt klaar: [groei/deal-van-de-week-draaiboek.md](groei/deal-van-de-week-draaiboek.md).
