import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, LogOut, MapPin, Phone, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../services/firebase/authService';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Order } from '../../types';

export default function Account() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে লগইন করা ইউজারের আগের অর্ডারগুলো ফেচ করা
  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const myOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          myOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        // নতুন অর্ডারগুলো আগে দেখানোর জন্য সর্ট করা
        myOrders.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(myOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load order history');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  // ইউজার যদি লগইন করা না থাকে, তবে লগইন পেজে পাঠিয়ে দেবে
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Helmet>
        <title>My Account | BEST Coys For Boys</title>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar / Profile Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 text-center">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 uppercase">
              {user.displayName ? user.displayName.charAt(0) : 'U'}
            </div>
            <h2 className="text-xl font-bold text-neutral-900">{user.displayName || 'Customer'}</h2>
            <p className="text-sm text-neutral-500 mb-6">{user.email}</p>

            <div className="space-y-3 text-left">
              {user.phone && (
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <Phone className="w-4 h-4 text-neutral-400" />
                  {user.phone}
                </div>
              )}
              {user.address && (
                <div className="flex items-start gap-3 text-sm text-neutral-600">
                  <MapPin className="w-4 h-4 text-neutral-400 mt-1" />
                  {user.address}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold py-2.5 rounded-xl hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content / Order History */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100">
            <h2 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-primary-500" />
              Order History
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No orders yet</h3>
                <p className="text-sm text-neutral-500 mb-6">Looks like you haven't placed any orders.</p>
                <Link
                  to="/"
                  className="bg-primary-500 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary-600 transition-colors inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Link
                    key={order.id}
                    to={`/orders/${order.id}`}
                    className="block bg-neutral-50 hover:bg-primary-50 border border-neutral-100 hover:border-primary-200 rounded-2xl p-4 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-neutral-900">Order #{order.id.slice(-6)}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                            order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} Item(s)
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="font-bold text-primary-600">৳{order.total}</span>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}