import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutGrid, Smartphone, Headphones, Laptop, Watch } from 'lucide-react';

const categories = [
  { id: 'gadgets', name: 'Gadgets', icon: Smartphone, desc: 'Smartphones & Tech' },
  { id: 'accessories', name: 'Accessories', icon: Headphones, desc: 'Audio & Wearables' },
  { id: 'electronics', name: 'Electronics', icon: Laptop, desc: 'Laptops & Gear' },
  { id: 'lifestyle', name: 'Lifestyle', icon: Watch, desc: 'Smartwatches & Fitness' },
];

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>All Categories | BEST Coys For Boys</title>
      </Helmet>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">All Categories</h1>
          <p className="text-sm text-neutral-500 mt-1">Browse our premium collection by category</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.id}`}
            className="bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 flex flex-col items-center text-center hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/10 transition-all group"
          >
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-500 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors mb-4">
              <cat.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="font-bold text-neutral-900 text-sm md:text-base mb-1">{cat.name}</h3>
            <p className="text-xs text-neutral-500">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}