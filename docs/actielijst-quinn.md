# Actielijst Quinn — dingen die alleen jij kunt regelen

Bijgewerkt: 10 juni 2026, avond. Alles hieronder blokkeert een stap uit het
[masterplan](masterplan.md); de rest doe ik. Volgorde = prioriteit.

## 1. `dealwijs.nl` registreren — ~5 min, ~€10/jr
Bij een registrar naar keuze (TransIP, Versio, ...). Check daar ook of `dealwijs.com`
echt vrij is en neem 'm mee als dat zo is. **Waarom eerst:** naam claimen vóór de
eerste post; alles hierna hangt aan het domein.

## 2. Vercel-account aanmaken — ~5 min, gratis
Op [vercel.com](https://vercel.com) (inloggen met GitHub kan handig zijn, zie #5).
**Waarom:** zonder account geen deploy. Zodra het er is, doe ik de deploy, het
domein-koppelen en Analytics. Installeer daarna lokaal de CLI en log in:
`npm i -g vercel && vercel login` (de login-stap moet jij doen, browser-auth).

## 3. AI Gateway API-key — ~5 min, pay-as-you-go (centen per analyse)
In het Vercel-dashboard → AI Gateway → API key aanmaken → plak 'm in `.env.local`
als `AI_GATEWAY_API_KEY=...`. **Waarom:** dan gaan de AI-verbouwschatting en de
samenvatting live; nu is het rapport puur deterministisch.

## 4. Altum-key roteren — ~5 min
Op [altum.ai](https://altum.ai) → dashboard → nieuwe API-key genereren, oude
intrekken, nieuwe in `.env.local` zetten als `ALTUM_API_KEY=...`.
**Waarom:** de huidige key heeft in een chatgesprek gestaan; vóór publieke launch
vervangen.

## 5. (Aanrader) GitHub-repo aanmaken — ~5 min
De code staat nu alleen lokaal in git. Privé-repo op GitHub = backup + Vercel
deployt dan automatisch bij elke commit. Maak 'm aan en geef mij de URL, dan
koppel ik 'm.

## 6. Marketingvriend inplannen — week van 22 juni
Eerste "Deal van de week"-video staat gepland in week 26. Draaiboek ligt klaar:
[groei/deal-van-de-week-draaiboek.md](groei/deal-van-de-week-draaiboek.md).
Eén belletje deze week om de afspraak vast te zetten is genoeg.

---

**Daarna kan ik door met:** deploy + domein + Analytics (na #1+#2), AI-laag live
(na #3), testdeals + screenshots als contentvoorraad (na deploy), en de
validatieronde uit week 26 voorbereiden ([groei/validatie-kit.md](groei/validatie-kit.md)).
