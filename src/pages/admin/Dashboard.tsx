import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  ArrowRight 
} from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import type { Order, Product } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে ড্যাশবোর্ডের জন্য লাইভ ডেটা ফেচ করা
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ১. অর্ডার ডেটা ফেচ করা
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let totalOrd = 0;
        let pendingOrd = 0;
        let completedOrd = 0;
        let revenue = 0;
        const ordersList: Order[] = [];

        ordersSnap.forEach((doc) => {
          const data = doc.data() as Order;
          totalOrd++;
          if (data.orderStatus === 'pending') pendingOrd++;
          if (data.orderStatus === 'delivered') {
            completedOrd++;
            revenue += data.total || 0;
          }
         ordersList.push({ ...data, id: doc.id });
        });

        // সাম্প্রতিক অর্ডারগুলো সাজানো (নতুনগুলো আগে)
        ordersList.sort((a, b) => b.createdAt - a.createdAt);

        // ২. প্রোডাক্ট ডেটা ফেচ করা
        const productsSnap = await getDocs(collection(db, 'products'));
        let prodCount = 0;
        const lowStock: Product[] = [];
        productsSnap.forEach((doc) => {
          const prod = { ...doc.data(), id: doc.id } as Product;
          prodCount++;
          if (prod.stock <= 5) {
            lowStock.push(prod);
          }
        });

        // ৩. কাস্টমার ডেটা ফেচ করা
        const usersSnap = await getDocs(collection(db, 'users'));
        let userCount = 0;
        usersSnap.forEach(() => {
          userCount++;
        });

        setStats({
          totalOrders: totalOrd,
          pendingOrders: pendingOrd,
          completedOrders: completedOrd,
          totalRevenue: revenue,
          totalProducts: prodCount,
          totalCustomers: userCount,
        });

        setRecentOrders(ordersList.slice(0, 5)); // সেরা ৫টি সাম্প্রতিক অর্ডার
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Admin Dashboard | BEST Coys For Boys</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-sm text-neutral-500">Welcome back! Here is what's happening in your store today.</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Revenue</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">৳{stats.totalRevenue}</h3>
          </div>
          <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalOrders}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Pending Orders</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingOrders}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Products</p>
            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{stats.totalProducts}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm text-neutral-500 py-8 text-center">No orders found yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 text-xs uppercase">
                    <th className="pb-3 font-semibold">Order ID</th>
                    <th className="pb-3 font-semibold">Customer</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 font-medium text-neutral-900">#{ord.id.slice(-6)}</td>
                      <td className="py-3 text-neutral-600">{ord.deliveryInfo.fullName}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          ord.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                          ord.orderStatus === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-semibold text-neutral-900">৳{ord.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Alerts
            </h2>
            <Link to="/admin/products" className="text-xs font-semibold text-primary-600 hover:text-primary-700">Manage</Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-neutral-500 py-8 text-center">All products are well-stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg bg-neutral-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{prod.name}</p>
                      <p className="text-xs text-red-600 font-medium">Stock left: {prod.stock}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}