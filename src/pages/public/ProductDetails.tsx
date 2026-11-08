import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, ShoppingCart, ShieldCheck, Truck, ArrowLeft, Plus, Minus, Zap } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // ফায়ারস্টোর থেকে নির্দিষ্ট প্রোডাক্টের আইডি দিয়ে ডেটা ফেচ করা
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const prodData = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(prodData);
          if (prodData.images && prodData.images.length > 0) {
            setSelectedImage(prodData.images[0]);
          }
          // ভ্যারিয়েন্ট থাকলে ডিফল্ট অপশন সেট করা
          if (prodData.variants && prodData.variants.length > 0) {
            const initialVariants: Record<string, string> = {};
            prodData.variants.forEach(v => {
              if (v.options && v.options.length > 0) {
                initialVariants[v.name] = v.options[0];
              }
            });
            setSelectedVariants(initialVariants);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      image: selectedImage || product.images[0],
      quantity,
      selectedVariants,
    });

    toast.success('Product added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <Helmet>
          <title>Product Not Found | BEST Coys For Boys</title>
        </Helmet>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="bg-primary-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const currentPrice = product.discountPrice ?? product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 transition-colors duration-300">
      <Helmet>
        <title>{product.name} | BEST Coys For Boys</title>
        <meta name="description" content={product.description.slice(0, 150)} />
      </Helmet>

      <div className="mb-6">
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 shadow-sm">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 bg-white dark:bg-neutral-800 transition-all ${
                    selectedImage === img ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-neutral-200 dark:border-neutral-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{product.rating || 5.0}</span>
              </div>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{product.reviewsCount || 0} Reviews</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 bg-primary-50/50 dark:bg-neutral-800 p-4 rounded-2xl border border-primary-100 dark:border-neutral-700">
            <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">৳{currentPrice}</span>
            {product.discountPrice && (
              <span className="text-lg text-neutral-400 dark:text-neutral-500 line-through">৳{product.price}</span>
            )}
            {product.stock > 0 ? (
              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 uppercase">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 uppercase">
                Out of Stock
              </span>
            )}
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.name} className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                Select {variant.name}: <span className="text-primary-600 dark:text-primary-400">{selectedVariants[variant.name]}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: opt })}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      selectedVariants[variant.name] === opt
                        ? 'bg-primary-500 text-white border-primary-500 shadow-md shadow-primary-500/20'
                        : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200">Quantity</label>
            <div className="flex items-center gap-3 w-fit border border-neutral-200 dark:border-neutral-700 rounded-xl p-1.5 bg-white dark:bg-neutral-800">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-neutral-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="bg-neutral-900 dark:bg-neutral-700 text-white font-semibold py-3.5 px-6 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-neutral-900/10 disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-5 h-5" />
              Buy Now
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-100 dark:border-neutral-700">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
              <Truck className="w-6 h-6 text-primary-500" />
              <div>
                <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Fast Delivery</h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Inside & Outside Dhaka</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
              <ShieldCheck className="w-6 h-6 text-primary-500" />
              <div>
                <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">100% Authentic</h4>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">Quality Assured</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-12 bg-white dark:bg-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm border border-neutral-100 dark:border-neutral-700 space-y-4 transition-colors">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-700 pb-3">Product Description</h3>
        <div className="text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
          {product.description}
        </div>
      </div>
    </div>
  );
}
