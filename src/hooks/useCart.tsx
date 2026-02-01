import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  department: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setDepartment: (department: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  department: "",
  
  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find((i) => i.id === item.id);
    
    if (existingItem) {
      set({
        items: items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] });
    }
  },
  
  removeItem: (id) => {
    set({ items: get().items.filter((i) => i.id !== id) });
  },
  
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.id === id ? { ...i, quantity } : i
      ),
    });
  },
  
  setDepartment: (department) => set({ department }),
  
  clearCart: () => set({ items: [], department: "" }),
  
  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
  
  get totalPrice() {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
