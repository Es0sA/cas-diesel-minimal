import React, { useState, useEffect } from 'react';
import { Settings, Save, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function ProfileSettings({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    businessAddress: '',
    contactPhone: '',
    pricePerLitre: '',
    availableLitres: '',
    firstName: '',
    lastName: '',
    truckPlateNumber: '',
    truckCapacityLiters: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const role = (user?.role || '').toUpperCase();
  const isDriver = role === 'DRIVER';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!isDriver) {
          const res = await api.companies.getProfile();
          setFormData(prev => ({ ...prev, ...res }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isDriver]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (isDriver) {
        await api.drivers.editProfile(formData);
      } else {
        await api.companies.editProfile(formData);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (role === 'SUPPLIER') navigate('/marketer');
    else if (role === 'DRIVER') navigate('/driver');
    else navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors font-semibold text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800">Profile Settings</h1>
            <p className="text-sm text-slate-500">Manage your account information</p>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-start gap-3 border border-emerald-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="text-sm font-medium">Profile updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isDriver && (
              <>
                <div>
                  <label htmlFor="fld-company-name-1" className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                  <input id="fld-company-name-1"
                    type="text"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="fld-business-address-2" className="block text-sm font-bold text-slate-700 mb-1.5">Business Address</label>
                  <input id="fld-business-address-2"
                    type="text"
                    name="businessAddress"
                    value={formData.businessAddress || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="fld-contact-phone-3" className="block text-sm font-bold text-slate-700 mb-1.5">Contact Phone</label>
                  <input id="fld-contact-phone-3"
                    type="text"
                    name="contactPhone"
                    value={formData.contactPhone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                  />
                </div>

                {role === 'SUPPLIER' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fld-price-per-litre-4" className="block text-sm font-bold text-slate-700 mb-1.5">Price Per Litre (₦)</label>
                      <input id="fld-price-per-litre-4"
                        type="number"
                        name="pricePerLitre"
                        value={formData.pricePerLitre || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="fld-available-litres-5" className="block text-sm font-bold text-slate-700 mb-1.5">Available Litres</label>
                      <input id="fld-available-litres-5"
                        type="number"
                        name="availableLitres"
                        value={formData.availableLitres || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {isDriver && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fld-first-name-6" className="block text-sm font-bold text-slate-700 mb-1.5">First Name</label>
                    <input id="fld-first-name-6"
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="fld-last-name-7" className="block text-sm font-bold text-slate-700 mb-1.5">Last Name</label>
                    <input id="fld-last-name-7"
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="fld-truck-plate-number-8" className="block text-sm font-bold text-slate-700 mb-1.5">Truck Plate Number</label>
                  <input id="fld-truck-plate-number-8"
                    type="text"
                    name="truckPlateNumber"
                    value={formData.truckPlateNumber || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="fld-truck-capacity-liters-9" className="block text-sm font-bold text-slate-700 mb-1.5">Truck Capacity (Liters)</label>
                  <input id="fld-truck-capacity-liters-9"
                    type="number"
                    name="truckCapacityLiters"
                    value={formData.truckCapacityLiters || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-cas-slate focus:ring-1 focus:ring-cas-slate outline-none transition-all text-sm"
                  />
                </div>
              </>
            )}

            <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-cas-slate hover:bg-black text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
