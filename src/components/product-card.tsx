import { Link } from "@tanstack/react-router";
import { euro, type Product } from "@/lib/shop";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/produkt/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          width={1200}
          height={1200}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.badge && (
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium tracking-wide text-accent-foreground">
              {product.badge}
            </span>
          )}
          {product.product_type === "personalizable" && (
            <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium">
              Personalisierbar
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="text-xl">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short_description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-base font-medium">{euro(product.price)}</span>
          <span className="text-sm text-accent underline-offset-4 group-hover:underline">
            Entdecken
          </span>
        </div>
      </div>
    </Link>
  );
}
