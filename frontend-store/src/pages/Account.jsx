import { useState, useEffect, createElement, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Lock, MapPin, Heart, Package, ChevronRight,
  Edit2, Trash2, Plus, Check, LogOut,
  Phone, Mail, Shield, Home, Briefcase, X, LoaderCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store';
import { usersApi, ordersApi } from '../api';
import api from '../api/client';

const TABS = [
  { id: 'profile',   label: 'Profile',   icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'security',  label: 'Security',  icon: Lock },
  { id: 'wishlist',  label: 'Wishlist',  icon: Heart },
];

/* ── Status badge ── */
function StatusBadge({ status }) {
  const map = {
    PENDING:    { bg: 'bg-[#F2EDE0] text-[#9A8A70]', border: 'border-[#E8E2D8]', label: 'Pending' },
    CONFIRMED:  { bg: 'bg-blue-50 text-blue-700', border: 'border-blue-200', label: 'Confirmed' },
    PROCESSING: { bg: 'bg-[#FAFAF4] text-[#C8922A]', border: 'border-[#E8E2D8]', label: 'Processing' },
    SHIPPED:    { bg: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200', label: 'Shipped' },
    DELIVERED:  { bg: 'bg-green-50 text-green-700', border: 'border-green-200', label: 'Delivered' },
    CANCELLED:  { bg: 'bg-red-50 text-red-700', border: 'border-red-200', label: 'Cancelled' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 border rounded-xs text-[9px] font-semibold uppercase tracking-wider ${s.bg} ${s.border} ${s.text}`}>
      {s.label}
    </span>
  );
}

/* ── Address card ── */
function AddressCard({ addr, onEdit, onDelete, onSetDefault }) {
  return (
    <div className={`relative p-5 rounded-lg border transition-all text-left ${
      addr.isDefault ? 'border-[#C8922A] bg-[#FAFAF4]' : 'border-[#E8E2D8] bg-white hover:border-[#C8922A]'
    }`}>
      {addr.isDefault && (
        <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-wider bg-[#1A1A1A] text-white px-2 py-0.5 rounded-xs">
          Default
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
          addr.isDefault ? 'bg-white border-[#C8922A] text-[#C8922A]' : 'bg-[#FAFAF4] border-[#E8E2D8] text-[#9A8A70]'
        }`}>
          {addr.label === 'Work' ? (
            <Briefcase className="w-4 h-4" />
          ) : (
            <Home className="w-4 h-4" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{addr.label} — {addr.fullName}</p>
          <p className="text-xs text-[#6B6560] mt-1 leading-relaxed">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
          <p className="text-xs text-[#6B6560] leading-relaxed">{addr.city}, {addr.state} - {addr.pincode}</p>
          <p className="text-xs text-[#9A8A70] font-medium mt-2 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" /> {addr.phone}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E8E2D8]">
        {!addr.isDefault && (
          <button
            onClick={() => onSetDefault(addr.id)}
            className="text-[10px] font-semibold text-[#C8922A] hover:opacity-85 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Set as Default
          </button>
        )}
        <button
          onClick={() => onEdit(addr)}
          className="ml-auto text-[10px] font-semibold text-[#1A1A1A] hover:text-[#C8922A] transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          <Edit2 className="w-3 h-3" /> Edit
        </button>
        <button
          onClick={() => onDelete(addr.id)}
          className="text-[10px] font-semibold text-red-600 hover:text-red-800 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );
}

/* ── Inline Address Form ── */
function AccountInlineAddressForm({ addr, onCancel, onSave }) {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState(
    addr || {
      label: 'Home',
      fullName: user?.name || '',
      phone: user?.phone || '',
      line1: user?.address || '',
      line2: '',
      city: user?.city || '',
      state: user?.state || '',
      pincode: user?.pincode || '',
      isDefault: false
    }
  );
  const [saving, setSaving] = useState(false);
  
  // Pincode & Autofill States
  const [pincodeStatus, setPincodeStatus] = useState(form.pincode && form.pincode.length === 6 ? 'success' : 'idle');
  const [postOffices, setPostOffices] = useState([]);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showAreaHelper, setShowAreaHelper] = useState(false);
  const [pincodeStatusText, setPincodeStatusText] = useState('');
  
  const [autoFilledFields, setAutoFilledFields] = useState({
    line1: false,
    city: false,
    state: false
  });

  const lastSearchedPincode = useRef(form.pincode || '');
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setAutoFilledFields(prev => ({ ...prev, [name]: false }));
    if (name === 'line1') {
      setShowAreaHelper(false);
    }
  };

  const handleFieldFocus = (e) => {
    const { name } = e.target;
    setAutoFilledFields(prev => ({ ...prev, [name]: false }));
  };

  const handlePincodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setForm(prev => ({ ...prev, pincode: value }));

    if (value.length < 6) {
      setPincodeStatus('idle');
      setPincodeStatusText('');
      setPostOffices([]);
      setShowAreaDropdown(false);
      setShowAreaHelper(false);
      
      setForm(prev => ({
        ...prev,
        line1: '',
        city: '',
        state: ''
      }));
      setAutoFilledFields({ line1: false, city: false, state: false });
      lastSearchedPincode.current = '';
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      return;
    }

    if (value.length === 6) {
      if (value === lastSearchedPincode.current) {
        return;
      }
      
      setPincodeStatus('loading');
      setPincodeStatusText('Fetching location details...');
      
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await api.get(`/address/pincode/${value}`);
          const data = res.data;

          lastSearchedPincode.current = value;
          setPincodeStatus('success');
          
          const firstArea = data.postOffices && data.postOffices.length > 0 ? data.postOffices[0] : '';
          setPincodeStatusText(`📍 ${firstArea || data.city}, ${data.city}, ${data.state}`);

          setForm(prev => ({
            ...prev,
            city: data.city,
            state: data.state,
            line1: firstArea
          }));

          setAutoFilledFields({
            line1: !!firstArea,
            city: !!data.city,
            state: !!data.state
          });

          if (data.postOffices && data.postOffices.length > 0) {
            setPostOffices(data.postOffices);
            setShowAreaHelper(true);
            if (data.postOffices.length > 1) {
              setShowAreaDropdown(true);
            } else {
              setShowAreaDropdown(false);
            }
          } else {
            setPostOffices([]);
            setShowAreaDropdown(false);
            setShowAreaHelper(false);
          }
        } catch (err) {
          console.error(err);
          lastSearchedPincode.current = value;
          if (err.response?.status === 404) {
            setPincodeStatus('error');
            setPincodeStatusText('Invalid or unknown pincode');
          } else {
            setPincodeStatus('api_down');
            setPincodeStatusText('Could not verify. Fill city and state manually.');
          }
        }
      }, 400);
    }
  };

  const handleAreaSelect = (area) => {
    setForm(prev => ({ ...prev, line1: area }));
    setAutoFilledFields(prev => ({ ...prev, line1: true }));
    setShowAreaDropdown(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.phone || !/^[0-9]{10}$/.test(form.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    if (!form.pincode || !/^[0-9]{6}$/.test(form.pincode)) {
      toast.error('Pincode must be exactly 6 digits');
      return;
    }

    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E8E2D8] p-6 sm:p-8 space-y-6 shadow-none max-w-xl mx-auto text-left">
      <h3 className="font-display font-light text-xl text-[#1A1A1A] border-b border-[#E8E2D8] pb-4">
        {addr ? 'Edit Address' : 'Add New Address'}
      </h3>
      <form onSubmit={submit} className="space-y-5">
        <div className="flex gap-2">
          {['Home', 'Work', 'Other'].map((l) => (
            <button
              key={l} type="button"
              onClick={() => setForm((f) => ({ ...f, label: l }))}
              className={`flex-1 px-4 py-2 rounded-xs text-xs font-semibold border transition-all cursor-pointer ${
                form.label === l
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-[#FAFAF4] border-[#E8E2D8] text-[#6B6560] hover:bg-[#FAFAF4]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Full Name *</label>
            <input 
              name="fullName" 
              value={form.fullName} 
              onChange={handleFieldChange} 
              onFocus={handleFieldFocus}
              required 
              className="input-field" 
              placeholder="John Doe" 
            />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Phone *</label>
            <input 
              type="tel" 
              name="phone" 
              value={form.phone} 
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 10) setForm(f => ({ ...f, phone: val }));
              }} 
              required 
              pattern="[0-9]{10}"
              className="input-field" 
              placeholder="10-digit mobile number" 
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Pincode *</label>
          <div className="relative">
            <input 
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              name="pincode" 
              value={form.pincode} 
              onChange={handlePincodeChange} 
              required 
              maxLength="6"
              className={`input-field pr-10 border transition-all duration-200 ${
                pincodeStatus === 'success' ? 'border-green-600 focus:border-green-600' :
                pincodeStatus === 'error' ? 'border-red-600 focus:border-red-600' :
                'border-[#E8E2D8] focus:border-[#C8922A]'
              }`}
              placeholder="6-digit pincode"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              {pincodeStatus === 'loading' && <LoaderCircle className="w-5 h-5 text-[#9A8A70] animate-spin" />}
              {pincodeStatus === 'success' && <Check className="w-5 h-5 text-green-600" />}
              {pincodeStatus === 'error' && <X className="w-5 h-5 text-red-600" />}
            </div>
          </div>
          {pincodeStatusText && (
            <p className={`text-xs mt-1 font-medium ${
              pincodeStatus === 'loading' ? 'text-[#9A8A70]' :
              pincodeStatus === 'success' ? 'text-green-700' :
              pincodeStatus === 'error' ? 'text-red-600' :
              'text-[#9A8A70]'
            }`}>
              {pincodeStatusText}
            </p>
          )}
        </div>

        <div>
          <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Address Line 1 *</label>
          <input 
            type="text"
            name="line1" 
            value={form.line1} 
            onChange={handleFieldChange} 
            onFocus={handleFieldFocus}
            required 
            className={`input-field transition-all duration-200 ${
              autoFilledFields.line1 ? 'bg-[#FAFAF4] border-[#C8922A]' : ''
            }`} 
            placeholder="Flat, House no., Street, Area" 
          />
          {showAreaHelper && form.line1 && (
            <p className="text-xs text-[#9A8A70] mt-1 italic">
              Area auto-filled. Add flat/house/street details above.
            </p>
          )}
          {showAreaDropdown && postOffices.length > 1 && (
            <div className="mt-2 bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg p-3">
              <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] block mb-1">Select your area</label>
              <select 
                onChange={(e) => handleAreaSelect(e.target.value)} 
                value={form.line1}
                className="w-full bg-white border border-[#E8E2D8] rounded-md px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C8922A]"
              >
                {postOffices.map((po, idx) => (
                  <option key={idx} value={po}>{po}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Address Line 2 (Optional)</label>
          <input 
            name="line2" 
            value={form.line2} 
            onChange={handleFieldChange} 
            onFocus={handleFieldFocus}
            className="input-field" 
            placeholder="Flat, Floor, Building" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">City *</label>
            <input 
              name="city" 
              value={form.city} 
              onChange={handleFieldChange} 
              onFocus={handleFieldFocus}
              required 
              className={`input-field transition-all duration-200 ${
                autoFilledFields.city ? 'bg-[#FAFAF4] border-[#C8922A]' : ''
              }`} 
            />
          </div>
          <div>
            <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">State *</label>
            <input 
              name="state" 
              value={form.state} 
              onChange={handleFieldChange} 
              onFocus={handleFieldFocus}
              required 
              className={`input-field transition-all duration-200 ${
                autoFilledFields.state ? 'bg-[#FAFAF4] border-[#C8922A]' : ''
              }`} 
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
            className="w-4 h-4 accent-[#1A1A1A] rounded-xs"
          />
          <span className="text-sm font-medium text-[#6B6560]">Set as default address</span>
        </label>
        
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="flex-1 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] font-semibold rounded-xs text-xs uppercase tracking-wider hover:bg-[#FAFAF4] transition-colors cursor-pointer">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 bg-[#1A1A1A] text-white py-3.5 rounded-xs font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer">
            {saving ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Account() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const [tab, setTab] = useState('profile');
  const [profile, setProfile]   = useState({ name: '', phone: '' });
  const [saving, setSaving]     = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addrModal, setAddrModal] = useState(null); // null=closed, 'new'=new, addr obj=edit
  const [wishlist, setWishlist]   = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  useEffect(() => {
    if (tab === 'addresses') loadAddresses();
    if (tab === 'wishlist')  loadWishlist();
    if (tab === 'profile')   loadRecentOrders();
  }, [tab]);

  const loadAddresses = async () => {
    try { const { data } = await usersApi.getAddresses(); setAddresses(data.data || []); } catch (err) { toast.error('Failed to load addresses'); }
  };

  const loadWishlist = async () => {
    try { const { data } = await usersApi.getWishlist(); setWishlist(data.data || []); } catch (err) { toast.error('Failed to load wishlist'); }
  };

  const loadRecentOrders = async () => {
    try { const { data } = await ordersApi.myOrders({ limit: 3 }); setRecentOrders(data.data || []); } catch (err) { toast.error('Failed to load recent orders'); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (profile.phone && !/^[0-9]{10}$/.test(profile.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    setSaving(true);
    try {
      const response = await usersApi.updateProfile(profile);
      const updatedUser = response.data?.data || response.data;
      if (updatedUser) {
        useAuthStore.getState().updateProfile(updatedUser);
      }
      await fetchMe();
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setPwSaving(true);
    try {
      await usersApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setPwSaving(false); }
  };

  const saveAddress = async (form) => {
    try {
      let response;
      if (addrModal && typeof addrModal === 'object' && addrModal.id) {
        response = await usersApi.updateAddress(addrModal.id, form);
        toast.success('Address updated!');
      } else {
        response = await usersApi.addAddress(form);
        toast.success('Address added!');
      }
      const savedAddr = response.data?.data || response.data;
      if (savedAddr && (savedAddr.isDefault || addresses.length === 0)) {
        useAuthStore.getState().updateProfile({
          address: savedAddr.line1,
          city: savedAddr.city,
          state: savedAddr.state,
          pincode: savedAddr.pincode,
          phone: savedAddr.phone,
        });
      }
      await fetchMe();
      setAddrModal(null);
      loadAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save address');
      throw err;
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await usersApi.deleteAddress(id);
      toast.success('Address deleted');
      await fetchMe();
      loadAddresses();
    } catch { toast.error('Failed to delete address'); }
  };

  const setDefaultAddress = async (id) => {
    try {
      await usersApi.setDefaultAddr(id);
      const target = addresses.find((a) => a.id === id);
      if (target) {
        useAuthStore.getState().updateProfile({
          address: target.line1,
          city: target.city,
          state: target.state,
          pincode: target.pincode,
          phone: target.phone,
        });
      }
      await fetchMe();
      loadAddresses();
    } catch { toast.error('Failed to set default address'); }
  };

  const removeWishlist = async (productId) => {
    try {
      await usersApi.removeWishlist(productId);
      setWishlist((w) => w.filter((i) => i.productId !== productId));
      toast.success('Removed from wishlist');
    } catch (err) { toast.error(err?.response?.data?.message || 'Failed to remove from wishlist'); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FAFAF4] luxury-grain pt-28 sm:pt-32 pb-24 px-4 relative overflow-hidden text-[#6B6560]">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10 text-left">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">My Account</span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-6 md:p-8 bg-white border border-[#E8E2D8] rounded-xl text-left">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xl md:text-2xl font-display font-light">
                {user.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-display font-light text-[#1A1A1A] truncate">
                Welcome, {user.name?.split(' ')[0]} 
              </h1>
              <p className="text-xs text-[#6B6560] flex items-center gap-1.5 mt-1 truncate">
                <Mail className="w-3.5 h-3.5 text-[#9A8A70]" /> {user.email}
              </p>
              {user.phone && (
                <p className="text-xs text-[#6B6560] flex items-center gap-1.5 mt-0.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-[#9A8A70]" /> {user.phone}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xs border border-red-200 text-red-600 font-semibold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-red-50 transition-all w-full md:w-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center p-1.5 bg-[#F2EDE0] border border-[#E8E2D8] rounded-xs mb-8 overflow-x-auto no-scrollbar whitespace-nowrap gap-1">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                tab === id 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#FAFAF4]'
              }`}
            >
              {createElement(icon, { className: 'w-3.5 h-3.5' })} {label}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 text-left">
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6">
                <h2 className="font-display font-light text-xl text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#C8922A]" /> Personal Information
                </h2>
                <form onSubmit={saveProfile} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Full Name</label>
                      <input
                        value={profile.name}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                        className="input-field"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) setProfile((p) => ({ ...p, phone: val }));
                        }}
                        pattern="[0-9]{10}"
                        className="input-field"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Email (Read-only)</label>
                    <div className="relative">
                      <input value={user.email} disabled className="input-field opacity-60 cursor-not-allowed bg-[#FAFAF4]" />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A8A70]" />
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary w-full justify-center mt-4 py-4 text-xs cursor-pointer">
                    {saving ? 'Updating...' : 'Update Personal Info'}
                  </button>
                </form>
              </div>
            </div>

            {/* Recent orders widget */}
            <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 text-left">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-light text-lg text-[#1A1A1A] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C8922A]" /> Recent Orders
                </h3>
                <button onClick={() => navigate('/orders')} className="text-xs font-semibold text-[#C8922A] hover:opacity-80 transition-colors uppercase tracking-wider cursor-pointer">
                  View all
                </button>
              </div>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-8 h-8 mx-auto mb-2 text-[#9A8A70] opacity-40" />
                  <p className="text-xs text-[#6B6560]">No orders reserved yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="w-full text-left p-4 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] hover:border-[#C8922A] transition-all cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-xs font-bold text-[#1A1A1A]">{o.orderNumber}</p>
                        <StatusBadge status={o.status} />
                      </div>
                      <p className="text-xs text-[#6B6560]">Total: <span className="font-display italic text-[#C8922A]">₹{Number(o.total).toFixed(2)}</span></p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADDRESSES TAB ── */}
        {tab === 'addresses' && (
          <div>
            {addrModal ? (
              <AccountInlineAddressForm
                addr={typeof addrModal === 'object' ? addrModal : null}
                onCancel={() => setAddrModal(null)}
                onSave={saveAddress}
              />
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6 text-left">
                  <h2 className="font-display font-light text-xl text-[#1A1A1A]">
                    Saved Delivery Addresses
                  </h2>
                  <button onClick={() => setAddrModal('new')} className="btn-primary py-2.5 px-4 text-xs gap-1.5 rounded-xs cursor-pointer">
                    <Plus className="w-4 h-4" /> Add Address
                  </button>
                </div>
                {addresses.length === 0 ? (
                  <div className="bg-white border border-[#E8E2D8] rounded-xl p-12 text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-[#9A8A70] opacity-45" />
                    <h3 className="font-display font-light text-lg text-[#1A1A1A] mb-1">No addresses saved</h3>
                    <p className="text-[#6B6560] text-xs mb-6">Add a delivery address to speed up your curing reservations.</p>
                    <button onClick={() => setAddrModal('new')} className="btn-primary rounded-xs py-3 px-6 text-xs cursor-pointer">
                      <Plus className="w-4 h-4" /> Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
                    {addresses.map((a) => (
                      <AddressCard
                        key={a.id}
                        addr={a}
                        onEdit={(a) => setAddrModal(a)}
                        onDelete={deleteAddress}
                        onSetDefault={setDefaultAddress}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SECURITY TAB ── */}
        {tab === 'security' && (
          <div className="max-w-lg mx-auto text-left">
            <div className="bg-white border border-[#E8E2D8] rounded-xl p-6">
              <h2 className="font-display font-light text-xl text-[#1A1A1A] mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#C8922A]" /> Change Password
              </h2>
              <form onSubmit={changePassword} className="space-y-4">
                <div>
                  <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Current Password</label>
                  <input
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    required className="input-field" placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">New Password</label>
                  <input
                    type="password"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                    required minLength={8} className="input-field" placeholder="At least 8 characters"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Confirm New Password</label>
                  <input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                    required className="input-field" placeholder="Repeat new password"
                  />
                </div>
                {pwForm.newPassword && pwForm.confirm && pwForm.newPassword !== pwForm.confirm && (
                  <p className="text-xs text-red-600 font-semibold uppercase tracking-wider">Passwords do not match</p>
                )}
                <button type="submit" disabled={pwSaving} className="btn-primary w-full justify-center py-4 mt-2 text-xs cursor-pointer">
                  {pwSaving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── WISHLIST TAB ── */}
        {tab === 'wishlist' && (
          <div className="text-left">
            <h2 className="font-display font-light text-xl text-[#1A1A1A] mb-6">
              Saved Favorites ({wishlist.length})
            </h2>
            {wishlist.length === 0 ? (
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-3 text-[#9A8A70] opacity-45 animate-pulse" />
                <h3 className="font-display font-light text-lg text-[#1A1A1A] mb-1">Your wishlist is empty</h3>
                <p className="text-[#6B6560] text-xs mb-6">Save the jars you love for checkout later.</p>
                <button onClick={() => navigate('/products')} className="btn-primary rounded-xs py-3 px-6 text-xs cursor-pointer">
                  Explore Products
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {wishlist.map(({ product }) => (
                  <div key={product.id} className="bg-white border border-[#E8E2D8] rounded-xl overflow-hidden flex flex-col group hover:border-[#C8922A] transition-all duration-300">
                    <div className="relative aspect-square bg-[#FAFAF4] overflow-hidden border-b border-[#E8E2D8]/50">
                      <img
                        src={product.images?.[0]?.url || 'https://placehold.co/300x300?text=Pickle'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <button
                        onClick={() => removeWishlist(product.id)}
                        className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/95 border border-[#E8E2D8] rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <p className="font-display font-light text-[#1A1A1A] text-sm leading-tight">{product.name}</p>
                        <p className="font-display italic text-[#C8922A] text-sm mt-1">₹{Number(product.price).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="btn-primary w-full justify-center text-xs py-2.5 mt-4 cursor-pointer"
                      >
                        View Jar Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
