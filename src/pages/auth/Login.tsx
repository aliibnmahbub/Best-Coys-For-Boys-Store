import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser } from '../../services/firebase/authService';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const userProfile = await loginUser(email, password);
      setUser(userProfile);
      toast.success('Login successful!');
      
      // যদি ইউজার অ্যাডমিন হন, তবে অ্যাডমিন প্যানেলে পাঠাবে, না হলে হোম পেজে
      if (userProfile.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>Login | BEST Coys For Boys</title>
      </Helmet>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 mx-auto mb-3 shadow-inner">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Welcome Back</h1>
          <p className="text-sm text-neutral-500 mt-1">Sign in to your account to continue shopping</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <Mail className="absolute left-3.5 top-3.5 text-neutral-400 w-4 h-4" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <Lock className="absolute left-3.5 top-3.5 text-neutral-400 w-4 h-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}