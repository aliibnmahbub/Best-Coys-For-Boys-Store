import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, LayoutGrid, Facebook, Moon, Sun } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function PublicLayout() {
  const location = useLocation();
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  // Dark Mode State Management with safe local storage check
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col relative transition-colors duration-300">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 shadow-sm z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block text-neutral-900 dark:text-white">
              BEST Coys For Boys
            </span>
            <span className="font-bold text-xl tracking-tight sm:hidden text-neutral-900 dark:text-white">
              BEST Coys
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-full py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-primary-500 transition-all border border-transparent dark:border-neutral-700"
            />
            <Search className="absolute right-3 top-2.5 text-neutral-400 w-5 h-5" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="md:hidden text-neutral-600 dark:text-neutral-300 hover:text-primary-500 transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/50 dark:hover:text-primary-400 transition-all shadow-sm"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <Link to="/account" className="hidden md:flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 transition-colors p-2">
              <User className="w-5 h-5" />
            </Link>

            <Link to="/cart" className="relative text-neutral-600 dark:text-neutral-300 hover:text-primary-500 transition-colors p-2">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-20 md:pb-0 max-w-7xl mx-auto w-full transition-colors duration-300">
        <Outlet />
      </main>

      {/* Floating Liquid Glass Facebook Button */}
      <a 
        href="https://www.facebook.com/bestcoysforboys" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Visit our Facebook Page"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md border border-white/50 dark:border-white/10 text-[#1877F2] p-3.5 rounded-full shadow-lg hover:bg-white/60 dark:hover:bg-neutral-900/60 transition-all z-40 flex items-center justify-center group hover:scale-110"
      >
        <Facebook className="w-6 h-6 fill-[#1877F2] drop-shadow-sm" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2 text-neutral-900 dark:text-neutral-100 drop-shadow-sm">
          Chat on Facebook
        </span>
      </a>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-8 mt-auto mb-14 md:mb-0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-500 dark:text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BEST Coys For Boys. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://www.facebook.com/bestcoysforboys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-[#1877F2] transition-colors font-medium"
            >
              <Facebook className="w-4 h-4 fill-[#1877F2] text-[#1877F2]" />
              <span>Facebook Page</span>
            </a>
            <Link to="/privacy-policy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
            <Link to="/refund-property" className="hover:text-primary-600 transition-colors">Refund</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-50 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
        <div className="flex items-center justify-around h-14">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-primary-500' : 'text-neutral-400 dark:text-neutral-500'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          
          <Link to="/categories" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/categories') ? 'text-primary-500' : 'text-neutral-400 dark:text-neutral-500'}`}>
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Categories</span>
          </Link>
          
          <Link to="/cart" className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive('/cart') ? 'text-primary-500' : 'text-neutral-400 dark:text-neutral-500'}`}>
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </Link>
          
          <Link to="/account" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/account') ? 'text-primary-500' : 'text-neutral-400 dark:text-neutral-500'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
