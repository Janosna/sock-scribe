import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt | Fadenglück" },
      {
        name: "description",
        content: "Fragen zu Bestellung, Personalisierung oder Versand? Schreib uns – wir antworten werktags innerhalb von 24 Stunden.",
      },
      { property: "og:title", content: "Kontakt | Fadenglück" },
      { property: "og:description", content: "Wir antworten werktags innerhalb von 24 Stunden." },
    ],
  }),
  component: () => (
    <ContentPage
      title="Kontakt"
      intro="Wir antworten werktags in der Regel innerhalb von 24 Stunden."
    >
      <p>
        E-Mail: hallo@fadenglueck.example
        <br />
        Telefon: +49 (0) 000 000000
      </p>
      <p>
        Fadenglück Werkstatt
        <br />
        Musterstraße 12
        <br />
        10115 Berlin
      </p>
      <p className="text-sm">
        Hinweis: Diese Kontaktdaten sind Platzhalter und müssen vor dem Verkaufsstart durch deine
        echten Angaben ersetzt werden.
      </p>
    </ContentPage>
  ),
});
