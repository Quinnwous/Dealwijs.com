# Actielijst Quinn

Bijgewerkt: 10 juni 2026, na deploy. De site is live op
[dealwijs.vercel.app](https://dealwijs.vercel.app).

## ✅ Afgerond

- ~~Domeinen registreren~~ — `dealwijs.nl` + `dealwijs.com` gekocht (TransIP)
- ~~Vercel~~ — account, CLI-login, project gelinkt, GitHub gekoppeld (auto-deploy bij elke push), eerste deploy live
- ~~GitHub-repo~~ — code staat op [Quinnwous/Dealwijs.com](https://github.com/Quinnwous/Dealwijs.com)
- ~~Altum-key roteren~~ — Quinn akkoord met huidige key (besluit 10-6); key staat als env-var op Vercel

## ☐ Nog te doen

### 1. Nameservers omzetten naar Vercel — 2 min per domein
Voor **dealwijs.nl** én **dealwijs.com**, in het TransIP-controlepaneel:
Domeinen → klik het domein → kopje **Domeinbeheer** → zet **TransIP-instellingen
UIT** (er verschijnt "Geavanceerd domeinbeheer") → **Nameservers** → wijzig in:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```
(derde veld leeg laten, opslaan)

Daarna beheert Vercel alle DNS automatisch — site én mail-records staan al klaar,
je hoeft daarna nooit meer iets met DNS te doen. Vercel mailt zodra de domeinen
geverifieerd zijn (kan een paar minuten tot enkele uren duren).

### 2. ImprovMX-account voor `privacy@dealwijs.nl` — 2 min, gratis
[improvmx.com](https://improvmx.com) → gratis account → *Add domain* `dealwijs.nl`
→ alias `privacy` → doorsturen naar je eigen mailadres. De benodigde MX/SPF-records
staan al in Vercel DNS klaar; het werkt zodra stap 1 doorgevoerd is.

### 3. AI Gateway-key — 3 min
[vercel.com dashboard](https://vercel.com) → **AI Gateway** → API Keys → *Create key*.
Plak hem in `.env.local` achter `AI_GATEWAY_API_KEY=` (placeholder staat klaar,
niet in de chat plakken) en zeg het even — dan zet ik 'm ook als env-var op Vercel.

### 4. Vercel Web Analytics aanzetten — 1 min
Dashboard → project **dealwijs** → tabblad **Analytics** → *Enable*. De code zit
al in de app; dit is alleen de schakelaar.

### 5. Marketingvriend inplannen — week van 22 juni
Eerste "Deal van de week"-video. Draaiboek ligt klaar:
[groei/deal-van-de-week-draaiboek.md](groei/deal-van-de-week-draaiboek.md).
