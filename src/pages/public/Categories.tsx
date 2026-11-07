import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutGrid, FolderTree, Package } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Category } from '../../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর ডাটাবেজ থেকে ডাইনামিক ক্যাটাগরিগুলো ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const list: Category[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Category);
        });
        setCategories(list);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 transition-colors duration-300">
      <Helmet>
        <title>All Categories | BEST Coys For Boys</title>
      </Helmet>

      {/* Header Info */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">All Categories</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Browse our premium collection by category</p>
        </div>
      </div>

      {/* Categories Grid or Empty State */}
      {categories.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-3xl p-12 shadow-sm border border-neutral-100 dark:border-neutral-700 text-center flex flex-col items-center justify-center min-h-[40vh] transition-colors">
          <FolderTree className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No Categories Found</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">Categories will appear here once added from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-700 flex flex-col items-center text-center hover:border-primary-200 dark:hover:border-primary-500/50 hover:shadow-lg transition-all group"
            >
              <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-700/60 rounded-full flex items-center justify-center text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors mb-4 shadow-sm">
                <Package className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-neutral-900 dark:text-white text-sm md:text-base mb-1 group-hover:text-primary-500 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">Explore items</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
