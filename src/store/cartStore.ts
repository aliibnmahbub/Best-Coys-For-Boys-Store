import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, selectedVariants?: Record<string, string>) => void;
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubTotal: () => number;
}

// Helper to check if two variants are identical
const variantsMatch = (v1?: Record<string, string>, v2?: Record<string, string>) => {
  if (!v1 && !v2) return true;
  if (!v1 || !v2) return false;
  const keys1 = Object.keys(v1);
  const keys2 = Object.keys(v2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(key => v1[key] === v2[key]);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId && variantsMatch(i.selectedVariants, item.selectedVariants)
          );

          if (existingItemIndex > -1) {
            // Item exists, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += item.quantity;
            return { items: updatedItems };
          }

          // Item does not exist, add as new
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId, selectedVariants) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && variantsMatch(i.selectedVariants, selectedVariants))
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedVariants) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId === productId && variantsMatch(i.selectedVariants, selectedVariants)) {
              return { ...i, quantity: Math.max(1, quantity) }; // Minimum quantity is 1
            }
            return i;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'best-coys-cart-storage', // Key for localStorage
    }
  )
);