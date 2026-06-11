# Actielijst Quinn

**Dit is dé levende lijst van alles wat alleen Quinn kan doen** (logins,
betalingen, permissies, beslissingen). Werkafspraak: stuit Claude op iets
dat hij niet kan, dan komt het hier bij en werkt hij door aan wat wél kan.
Afgeronde punten worden verwijderd.

Bijgewerkt: 11 juni 2026. De site is live op **beide domeinen**:
[dealwijs.com](https://dealwijs.com) én [dealwijs.nl](https://dealwijs.nl)
(nameservers doorgekomen, gecheckt 11-6 ✅). De AI Gateway-key staat op Vercel
(Production + Preview) en productie is herdeployd — **AI werkt live** ✅.

## ☐ Nog te doen

### 1. `www.dealwijs.com` koppelen in Vercel — 1 min
`www.dealwijs.nl` redirect netjes naar het hoofddomein, maar
**www.dealwijs.com geeft een SSL-fout** (certificaat dekt het subdomein
niet — het is nooit als domein aan het Vercel-project toegevoegd). Fix:
zeg "voeg www.dealwijs.com toe aan het Vercel-project" tegen Claude
(en geef de domeinwijziging toestemming), of doe het zelf: Vercel-dashboard →
project **dealwijs** → Settings → Domains → add `www.dealwijs.com` →
kies "Redirect to dealwijs.com".

### 2. ImprovMX-check — 1 min
De MX-records van dealwijs.com wijzen correct naar ImprovMX ✅ (gecheckt
10-6). Alleen nog even in het ImprovMX-dashboard kijken of de alias
`privacy` heet óf een catch-all (`*`) is — anders bounct mail aan
`privacy@dealwijs.com`. De privacypagina verwijst naar het .com-adres,
dus dealwijs.nl heeft geen mail nodig.

### 3. Akkoord: 3 testdeals draaien — 10 sec
Laatste open taak van week 25 (masterplan): 3 echte adressen analyseren als
kwaliteitscheck van de AI-duiding én als contentvoorraad. Kost ~€0,94
Altum-credits per analyse (~€3 totaal). Zeg "draai de testdeals" tegen
Claude (geef eventueel 3 adressen mee, anders kiest hij gevarieerde cases).

### 4. Keuze: Claude permissie geven voor Vercel-beheer — 2 min
Domein- en env-wijzigingen op Vercel worden nu geblokkeerd (zo ontdekt bij
het www-fixpunt hierboven). Wil je dat Claude dit soort beheer voortaan
zelf afhandelt, voeg dan in `.claude/settings.json` van dit project toe:
`"permissions": { "allow": ["Bash(npx vercel domains add:*)", "Bash(npx vercel env:*)"] }`
— of zeg "regel de Vercel-permissies" en Claude schrijft het bestand,
waarna jij het alleen hoeft te bevestigen.

### 5. Optioneel: `ALTUM_API_KEY` ook op Preview — 1 min
Staat nu alleen op Production. Preview-deploys (bijv. van een feature-branch)
kunnen daardoor geen echte woningdata ophalen. Alleen nodig als je
preview-deploys met echte data wilt testen. Zeg "zet de Altum-key ook op
Preview" tegen Claude, of doe het zelf in het Vercel-dashboard.

## ⏸ Geparkeerd (tot het product beter is)

- **Marketingvriend inplannen** voor de eerste "Deal van de week"-video.
  Bewust uitgesteld (besluit 10-6): eerst het product verbeteren. Draaiboek
  ligt klaar: [groei/deal-van-de-week-draaiboek.md](groei/deal-van-de-week-draaiboek.md).
