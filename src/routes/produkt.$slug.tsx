import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SockPreview } from "@/components/sock-preview";
import { useCart } from "@/lib/cart";
import { euro, productQuery, type Product } from "@/lib/shop";

const SOCK_HEX: Record<string, string> = {
  Weiß: "#f7f6f2",
  Schwarz: "#1b1b1b",
  Creme: "#f0e8db",
  Grau: "#b9b9b6",
};

export const Route = createFileRoute("/produkt/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Produkt nicht gefunden | Fadenglück" }, { name: "robots", content: "noindex" }] };
    }
    return {
      meta: [
        { title: `${loaderData.name} – bestickte Socken | Fadenglück` },
        { name: "description", content: loaderData.short_description },
        { property: "og:title", content: `${loaderData.name} | Fadenglück` },
        { property: "og:description", content: loaderData.short_description },
      ],
    };
  },
  component: ProductDetail,
  errorComponent: () => <p className="container-page py-24">Produkt konnte nicht laden.</p>,
  notFoundComponent: () => (
    <p className="container-page py-24">Dieses Produkt gibt es nicht (mehr).</p>
  ),
});

function ProductDetail() {
  const product = Route.useLoaderData() as Product;
  const cart = useCart();
  const options = product.personalization_options[0];
  const isPersonalizable = product.product_type === "personalizable";
  const sizes = Array.from(new Set(product.product_variants.map((v) => v.size))).sort();
  const colors = Array.from(new Set(product.product_variants.map((v) => v.color)));

  const [image, setImage] = useState(product.images[0]!);
  const [zoom, setZoom] = useState(false);
  const [size, setSize] = useState(sizes[1] ?? sizes[0] ?? "39-42");
  const [color, setColor] = useState(colors[0] ?? product.base_color);
  const [quantity, setQuantity] = useState(1);
  const [text, setText] = useState("");
  const [thread, setThread] = useState(options?.available_thread_colors?.[0]);
  const [font, setFont] = useState(options?.available_fonts?.[0] ?? "Serif");
  const [motif, setMotif] = useState(options?.available_motifs?.[0] ?? null);

  const maxChars = options?.max_characters ?? 15;
  const textInvalid = isPersonalizable && text.trim().length === 0;

  const addToCart = () => {
    if (textInvalid) {
      toast.error("Bitte gib deinen Sticktext ein (max. 15 Zeichen).");
      return;
    }
    const variant = product.product_variants.find((v) => v.size === size && v.color === color);
    cart.add({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      image: product.images[0]!,
      price: product.price,
      size,
      color,
      quantity,
      personalizationText: isPersonalizable ? text.trim() : null,
      threadColor: isPersonalizable ? (thread?.name ?? null) : null,
      font: isPersonalizable ? font : null,
      motif: !isPersonalizable ? motif : null,
    });
    toast.success("In den Warenkorb gelegt");
  };

  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-2 lg:py-16">
      {/* Gallery */}
      <div>
        <div
          className="overflow-hidden rounded-3xl bg-secondary shadow-soft"
          onClick={() => setZoom((z) => !z)}
        >
          <img
            src={image}
            alt={product.name}
            width={1200}
            height={1200}
            className={`aspect-square w-full cursor-zoom-in object-cover transition-transform duration-500 ${
              zoom ? "scale-150 cursor-zoom-out" : ""
            }`}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Zum Zoomen auf das Bild tippen.</p>
        {product.images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {product.images.map((img) => (
              <button
                key={img}
                onClick={() => setImage(img)}
                className={`size-20 overflow-hidden rounded-xl border-2 ${
                  img === image ? "border-accent" : "border-transparent"
                }`}
              >
                <img src={img} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <h1 className="text-4xl md:text-5xl">{product.name}</h1>
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="flex gap-0.5 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-current" />
            ))}
          </span>
          4,9 · 128 Bewertungen
        </div>
        <p className="mt-5 text-2xl">{euro(product.price)}</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-8 space-y-6">
          <div>
            <p className="text-sm font-medium">Größe</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    s === size ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Farbe</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    c === color ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {isPersonalizable ? (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-2xl">Mach deine Socken einzigartig</h2>

              <label className="mt-4 block text-sm font-medium">
                Dein Text
                <Input
                  value={text}
                  maxLength={maxChars}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="z. B. MAMA"
                  className="mt-2 rounded-xl"
                />
              </label>
              <div className="mt-1.5 flex justify-between text-xs">
                <span className={textInvalid ? "text-destructive" : "text-muted-foreground"}>
                  {textInvalid ? "Bitte gib einen Text ein." : "Maximal 15 Zeichen."}
                </span>
                <span className="text-muted-foreground">
                  {text.length}/{maxChars}
                </span>
              </div>

              <p className="mt-5 text-sm font-medium">Stickfarbe</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {options?.available_thread_colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setThread(c)}
                    aria-label={c.name}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                      thread?.name === c.name ? "border-accent" : "border-border"
                    }`}
                  >
                    <span
                      className="size-4 rounded-full border border-border"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>

              <p className="mt-5 text-sm font-medium">Schriftart</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {options?.available_fonts.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFont(f)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      f === font ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <SockPreview
                  text={text.toUpperCase()}
                  threadColor={thread?.hex ?? "#111111"}
                  font={font}
                  sockColor={SOCK_HEX[color] ?? "#f0ece4"}
                />
              </div>
            </div>
          ) : (
            options?.available_motifs?.length ? (
              <div>
                <p className="text-sm font-medium">Motiv</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {options.available_motifs.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMotif(m)}
                      className={`rounded-full border px-4 py-2 text-sm ${
                        m === motif ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            ) : null
          )}

          <div>
            <p className="text-sm font-medium">Menge</p>
            <div className="mt-2 inline-flex items-center rounded-full border border-border">
              <button
                className="p-3"
                aria-label="Menge verringern"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="p-3"
                aria-label="Menge erhöhen"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">Gesamtpreis</span>
            <span className="text-2xl">{euro(product.price * quantity)}</span>
          </div>

          <Button size="lg" className="w-full rounded-full" onClick={addToCart}>
            {isPersonalizable ? "Jetzt personalisieren & in den Warenkorb" : "In den Warenkorb"}
          </Button>
        </div>
      </div>
    </div>
  );
}
