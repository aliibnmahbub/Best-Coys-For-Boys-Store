import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// উইশলিস্টের জন্য প্রোডাক্টের প্রয়োজনীয় ডাটা টাইপ
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string; // Cloudinary URL
  slug: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      // নতুন প্রোডাক্ট উইশলিস্টে যোগ করা
      addItem: (item) => {
        const currentItems = get().items;
        // যদি প্রোডাক্ট আগে থেকেই না থাকে, তবেই যোগ করবে
        if (!currentItems.find((i) => i.id === item.id)) {
          set({ items: [...currentItems, item] });
        }
      },

      // উইশলিস্ট থেকে প্রোডাক্ট রিমুভ করা
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      // প্রোডাক্ট উইশলিস্টে আছে কি না তা চেক করা
      isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
      },

      // পুরো উইশলিস্ট ক্লিয়ার করা
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'best-coys-wishlist-storage', // Key for localStorage
    }
  )
);