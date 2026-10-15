import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Order, OrderStatus, PaymentStatus } from '../../types';

const statuses: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ফায়ারস্টোর থেকে সমস্ত অর্ডার ফেচ করা
  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const list: Order[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      // নতুন অর্ডারগুলো আগে দেখানোর জন্য সর্ট করা
      list.sort((a, b) => b.createdAt - a.createdAt);
      setOrders(list);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        orderStatus: newStatus,
        updatedAt: Date.now()
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order status updated to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  // পেমেন্ট স্ট্যাটাস আপডেট করার ফাংশন
  const handlePaymentStatusChange = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        paymentStatus: newPaymentStatus,
        updatedAt: Date.now()
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o));
      toast.success(`Payment status updated to ${newPaymentStatus.toUpperCase()}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  // সার্চ এবং স্ট্যাটাস ফিল্টার
  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.deliveryInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.deliveryInfo.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

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
        <title>Manage Orders | Admin Panel</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Orders Management</h1>
        <p className="text-sm text-neutral-500">View and update customer order statuses.</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search by Order ID, Name, or Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-2.5 text-neutral-400 w-4 h-4" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filterStatus === 'all' ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                filterStatus === st ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No orders found</p>
            <p className="text-xs text-neutral-400 mt-1">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 text-xs uppercase">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Customer & Address</th>
                  <th className="py-3 px-4 font-semibold">Items</th>
                  <th className="py-3 px-4 font-semibold">Total</th>
                  <th className="py-3 px-4 font-semibold">Payment Status</th>
                  <th className="py-3 px-4 font-semibold">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-neutral-900">
                      #{order.id.slice(-6)}
                      <span className="block text-[10px] text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-neutral-900">{order.deliveryInfo.fullName}</p>
                      <p className="text-xs text-neutral-500">{order.deliveryInfo.phone}</p>
                      <p className="text-[11px] text-neutral-400 truncate max-w-xs">{order.deliveryInfo.address}, {order.deliveryInfo.area}</p>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 text-xs">
                      {order.items.length} item(s)
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      ৳{order.total}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)}
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-lg border focus:outline-none ${
                          order.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-lg border focus:outline-none ${
                          order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800 border-green-300' :
                          order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800 border-red-300' :
                          order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                      >
                        {statuses.map(st => (
                          <option key={st} value={st}>{st.toUpperCase()}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}