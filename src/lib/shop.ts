import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ThreadColor = { name: string; hex: string };

export type PersonalizationOption = {
  id: string;
  max_characters: number;
  available_thread_colors: ThreadColor[];
  available_fonts: string[];
  available_motifs: string[];
};

export type Variant = {
  id: string;
  size: string;
  color: string;
  stock_quantity: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  price: number;
  category: string;
  product_type: "personalizable" | "ready_made";
  badge: string | null;
  base_color: string;
  images: string[];
  popularity: number;
  created_at: string;
  product_variants: Variant[];
  personalization_options: PersonalizationOption[];
};

const SELECT = "*, product_variants(*), personalization_options(*)";

function normalize(row: Record<string, unknown>): Product {
  const p = row as unknown as Product;
  return {
    ...p,
    price: Number(p.price),
    images: p.images?.length ? p.images : ["/images/product-classic-white.jpg"],
    personalization_options: (p.personalization_options ?? []).map((o) => ({
      ...o,
      available_thread_colors: (o.available_thread_colors ?? []) as ThreadColor[],
      available_fonts: (o.available_fonts ?? []) as string[],
      available_motifs: (o.available_motifs ?? []) as string[],
    })),
  };
}

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(SELECT)
      .eq("active", true)
      .order("popularity", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(normalize);
  },
});

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products")
        .select(SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? normalize(data) : null;
    },
  });

export const euro = (value: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);

export const SHIPPING_COST = 3.9;
export const FREE_SHIPPING_FROM = 50;

export const CATEGORY_LABELS: Record<string, string> = {
  alle: "Alle Socken",
  personalisierbar: "Personalisierbare Socken",
  "fertig-bestickt": "Fertig bestickte Socken",
  geschenke: "Geschenke",
};

export const SIZES = ["35-38", "39-42", "43-46"];

export const PRODUCTION_STATUSES = [
  "offen",
  "in_vorbereitung",
  "in_produktion",
  "qualitaetskontrolle",
  "fertig",
  "versendet",
] as const;

export const PRODUCTION_LABELS: Record<string, string> = {
  offen: "Offen",
  in_vorbereitung: "In Vorbereitung",
  in_produktion: "In Produktion",
  qualitaetskontrolle: "Qualitätskontrolle",
  fertig: "Fertig",
  versendet: "Versendet",
};
