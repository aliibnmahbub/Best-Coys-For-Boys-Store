import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase/firebaseConfig';
import { getUserProfile } from './services/firebase/authService';
import { useAuthStore } from './store/authStore';

// Layouts & Public Pages
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import Cart from './pages/public/Cart';
import Checkout from './pages/public/Checkout';
import OrderDetails from './pages/public/OrderDetails';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import LegalPageView from './pages/public/LegalPageView';

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ProductForm from './pages/admin/ProductForm';
import OrderManagement from './pages/admin/OrderManagement';
import LegalPageManagement from './pages/admin/LegalPageManagement';

export default function App() {
  const { setUser, setLoading, isLoading } = useAuthStore();

  // ফায়ারবেজ থেকে ইউজারের লগইন অবস্থা চেক করা
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid, firebaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  // ফায়ারবেজ চেক করার সময় লোডিং স্পিনার দেখাবে
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#374151',
              color: '#fff',
              borderRadius: '8px',
            },
          }} 
        />
        
        <Routes>
          {/* Public Layout Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<LegalPageView slug="privacy-policy" />} />
            <Route path="/terms" element={<LegalPageView slug="terms-and-conditions" />} />
            <Route path="/refund-policy" element={<LegalPageView slug="refund-policy" />} />
          </Route>

          {/* Admin Panel Routes (Protected) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="legal-pages" element={<LegalPageManagement />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}