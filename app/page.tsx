"use client";

import { useEffect, useState } from "react";
import type { DealReport } from "@/lib/analyse";
import { SITE_URL } from "@/lib/site";

const euro = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const pct = (f: number) => `${(f * 100).toFixed(1)}%`;

const STEMPEL_CLASS: Record<string, string> = {
  "GO": "stempel stempel--go",
  "TWIJFEL": "stempel stempel--twijfel",
  "NO-GO": "stempel stempel--nogo",
};

const ANALYSE_STAPPEN = [
  "Woningdata ophalen (Kadaster / Altum)",
  "Marktwaarde & WOZ toetsen",
  "2026-regels doorrekenen",
  "AI-duiding schrijven",
];

export default function Home() {
  const [doel, setDoel] = useState<"flip" | "verhuur">("flip");
  const [metHypotheek, setMetHypotheek] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<DealReport | null>(null);
  const [voorbeeld, setVoorbeeld] = useState(false);

  async function toonVoorbeeld() {
    setError(null);
    try {
      const res = await fetch("/api/voorbeeld");
      if (!res.ok) throw new Error("Voorbeeld laden mislukte");
      setReport((await res.json()) as DealReport);
      setVoorbeeld(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);
    setVoorbeeld(false);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(
      [...fd.entries()].filter(([, v]) => typeof v !== "string" || v.trim() !== ""),
    );
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, metHypotheek: fd.get("metHypotheek") === "on" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Er ging iets mis");
      setReport(data as DealReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-10 lg:py-16">
      <header className="rij-in mb-10 lg:mb-14">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold tracking-tight text-groen-diep lg:text-5xl">
            Dealwijs
          </h1>
          <span className="text-sm uppercase tracking-[0.2em] text-ink-faint">
            deal-analyse voor NL vastgoed
          </span>
        </div>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          Is deze woning een goede deal? Vul een adres in en krijg een onderbouwd oordeel:
          kosten koper, marge en rendement <em>ná</em> belasting — onder de regels van 2026.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2 text-xs text-ink-soft">
          {["8% overdrachtsbelasting belegger", "Box 3 op WOZ", "Wet betaalbare huur (WWS)", "Geen account nodig"].map((t) => (
            <li key={t} className="rounded-full border border-line bg-white/60 px-3 py-1">
              {t}
            </li>
          ))}
        </ul>
      </header>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="rij-in lg:col-span-5" style={{ animationDelay: "0.08s" }}>
          <form onSubmit={onSubmit} className="akte space-y-5 rounded-2xl p-6 lg:sticky lg:top-8">
            <div className="grid grid-cols-[1fr_5.5rem_4.5rem] gap-3">
              <Field label="Postcode" name="postcode" placeholder="1071 AA" required />
              <Field label="Nr." name="housenumber" type="number" placeholder="12" required />
              <Field label="Toev." name="houseaddition" placeholder="A" />
            </div>

            <div>
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">Wat is het plan?</span>
              <div className="flex gap-2">
                {(["flip", "verhuur"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDoel(d)}
                    className={`flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                      doel === d
                        ? "border-groen-diep bg-groen-diep text-paper"
                        : "border-line bg-white/70 text-ink-soft hover:border-ink-faint"
                    }`}
                  >
                    {d === "flip" ? "Opknappen & verkopen" : "Verhuren"}
                  </button>
                ))}
                <input type="hidden" name="doel" value={doel} />
              </div>
            </div>

            <Field label="Aankoopprijs (€)" name="aankoopprijs" type="number" placeholder="350.000" required />

            <div className="rounded-xl border border-dashed border-line bg-white/50 p-4">
              <Field label="Verbouwkosten (€) — leeg = AI schat" name="verbouwkosten" type="number" placeholder="eigen budget" />
              <label className="mt-3 block">
                <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                  Staat & verbouwplannen
                </span>
                <textarea
                  name="omschrijving"
                  rows={3}
                  maxLength={2000}
                  placeholder="Bijv. jaren-70 staat: keuken en badkamer vervangen, enkel glas, cv-ketel uit 2009…"
                  className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none placeholder:text-ink-faint/70 focus:border-groen focus:ring-2 focus:ring-groen/15"
                />
                <span className="mt-1 block text-xs text-ink-faint">
                  Beschrijf de staat — de AI raamt dan een verbouwbudget met kostenposten.
                </span>
              </label>
            </div>

            {doel === "flip" ? (
              <Field
                label="Verwachte verkoopwaarde ná verbouwing (€, optioneel)"
                name="verwachteVerkoopwaarde"
                type="number"
                placeholder="leeg = marktwaarde-schatting"
              />
            ) : (
              <Field
                label="Beoogde maandhuur (€, optioneel)"
                name="maandhuur"
                type="number"
                placeholder="leeg = schatting"
              />
            )}

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  name="metHypotheek"
                  checked={metHypotheek}
                  onChange={(e) => setMetHypotheek(e.target.checked)}
                  className="h-4 w-4 rounded border-line accent-[var(--groen)]"
                />
                Met hypotheek financieren
              </label>
              {metHypotheek && doel === "verhuur" && (
                <Field label="Hypotheekschuld op het pand (€)" name="schuld" type="number" placeholder="200.000" />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-groen-diep py-3 font-semibold text-paper transition hover:bg-groen disabled:opacity-60"
            >
              {loading ? "Analyseren…" : "Geef mij het oordeel"}
            </button>

            {error && (
              <p className="rounded-lg border border-[var(--rood)]/30 bg-[var(--rood-bg)] px-4 py-3 text-sm text-[var(--rood)]">
                {error}
              </p>
            )}
          </form>
        </div>

        <div className="rij-in lg:col-span-7" style={{ animationDelay: "0.16s" }}>
          {loading ? (
            <AnalyseVoortgang />
          ) : report ? (
            <Report report={report} voorbeeld={voorbeeld} />
          ) : (
            <Uitleg onVoorbeeld={toonVoorbeeld} />
          )}
        </div>
      </div>

      <footer className="mt-14 border-t border-line pt-5 text-xs text-ink-faint">
        Dealwijs is een informatieve rekentool — geen financieel, fiscaal of juridisch advies.
        Woningdata via Altum AI (Kadaster-bronnen). Cijfers zijn indicatief; controleer vóór aankoop alles met je adviseur.{" "}
        <a href="/privacy" className="underline underline-offset-2 hover:text-ink-soft">
          Privacy
        </a>
      </footer>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-line bg-white px-3 py-2 text-ink outline-none placeholder:text-ink-faint/70 focus:border-groen focus:ring-2 focus:ring-groen/15"
      />
    </label>
  );
}

function AnalyseVoortgang() {
  const [stap, setStap] = useState(0);
  useEffect(() => {
    const t = setInterval(
      () => setStap((s) => Math.min(s + 1, ANALYSE_STAPPEN.length - 1)),
      3500,
    );
    return () => clearInterval(t);
  }, []);
  return (
    <div className="akte rounded-2xl p-8">
      <p className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
        Rapport wordt opgemaakt…
      </p>
      <ul className="mt-6 space-y-3">
        {ANALYSE_STAPPEN.map((s, i) => (
          <li key={s} className={`flex items-center gap-3 text-sm ${i > stap ? "text-ink-faint/50" : "text-ink-soft"}`}>
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                i < stap ? "bg-groen" : i === stap ? "stap-puls bg-groen" : "bg-line"
              }`}
            />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Uitleg({ onVoorbeeld }: { onVoorbeeld: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-8 text-ink-soft">
      <p className="font-[family-name:var(--font-fraunces)] text-2xl text-ink">
        Wat je terugkrijgt
      </p>
      <ul className="mt-5 space-y-4 text-sm leading-relaxed">
        <li>
          <strong className="text-ink">Een eerlijk oordeel.</strong> GO, TWIJFEL of NO-GO — op basis van
          marge of nettorendement, niet op onderbuikgevoel.
        </li>
        <li>
          <strong className="text-ink">De échte kosten.</strong> 8% overdrachtsbelasting voor beleggers,
          notaris, keuring, verkoopkosten én box 3 op de WOZ-waarde.
        </li>
        <li>
          <strong className="text-ink">De huurregels van 2026.</strong> WWS-punten-indicatie: valt de woning
          in het gereguleerde segment, en welke huur mág je dan vragen?
        </li>
        <li>
          <strong className="text-ink">AI-verbouwschatting.</strong> Beschrijf de staat van de woning en
          krijg een geraamd verbouwbudget met kostenposten.
        </li>
      </ul>
      <button
        type="button"
        onClick={onVoorbeeld}
        className="mt-6 w-full rounded-lg border border-groen-diep/30 bg-white/70 py-2.5 text-sm font-semibold text-groen-diep transition hover:border-groen-diep"
      >
        Eerst zien hoe dat eruitziet? Bekijk een voorbeeldrapport →
      </button>
      <p className="mt-4 text-xs text-ink-faint">
        Marktwaarde en WOZ komen live uit officiële bronnen (Altum AI / Kadaster).
      </p>
    </div>
  );
}

function Report({ report, voorbeeld = false }: { report: DealReport; voorbeeld?: boolean }) {
  const { object, waarde, aankoopkosten, flip, verhuur, wws, score, ai } = report;
  const [gekopieerd, setGekopieerd] = useState(false);

  async function kopieer() {
    const r: string[] = [
      `${score.oordeel} — ${object.adres}`,
      score.kernsignaal,
      `Aankoopprijs ${euro(report.aankoopprijs)} · marktwaarde ${euro(waarde.marktwaarde)} · kosten koper ${euro(aankoopkosten.totaalKostenKoper)}`,
    ];
    if (flip) r.push(`Flip: marge ${euro(flip.brutoMarge)} (${pct(flip.rendementOpInvestering)} ROI)`);
    if (verhuur) r.push(`Verhuur: nettorendement ${pct(verhuur.nettoRendement)}`);
    if (wws) r.push(`WWS-indicatie: ±${wws.indicatie.punten} punten (${wws.indicatie.segment})`);
    r.push(`— berekend met Dealwijs · ${SITE_URL.replace("https://", "")}`);
    try {
      await navigator.clipboard.writeText(r.join("\n"));
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      /* clipboard geweigerd — knop laat dan niets zien */
    }
  }

  return (
    <section className="akte rounded-2xl p-6 lg:p-8">
      {voorbeeld && (
        <p className="mb-5 rounded-lg border border-dashed border-line bg-white/60 px-4 py-2.5 text-xs text-ink-soft">
          <strong className="text-ink">Voorbeeldrapport</strong> — echte woningdata (snapshot juni 2026),
          vaste casus: aankoop €800.000, beoogde huur €3.000. Vul links een eigen adres in voor een verse analyse.
        </p>
      )}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-ink-faint">Deal-rapport</p>
          <h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-3xl text-ink">
            {object.adres}
          </h2>
          <p className="mt-1 text-sm text-ink-faint">
            {[
              object.type,
              object.bouwjaar && `bouwjaar ${object.bouwjaar}`,
              object.m2 && `${object.m2} m²`,
              object.energielabel && `energielabel ${object.energielabel}`,
            ]
              .filter(Boolean)
              .join("  ·  ")}
          </p>
        </div>
        <span className={`${STEMPEL_CLASS[score.oordeel]} shrink-0 text-xl lg:text-2xl`}>
          {score.oordeel}
        </span>
      </div>

      <p className="mt-5 border-l-2 border-groen pl-4 text-lg text-ink">{score.kernsignaal}</p>

      {ai.samenvatting && (
        <div className="mt-5 rounded-xl bg-white/70 p-4 ring-1 ring-line">
          <p className="text-xs font-semibold uppercase tracking-wider text-groen">AI-duiding</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{ai.samenvatting}</p>
          {ai.risicos.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
              {ai.risicos.map((r) => (
                <li key={r} className="flex gap-2">
                  <span aria-hidden className="text-[var(--amber)]">▲</span>
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="akte-rule my-6" />

      <div className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
        <Stat label="Marktwaarde (AVM)" value={euro(waarde.marktwaarde)} />
        <Stat label="WOZ-waarde" value={euro(waarde.wozWaarde)} />
        <Stat label="Aankoopprijs" value={euro(report.aankoopprijs)} />
        <Stat label="Kosten koper" value={euro(aankoopkosten.totaalKostenKoper)} />
      </div>

      {flip && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
          <Stat label="Verbouwkosten" value={euro(report.verbouwkosten)} sub={bronLabel(report.verbouwkostenBron)} />
          <Stat label="Totale investering" value={euro(flip.totaleInvestering)} />
          <Stat label="Bruto marge" value={euro(flip.brutoMarge)} highlight />
          <Stat label="Rendement" value={pct(flip.rendementOpInvestering)} highlight />
        </div>
      )}

      {verhuur && (
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
          <Stat label="Jaarhuur" value={euro(verhuur.jaarhuur)} />
          <Stat label="Box 3 / jaar" value={euro(verhuur.box3Jaarlast)} />
          <Stat label="Netto cashflow / jaar" value={euro(verhuur.nettoJaarcashflowVoorFinanciering)} highlight />
          <Stat label="Nettorendement" value={pct(verhuur.nettoRendement)} highlight />
        </div>
      )}

      {wws && <WwsBlok wws={wws} />}

      {ai.verbouwSchatting && (
        <div className="mt-6 rounded-xl bg-white/70 p-4 ring-1 ring-line">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-groen">
              AI-verbouwschatting
            </p>
            <p className="cijfer text-sm font-semibold text-ink">
              {euro(ai.verbouwSchatting.minimum)} – {euro(ai.verbouwSchatting.maximum)}
            </p>
          </div>
          {report.verbouwkostenBron === "ai" && (
            <p className="mt-1 text-xs text-ink-faint">
              Het midden van deze range ({euro(report.verbouwkosten)}) is gebruikt in de berekening.
            </p>
          )}
          <ul className="mt-3 space-y-1 text-sm text-ink-soft">
            {ai.verbouwSchatting.posten.map((p) => (
              <li key={p.post} className="flex justify-between gap-3">
                <span>{p.post}</span>
                <span className="cijfer">{euro(p.bedrag)}</span>
              </li>
            ))}
          </ul>
          {ai.verbouwSchatting.aannames.length > 0 && (
            <details className="mt-3 text-xs text-ink-faint">
              <summary className="cursor-pointer">Aannames</summary>
              <ul className="mt-1 list-inside list-disc space-y-0.5">
                {ai.verbouwSchatting.aannames.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <details className="mt-6 text-sm text-ink-soft">
        <summary className="cursor-pointer font-medium text-ink">Kostenuitsplitsing koper</summary>
        <ul className="mt-2 space-y-1">
          {aankoopkosten.posten.map((p) => (
            <li key={p.naam} className="flex justify-between">
              <span>{p.naam}</span>
              <span className="cijfer">{euro(p.bedrag)}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="akte-rule my-6" />

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-ink-faint">
          Indicatieve berekening op {new Date().toLocaleDateString("nl-NL")} — geen advies.
        </p>
        <button
          type="button"
          onClick={kopieer}
          className="rounded-lg border border-line bg-white/70 px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-ink-faint"
        >
          {gekopieerd ? "Gekopieerd ✓" : "Kopieer samenvatting"}
        </button>
      </div>
    </section>
  );
}

function bronLabel(bron: DealReport["verbouwkostenBron"]): string | undefined {
  if (bron === "ai") return "AI-schatting";
  if (bron === "gebruiker") return "eigen opgave";
  return undefined;
}

function WwsBlok({ wws }: { wws: NonNullable<DealReport["wws"]> }) {
  const { indicatie, gereguleerdScenario } = wws;
  const segmentTekst: Record<string, string> = {
    sociaal: "gereguleerd (laag segment)",
    middenhuur: "gereguleerd (middenhuur)",
    vrij: "vrije sector",
  };
  return (
    <div
      className={`mt-6 rounded-xl p-4 ring-1 ${
        gereguleerdScenario
          ? "bg-[var(--amber-bg)] ring-[var(--amber)]/30"
          : "bg-white/70 ring-line"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-groen">
          Huurregulering (WWS-indicatie)
        </p>
        <p className="cijfer text-sm font-semibold text-ink">
          ±{indicatie.punten} punten · {segmentTekst[indicatie.segment]}
        </p>
      </div>

      {indicatie.maxHuurIndicatie != null && (
        <p className="mt-2 text-sm text-ink-soft">
          Maximale huur (indicatie): <strong className="cijfer text-ink">{euro(indicatie.maxHuurIndicatie)}/mnd</strong>
        </p>
      )}

      {gereguleerdScenario && (
        <div className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-ink-soft ring-1 ring-[var(--amber)]/20">
          <p className="font-semibold text-[var(--amber)]">
            Let op: de beoogde huur ligt boven het wettelijke maximum.
          </p>
          <p className="mt-1">
            Met de toegestane huur wordt het nettorendement{" "}
            <strong className="cijfer text-ink">{pct(gereguleerdScenario.nettoRendement)}</strong>{" "}
            (cashflow {euro(gereguleerdScenario.nettoJaarcashflowVoorFinanciering)}/jaar). Het oordeel
            hierboven is op dit gereguleerde scenario gebaseerd.
          </p>
        </div>
      )}

      {indicatie.grensgeval && (
        <p className="mt-2 text-xs text-ink-faint">
          Grensgeval: het puntenaantal ligt dicht bij een segmentgrens
          (bandbreedte {indicatie.bandbreedte.min}–{indicatie.bandbreedte.max}). Laat vóór aankoop een
          volledige puntentelling doen.
        </p>
      )}

      <details className="mt-2 text-xs text-ink-faint">
        <summary className="cursor-pointer">Aannames bij deze indicatie</summary>
        <ul className="mt-1 list-inside list-disc space-y-0.5">
          {indicatie.aannames.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${highlight ? "bg-groen-diep text-paper" : "bg-white/70 text-ink ring-1 ring-line"}`}>
      <div className={`text-xs ${highlight ? "text-paper/70" : "text-ink-faint"}`}>{label}</div>
      <div className="cijfer mt-0.5 font-semibold">{value}</div>
      {sub && <div className={`text-[11px] ${highlight ? "text-paper/60" : "text-ink-faint"}`}>{sub}</div>}
    </div>
  );
}
