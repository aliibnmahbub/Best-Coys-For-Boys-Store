import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, FileText } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function LegalPageView({ slug: propSlug }: { slug?: string }) {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const slug = propSlug || paramSlug;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ফায়ারস্টোর থেকে লিগ্যাল পেজের কনটেন্ট ফেচ করা
  useEffect(() => {
    const fetchLegalPage = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'legalPages', slug);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || 'Legal Information');
          setContent(data.content || '<p>No content available yet.</p>');
        } else {
          setError(true);
          setTitle('Page Not Found');
        }
      } catch (err) {
        console.error('Error fetching legal page:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLegalPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <Helmet>
          <title>Page Not Found | BEST Coys For Boys</title>
        </Helmet>
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Page Not Found</h2>
        <p className="text-neutral-600 mb-6">The legal page you are looking for does not exist.</p>
        <Link
          to="/"
          className="bg-primary-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Helmet>
        <title>{title} | BEST Coys For Boys</title>
      </Helmet>

      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-neutral-100 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 border-b pb-4">{title}</h1>
        
        {/* ডায়নামিক রিচ টেক্সট কনটেন্ট রেন্ডার করার জন্য */}
        <div 
          className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}