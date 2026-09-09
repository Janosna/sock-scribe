import { createFileRoute } from "@tanstack/react-router";
import craftImage from "@/assets/craft.jpg";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns – Handarbeit und kleine Details | Fadenglück" },
      {
        name: "description",
        content:
          "Die Geschichte hinter Fadenglück: eine kleine Werkstatt, eine Stickmaschine und die Idee, dass persönliche Details ein Geschenk besonders machen.",
      },
      { property: "og:title", content: "Über uns | Fadenglück" },
      {
        property: "og:description",
        content: "Handarbeit, Individualität und kleine Details, die bleiben.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-4xl md:text-5xl">Kleine Details, die bleiben.</h1>
      <div className="mt-8 overflow-hidden rounded-3xl shadow-soft">
        <img
          src={craftImage}
          alt="Stickarbeit in unserer Werkstatt"
          loading="lazy"
          width={1400}
          height={1000}
          className="w-full object-cover"
        />
      </div>
      <div className="mt-10 space-y-5 leading-relaxed text-muted-foreground">
        <p>
          Angefangen hat alles mit einem Paar Socken für meine Mutter. Ihr Name, drei Buchstaben,
          weiß auf Grau. Sie hat sie ein halbes Jahr lang jeden Sonntag getragen – und irgendwann
          gefragt, ob ich das auch für ihre Freundinnen machen könnte.
        </p>
        <p>
          Heute arbeiten wir zu dritt in einer kleinen Werkstatt. Wir stricken nicht selbst, aber wir
          suchen die Socken sorgfältig aus: gekämmte Baumwolle, dichte Rippe, ein Bund, der auch nach
          dreißig Wäschen noch hält. Jede Stickerei wird einzeln eingerichtet, kontrolliert und von
          Hand nachgearbeitet.
        </p>
        <p>
          Uns geht es nicht um schnelle Massenware. Uns geht es um den Moment, in dem jemand ein
          Paar Socken auspackt und den eigenen Namen darauf liest. Das ist ein kleines Detail – und
          genau deshalb bleibt es.
        </p>
      </div>
    </div>
  );
}
