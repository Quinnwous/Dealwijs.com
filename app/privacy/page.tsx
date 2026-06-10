import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Dealwijs",
  description: "Wat Dealwijs verwerkt en wat niet: geen accounts, geen tracking-cookies, geen doorverkoop van gegevens.",
};

export default function PrivacyPagina() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12">
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-groen-diep">
        Privacy
      </h1>
      <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink-soft">
        <p>
          Dealwijs is een rekentool zonder accounts. We verwerken zo min mogelijk en
          verkopen niets door. Concreet:
        </p>
        <ul className="list-disc space-y-3 pl-5">
          <li>
            <strong className="text-ink">Adresgegevens die je invoert</strong> (postcode,
            huisnummer) sturen we door naar Altum AI om officiële woningdata op te halen
            (marktwaarde, WOZ, kenmerken). Dit zijn gegevens over de wóning, niet over jou.
          </li>
          <li>
            <strong className="text-ink">Je omschrijving van verbouwplannen</strong> gaat —
            alleen als je die invult — naar een AI-model om een verbouwbudget te ramen.
            We koppelen die tekst niet aan je identiteit.
          </li>
          <li>
            <strong className="text-ink">Je IP-adres</strong> gebruiken we uitsluitend om de
            gratis daglimiet te handhaven. Het wordt niet gebruikt voor profilering en niet
            gedeeld.
          </li>
          <li>
            <strong className="text-ink">Geen tracking-cookies.</strong> We meten bezoek
            anoniem (geaggregeerde statistieken, zonder cookies).
          </li>
          <li>
            <strong className="text-ink">Rapporten worden niet opgeslagen</strong> onder jouw
            naam — er zijn geen accounts. Opgehaalde woningdata cachen we kort om dubbele
            kosten te voorkomen.
          </li>
        </ul>
        <p>
          Vragen of een verzoek (inzage, verwijdering)? Mail naar{" "}
          <a href="mailto:privacy@dealwijs.com" className="text-groen-diep underline-offset-2 hover:underline">
            privacy@dealwijs.com
          </a>
          .
        </p>
        <p>
          <Link href="/" className="font-semibold text-groen-diep underline-offset-2 hover:underline">
            ← Terug naar Dealwijs
          </Link>
        </p>
      </div>
    </main>
  );
}
