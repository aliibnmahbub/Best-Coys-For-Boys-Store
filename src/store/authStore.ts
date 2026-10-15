import { create } from 'zustand';
import type { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // ওয়েবসাইটের শুরুতে ফায়ারবেজ চেক করার সময় লোডিং দেখাবে

  // ফায়ারবেজ থেকে ইউজার পেলে স্টোরে সেট করবে
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  // লোডিং স্টেট পরিবর্তন করার জন্য
  setLoading: (isLoading) => set({ isLoading }),

  // লগআউট করার সময় সব ডাটা ক্লিয়ার করবে
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));