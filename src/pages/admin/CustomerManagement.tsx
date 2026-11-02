import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import toast from 'react-hot-toast';
import type { UserProfile } from '../../types';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে শুধুমাত্র 'customer' রোলযুক্ত ইউজারদের ফেচ করা
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'customer'));
        const querySnapshot = await getDocs(q);
        const list: UserProfile[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as UserProfile);
        });
        setCustomers(list);
      } catch (error) {
        console.error('Error fetching customers:', error);
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Helmet>
        <title>Manage Customers | Admin Panel</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Customers Management</h1>
        <p className="text-sm text-neutral-500">View all registered store customers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Registered Customers ({customers.length})</h2>
        </div>

        {customers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">No customers found</p>
            <p className="text-xs text-neutral-400 mt-1">Customers will appear here once they register on your store.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/50 text-neutral-400 text-xs uppercase">
                  <th className="py-3 px-4 font-semibold">Customer Name</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 font-semibold">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((cust) => (
                  <tr key={cust.uid} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-50 text-primary-600 font-bold flex items-center justify-center uppercase text-xs">
                          {cust.displayName ? cust.displayName.charAt(0) : 'C'}
                        </div>
                        <span className="font-semibold text-neutral-900">{cust.displayName || 'No Name'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        {cust.email || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {cust.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : 'N/A'}
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
