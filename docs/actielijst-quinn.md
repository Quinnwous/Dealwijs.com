# Actielijst Quinn — dingen die alleen jij kunt regelen

Bijgewerkt: 10 juni 2026, avond. Alles hieronder blokkeert een stap uit het
[masterplan](masterplan.md); de rest doe ik. Volgorde = prioriteit.

## 1. `dealwijs.nl` + `dealwijs.com` registreren — ~5 min, ~€20/jr samen
Bij een registrar naar keuze (TransIP, Versio, ...). Beide zijn per WHOIS bevestigd
vrij (10-6). De .com dekt internationaal meteen af. ("Dealwise" was geen optie:
dealwise.com/.nl/.eu zijn bezet en er bestaat al een YC-startup Dealwise in de
M&A-hoek.) **Waarom eerst:** naam claimen vóór de eerste post; alles hierna hangt
aan het domein.
Stel meteen e-mailforwarding in: `privacy@dealwijs.nl` → je eigen mail (de
privacypagina verwijst ernaar; bij de meeste registrars 2 min werk).

## 2. Vercel: inloggen met de CLI — ~1 min ✅ account · ✅ CLI · ☐ login
Account is er en de CLI is geïnstalleerd (projectlokaal). Enige wat rest: draai in
de terminal `npx vercel login` (opent je browser, één klik bevestigen). Daarna doe
ik de deploy, het domein-koppelen en Analytics.

## 3. AI Gateway API-key — ~5 min, pay-as-you-go (centen per analyse)
In het Vercel-dashboard → AI Gateway → API key aanmaken → plak 'm in `.env.local`
als `AI_GATEWAY_API_KEY=...`. **Waarom:** dan gaan de AI-verbouwschatting en de
samenvatting live; nu is het rapport puur deterministisch.

## 4. Altum-key roteren — ~5 min
Op [altum.ai](https://altum.ai) → dashboard → nieuwe API-key genereren, oude
intrekken, nieuwe in `.env.local` zetten als `ALTUM_API_KEY=...`.
**Waarom:** de huidige key heeft in een chatgesprek gestaan; vóór publieke launch
vervangen.

## 5. GitHub-repo — ✅ KLAAR (code gepusht)
Repo: https://github.com/Quinnwous/Dealwise — code staat erop (main).
Optioneel, 30 sec: hernoem de repo naar `dealwijs` (Settings → Repository name)
voor consistentie met het naamsbesluit; GitHub redirect de oude URL automatisch.

## 6. Marketingvriend inplannen — week van 22 juni
Eerste "Deal van de week"-video staat gepland in week 26. Draaiboek ligt klaar:
[groei/deal-van-de-week-draaiboek.md](groei/deal-van-de-week-draaiboek.md).
Eén belletje deze week om de afspraak vast te zetten is genoeg.

---

**Daarna kan ik door met:** deploy + domein + Analytics (na #1+#2), AI-laag live
(na #3), testdeals + screenshots als contentvoorraad (na deploy), en de
validatieronde uit week 26 voorbereiden ([groei/validatie-kit.md](groei/validatie-kit.md)).
