import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart, saveLastOrder } from "@/lib/cart";
import { euro } from "@/lib/shop";
import { supabase } from "@/integrations/supabase/client";
import { createStripeCheckout } from "@/lib/payments.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Kasse | Fadenglück" },
      { name: "description", content: "Bestellung abschließen – sichere Bezahlung." },
      { property: "og:title", content: "Kasse | Fadenglück" },
      { property: "og:description", content: "Bestellung abschließen bei Fadenglück." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const addressSchema = z.object({
  firstName: z.string().trim().min(1, "Vorname fehlt").max(60),
  lastName: z.string().trim().min(1, "Nachname fehlt").max(60),
  email: z.string().trim().email("E-Mail ist ungültig").max(180),
  street: z.string().trim().min(1, "Straße fehlt").max(120),
  houseNumber: z.string().trim().min(1, "Hausnummer fehlt").max(20),
  zip: z.string().trim().min(4, "PLZ ist ungültig").max(10),
  city: z.string().trim().min(1, "Ort fehlt").max(80),
  country: z.string().trim().min(1).max(60),
});

const FIELDS = [
  { name: "firstName", label: "Vorname" },
  { name: "lastName", label: "Nachname" },
  { name: "email", label: "E-Mail", type: "email", full: true },
  { name: "street", label: "Straße" },
  { name: "houseNumber", label: "Hausnummer" },
  { name: "zip", label: "PLZ" },
  { name: "city", label: "Ort" },
  { name: "country", label: "Land", full: true },
] as const;

function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    houseNumber: "",
    zip: "",
    city: "",
    country: "Deutschland",
  });
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  if (cart.items.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-4xl">Dein Warenkorb ist leer</h1>
      </div>
    );
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Bitte prüfe deine Angaben.");
      return;
    }
    if (!terms || !privacy) {
      toast.error("Bitte akzeptiere AGB und Datenschutzerklärung.");
      return;
    }

    setLoading(true);
    const address = parsed.data;
    const orderId = crypto.randomUUID();
    const orderNumber = `#${Date.now().toString().slice(-6)}`;

    try {
      const { error: orderError } = await supabase.from("orders").insert({
        id: orderId,
        order_number: orderNumber,
        customer_email: address.email,
        customer_first_name: address.firstName,
        customer_last_name: address.lastName,
        shipping_address: address,
        subtotal: cart.subtotal,
        shipping_cost: cart.shipping,
        total: cart.total,
        payment_status: "pending",
        production_status: "offen",
        shipping_status: "nicht_versendet",
      });
      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from("order_items").insert(
        cart.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId,
          variant_id: item.variantId,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          size: item.size,
          color: item.color,
          personalization_text: item.personalizationText,
          thread_color: item.threadColor,
          font: item.font,
          personalization_details: { motif: item.motif },
        })),
      );
      if (itemsError) throw itemsError;

      const payment = await createStripeCheckout({
        data: { orderId, orderNumber, amount: cart.total, email: address.email },
      });

      saveLastOrder({
        orderNumber,
        items: cart.items,
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total,
        address,
      });

      if (payment.configured && payment.url) {
        window.location.href = payment.url;
        return;
      }

      cart.clear();
      navigate({ to: "/bestellung" });
    } catch (error) {
      console.error(error);
      toast.error("Die Bestellung konnte nicht gespeichert werden. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="text-4xl">Kasse</h1>

        <h2 className="mt-8 text-xl">Kundendaten</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.name} className={`text-sm ${"full" in f && f.full ? "sm:col-span-2" : ""}`}>
              <span className="mb-1.5 block text-muted-foreground">{f.label}</span>
              <Input
                type={"type" in f ? f.type : "text"}
                value={form[f.name]}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.name]: e.target.value }))}
                className="rounded-xl"
                required
              />
            </label>
          ))}
        </div>

        <h2 className="mt-10 text-xl">Versand</h2>
        <div className="mt-4 rounded-2xl border border-border bg-card p-5 text-sm">
          <p className="font-medium">Standardversand</p>
          <p className="text-muted-foreground">
            3–5 Werktage · {cart.shipping === 0 ? "kostenlos" : euro(cart.shipping)}
          </p>
        </div>

        <div className="mt-8 space-y-3 text-sm">
          <label className="flex items-start gap-3">
            <Checkbox checked={terms} onCheckedChange={(v) => setTerms(v === true)} />
            <span>Ich akzeptiere die AGB.</span>
          </label>
          <label className="flex items-start gap-3">
            <Checkbox checked={privacy} onCheckedChange={(v) => setPrivacy(v === true)} />
            <span>Ich habe die Datenschutzerklärung gelesen.</span>
          </label>
        </div>
      </div>

      <aside className="h-fit rounded-2xl bg-card p-6 shadow-soft">
        <h2 className="text-xl">Bestellübersicht</h2>
        <ul className="mt-5 space-y-4 text-sm">
          {cart.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3">
              <div>
                <p>
                  {item.quantity}× {item.name}
                </p>
                <p className="text-muted-foreground">
                  Größe {item.size} · {item.color}
                </p>
                {item.personalizationText && (
                  <p className="text-muted-foreground">
                    „{item.personalizationText}" · {item.threadColor} · {item.font}
                  </p>
                )}
                {item.motif && <p className="text-muted-foreground">Motiv: {item.motif}</p>}
              </div>
              <span>{euro(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Zwischensumme</dt>
            <dd>{euro(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Versandkosten</dt>
            <dd>{cart.shipping === 0 ? "Kostenlos" : euro(cart.shipping)}</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium">
            <dt>Gesamtbetrag</dt>
            <dd>{euro(cart.total)}</dd>
          </div>
        </dl>
        <Button type="submit" size="lg" disabled={loading} className="mt-6 w-full rounded-full">
          {loading ? "Bestellung wird erstellt…" : "Kostenpflichtig bestellen"}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Die Zahlung wird über Stripe abgewickelt, sobald die Zahlungsdaten hinterlegt sind. Der
          Zahlungsstatus wird ausschließlich serverseitig bestätigt.
        </p>
      </aside>
    </form>
  );
}
