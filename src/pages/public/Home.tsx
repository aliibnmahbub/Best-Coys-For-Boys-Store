import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Star, ShieldCheck, Truck, Clock, PackageX } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

const categories = [
  { name: 'Gadgets', icon: '📱', id: 'gadgets' },
  { name: 'Accessories', icon: '🎧', id: 'accessories' },
  { name: 'Electronics', icon: '💻', id: 'electronics' },
  { name: 'Lifestyle', icon: '⌚', id: 'lifestyle' },
];

export default function Home() {
  const { addItem } = useCartStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারবেজ ডাটাবেজ থেকে শুধুমাত্র সেই প্রোডাক্টগুলো ফেচ করা যেগুলোতে 'isFeatured: true' টিক দেওয়া আছে
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('isFeatured', '==', true),
          limit(8)
        );
        const querySnapshot = await getDocs(q);
        const list: Product[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Product);
        });
        setFeaturedProducts(list);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }

    const initialVariants: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach(v => {
        if (v.options && v.options.length > 0) {
          initialVariants[v.name] = v.options[0];
        }
      });
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice ?? product.price,
      image: product.images[0],
      quantity: 1,
      selectedVariants: initialVariants,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>Home | BEST Coys For Boys</title>
        <meta name="description" content="Welcome to BEST Coys For Boys - Your trusted shop for premium gadgets and accessories." />
      </Helmet>

      {/* Hero Banner Section */}
      <section className="bg-primary-50 py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
              Discover Premium <br className="hidden md:block" />
              <span className="text-primary-600">Gadgets & Accessories</span>
            </h1>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto md:mx-0">
              Upgrade your lifestyle with our handpicked collection of top-quality products at the best prices.
            </p>
            <Link 
              to="/categories" 
              className="inline-block bg-primary-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex-1 w-full max-w-md">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop" 
              alt="Shopping Banner" 
              className="w-full h-auto object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features/Trust Badges */}
      <section className="py-8 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 divide-x divide-neutral-100">
          <div className="flex flex-col items-center text-center px-2">
            <Truck className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="text-xs md:text-sm font-semibold text-neutral-800">Fast Delivery</h3>
          </div>
          <div className="flex flex-col items-center text-center px-2">
            <ShieldCheck className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="text-xs md:text-sm font-semibold text-neutral-800">100% Authentic</h3>
          </div>
          <div className="flex flex-col items-center text-center px-2">
            <Clock className="w-8 h-8 text-primary-500 mb-2" />
            <h3 className="text-xs md:text-sm font-semibold text-neutral-800">24/7 Support</h3>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold text-neutral-900 mb-6">Top Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link 
              key={index} 
              to={`/category/${cat.id}`}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-xs md:text-sm font-medium text-neutral-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section (Database Driven) */}
      <section className="py-8 md:py-12 bg-neutral-50 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">Featured Products</h2>
          <Link to="/categories" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-neutral-100">
            <PackageX className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No featured products available.</p>
            <p className="text-xs text-neutral-400 mt-1">Go to Admin Panel & check "Feature on Home Page" for products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow group flex flex-col h-full">
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden mb-3 md:mb-4 bg-neutral-100">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discountPrice && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full">
                      Sale
                    </span>
                  )}
                </Link>
                
                {/* Product Info */}
                <Link to={`/product/${product.id}`} className="block flex-1">
                  <h3 className="text-sm md:text-base font-semibold text-neutral-800 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-neutral-600">{product.rating || 5.0}</span>
                </div>
                
                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-neutral-100">
                  <div>
                    <span className="text-base md:text-lg font-bold text-primary-600">
                      ৳{product.discountPrice || product.price}
                    </span>
                    {product.discountPrice && (
                      <span className="text-xs text-neutral-400 line-through ml-1">
                        ৳{product.price}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="bg-neutral-100 p-2 rounded-full text-neutral-700 hover:bg-primary-500 hover:text-white transition-colors disabled:opacity-50"
                    aria-label="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
            }
