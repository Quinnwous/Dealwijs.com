# Actielijst Quinn

Bijgewerkt: 10 juni 2026, na deploy. De site is live op
[dealwijs.vercel.app](https://dealwijs.vercel.app).

## ✅ Afgerond

- ~~Domeinen registreren~~ — `dealwijs.nl` + `dealwijs.com` gekocht (TransIP)
- ~~Vercel~~ — account, CLI-login, project gelinkt, GitHub gekoppeld (auto-deploy bij elke push), eerste deploy live
- ~~GitHub-repo~~ — code staat op [Quinnwous/Dealwijs.com](https://github.com/Quinnwous/Dealwijs.com)
- ~~Altum-key roteren~~ — Quinn akkoord met huidige key (besluit 10-6); key staat als env-var op Vercel

## ☐ Nog te doen

### 1. DNS-records instellen bij TransIP — 2 min
TransIP-controlepaneel → Domeinen → klik het domein → **DNS**. Voeg per domein toe:

| Domein | Type | Naam | Waarde |
|---|---|---|---|
| dealwijs.nl | A | @ | 76.76.21.21 |
| dealwijs.com | A | @ | 76.76.21.21 |

**Belangrijk: nameservers NIET omzetten naar Vercel** — dan stopt TransIP's gratis
e-mailforwarding (#2). De A-records zijn genoeg; Vercel verifieert automatisch en
mailt als het domein live is (paar minuten tot een uur).

### 2. E-mailforwarding `privacy@dealwijs.nl` — 2 min
TransIP-controlepaneel → Domeinen → `dealwijs.nl` → tabblad **E-mail** →
**E-mailforwards** (heet soms "Doorsturen") → nieuwe forward: `privacy` → je eigen
mailadres. (De privacypagina op de site verwijst naar dit adres.)

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
