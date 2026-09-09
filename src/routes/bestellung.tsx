import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { loadLastOrder, type PlacedOrder } from "@/lib/cart";
import { euro } from "@/lib/shop";

export const Route = createFileRoute("/bestellung")({
  head: () => ({
    meta: [
      { title: "Bestellbestätigung | Fadenglück" },
      { name: "description", content: "Vielen Dank für deine Bestellung bei Fadenglück." },
      { property: "og:title", content: "Bestellbestätigung | Fadenglück" },
      { property: "og:description", content: "Deine Bestellung ist bei uns eingegangen." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  useEffect(() => {
    setOrder(loadLastOrder());
  }, []);

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-4xl">Keine Bestellung gefunden</h1>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/shop">Weiter shoppen</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="text-4xl md:text-5xl">Vielen Dank für deine Bestellung! ❤️</h1>
      <p className="mt-4 text-muted-foreground">
        Wir beginnen jetzt mit der Vorbereitung deiner Bestellung.
      </p>

      <div className="mt-8 rounded-2xl bg-card p-6 shadow-soft">
        <p className="text-sm text-muted-foreground">Bestellnummer</p>
        <p className="font-display text-3xl">{order.orderNumber}</p>

        <ul className="mt-6 space-y-4 border-t border-border pt-5 text-sm">
          {order.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-4">
              <div>
                <p>
                  {item.quantity}× {item.name}
                </p>
                <p className="text-muted-foreground">
                  Größe {item.size} · {item.color}
                </p>
                {item.personalizationText && (
                  <p className="text-muted-foreground">
                    Sticktext „{item.personalizationText}" · {item.threadColor} · {item.font}
                  </p>
                )}
                {item.motif && <p className="text-muted-foreground">Motiv: {item.motif}</p>}
              </div>
              <span>{euro(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-between border-t border-border pt-4 text-base font-medium">
          <span>Gesamtbetrag</span>
          <span>{euro(order.total)}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-card p-6 shadow-soft text-sm">
        <p className="font-medium">Lieferadresse</p>
        <p className="mt-2 text-muted-foreground">
          {order.address.firstName} {order.address.lastName}
          <br />
          {order.address.street} {order.address.houseNumber}
          <br />
          {order.address.zip} {order.address.city}
          <br />
          {order.address.country}
        </p>
      </div>

      <Button asChild size="lg" className="mt-8 rounded-full">
        <Link to="/shop">Weiter shoppen</Link>
      </Button>
    </div>
  );
}
