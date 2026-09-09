import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  orderId: z.string().uuid(),
  orderNumber: z.string().min(1),
  amount: z.number().positive(),
  email: z.string().email(),
});

/**
 * Stripe-Vorbereitung.
 *
 * Sobald der Stripe-Secret-Key als Server-Secret hinterlegt ist, wird hier eine
 * Checkout-Session erzeugt und deren URL zurückgegeben. Der Zahlungsstatus wird
 * NIEMALS vom Frontend gesetzt, sondern ausschließlich serverseitig über den
 * Webhook (/api/public/webhooks/stripe) verifiziert und geschrieben.
 */
export const createStripeCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const secretKey = process.env["STRIPE_SECRET_KEY"];
    if (!secretKey) {
      return { configured: false as const, url: null };
    }

    const params = new URLSearchParams({
      mode: "payment",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "eur",
      "line_items[0][price_data][unit_amount]": Math.round(data.amount * 100).toString(),
      "line_items[0][price_data][product_data][name]": `Bestellung ${data.orderNumber}`,
      customer_email: data.email,
      client_reference_id: data.orderId,
      "metadata[order_id]": data.orderId,
      success_url: `${process.env["PUBLIC_SITE_URL"] ?? ""}/bestellung`,
      cancel_url: `${process.env["PUBLIC_SITE_URL"] ?? ""}/checkout`,
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!response.ok) throw new Error("Stripe-Checkout konnte nicht erstellt werden.");
    const session = (await response.json()) as { url: string };
    return { configured: true as const, url: session.url };
  });
