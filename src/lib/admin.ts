import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AdminOrderItem = {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  size: string | null;
  color: string | null;
  personalization_text: string | null;
  thread_color: string | null;
  font: string | null;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  total: number;
  payment_status: string;
  production_status: string;
  shipping_status: string;
  order_items: AdminOrderItem[];
};

export const isAdminQuery = queryOptions({
  queryKey: ["is-admin"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (error) return false;
    return Boolean(data);
  },
});

export const adminOrdersQuery = queryOptions({
  queryKey: ["admin-orders"],
  queryFn: async (): Promise<AdminOrder[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as AdminOrder[];
  },
});
