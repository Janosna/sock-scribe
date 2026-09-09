import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/shop", label: "Personalisieren", search: { kategorie: "personalisierbar" } },
  { to: "/ueber-uns", label: "Über uns" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button
          className="md:hidden -ml-2 p-2 text-foreground"
          onClick={() => setMobile((v) => !v)}
          aria-label="Menü"
        >
          {mobile ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="font-display text-2xl tracking-tight">
          Fadenglück
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={"search" in item ? (item.search as never) : undefined}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Warenkorb öffnen"
            className="relative rounded-full"
            onClick={() => setOpen(true)}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[11px] font-medium text-accent-foreground">
                {count}
              </span>
            )}
          </Button>
        </div>
      </div>

      {mobile && (
        <nav className="border-t border-border bg-background px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-3 text-base">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  search={"search" in item ? (item.search as never) : undefined}
                  onClick={() => setMobile(false)}
                  className="block py-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
