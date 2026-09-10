import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung | Fadenglück" },
      { name: "description", content: "Informationen zur Verarbeitung personenbezogener Daten." },
      { property: "og:title", content: "Datenschutzerklärung | Fadenglück" },
      { property: "og:description", content: "So gehen wir mit deinen Daten um." },
    ],
  }),
  component: () => (
    <ContentPage title="Datenschutzerklärung">
      <p>
        Wir verarbeiten personenbezogene Daten ausschließlich zur Abwicklung deiner Bestellung:
        Name, Adresse, E-Mail-Adresse sowie deine Personalisierungsangaben.
      </p>
      <p>
        Zahlungsdaten werden von unserem Zahlungsdienstleister verarbeitet; wir speichern keine
        Kartendaten. Bestelldaten bewahren wir im Rahmen der gesetzlichen Aufbewahrungsfristen auf.
      </p>
      <p className="text-sm">
        Platzhaltertext – bitte vor Verkaufsstart durch eine rechtlich geprüfte
        Datenschutzerklärung ersetzen.
      </p>
    </ContentPage>
  ),
});
