import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, MapPin, Phone, User } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import type { Order } from '../../types';

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const docRef = doc(db, 'orders', orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <Helmet>
          <title>Order Not Found | BEST Coys For Boys</title>
        </Helmet>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">{error || 'Order not found'}</h2>
        <p className="text-neutral-600 mb-6">The order you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="bg-primary-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const currentStatusIndex = orderStatuses.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>Order #{order.id.slice(-6)} | BEST Coys For Boys</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase bg-primary-100 text-primary-700">
          {order.orderStatus}
        </span>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 mb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Order ID: #{order.id}</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm text-neutral-500">Total Amount: </span>
            <span className="text-lg font-bold text-primary-600">৳{order.total}</span>
          </div>
        </div>

        {/* Visual Order Progress Tracker */}
        {order.orderStatus !== 'cancelled' ? (
          <div className="py-4">
            <h3 className="text-sm font-semibold text-neutral-800 mb-4">Order Progress</h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {orderStatuses.map((st, index) => {
                const isCompleted = index <= currentStatusIndex;
                return (
                  <div key={st} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-colors ${
                      isCompleted ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-[10px] md:text-xs capitalize font-medium ${
                      isCompleted ? 'text-neutral-900 font-semibold' : 'text-neutral-400'
                    }`}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm font-semibold">
            This order has been cancelled.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Delivery Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-3">
          <h3 className="font-bold text-neutral-900 border-b pb-2">Delivery Information</h3>
          <div className="text-sm space-y-2 text-neutral-600">
            <p className="flex items-center gap-2"><User className="w-4 h-4 text-neutral-400" /> <span className="font-medium text-neutral-800">{order.deliveryInfo.fullName}</span></p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-neutral-400" /> <span className="font-medium text-neutral-800">{order.deliveryInfo.phone}</span></p>
            <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-neutral-400 mt-0.5" /> <span className="font-medium text-neutral-800">{order.deliveryInfo.address}, {order.deliveryInfo.area}</span></p>
            {order.deliveryInfo.note && (
              <p className="text-xs bg-neutral-50 p-2 rounded-lg mt-2"><span className="font-semibold">Note:</span> {order.deliveryInfo.note}</p>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-3">
          <h3 className="font-bold text-neutral-900 border-b pb-2">Payment Details</h3>
          <div className="text-sm space-y-2 text-neutral-600">
            <p className="flex justify-between"><span>Method:</span> <span className="font-semibold text-neutral-800 uppercase">{order.paymentMethod}</span></p>
            <p className="flex justify-between"><span>Payment Status:</span> <span className={`font-semibold uppercase ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span></p>
            <p className="flex justify-between"><span>Subtotal:</span> <span className="font-semibold text-neutral-800">৳{order.subTotal}</span></p>
            <p className="flex justify-between"><span>Delivery Charge:</span> <span className="font-semibold text-neutral-800">৳{order.deliveryCharge}</span></p>
            <p className="flex justify-between border-t pt-2 text-base font-bold text-neutral-900"><span>Total:</span> <span className="text-primary-600">৳{order.total}</span></p>
          </div>
        </div>
      </div>

      {/* Ordered Items */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
        <h3 className="font-bold text-neutral-900 border-b pb-2">Ordered Products</h3>
        <div className="divide-y divide-neutral-100">
          {order.items.map((item, index) => (
            <div key={index} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl bg-neutral-100 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-neutral-800">{item.name}</h4>
                  <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-sm text-neutral-900">৳{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}