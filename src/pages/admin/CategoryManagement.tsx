import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FolderTree, Plus, Trash2 } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { Category } from '../../types';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ফায়ারস্টোর থেকে ক্যাটাগরিগুলো ফেচ করা
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

  useEffect(() => {
    fetchCategories();
  }, []);

  // নতুন ক্যাটাগরি যোগ করা
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const newCategory = {
        name,
        slug,
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, 'categories'), newCategory);
      setCategories([...categories, { id: docRef.id, ...newCategory }]);
      setName('');
      toast.success('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  // ক্যাটাগরি ডিলিট করা
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteDoc(doc(db, 'categories', id));
      setCategories(categories.filter(c => c.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Manage Categories | Admin Panel</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Categories Management</h1>
        <p className="text-sm text-neutral-500">Add or remove product categories dynamically.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-fit space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-3">Add New Category</h2>
          
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smartwatches"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Category
                </>
              )}
            </button>
          </form>
        </div>

        {/* Categories List Table */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-900">All Categories ({categories.length})</h2>
          </div>

          {categories.length === 0 ? (
            <div className="py-12 text-center">
              <FolderTree className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">No categories found</p>
              <p className="text-xs text-neutral-400 mt-1">Add your first category using the form.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 text-xs uppercase">
                    <th className="py-3 px-4 font-semibold">Name</th>
                    <th className="py-3 px-4 font-semibold">Slug</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-neutral-900">{cat.name}</td>
                      <td className="py-3 px-4 text-neutral-500 text-xs font-mono">{cat.slug}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
        }
