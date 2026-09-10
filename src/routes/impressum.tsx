import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum | Fadenglück" },
      { name: "description", content: "Anbieterkennzeichnung nach § 5 TMG." },
      { property: "og:title", content: "Impressum | Fadenglück" },
      { property: "og:description", content: "Anbieterkennzeichnung von Fadenglück." },
    ],
  }),
  component: () => (
    <ContentPage title="Impressum">
      <p>
        Angaben gemäß § 5 TMG
        <br />
        Fadenglück (Platzhalter)
        <br />
        Musterstraße 12, 10115 Berlin
      </p>
      <p>
        Vertreten durch: Vorname Nachname
        <br />
        E-Mail: hallo@fadenglueck.example
        <br />
        USt-IdNr.: DE000000000
      </p>
      <p className="text-sm">
        Platzhaltertext – bitte vor Verkaufsstart durch die rechtlich geprüften Angaben ersetzen.
      </p>
    </ContentPage>
  ),
});
