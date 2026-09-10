import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";
import { adminOrdersQuery } from "@/lib/admin";
import { euro, PRODUCTION_LABELS, PRODUCTION_STATUSES } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin – Bestellungen | Fadenglück" },
      { name: "description", content: "Interner Bereich: Bestellungen und Umsatz." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOrders,
  errorComponent: () => <p className="container-page py-24">Daten konnten nicht laden.</p>,
  notFoundComponent: () => <p className="container-page py-24">Nicht gefunden.</p>,
});

function AdminOrders() {
  const { data: orders } = useSuspenseQuery(adminOrdersQuery);
  const queryClient = useQueryClient();

  const revenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const open = orders.filter((o) => o.production_status === "offen").length;
  const inProduction = orders.filter((o) => o.production_status === "in_produktion").length;
  const shipped = orders.filter((o) => o.production_status === "versendet").length;

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({
        production_status: status,
        shipping_status: status === "versendet" ? "versendet" : "nicht_versendet",
      })
      .eq("id", id);
    if (error) {
      toast.error("Status konnte nicht geändert werden.");
      return;
    }
    toast.success("Status aktualisiert");
    void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const stats = [
    { label: "Umsatz (bezahlt)", value: euro(revenue) },
    { label: "Bestellungen", value: orders.length },
    { label: "Offen", value: open },
    { label: "In Produktion", value: inProduction },
    { label: "Versendet", value: shipped },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto rounded-2xl bg-card shadow-soft">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              {[
                "Nr.",
                "Datum",
                "Kunde",
                "Produkt",
                "Größe",
                "Farbe",
                "Personalisierung",
                "Stickfarbe",
                "Betrag",
                "Zahlung",
                "Produktion",
                "Versand",
              ].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-10 text-center text-muted-foreground">
                  Noch keine Bestellungen.
                </td>
              </tr>
            )}
            {orders.map((order) => {
              const first = order.order_items[0];
              return (
                <tr key={order.id} className="border-b border-border/60 align-top">
                  <td className="px-4 py-3 font-medium">{order.order_number}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(order.created_at).toLocaleDateString("de-DE")}
                  </td>
                  <td className="px-4 py-3">
                    {order.customer_first_name} {order.customer_last_name}
                    <br />
                    <span className="text-muted-foreground">{order.customer_email}</span>
                  </td>
                  <td className="px-4 py-3">
                    {order.order_items.map((i) => (
                      <div key={i.id}>
                        {i.quantity}× {i.product_name}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-3">{first?.size ?? "–"}</td>
                  <td className="px-4 py-3">{first?.color ?? "–"}</td>
                  <td className="px-4 py-3">
                    {order.order_items.map((i) => (
                      <div key={i.id}>{i.personalization_text ?? "–"}</div>
                    ))}
                  </td>
                  <td className="px-4 py-3">{first?.thread_color ?? "–"}</td>
                  <td className="whitespace-nowrap px-4 py-3">{euro(Number(order.total))}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        order.payment_status === "paid"
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      {order.payment_status === "paid" ? "Bezahlt" : "Offen"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={order.production_status}
                      onValueChange={(v) => setStatus(order.id, v)}
                    >
                      <SelectTrigger className="w-44 rounded-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCTION_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {PRODUCTION_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    {order.shipping_status === "versendet" ? "Versendet" : "Nicht versendet"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
