import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ – Personalisierung, Versand & Pflege | Fadenglück" },
      {
        name: "description",
        content:
          "Antworten zu Personalisierung, Herstellungszeit, Größen, Pflege, Versandkosten, Rückgabe und Sendungsverfolgung.",
      },
      { property: "og:title", content: "Häufige Fragen | Fadenglück" },
      { property: "og:description", content: "Alles zu Personalisierung, Versand und Pflege." },
    ],
  }),
  component: Faq,
});

const QA = [
  {
    q: "Wie funktioniert die Personalisierung?",
    a: "Du wählst dein Sockenmodell, gibst deinen Text (max. 15 Zeichen) ein und entscheidest dich für Stickfarbe und Schriftart. Die Vorschau zeigt dir, wie das Ergebnis ungefähr aussieht. Anschließend besticken wir die Socken von Hand vorbereitet in unserer Werkstatt.",
  },
  {
    q: "Wie lange dauert die Herstellung?",
    a: "Personalisierte Socken fertigen wir innerhalb von 2–3 Werktagen. Danach dauert der Versand in Deutschland in der Regel 1–2 Werktage.",
  },
  {
    q: "Welche Größen gibt es?",
    a: "Aktuell bieten wir die Größen 35–38, 39–42 und 43–46 an. Alle Modelle sind elastisch gestrickt und sitzen dadurch angenehm im gesamten Größenbereich.",
  },
  {
    q: "Kann ich mehrere verschiedene Personalisierungen bestellen?",
    a: "Ja. Jede Personalisierung ist eine eigene Position im Warenkorb. Du kannst beliebig viele unterschiedliche Texte, Stickfarben und Größen in einer Bestellung kombinieren.",
  },
  {
    q: "Wie pflege ich die bestickten Socken?",
    a: "Bei 30 °C auf links gewendet im Feinwaschgang waschen, nicht bleichen und nicht in den Trockner geben. So bleibt die Stickerei lange schön.",
  },
  {
    q: "Wie hoch sind die Versandkosten?",
    a: "Der Standardversand kostet 3,90 €. Ab einem Bestellwert von 50 € liefern wir versandkostenfrei.",
  },
  {
    q: "Kann ich personalisierte Produkte zurückgeben?",
    a: "Individuell bestickte Produkte sind vom Widerruf ausgenommen. Sollte etwas nicht stimmen oder ein Fehler von uns passiert sein, melde dich – wir finden immer eine Lösung.",
  },
  {
    q: "Wie kann ich meine Bestellung verfolgen?",
    a: "Sobald deine Bestellung unser Atelier verlässt, erhältst du eine E-Mail mit Sendungsnummer und Link zur Sendungsverfolgung.",
  },
];

function Faq() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-4xl md:text-5xl">Häufige Fragen</h1>
      <Accordion type="single" collapsible className="mt-8">
        {QA.map((item) => (
          <AccordionItem key={item.q} value={item.q}>
            <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
