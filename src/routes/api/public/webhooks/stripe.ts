import { createFileRoute } from "@tanstack/react-router";

/**
 * Stripe-Webhook: einzige Stelle, an der eine Bestellung als bezahlt markiert wird.
 * Die Signatur wird serverseitig geprüft; ohne gültige Signatur passiert nichts.
 */
export const Route = createFileRoute("/api/public/webhooks/stripe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        if (!secret) {
          return new Response("Stripe webhook not configured", { status: 503 });
        }

        const signatureHeader = request.headers.get("stripe-signature") ?? "";
        const body = await request.text();

        const parts = Object.fromEntries(
          signatureHeader.split(",").map((p) => {
            const [k, v] = p.split("=");
            return [k ?? "", v ?? ""];
          }),
        );
        const timestamp = parts["t"];
        const provided = parts["v1"];
        if (!timestamp || !provided) return new Response("Invalid signature", { status: 401 });

        const encoder = new TextEncoder();
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"],
        );
        const digest = await crypto.subtle.sign(
          "HMAC",
          key,
          encoder.encode(`${timestamp}.${body}`),
        );
        const expected = Array.from(new Uint8Array(digest))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        if (expected.length !== provided.length) {
          return new Response("Invalid signature", { status: 401 });
        }
        let mismatch = 0;
        for (let i = 0; i < expected.length; i++) {
          mismatch |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
        }
        if (mismatch !== 0) return new Response("Invalid signature", { status: 401 });

        const event = JSON.parse(body) as {
          type: string;
          data: { object: { id: string; metadata?: { order_id?: string } } };
        };

        if (event.type === "checkout.session.completed") {
          const orderId = event.data.object.metadata?.order_id;
          if (orderId) {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin
              .from("orders")
              .update({
                payment_status: "paid",
                production_status: "in_vorbereitung",
                stripe_session_id: event.data.object.id,
              })
              .eq("id", orderId);
          }
        }

        return new Response("ok");
      },
    },
  },
});
