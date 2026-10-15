import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Star, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';

// ডেমো প্রোডাক্ট লিস্ট (পরে এগুলো ফায়ারবেজ ডাটাবেজ থেকে আসবে)
const featuredProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 2500,
    discountPrice: 1999,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Smart Fitness Watch Series 7',
    price: 3500,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Pro Gaming Mouse RGB',
    price: 1200,
    discountPrice: 950,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: '4',
    name: 'Ultra Fast Power Bank 20000mAh',
    price: 1800,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=600&auto=format&fit=crop',
  }
];

const categories = [
  { name: 'Gadgets', icon: '📱' },
  { name: 'Accessories', icon: '🎧' },
  { name: 'Electronics', icon: '💻' },
  { name: 'Lifestyle', icon: '⌚' },
];

export default function Home() {
  const { addItem } = useCartStore();

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.image,
      quantity: 1,
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
              to="/products" 
              className="inline-block bg-primary-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex-1 w-full max-w-md">
            {/* Hero Image (Demo) */}
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
              to={`/category/${cat.name.toLowerCase()}`}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <span className="text-3xl mb-2">{cat.icon}</span>
              <span className="text-xs md:text-sm font-medium text-neutral-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 md:py-12 bg-neutral-50 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900">Featured Products</h2>
          <Link to="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl p-3 md:p-4 shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow group">
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden mb-3 md:mb-4 bg-neutral-100">
                <img 
                  src={product.image} 
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
              <Link to={`/product/${product.id}`} className="block">
                <h3 className="text-sm md:text-base font-semibold text-neutral-800 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-neutral-600">{product.rating}</span>
              </div>
              
              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between mt-auto pt-2">
                <div>
                  <span className="text-base md:text-lg font-bold text-primary-600">
                    ৳{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-xs text-neutral-400 line-through ml-1 md:ml-2">
                      ৳{product.price}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleAddToCart(product)}
                  className="bg-neutral-100 p-2 rounded-full text-neutral-700 hover:bg-primary-500 hover:text-white transition-colors"
                  aria-label="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}