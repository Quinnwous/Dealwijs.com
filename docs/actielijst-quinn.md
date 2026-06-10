# Actielijst Quinn

Bijgewerkt: 10 juni 2026 (avond). De site is live op
[dealwijs.vercel.app](https://dealwijs.vercel.app). Afgeronde punten zijn
verwijderd — wat hieronder staat is alles wat nog open is.

## ☐ Nog te doen

### 1. Nameservers van `dealwijs.nl` alsnog omzetten — 2 min
`dealwijs.com` staat goed (✅ live), maar **dealwijs.nl wijst nog naar
TransIP-parking** — daar is de wijziging niet doorgekomen. Check in het
TransIP-controlepaneel: Domeinen → **dealwijs.nl** → kopje **Domeinbeheer** →
**TransIP-instellingen UIT** (er verschijnt "Geavanceerd domeinbeheer") →
**Nameservers** → wijzig in:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
(derde veld leeg laten, opslaan)

### 2. AI Gateway-key ook op Vercel zetten — 1 min
De key staat lokaal in `.env.local` ✅, maar moet ook als env-var op Vercel
(anders werkt AI straks niet in productie). Zeg "zet de key maar op Vercel"
tegen Claude (toestemming nodig), óf doe het zelf: dashboard → project
**dealwijs** → Settings → Environment Variables → naam `AI_GATEWAY_API_KEY`,
waarde uit `.env.local`, environments Production + Preview.

### 3. ImprovMX-check — 1 min
Kijk in ImprovMX of de alias `privacy` heet óf een catch-all (`*`) is —
anders bounct mail aan `privacy@dealwijs.com`. De privacypagina verwijst
naar het .com-adres, dus dealwijs.nl heeft geen mail nodig.

## ⏸ Geparkeerd (tot het product beter is)

- **Marketingvriend inplannen** voor de eerste "Deal van de week"-video.
  Bewust uitgesteld (besluit 10-6): eerst het product verbeteren. Draaiboek
  ligt klaar: [groei/deal-van-de-week-draaiboek.md](groei/deal-van-de-week-draaiboek.md).
