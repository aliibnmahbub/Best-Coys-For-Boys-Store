import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, getSubTotal, clearCart } = useCartStore();
  const subtotal = getSubTotal();
  const deliveryCharge = items.length > 0 ? 60 : 0; // স্ট্যান্ডার্ড ডেলিভারি চার্জ ৬০ টাকা
  const total = subtotal + (items.length > 0 ? deliveryCharge : 0);

  // খালি কার্টের জন্য প্রফেশনাল এম্পটি স্টেট (Empty State)
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <Helmet>
          <title>Shopping Cart | BEST Coys For Boys</title>
        </Helmet>
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Cart is Empty</h2>
        <p className="text-neutral-600 mb-6 max-w-sm">
          Looks like you haven't added anything to your cart yet. Explore our products and find something you love!
        </p>
        <Link
          to="/"
          className="bg-primary-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>Shopping Cart ({items.length}) | BEST Coys For Boys</title>
      </Helmet>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
            <span className="text-sm text-neutral-500">Products ({items.length})</span>
            <button
              onClick={clearCart}
              className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {items.map((item) => {
            const variantKey = `${item.productId}-${JSON.stringify(item.selectedVariants || {})}`;
            return (
              <div
                key={variantKey}
                className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-800 text-sm md:text-base truncate">
                    {item.name}
                  </h3>
                  {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                    <div className="text-xs text-neutral-500 mt-0.5 space-x-2">
                      {Object.entries(item.selectedVariants).map(([key, value]) => (
                        <span key={key} className="inline-block bg-neutral-100 px-2 py-0.5 rounded mr-1">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-primary-600 font-bold mt-1">
                    ৳{item.price}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 border border-neutral-200 rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedVariants)}
                    className="p-1 text-neutral-600 hover:bg-neutral-100 rounded"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedVariants)}
                    className="p-1 text-neutral-600 hover:bg-neutral-100 rounded"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.productId, item.selectedVariants)}
                  className="text-neutral-400 hover:text-red-500 p-2 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 h-fit space-y-4">
          <h3 className="text-lg font-bold text-neutral-900 border-b pb-3">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Estimated Delivery</span>
              <span className="font-semibold text-neutral-900">৳{deliveryCharge}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold text-neutral-900">
              <span>Total</span>
              <span className="text-primary-600">৳{total}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-primary-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}