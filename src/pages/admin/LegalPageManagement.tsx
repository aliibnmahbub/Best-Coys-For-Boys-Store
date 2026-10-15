import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
// @ts-ignore
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, FileText } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const legalPagesList = [
  { id: 'privacy-policy', title: 'Privacy Policy' },
  { id: 'terms-and-conditions', title: 'Terms & Conditions' },
  { id: 'refund-policy', title: 'Refund Policy' },
];

export default function LegalPageManagement() {
  const [selectedPageId, setSelectedPageId] = useState('privacy-policy');
  const [title, setTitle] = useState('Privacy Policy');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ফায়ারস্টোর থেকে নির্বাচিত লিগ্যাল পেজের ডেটা ফেচ করা
  useEffect(() => {
    const fetchPageContent = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'legalPages', selectedPageId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || legalPagesList.find(p => p.id === selectedPageId)?.title || '');
          setContent(data.content || '');
        } else {
          setTitle(legalPagesList.find(p => p.id === selectedPageId)?.title || '');
          setContent('');
        }
      } catch (error) {
        console.error('Error fetching legal page:', error);
        toast.error('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, [selectedPageId]);

  // ফায়ারস্টোরে কন্টেন্ট সেভ বা আপডেট করা
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const docRef = doc(db, 'legalPages', selectedPageId);
      await setDoc(docRef, {
        id: selectedPageId,
        title,
        slug: selectedPageId,
        content,
        updatedAt: Date.now(),
      }, { merge: true });

      toast.success(`${title} saved successfully!`);
    } catch (error) {
      console.error('Error saving legal page:', error);
      toast.error('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Legal Pages Management | Admin Panel</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Legal Pages Management</h1>
        <p className="text-sm text-neutral-500">Edit dynamic legal pages (Privacy Policy, Terms, etc.) using the rich text editor.</p>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 border-b border-neutral-200 pb-3 overflow-x-auto">
        {legalPagesList.map((page) => (
          <button
            key={page.id}
            onClick={() => setSelectedPageId(page.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedPageId === page.id
                ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            {page.title}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Page Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Page Content (Rich Text Editor)</label>
            <div className="bg-white rounded-xl overflow-hidden border border-neutral-200">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                className="h-72 mb-12"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}