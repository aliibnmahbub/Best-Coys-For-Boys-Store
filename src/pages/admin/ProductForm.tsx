import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Upload, X, ArrowLeft, Save } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../../services/cloudinary/cloudinaryService';
import toast from 'react-hot-toast';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('general');
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);

  // এডিট মোড হলে আগের ডাটা লোড করা
  useEffect(() => {
    if (isEditMode && id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setDescription(data.description || '');
            setPrice(data.price?.toString() || '');
            setDiscountPrice(data.discountPrice?.toString() || '');
            setStock(data.stock?.toString() || '');
            setCategoryId(data.categoryId || 'general');
            setImages(data.images || []);
            setIsFeatured(data.isFeatured || false);
          } else {
            toast.error('Product not found');
            navigate('/admin/products');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product details');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isEditMode, id, navigate]);

  // Cloudinary এ ছবি আপলোড হ্যান্ডলার
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImageUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImageToCloudinary(files[i]);
        newImageUrls.push(url);
      }
      setImages((prev) => [...prev, ...newImageUrls]);
      toast.success('Images uploaded successfully to Cloudinary!');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  // ছবি রিমুভ করার ফাংশন
  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // ফর্ম সাবমিট (Firestore এ সেভ বা আপডেট করা)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one product image.');
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock),
        categoryId,
        images, // Cloudinary URLs ONLY
        isFeatured,
        rating: 5.0,
        reviewsCount: 0,
        updatedAt: Date.now(),
      };

      if (isEditMode && id) {
        await updateDoc(doc(db, 'products', id), productData);
        toast.success('Product updated successfully!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: Date.now(),
        });
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Helmet>
        <title>{isEditMode ? 'Edit Product' : 'Add New Product'} | Admin Panel</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-xl font-bold text-neutral-900">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wireless Bluetooth Earbuds"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write detailed product description..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2">Pricing & Inventory</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Regular Price (BDT) *</label>
              <input
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Discount Price (Optional)</label>
              <input
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="1200"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="general">General</option>
                <option value="gadgets">Gadgets</option>
                <option value="accessories">Accessories</option>
                <option value="electronics">Electronics</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-neutral-800">Feature on Home Page</span>
              </label>
            </div>
          </div>
        </div>

        {/* Media Upload (Cloudinary) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2">Product Images (Cloudinary)</h2>
          
          <div className="flex flex-wrap gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative w-24 h-24 rounded-xl overflow-hidden border border-neutral-200 group bg-neutral-100">
                <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors bg-neutral-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload className="w-6 h-6 text-neutral-400 mb-1" />
              <span className="text-[10px] font-medium text-neutral-500">{uploading ? 'Uploading...' : 'Upload'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-neutral-400">Images are uploaded directly to Cloudinary and stored securely.</p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full bg-primary-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {isEditMode ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}