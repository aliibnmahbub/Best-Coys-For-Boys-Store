import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, User, LayoutGrid } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

export default function PublicLayout() {
  const location = useLocation();
  // কার্টে কয়টি প্রোডাক্ট আছে তা জানার জন্য Zustand স্টোর ব্যবহার করা হলো
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  // বর্তমান পেজ অনুযায়ী বটম নেভিগেশনের কালার পরিবর্তন করার ফাংশন
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Top Header (সবসময় উপরে ফিক্সড থাকবে) */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              B
            </div>
            <span className="font-bold text-xl text-neutral-900 tracking-tight hidden sm:block">
              BEST Coys For Boys
            </span>
            <span className="font-bold text-xl text-neutral-900 tracking-tight sm:hidden">
              BEST Coys
            </span>
          </Link>

          {/* Desktop Search Bar (শুধুমাত্র ল্যাপটপ/ডেস্কটপে দেখাবে) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full bg-neutral-100 rounded-full py-2 pl-4 pr-10 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <Search className="absolute right-3 top-2.5 text-neutral-400 w-5 h-5" />
          </div>

          {/* Right Actions (Cart and User Profile) */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Icon */}
            <button className="md:hidden text-neutral-600 hover:text-primary-500 transition-colors">
              <Search className="w-6 h-6" />
            </button>
            
            {/* Desktop User Icon */}
            <Link to="/account" className="hidden md:flex items-center gap-1 text-neutral-600 hover:text-primary-500 transition-colors">
              <User className="w-6 h-6" />
            </Link>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative text-neutral-600 hover:text-primary-500 transition-colors">
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
      {/* pt-16 দেওয়া হয়েছে কারণ উপরে ১৬px এর হেডার আছে, pb-16 মোবাইলের বটম নেভের জন্য */}
      <main className="flex-1 pt-16 pb-16 md:pb-0 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Desktop Footer (শুধুমাত্র বড় স্ক্রিনে দেখাবে) */}
      <footer className="hidden md:block bg-white border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-neutral-500">
          <p>&copy; {new Date().getFullYear()} BEST Coys For Boys. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Bottom Navigation (শুধুমাত্র মোবাইলে নিচে ফিক্সড থাকবে) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 safe-bottom shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around h-14">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-primary-500' : 'text-neutral-400'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          
          <Link to="/categories" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/categories') ? 'text-primary-500' : 'text-neutral-400'}`}>
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Categories</span>
          </Link>
          
          <Link to="/cart" className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive('/cart') ? 'text-primary-500' : 'text-neutral-400'}`}>
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
          
          <Link to="/account" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/account') ? 'text-primary-500' : 'text-neutral-400'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}