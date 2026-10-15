import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ফায়ারস্টোর থেকে প্রোডাক্ট লিস্ট ফেচ করা
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const list: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      setProducts(list);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // প্রোডাক্ট ডিলিট করার ফাংশন
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // সার্চ ফিল্টার
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <title>Manage Products | Admin Panel</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Products Management</h1>
          <p className="text-sm text-neutral-500">Add, edit, or remove store products.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-primary-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 text-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Search Bar & Stats */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-2.5 text-neutral-400 w-4 h-4" />
        </div>
        <div className="text-sm text-neutral-500 hidden sm:block">
          Total: <span className="font-bold text-neutral-900">{products.length}</span> products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No products found</p>
            <p className="text-xs text-neutral-400 mt-1">Try searching with another name or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 text-xs uppercase">
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Stock</th>
                  <th className="py-3 px-4 font-semibold">Rating</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.images[0] || 'https://via.placeholder.com/150'} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900 truncate max-w-xs">{product.name}</p>
                          <p className="text-xs text-neutral-400">ID: {product.id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">
                      ৳{product.discountPrice || product.price}
                      {product.discountPrice && (
                        <span className="text-xs text-neutral-400 line-through block font-normal">৳{product.price}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-600 font-medium">
                      ⭐ {product.rating || 0} ({product.reviewsCount || 0})
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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