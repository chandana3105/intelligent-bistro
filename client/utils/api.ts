// iOS Simulator / web: use "http://localhost:3001"
// Android Emulator:    use "http://10.0.2.2:3001"
// Physical device:     use your machine's LAN IP (run `ipconfig` to find it)
export const API_BASE_URL = "http://192.168.0.240:3001";

export interface ParseOrderResponse {
  message: string;
  actions: OrderAction[];
  suggestions: string[];
}

export interface OrderAction {
  type: "add" | "remove" | "update_quantity" | "clear_cart" | "none";
  itemId?: string;
  quantity?: number;
  note?: string;
  item?: {
    id: string;
    name: string;
    price: number;
    emoji: string;
    description: string;
    category: string;
    tags: string[];
  };
}

export const parseOrder = async (
  message: string,
  cartContext: { itemId: string; quantity: number; name: string }[]
): Promise<ParseOrderResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/orders/parse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, cartContext }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to parse order");
  }

  return res.json();
};

export const fetchMenu = async () => {
  const res = await fetch(`${API_BASE_URL}/api/orders/menu`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  return res.json();
};
