# Fase 0 — Altum AI data-feasibility

**Datum:** 2026-06-09 · **Verdict: GO ✅**

De data is bruikbaar, legaal en betaalbaar (met caching + gating). We bouwen de data-laag hierop.

## Bevestigd (live getest)
- **Endpoints:** `POST https://api.altum.ai/avm` en `POST https://api.altum.ai/woz`.
- **Auth:** header `x-api-key`; `Content-Type: application/json`.
- **Request body:** `{ postcode, housenumber, houseaddition? }` (AVM accepteert ook optionele `energylabel`, `innersurfacearea`, `housetype`, `buildyear`, `valuationdate`).

## Wat we terugkrijgen
**AVM (1 call)** — `Output`:
- `PriceEstimation` (geschatte marktwaarde), `Confidence` (interval), `AccuracyIndicator`
- `HouseType`, `BuildYear`, `InnerSurfaceArea`, `OuterSurfaceArea`, `Volume`, `EnergyLabel`, coördinaten, `BagID`
- → dekt marktwaarde + woningkenmerken + energielabel in één call.

**WOZ (1 call)** — `Output.wozvalue[]`: historie `{ Date, Value }` incl. de laatste (2025) → **grondslag voor box 3**.

**Voorbeeld** (Vondelpark 1, 1071AA): AVM €879.225 (90% CI €791k–€967k); WOZ 2025 €1.321.000.

## Kosten / unit-economics
- €0,47 per geslaagde call → **~€0,94 per analyse** (AVM + WOZ). Gratis tier ~50 credits; alleen 200-responses kosten een credit.
- Break-even op datakosten ≈ **30 analyses/maand per gebruiker** bij €29/mnd.

## Aandachtspunten
- **Rate limit:** de gratis tier knijpt hard (429 bij snelle opeenvolgende calls). Oplossing: ~1,5s tussen calls + retry/backoff. Productie-plan-limieten nog bevestigen.
- **Caching verplicht:** cache per `BagID`/adres om herhaalkosten te vermijden.
- **Gating gratis gebruikers** (paar analyses gratis) om datakost te beheersen.

## Data-aanpak voor de app
Per analyse: 1× AVM + 1× WOZ (sequentieel, kleine delay) → in de reken-engine. Cachen op `BagID`.

## Open / later
- Paid-plan rate limits + prijzen bevestigen.
- Overweeg Kadaster-transactie-API + woningreferentie-API (comparables) voor scherpere ARV bij flips, en Vraagprijs-API.
