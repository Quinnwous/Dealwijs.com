import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo, Fraunces, JetBrains_Mono } from "next/font/google";
import { SITE_NAAM, SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const TITEL = "Dealwijs — weet wat een woning wáárd is als deal";
const OMSCHRIJVING =
  "Plak een adres, krijg in seconden een onderbouwd deal-oordeel: kosten koper, marge, rendement ná box 3 en de huurregels van 2026. Voor flippers en vastgoedbeleggers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITEL,
  description: OMSCHRIJVING,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: SITE_NAAM,
    title: TITEL,
    description: OMSCHRIJVING,
  },
  twitter: {
    card: "summary_large_image",
    title: TITEL,
    description: OMSCHRIJVING,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAAM,
  url: SITE_URL,
  description: OMSCHRIJVING,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  inLanguage: "nl",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${fraunces.variable} ${archivo.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
