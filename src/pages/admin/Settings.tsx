import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { db } from '../../services/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Settings() {
  const [storeName, setStoreName] = useState('BEST Coys For Boys');
  const [supportEmail, setSupportEmail] = useState('support@bestcoys.com');
  const [phone, setPhone] = useState('01700000000');
  const [address, setAddress] = useState('Dhaka, Bangladesh');
  const [deliveryChargeDhaka, setDeliveryChargeDhaka] = useState('60');
  const [deliveryChargeOutside, setDeliveryChargeOutside] = useState('120');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ফায়ারস্টোর থেকে সেটিংস ডেটা ফেচ করা
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'storeSettings');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStoreName(data.storeName || 'BEST Coys For Boys');
          setSupportEmail(data.supportEmail || 'support@bestcoys.com');
          setPhone(data.phone || '01700000000');
          setAddress(data.address || 'Dhaka, Bangladesh');
          setDeliveryChargeDhaka(data.deliveryChargeDhaka?.toString() || '60');
          setDeliveryChargeOutside(data.deliveryChargeOutside?.toString() || '120');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // সেটিংস সেভ করা
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const settingsData = {
        storeName,
        supportEmail,
        phone,
        address,
        deliveryChargeDhaka: Number(deliveryChargeDhaka),
        deliveryChargeOutside: Number(deliveryChargeOutside),
        updatedAt: Date.now(),
      };

      const docRef = doc(db, 'settings', 'storeSettings');
      await setDoc(docRef, settingsData, { merge: true });

      toast.success('Settings updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Store Settings | Admin Panel</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Store Settings</h1>
        <p className="text-sm text-neutral-500">Manage general store information and delivery charges.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 space-y-6">
        {/* General Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-primary-500" />
            General Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Store Name *</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Store Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Delivery Charges */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2">Delivery Charges (BDT)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Inside Dhaka Charge *</label>
              <input
                type="number"
                required
                min="0"
                value={deliveryChargeDhaka}
                onChange={(e) => setDeliveryChargeDhaka(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Outside Dhaka Charge *</label>
              <input
                type="number"
                required
                min="0"
                value={deliveryChargeOutside}
                onChange={(e) => setDeliveryChargeOutside(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
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
    </div>
  );
}
