import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "AGB | Fadenglück" },
      { name: "description", content: "Allgemeine Geschäftsbedingungen von Fadenglück." },
      { property: "og:title", content: "AGB | Fadenglück" },
      { property: "og:description", content: "Allgemeine Geschäftsbedingungen." },
    ],
  }),
  component: () => (
    <ContentPage title="Allgemeine Geschäftsbedingungen">
      <p>
        Diese Bedingungen gelten für alle Bestellungen über unseren Online-Shop. Der Vertrag kommt
        mit Bestätigung der Bestellung zustande.
      </p>
      <p>
        Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer zuzüglich Versandkosten.
        Personalisierte Artikel werden nach Bestelleingang individuell gefertigt.
      </p>
      <p className="text-sm">
        Platzhaltertext – bitte vor Verkaufsstart durch rechtlich geprüfte AGB ersetzen.
      </p>
    </ContentPage>
  ),
});
