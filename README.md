# Dealwijs

**Is deze woning een goede deal?** Vul een adres in en krijg in seconden een onderbouwd
oordeel (GO / TWIJFEL / NO-GO) voor flippen of verhuren — onder de Nederlandse regels van 2026.

**Masterplan (week-afvinklijst): [docs/masterplan.md](docs/masterplan.md)** ·
Concept: [docs/product/concept-en-ontwerp.md](docs/product/concept-en-ontwerp.md) ·
Data-feasibility: [docs/product/data-feasibility-altum.md](docs/product/data-feasibility-altum.md) ·
Go-to-market: [docs/groei/go-to-market.md](docs/groei/go-to-market.md)

## Wat het doet

- **Live woningdata** via Altum AI (Kadaster-bronnen): AVM-marktwaarde, WOZ, kenmerken, energielabel.
- **Deterministische reken-engine** (`lib/rules/`) — alle fiscale en financiële sommen in code:
  - Overdrachtsbelasting 2026 (8% belegger / 2% hoofdverblijf / 10,4% bedrijf)
  - Box 3 op WOZ (6% forfait × 36%), kosten koper, verkoopkosten
  - Flip-marge & ROI, bruto-/nettorendement verhuur
  - **WWS-punten-indicatie** (Wet betaalbare huur): gereguleerd of vrije sector, incl. WOZ-cap
    en maximale huur — het oordeel rekent automatisch met de wettelijk toegestane huur.
- **AI-laag** (`lib/ai/`, Claude via Vercel AI Gateway) — alléén voor fuzzy taken:
  verbouwkosten-raming uit een omschrijving + leesbare samenvatting met risico's.
  Zonder API-key blijft alles werken (rapport is dan puur deterministisch).
- **Kostenbescherming**: per-IP rate limit (default 5 analyses/dag).

## Starten

```bash
cp .env.local.example .env.local   # vul minimaal ALTUM_API_KEY in
npm install
npm run dev                        # → http://localhost:3000
```

| Env-var | Nodig voor | Zonder |
|---|---|---|
| `ALTUM_API_KEY` | woningdata (verplicht) | analyse faalt |
| `AI_GATEWAY_API_KEY` | AI-verbouwschatting + samenvatting | rapport zonder AI-velden |

## Ontwikkelen

```bash
npm test          # vitest — reken-engine, WWS, orchestrator, rate limit
npx tsc --noEmit  # types
npm run lint
npm run build
# live e2e (kost ~2 Altum-credits):
node --env-file=.env.local --import tsx scripts/analyse-run.ts verhuur
```

Architectuur: `app/page.tsx` (hero-flow + rapport) → `app/api/analyse/route.ts` →
`lib/analyse.ts` (orchestrator) → `lib/altum.ts` + `lib/rules/*` + `lib/ai/*` → `DealReport`.

Belangrijk principe: **belastingen en financiële wiskunde zitten in code** (toetsbaar,
deterministisch, met peildatum-2026-constanten in `lib/rules/constants.ts`); AI raakt alleen
de verbouwschatting en de tekstuele duiding.
