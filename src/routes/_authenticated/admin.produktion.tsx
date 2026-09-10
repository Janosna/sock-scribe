import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin-shell";
import { adminOrdersQuery } from "@/lib/admin";
import { PRODUCTION_LABELS } from "@/lib/shop";

export const Route = createFileRoute("/_authenticated/admin/produktion")({
  head: () => ({
    meta: [
      { title: "Admin – Produktion | Fadenglück" },
      { name: "description", content: "Produktionsansicht aller Personalisierungen." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Production,
  errorComponent: () => <p className="container-page py-24">Daten konnten nicht laden.</p>,
  notFoundComponent: () => <p className="container-page py-24">Nicht gefunden.</p>,
});

function Production() {
  const { data: orders } = useSuspenseQuery(adminOrdersQuery);
  const open = orders.filter((o) => o.production_status !== "versendet");

  return (
    <AdminShell title="Produktion">
      {open.length === 0 ? (
        <p className="text-muted-foreground">Aktuell nichts in Produktion.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {open.map((order) => (
            <article key={order.id} className="rounded-2xl bg-card p-6 shadow-soft">
              <p className="font-display text-2xl">BESTELLUNG {order.order_number}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("de-DE")} ·{" "}
                {PRODUCTION_LABELS[order.production_status] ?? order.production_status}
              </p>
              <ul className="mt-5 space-y-4 text-sm">
                {order.order_items.map((item) => (
                  <li key={item.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
                    <p className="font-medium">
                      {item.quantity}× {item.product_name}
                    </p>
                    <p>{item.color ?? "–"}</p>
                    <p>Größe {item.size ?? "–"}</p>
                    <p>
                      Sticktext: {item.personalization_text ? `„${item.personalization_text}"` : "–"}
                    </p>
                    <p>Stickfarbe: {item.thread_color ?? "–"}</p>
                    <p>Schrift: {item.font ?? "–"}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
