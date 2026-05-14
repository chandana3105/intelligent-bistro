import { create } from "zustand";

export interface CartItem {
  cartKey: string;     // unique per (id + note)
  id: string;          // menu item id
  name: string;
  price: number;
  quantity: number;
  emoji: string;
  note?: string;
}

export interface MenuItemOption {
  name: string;
  choices: string[];
  default?: string;
  multi?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  tags: string[];
  emoji: string;
  image?: string;
  options?: MenuItemOption[];
}

const makeCartKey = (id: string, note?: string): string =>
  note ? `${id}::${note}` : id;

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number, note?: string) => void;
  removeRow: (cartKey: string) => void;
  updateRowQuantity: (cartKey: string, quantity: number) => void;
  // AI integration — work by menu item id (aggregated across customizations)
  removeItem: (itemId: string, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getCartContext: () => { itemId: string; quantity: number; name: string; note?: string }[];
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (menuItem, quantity = 1, note) => {
    const cartKey = makeCartKey(menuItem.id, note);
    set((state) => {
      const existing = state.items.find((i) => i.cartKey === cartKey);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            cartKey,
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity,
            emoji: menuItem.emoji,
            note,
          },
        ],
      };
    });
  },

  removeRow: (cartKey) => {
    set((state) => ({ items: state.items.filter((i) => i.cartKey !== cartKey) }));
  },

  updateRowQuantity: (cartKey, quantity) => {
    if (quantity <= 0) {
      get().removeRow(cartKey);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.cartKey === cartKey ? { ...i, quantity } : i)),
    }));
  },

  // AI-driven: remove `quantity` from any rows with this menu id (or all rows if undefined)
  removeItem: (itemId, quantity) => {
    set((state) => {
      if (quantity === undefined) {
        return { items: state.items.filter((i) => i.id !== itemId) };
      }
      let remaining = quantity;
      const next = state.items
        .map((i) => {
          if (i.id !== itemId || remaining <= 0) return i;
          const take = Math.min(i.quantity, remaining);
          remaining -= take;
          return { ...i, quantity: i.quantity - take };
        })
        .filter((i) => i.quantity > 0);
      return { items: next };
    });
  },

  // AI-driven: set total qty for first row matching id (simple — customized rows are kept distinct)
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => {
      const rows = state.items.filter((i) => i.id === itemId);
      if (rows.length === 0) return state;
      // Set the first row to target quantity, leave others alone
      const firstKey = rows[0].cartKey;
      return {
        items: state.items.map((i) =>
          i.cartKey === firstKey ? { ...i, quantity } : i
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  getCartContext: () =>
    get().items.map((i) => ({
      itemId: i.id,
      quantity: i.quantity,
      name: i.name,
      note: i.note,
    })),
}));
