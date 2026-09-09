import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Heart, Scissors, Gift, Star } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { productsQuery } from "@/lib/shop";
import heroImage from "@/assets/hero-socks.jpg";
import craftImage from "@/assets/craft.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fadenglück – Socken, die nur dir gehören" },
      {
        name: "description",
        content:
          "Personalisiert oder fertig bestickt: besondere Socken für besondere Menschen. Mit Liebe in kleiner Auflage gefertigt.",
      },
      { property: "og:title", content: "Fadenglück – Socken, die nur dir gehören" },
      {
        property: "og:description",
        content: "Personalisiert oder fertig bestickt – besondere Socken für besondere Menschen.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Home,
  errorComponent: () => <p className="container-page py-24">Inhalte konnten nicht laden.</p>,
  notFoundComponent: () => <p className="container-page py-24">Nicht gefunden.</p>,
});

const BENEFITS = [
  { icon: Scissors, title: "Persönlich bestickt", text: "Dein Text, deine Farbe, deine Schrift." },
  { icon: Heart, title: "Mit Liebe gefertigt", text: "Kleine Auflagen aus unserer Werkstatt." },
  { icon: Gift, title: "Ein Geschenk, das bleibt", text: "Individuell und alltagstauglich." },
];

const STEPS = [
  { n: "01", title: "Socken auswählen", text: "Farbe, Größe und Modell wählen." },
  { n: "02", title: "Personalisierung gestalten", text: "Text, Stickfarbe und Schriftart wählen." },
  { n: "03", title: "Wir besticken und versenden", text: "In 3–5 Werktagen bei dir." },
];

const GIFTS = [
  { label: "Für Mama", to: "geschenke" },
  { label: "Für Papa", to: "geschenke" },
  { label: "Für Partner/in", to: "fertig-bestickt" },
  { label: "Für Freunde", to: "personalisierbar" },
  { label: "Für besondere Anlässe", to: "alle" },
];

const REVIEWS = [
  {
    name: "Lena K.",
    text: "Die Stickerei ist wunderschön sauber. Meine Mama hat beim Auspacken geweint – schöner geht es nicht.",
  },
  {
    name: "Tobias M.",
    text: "Qualitativ deutlich besser als erwartet. Die Socken sitzen nach mehreren Wäschen noch perfekt.",
  },
  {
    name: "Sarah B.",
    text: "Schnelle Lieferung, liebevolle Verpackung und der Text saß exakt so, wie in der Vorschau gezeigt.",
  },
];

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const bestsellers = products.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="container-page grid items-center gap-10 py-12 md:grid-cols-2 md:py-20">
        <div className="reveal max-w-xl">
          <p className="text-sm tracking-[0.2em] text-accent uppercase">Bestickte Socken</p>
          <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl">Socken, die nur dir gehören.</h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Personalisiert oder fertig bestickt – besondere Socken für besondere Menschen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link to="/shop">Socken entdecken</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link to="/shop" search={{ kategorie: "personalisierbar" }}>
                Socken personalisieren
              </Link>
            </Button>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl shadow-soft">
          <img
            src={heroImage}
            alt="Weiße bestickte Socken auf Leinen"
            width={1600}
            height={1200}
            className="size-full object-cover"
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="container-page grid gap-6 py-10 sm:grid-cols-3">
        {BENEFITS.map((b) => (
          <div key={b.title} className="rounded-2xl bg-card p-6 shadow-soft">
            <b.icon className="size-6 text-accent" />
            <p className="mt-4 text-lg">{b.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
          </div>
        ))}
      </section>

      {/* Bestsellers */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl md:text-4xl">Unsere Bestseller</h2>
          <Link to="/shop" className="text-sm text-accent hover:underline">
            Alle ansehen
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-secondary/50 py-16">
        <div className="container-page grid gap-10 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <img
              src={craftImage}
              alt="Stickarbeit an einer Socke"
              loading="lazy"
              width={1400}
              height={1000}
              className="size-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl">Deine Idee. Unsere Stickerei.</h2>
            <ol className="mt-8 space-y-6">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="font-display text-2xl text-accent">{s.n}</span>
                  <div>
                    <p className="text-lg">{s.title}</p>
                    <p className="text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Gifts */}
      <section className="container-page py-16">
        <h2 className="text-3xl md:text-4xl">Das perfekte persönliche Geschenk</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {GIFTS.map((g) => (
            <Link
              key={g.label}
              to="/shop"
              search={{ kategorie: g.to }}
              className="rounded-full border border-border bg-card px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              {g.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-page py-10">
        <h2 className="text-3xl md:text-4xl">Was unsere Kund:innen sagen</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rounded-2xl bg-card p-6 shadow-soft">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed">{r.text}</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-4xl md:text-5xl">Mach sie einzigartig.</h2>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-8 rounded-full px-8 text-foreground"
          >
            <Link to="/shop" search={{ kategorie: "personalisierbar" }}>
              Jetzt personalisieren
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
