import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";

export const Route = createFileRoute("/rueckgabe")({
  head: () => ({
    meta: [
      { title: "Rückgabe & Widerruf | Fadenglück" },
      {
        name: "description",
        content: "Rückgabebedingungen für bestickte und personalisierte Socken.",
      },
      { property: "og:title", content: "Rückgabe & Widerruf | Fadenglück" },
      { property: "og:description", content: "So funktioniert die Rückgabe bei Fadenglück." },
    ],
  }),
  component: () => (
    <ContentPage title="Rückgabe">
      <p>
        Ungetragene, fertig bestickte Artikel kannst du innerhalb von 14 Tagen nach Erhalt
        zurücksenden.
      </p>
      <p>
        Individuell personalisierte Socken sind vom Widerrufsrecht ausgenommen, da sie eigens für
        dich gefertigt werden. Sollte die Stickerei fehlerhaft sein oder nicht deiner Bestellung
        entsprechen, ersetzen wir sie selbstverständlich kostenfrei.
      </p>
      <p>Melde dich für eine Rücksendung einfach per E-Mail mit deiner Bestellnummer.</p>
    </ContentPage>
  ),
});
