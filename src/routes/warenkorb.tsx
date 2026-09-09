import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/shop";

export const Route = createFileRoute("/warenkorb")({
  head: () => ({
    meta: [
      { title: "Warenkorb | Fadenglück" },
      { name: "description", content: "Deine ausgewählten bestickten Socken im Überblick." },
      { property: "og:title", content: "Warenkorb | Fadenglück" },
      { property: "og:description", content: "Deine ausgewählten bestickten Socken." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-4xl">Dein Warenkorb ist leer</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/shop">Socken entdecken</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-4xl">Warenkorb</h1>
        <ul className="mt-8 divide-y divide-border">
          {cart.items.map((item) => (
            <li key={item.key} className="flex gap-5 py-6">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                className="size-28 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex justify-between gap-3">
                  <p className="text-lg">{item.name}</p>
                  <p className="text-lg">{euro(item.price * item.quantity)}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Größe {item.size} · Farbe {item.color} · Einzelpreis {euro(item.price)}
                </p>
                {item.personalizationText && (
                  <p className="text-sm text-muted-foreground">
                    Sticktext „{item.personalizationText}" · Stickfarbe {item.threadColor} ·{" "}
                    {item.font}
                  </p>
                )}
                {item.motif && (
                  <p className="text-sm text-muted-foreground">Motiv: {item.motif}</p>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-border">
                    <button
                      className="p-2"
                      aria-label="Menge verringern"
                      onClick={() => cart.setQuantity(item.key, item.quantity - 1)}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <button
                      className="p-2"
                      aria-label="Menge erhöhen"
                      onClick={() => cart.setQuantity(item.key, item.quantity + 1)}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    className="text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Entfernen"
                    onClick={() => cart.remove(item.key)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft">
        <h2 className="text-xl">Zusammenfassung</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Zwischensumme</dt>
            <dd>{euro(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Versand</dt>
            <dd>{cart.shipping === 0 ? "Kostenlos" : euro(cart.shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
            <dt>Gesamtbetrag</dt>
            <dd>{euro(cart.total)}</dd>
          </div>
        </dl>
        <Button asChild size="lg" className="mt-6 w-full rounded-full">
          <Link to="/checkout">Zur Kasse</Link>
        </Button>
      </aside>
    </div>
  );
}
