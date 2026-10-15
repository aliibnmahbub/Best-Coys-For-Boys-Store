import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Truck, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getSubTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  // Form States
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    area: 'Dhaka',
    note: '',
  });

  const subtotal = getSubTotal();
  const deliveryCharge = formData.area === 'Dhaka' ? 60 : 120; // ঢাকার ভেতরে ৬০ টাকা, বাইরে ১২০ টাকা
  const total = subtotal + (items.length > 0 ? deliveryCharge : 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error('Please fill in all required delivery information.');
      return;
    }

    setLoading(true);

    try {
      // অর্ডার অবজেক্ট তৈরি
      const orderData = {
        customerId: user ? user.uid : 'guest-user',
        items: items,
        subTotal: subtotal,
        deliveryCharge: deliveryCharge,
        discount: 0,
        total: total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        orderStatus: 'pending', // Initial status
        deliveryInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          area: formData.area,
          note: formData.note,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Firestore এর 'orders' কালেকশনে সেভ করা
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // কার্ট ক্লিয়ার করা
      clearCart();
      
      toast.success('Order placed successfully!');
      
      // সফল হওয়ার পর কনফার্মেশন বা অর্ডার পেজে রিডাইরেক্ট করা
      navigate(`/orders/${docRef.id}`);
    } catch (error: any) {
      console.error('Order Error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Checkout | BEST Coys For Boys</title>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">Checkout</h1>

      <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery Information Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary-500" />
              Delivery Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Delivery Address *</label>
              <textarea
                name="address"
                required
                rows={2}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="House/Road, Area, City"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Delivery Area *</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Dhaka">Inside Dhaka (Charge: ৳60)</option>
                  <option value="Outside Dhaka">Outside Dhaka (Charge: ৳120)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Order Note (Optional)</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Special instructions for delivery"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-4">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary-500" />
              Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-primary-500 bg-primary-50/30' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="block font-semibold text-neutral-900 text-sm">Cash on Delivery</span>
                    <span className="block text-xs text-neutral-500">Pay with cash upon delivery</span>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-primary-500' : 'text-transparent'}`} />
              </label>

              <label 
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'online' ? 'border-primary-500 bg-primary-50/30' : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <span className="block font-semibold text-neutral-900 text-sm">Online Payment</span>
                    <span className="block text-xs text-neutral-500">BKash, Nagad, Card (Coming Soon)</span>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${paymentMethod === 'online' ? 'text-primary-500' : 'text-transparent'}`} />
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 h-fit space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 border-b pb-3">Your Order</h3>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {items.map((item) => {
              const variantKey = `${item.productId}-${JSON.stringify(item.selectedVariants || {})}`;
              return (
                <div key={variantKey} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 truncate">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-neutral-100 flex-shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-neutral-800 truncate">{item.name}</p>
                      <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-900">৳{item.price * item.quantity}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-sm border-t pt-3">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Delivery Charge</span>
              <span className="font-semibold text-neutral-900">৳{deliveryCharge}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold text-neutral-900">
              <span>Total</span>
              <span className="text-primary-600">৳{total}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Confirm Order (৳{total})
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}