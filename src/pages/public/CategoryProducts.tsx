import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingCart, Star, PackageX } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

export default function CategoryProducts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { addItem } = useCartStore();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে নির্দিষ্ট ক্যাটাগরির প্রোডাক্ট ফেচ করা
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (!categoryId) return;
      try {
        const q = query(
          collection(db, 'products'),
          where('categoryId', '==', categoryId)
        );
        const querySnapshot = await getDocs(q);
        const list: Product[] = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(list);
      } catch (error) {
        console.error('Error fetching category products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryId]);

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }
    
    // ডিফল্ট ভ্যারিয়েন্ট থাকলে তা সিলেক্ট করা
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

  const formattedCategoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'Category';

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 transition-colors duration-300">
      <Helmet>
        <title>{formattedCategoryName} | BEST Coys For Boys</title>
      </Helmet>

      {/* Header Info */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          to="/categories" 
          className="p-2 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-700 rounded-full shadow-sm hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">{formattedCategoryName} Products</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Explore all products in this category</p>
        </div>
      </div>

      {/* Empty State or Products Grid */}
      {products.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-12 shadow-sm border border-neutral-100 dark:border-neutral-700 text-center flex flex-col items-center justify-center min-h-[40vh] transition-colors duration-300">
          <PackageX className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No Products Found</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">We currently don't have any products in the {formattedCategoryName} category.</p>
          <Link to="/" className="bg-primary-500 text-white font-semibold px-6 py-2.5 rounded-full hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-neutral-800 rounded-2xl p-3 md:p-4 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-lg transition-all group flex flex-col h-full"
            >
              {/* Product Image */}
              <Link to={`/product/${product.id}`} className="block relative aspect-square rounded-xl overflow-hidden mb-3 md:mb-4 bg-neutral-50 dark:bg-neutral-700/60">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.discountPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    Sale
                  </span>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-neutral-900/70 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-neutral-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
                  </div>
                )}
              </Link>
              
              {/* Product Info */}
              <Link to={`/product/${product.id}`} className="block flex-1">
                <h3 className="text-sm md:text-base font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{product.rating || 5.0}</span>
                </div>
              </Link>
              
              {/* Price & Add to Cart */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
                <div>
                  <span className="text-base md:text-lg font-bold text-primary-600 dark:text-primary-400">
                    ৳{product.discountPrice || product.price}
                  </span>
                  {product.discountPrice && (
                    <span className="text-[10px] md:text-xs text-neutral-400 dark:text-neutral-500 line-through ml-1 md:ml-2">
                      ৳{product.price}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="bg-primary-50 dark:bg-primary-900/30 p-2 rounded-full text-primary-600 dark:text-primary-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-primary-50 disabled:hover:text-primary-600"
                  aria-label="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
