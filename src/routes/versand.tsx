import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/versand")({
  head: () => ({
    meta: [
      { title: "Versand & Lieferung | Fadenglück" },
      {
        name: "description",
        content: "Versandkosten, Lieferzeiten und Sendungsverfolgung für bestickte Socken.",
      },
      { property: "og:title", content: "Versand & Lieferung | Fadenglück" },
      { property: "og:description", content: "Versandkosten und Lieferzeiten im Überblick." },
    ],
  }),
  component: () => (
    <ContentPage title="Versand & Lieferung">
      <p>
        Standardversand innerhalb Deutschlands: 3,90 €. Ab 50 € Bestellwert liefern wir
        versandkostenfrei.
      </p>
      <p>
        Fertig bestickte Modelle versenden wir innerhalb von 1–2 Werktagen. Personalisierte Socken
        werden nach Bestelleingang gefertigt, dafür rechne bitte 2–3 zusätzliche Werktage ein.
      </p>
      <p>Sobald dein Paket unterwegs ist, erhältst du eine E-Mail mit Sendungsnummer.</p>
    </ContentPage>
  ),
});
