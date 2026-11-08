import { useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, LayoutGrid, Facebook, Download, Sun, Moon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';

export default function PublicLayout() {
  const location = useLocation();
  // কার্টে কয়টি প্রোডাক্ট আছে তা জানার জন্য Zustand স্টোর ব্যবহার করা হলো
  const cartItemsCount = useCartStore((state) => state.getTotalItems());
  
  // ডার্ক মোড কন্ট্রোল করার জন্য Zustand স্টোর
  const { isDarkMode, toggleTheme, initTheme } = useThemeStore();

  // পেজ লোড হওয়ার সাথে সাথে থিম ইনিশিয়ালাইজ করা
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // বর্তমান পেজ অনুযায়ী বটম নেভিগেশনের কালার পরিবর্তন করার ফাংশন
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col relative transition-colors duration-300">
      {/* Top Header (সবসময় উপরে ফিক্সড থাকবে) */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 shadow-sm z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Section with Premium CSS/Icon Badge */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0 border border-blue-400/30">
              B
            </div>
            <span className="font-bold text-xl text-neutral-900 dark:text-white tracking-tight hidden sm:block">
              BEST Coys For Boys
            </span>
            <span className="font-bold text-xl text-neutral-900 dark:text-white tracking-tight sm:hidden">
              BEST Coys
            </span>
          </Link>

          {/* Desktop Search Bar (শুধুমাত্র ল্যাপটপ/ডেস্কটপে দেখাবে) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-100 dark:bg-neutral-700 dark:text-white dark:placeholder-neutral-400 rounded-full py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <Search className="absolute right-3 top-2.5 text-neutral-400 dark:text-neutral-400 w-5 h-5" />
          </div>

          {/* Right Actions (Install App, Theme Toggle, Search, Cart and User Profile) */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Install App Button (Direct Download Link) */}
            <a 
              href="https://drive.google.com/uc?export=download&id=1a7dyvylOtFPn6NboWuixIQxc0Vn9P-yQ"
              className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white border border-primary-200 dark:border-primary-800 hover:border-primary-500 px-2.5 py-1.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all"
            >
              <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden md:inline">Install App</span>
              <span className="inline md:hidden">App</span>
            </a>

            {/* Dark Mode Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 md:w-6 md:h-6" /> : <Moon className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            {/* Mobile Search Icon */}
            <button className="md:hidden text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              <Search className="w-6 h-6" />
            </button>
            
            {/* Desktop User Icon */}
            <Link to="/account" className="hidden md:flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              <User className="w-6 h-6" />
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-neutral-600 dark:text-neutral-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area (এখানে পেজের আসল কনটেন্ট দেখাবে) */}
      <main className="flex-1 pt-16 pb-20 md:pb-0 max-w-7xl mx-auto w-full text-neutral-900 dark:text-neutral-100">
        <Outlet />
      </main>

      {/* Floating Liquid Glass WhatsApp Button */}
      <a 
        href="https://wa.me/8801634709250?text=Hello!%20I%20want%20to%20know%20more%20about%20your%20products." 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-36 right-4 md:bottom-20 md:right-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/50 dark:border-neutral-700/50 text-[#25D366] p-3.5 rounded-full shadow-lg hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all z-40 flex items-center justify-center group hover:scale-110"
      >
        <svg className="w-6 h-6 fill-[#25D366] drop-shadow-sm" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.198-.198.347-.764.967-.937 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2 text-neutral-900 dark:text-white drop-shadow-sm">
          Chat on WhatsApp
        </span>
      </a>

      {/* Floating Liquid Glass Facebook Button */}
      <a 
        href="https://www.facebook.com/bestcoysforboys" 
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Visit our Facebook Page"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md border border-white/50 dark:border-neutral-700/50 text-[#1877F2] p-3.5 rounded-full shadow-lg hover:bg-white/60 dark:hover:bg-neutral-800/60 transition-all z-40 flex items-center justify-center group hover:scale-110"
      >
        <Facebook className="w-6 h-6 fill-[#1877F2] drop-shadow-sm" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-semibold px-0 group-hover:px-2 text-neutral-900 dark:text-white drop-shadow-sm">
          Chat on Facebook
        </span>
      </a>

      {/* Desktop & Mobile Footer */}
      <footer className="bg-white dark:bg-neutral-800 border-t dark:border-neutral-700 py-8 mt-auto mb-14 md:mb-0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-500 dark:text-neutral-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BEST Coys For Boys. All rights reserved.</p>
          
          {/* Footer Facebook Link & Legal Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://www.facebook.com/bestcoysforboys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-[#1877F2] dark:hover:text-[#1877F2] transition-colors font-medium"
            >
              <Facebook className="w-4 h-4 fill-[#1877F2] text-[#1877F2]" />
              <span>Facebook Page</span>
            </a>
            <Link to="/privacy-policy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Refund</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (শুধুমাত্র মোবাইলে নিচে ফিক্সড থাকবে) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 z-50 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)] transition-colors duration-300">
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
