import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { CATEGORY_LABELS, SIZES, productsQuery } from "@/lib/shop";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type Search = {
  kategorie: string;
  sortierung: string;
  groesse: string;
  farbe: string;
  maxPreis: number;
};

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop – bestickte & personalisierbare Socken | Fadenglück" },
      {
        name: "description",
        content:
          "Alle Socken von Fadenglück: personalisierbare Modelle, fertig bestickte Designs und Geschenkideen. Filtern nach Größe, Farbe und Preis.",
      },
      { property: "og:title", content: "Shop – bestickte Socken | Fadenglück" },
      {
        property: "og:description",
        content: "Personalisierbare und fertig bestickte Socken, gefiltert nach deinem Geschmack.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): Search => ({
    kategorie: typeof search["kategorie"] === "string" ? search["kategorie"] : "alle",
    sortierung: typeof search["sortierung"] === "string" ? search["sortierung"] : "beliebt",
    groesse: typeof search["groesse"] === "string" ? search["groesse"] : "alle",
    farbe: typeof search["farbe"] === "string" ? search["farbe"] : "alle",
    maxPreis: Number(search["maxPreis"]) || 50,
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Shop,
  errorComponent: () => <p className="container-page py-24">Produkte konnten nicht laden.</p>,
  notFoundComponent: () => <p className="container-page py-24">Nichts gefunden.</p>,
});

function Shop() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });

  const update = (patch: Partial<Search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const colors = Array.from(new Set(products.map((p) => p.base_color)));

  let list = products.filter((p) => {
    if (search.kategorie !== "alle" && p.category !== search.kategorie) return false;
    if (search.farbe !== "alle" && p.base_color !== search.farbe) return false;
    if (p.price > search.maxPreis) return false;
    if (
      search.groesse !== "alle" &&
      !p.product_variants.some((v) => v.size === search.groesse && v.stock_quantity > 0)
    )
      return false;
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (search.sortierung) {
      case "neu":
        return b.created_at.localeCompare(a.created_at);
      case "preis-auf":
        return a.price - b.price;
      case "preis-ab":
        return b.price - a.price;
      default:
        return b.popularity - a.popularity;
    }
  });

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="text-4xl md:text-5xl">{CATEGORY_LABELS[search.kategorie] ?? "Alle Socken"}</h1>

      <div className="mt-6 flex flex-wrap gap-2">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <Link
            key={key}
            to="/shop"
            search={(prev) => ({ ...prev, kategorie: key })}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              search.kategorie === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-accent"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl bg-card p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1.5 block text-muted-foreground">Größe</span>
          <Select value={search.groesse} onValueChange={(v) => update({ groesse: v })}>
            <SelectTrigger className="rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle Größen</SelectItem>
              {SIZES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block text-muted-foreground">Farbe</span>
          <Select value={search.farbe} onValueChange={(v) => update({ farbe: v })}>
            <SelectTrigger className="rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle Farben</SelectItem>
              {colors.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="text-sm">
          <span className="mb-1.5 block text-muted-foreground">Preis bis {search.maxPreis} €</span>
          <Slider
            value={[search.maxPreis]}
            min={10}
            max={50}
            step={1}
            onValueChange={([v]) => update({ maxPreis: v ?? 50 })}
            className="mt-4"
          />
        </div>

        <label className="text-sm">
          <span className="mb-1.5 block text-muted-foreground">Sortierung</span>
          <Select value={search.sortierung} onValueChange={(v) => update({ sortierung: v })}>
            <SelectTrigger className="rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beliebt">Beliebteste</SelectItem>
              <SelectItem value="neu">Neueste</SelectItem>
              <SelectItem value="preis-auf">Preis aufsteigend</SelectItem>
              <SelectItem value="preis-ab">Preis absteigend</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>

      {list.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">
          Keine Socken für diese Auswahl gefunden.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
