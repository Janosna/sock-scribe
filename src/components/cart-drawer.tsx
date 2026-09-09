import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { euro } from "@/lib/shop";

export function CartDrawer() {
  const cart = useCart();

  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Dein Warenkorb</SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted-foreground">Noch keine Socken ausgewählt.</p>
            <Button asChild onClick={() => cart.setOpen(false)}>
              <Link to="/shop">Socken entdecken</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
              {cart.items.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="size-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex-1 text-sm">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium">{item.name}</p>
                      <p className="font-medium">{euro(item.price * item.quantity)}</p>
                    </div>
                    <p className="text-muted-foreground">
                      Größe {item.size} · {item.color}
                    </p>
                    {item.personalizationText && (
                      <p className="text-muted-foreground">
                        Sticktext: „{item.personalizationText}" · {item.threadColor} · {item.font}
                      </p>
                    )}
                    {item.motif && <p className="text-muted-foreground">Motiv: {item.motif}</p>}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          className="p-1.5"
                          aria-label="Menge verringern"
                          onClick={() => cart.setQuantity(item.key, item.quantity - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          className="p-1.5"
                          aria-label="Menge erhöhen"
                          onClick={() => cart.setQuantity(item.key, item.quantity + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        className="p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                        aria-label="Produkt entfernen"
                        onClick={() => cart.remove(item.key)}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border px-5 py-5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zwischensumme</span>
                <span>{euro(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versand</span>
                <span>{cart.shipping === 0 ? "Kostenlos" : euro(cart.shipping)}</span>
              </div>
              <div className="flex justify-between text-base font-medium">
                <span>Gesamt</span>
                <span>{euro(cart.total)}</span>
              </div>
              <Button asChild className="w-full rounded-full" size="lg">
                <Link to="/checkout" onClick={() => cart.setOpen(false)}>
                  Zur Kasse
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full rounded-full">
                <Link to="/warenkorb" onClick={() => cart.setOpen(false)}>
                  Warenkorb ansehen
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
