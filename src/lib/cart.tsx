import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { FREE_SHIPPING_FROM, SHIPPING_COST } from "./shop";

export type CartItem = {
  key: string;
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  personalizationText: string | null;
  threadColor: string | null;
  font: string | null;
  motif: string | null;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "key">) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "socken-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
    return {
      items,
      open,
      setOpen,
      add: (item) => {
        const key = [
          item.productId,
          item.size,
          item.color,
          item.personalizationText ?? "",
          item.threadColor ?? "",
          item.font ?? "",
          item.motif ?? "",
        ].join("|");
        setItems((prev) => {
          const existing = prev.find((i) => i.key === key);
          if (existing) {
            return prev.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i,
            );
          }
          return [...prev, { ...item, key }];
        });
        setOpen(true);
      },
      setQuantity: (key, quantity) =>
        setItems((prev) =>
          prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)),
        ),
      remove: (key) => setItems((prev) => prev.filter((i) => i.key !== key)),
      clear: () => setItems([]),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export type PlacedOrder = {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  address: {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    houseNumber: string;
    zip: string;
    city: string;
    country: string;
  };
};

const ORDER_KEY = "socken-last-order";

export function saveLastOrder(order: PlacedOrder) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function loadLastOrder(): PlacedOrder | null {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
