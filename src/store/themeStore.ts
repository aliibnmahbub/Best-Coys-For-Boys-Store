import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false, // ডিফল্টভাবে লাইট মোড থাকবে
      
      toggleTheme: () => {
        const newDarkMode = !get().isDarkMode;
        set({ isDarkMode: newDarkMode });
        
        // HTML ট্যাগে 'dark' ক্লাস যুক্ত বা রিমুভ করা
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      initTheme: () => {
        const isDark = get().isDarkMode;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'theme-storage', // লোকাল স্টোরেজে এই নামে সেভ থাকবে
    }
  )
);
