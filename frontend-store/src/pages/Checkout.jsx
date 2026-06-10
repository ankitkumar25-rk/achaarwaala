import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Plus, Check, Truck, Package,
  ShoppingBag, X, ChevronDown, ChevronUp, ChevronRight,
  Shield, Tag, CreditCard, Banknote, CheckCircle, AlertCircle, LoaderCircle
} from 'lucide-react';
import { 
  MdSecurity, MdLocalShipping, MdAssignmentReturn 
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { useCartStore } from '../store';
import { usersApi, ordersApi, paymentsApi } from '../api';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store';
import { loadRazorpayScript } from '../utils/razorpay';
import api from '../api/client'; // axiosInstance
import { trackInitiateCheckout, trackPurchase } from '../utils/metaPixel';

/* -- Inline address form component -- */
function InlineAddressForm({ onSave, onCancel, showCancel = true }) {
  const user = useAuthStore((s) => s.user);
  const isGuest = !user;
  
  const [form, setForm] = useState({
    label: 'Home',
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    line1: user?.address || '',
    line2: '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    isDefault: false,
  });
  
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

  // Clean up timeout on unmount
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
    if (isGuest && (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))) {
      toast.error('Please enter a valid email address');
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
    <form onSubmit={submit} className="space-y-6 bg-[#FAFAF4] p-5 sm:p-6 rounded-lg border border-[#E8E2D8] animate-in fade-in duration-300 text-left">
      <p className="text-xs font-semibold text-[#9A8A70] uppercase tracking-wider">Enter Delivery Details</p>
      <div className="flex gap-2">
        {['Home', 'Work', 'Other'].map((l) => (
          <button key={l} type="button"
            onClick={() => setForm((f) => ({ ...f, label: l }))}
            className={`flex-1 px-4 py-2 rounded-xs text-xs font-semibold transition-all border cursor-pointer ${
              form.label === l ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white border-[#E8E2D8] text-[#6B6560] hover:bg-[#FAFAF4]'
            }`}
          >{l}</button>
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

      {isGuest && (
        <div>
          <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-1 block">Email Address *</label>
          <input 
            type="email"
            name="email" 
            value={form.email} 
            onChange={handleFieldChange} 
            onFocus={handleFieldFocus}
            required 
            className="input-field" 
            placeholder="yourname@example.com" 
          />
        </div>
      )}

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
          <div className="mt-2 bg-white border border-[#E8E2D8] rounded-lg p-3">
            <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] block mb-1">Select your area</label>
            <select 
              onChange={(e) => handleAreaSelect(e.target.value)} 
              value={form.line1}
              className="w-full bg-[#FAFAF4] border border-[#E8E2D8] rounded-md px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#C8922A]"
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
        <input type="checkbox" checked={form.isDefault}
          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
          className="w-4 h-4 accent-[#1A1A1A] rounded-xs" />
        <span className="text-sm font-medium text-[#6B6560]">Set as default address</span>
      </label>

      <div className="flex gap-3">
        {showCancel && (
          <button type="button" onClick={onCancel} className="flex-1 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] font-semibold rounded-xs text-xs uppercase tracking-wider hover:bg-[#FAFAF4] transition-colors cursor-pointer">
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving}
          className="flex-1 bg-[#1A1A1A] text-white py-3.5 rounded-xs font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer">
          {saving ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </form>
  );
}

/* -- Steps -- */
const STEPS = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Review' },
  { id: 3, label: 'Payment' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const items     = useCartStore((s) => s.items);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep]               = useState(1);
  const [addresses, setAddresses]     = useState([]);
  const [guestAddress, setGuestAddress] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [notes, setNotes]             = useState('');
  const [placing, setPlacing]         = useState(false);
  const [showItems, setShowItems]     = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(null); // 'verifying' | null
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null); // 'RAZORPAY' | 'COD' | null

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);

  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const isProfileComplete = useAuthStore((s) => s.isProfileComplete?.() || false);

  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const shipping = 0; // Free shipping on all orders!
  const total    = subtotal + shipping;

  const loadAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddr('guest');
      setShowInlineForm(true);
      return;
    }
    try {
      const { data } = await usersApi.getAddresses();
      let list = data.data || [];

      if (list.length === 0 && user?.address && user?.city && user?.pincode) {
        try {
          const autoRes = await usersApi.addAddress({
            label: 'Home',
            fullName: user.name || 'Personal Profile',
            phone: user.phone || '',
            line1: user.address,
            line2: '',
            city: user.city,
            state: user.state || '',
            pincode: user.pincode,
            isDefault: true
          });
          if (autoRes.data?.data) {
            list = [autoRes.data.data];
          }
        } catch (autoErr) {
          console.error('[Checkout] Failed to auto-save profile address:', autoErr);
        }
      }

      setAddresses(list);
      const def = list.find((a) => a.isDefault) || list[0];
      if (def) {
        setSelectedAddr(def.id);
        setShowInlineForm(false);
      } else {
        setShowInlineForm(true);
      }
    } catch (err) {
      toast.error('Failed to load addresses');
    }
  }, [user]);

  useEffect(() => { 
    if (user) {
      loadAddresses(); 
    } else {
      setAddresses([]);
      setSelectedAddr('guest');
      setShowInlineForm(true);
    }
  }, [user, loadAddresses]);

  useEffect(() => {
    if (items.length === 0 && step !== 3) navigate('/cart');
  }, [items, step, navigate]);

  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(total, items.length);
    }
  }, []);

  const addAddress = async (form) => {
    if (user) {
      try {
        const { data } = await usersApi.addAddress(form);
        await loadAddresses();
        setSelectedAddr(data.data.id);
        setShowInlineForm(false);
        toast.success('Address added!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add address');
        throw err;
      }
    } else {
      setGuestAddress(form);
      setSelectedAddr('guest');
      setShowInlineForm(false);
      toast.success('Details saved!');
    }
  };

  const handleCreateOrder = async (method) => {
    if (!selectedAddr || placing) return;
    setPlacing(true);

    try {
      if (method === 'COD') {
        const payload = {
          notes,
          paymentMethod: 'COD',
          idempotencyKey
        };
        if (selectedAddr === 'guest') {
          payload.guestAddress = guestAddress;
        } else {
          payload.addressId = selectedAddr;
        }
        const { data: orderRes } = await ordersApi.create(payload);
        await handlePaymentSuccess('COD', orderRes.data.id);
      } else {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
          toast.error('Failed to load payment gateway. Please check your connection.');
          setPlacing(false);
          return;
        }

        const payload = {
          amount: total, 
          currency: 'INR', 
          notes,
          idempotencyKey
        };
        if (selectedAddr === 'guest') {
          payload.guestAddress = guestAddress;
        } else {
          payload.addressId = selectedAddr;
        }

        const { data: responseBody } = await paymentsApi.createOrder(payload);
        const rzpData = responseBody.data;

        const options = {
          key: rzpData.keyId,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: 'Achaarwaala',
          description: 'Product Order Checkout',
          order_id: rzpData.razorpayOrderId,
          handler: async (resp) => {
            try {
              setPaymentLoading('verifying');
              const verifyPayload = {
                razorpay_order_id: resp.razorpay_order_id,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature,
                notes,
                idempotencyKey
              };
              if (selectedAddr === 'guest') {
                verifyPayload.guestAddress = guestAddress;
              } else {
                verifyPayload.addressId = selectedAddr;
              }

              const { data: verifyData } = await paymentsApi.verifyPayment(verifyPayload);

              if (verifyData.success) {
                await handlePaymentSuccess('RAZORPAY', verifyData.order.id);
              }
            } catch (vErr) {
              setPaymentLoading(null);
              toast.error(vErr.response?.data?.message || 'Payment verification failed. Contact support.');
              setPlacing(false);
            }
          },
          prefill: {
            name: user?.name || guestAddress?.fullName || '',
            email: user?.email || guestAddress?.email || '',
            contact: user?.phone || guestAddress?.phone || '',
          },
          theme: { color: '#1A1A1A' },
          modal: { 
            ondismiss: () => {
              setPlacing(false);
              setPaymentLoading(null);
            }
          },
        };

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', (response) => {
          setPaymentLoading(null);
          toast.error(response.error?.description || 'Payment failed. Please try again.');
          setPlacing(false);
        });

        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = async (method, orderId) => {
    trackPurchase(orderId, total);
    await clearCart();

    await queryClient.invalidateQueries({ queryKey: ['cart'] });
    await queryClient.invalidateQueries({ queryKey: ['orders'] });
    await queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    await queryClient.invalidateQueries({ queryKey: ['user'] });

    navigate(`/orders/${orderId}/success`, { replace: true });
    toast.success('Order placed successfully!');
  };

  const selectedAddress = selectedAddr === 'guest' ? guestAddress : addresses.find((a) => a.id === selectedAddr);

  return (
    <div className="min-h-screen bg-[#FAFAF4] luxury-grain pt-28 sm:pt-32 pb-20 sm:pb-24 px-3 sm:px-4 relative overflow-hidden text-[#6B6560]">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <Link to="/cart" className="hover:text-[#C8922A] transition-colors">Cart</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">Checkout</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 sm:mb-12 text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A] leading-tight">
              Secure <span className="italic text-[#C8922A]">Checkout</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-8 bg-[#C8922A]" />
              <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">Step {step} of 3</p>
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8 sm:mb-12 p-3 sm:p-6 bg-white border border-[#E8E2D8] rounded-xl flex items-center justify-between shadow-none">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step === s.id
                    ? 'bg-[#1A1A1A] text-white ring-4 ring-[#1A1A1A]/10'
                    : step > s.id
                    ? 'bg-[#C8922A] text-white'
                    : 'bg-[#FAFAF4] border border-[#E8E2D8] text-[#9A8A70]'
                }`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <span className="font-semibold text-[10px] sm:text-xs text-[#1A1A1A] hidden sm:inline uppercase tracking-widest">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[1px] mx-4 ${step > s.id ? 'bg-[#C8922A]' : 'bg-[#E8E2D8]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left column - Steps */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">

            {/* STEP 1 — Address */}
            <div className={`bg-white border border-[#E8E2D8] rounded-xl p-4 sm:p-6 md:p-8 transition-all ${step >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#C8922A]" />
                  </div>
                  <h2 className="font-display font-light text-xl text-[#1A1A1A]">Delivery Address</h2>
                </div>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-xs font-semibold text-[#C8922A] hover:opacity-80 transition-colors uppercase tracking-wider cursor-pointer">
                    Change
                  </button>
                )}
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  {showInlineForm ? (
                    <InlineAddressForm 
                      onSave={addAddress} 
                      onCancel={() => setShowInlineForm(false)} 
                      showCancel={addresses.length > 0} 
                    />
                  ) : (
                    <div className="space-y-3 text-left">
                      <p className="text-xs font-semibold text-[#9A8A70] uppercase tracking-wider">Select Delivery Address</p>
                      {addresses.map((a) => (
                        <label
                          key={a.id}
                          className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-5 rounded-lg border cursor-pointer transition-all group ${
                            selectedAddr === a.id
                              ? 'border-[#C8922A] bg-[#FAFAF4]'
                              : 'border-[#E8E2D8] hover:border-[#C8922A] hover:bg-[#FAFAF4]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="address"
                            value={a.id}
                            checked={selectedAddr === a.id}
                            onChange={() => setSelectedAddr(a.id)}
                            className="mt-0.5 accent-[#1A1A1A] w-5 h-5 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-[#1A1A1A]">{a.label}</span>
                              {a.isDefault && (
                                <span className="text-[10px] font-sans font-medium uppercase tracking-wider bg-[#1A1A1A] text-white px-2 py-0.5 rounded-xs">Default</span>
                              )}
                            </div>
                            <p className="font-semibold text-[#1A1A1A] text-sm">{a.fullName}</p>
                            <p className="text-xs sm:text-sm text-[#6B6560] mt-1 break-words">
                              {a.line1}{a.line2 ? `, ${a.line2}` : ''}
                            </p>
                            <p className="text-xs sm:text-sm text-[#6B6560]">
                              {a.city}, {a.state} – {a.pincode}
                            </p>
                            <p className="text-xs text-[#9A8A70] mt-2 font-medium">{a.phone}</p>
                          </div>
                          {selectedAddr === a.id && (
                            <div className="shrink-0 mt-1">
                              <div className="w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                          )}
                        </label>
                      ))}

                      {user && (
                        <button
                          onClick={() => setShowInlineForm(true)}
                          className="w-full py-3 sm:py-4 border border-dashed border-[#9A8A70]/60 rounded-lg text-xs sm:text-sm font-semibold text-[#1A1A1A] bg-white hover:bg-[#FAFAF4] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add New Delivery Address
                        </button>
                      )}
                    </div>
                  )}

                  {!isProfileComplete && (
                    <p className="text-xs text-[#9A8A70] italic mt-4 text-left">
                      Save your address in My Account for faster checkout.
                    </p>
                  )}

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-[1px] bg-[#E8E2D8]" />
                    <span className="text-[10px] text-[#9A8A70] font-semibold uppercase tracking-wider">Additional Info</span>
                    <div className="flex-1 h-[1px] bg-[#E8E2D8]" />
                  </div>

                  {/* Order Notes */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] flex items-center gap-2">
                      <span>Special Instructions</span>
                      <span className="text-[#6B6560] font-normal lowercase">(optional)</span>
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-3 rounded-xs border border-[#E8E2D8] focus:border-[#C8922A] focus:outline-none transition-colors resize-none placeholder-[#9A8A70] text-sm text-[#1A1A1A]"
                      placeholder="Add any special instructions or delivery notes (e.g., ring doorbell twice, leave with security)"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 pt-4">
                    <button
                      onClick={() => navigate('/cart')}
                      className="flex-1 px-3 sm:px-6 py-3 sm:py-4 rounded-xs border border-[#E8E2D8] text-[#6B6560] font-semibold text-xs uppercase tracking-wider hover:bg-[#FAFAF4] transition-colors cursor-pointer"
                    >
                      Back to Cart
                    </button>
                    <button
                      onClick={() => {
                        if (!selectedAddr) { toast.error('Please select a delivery address'); return; }
                        setStep(2);
                      }}
                      className="flex-1 px-3 sm:px-6 py-3 sm:py-4 rounded-xs bg-[#1A1A1A] text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-colors cursor-pointer"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {step > 1 && selectedAddress && (
                <div className="p-4 bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg text-left">
                  <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">{selectedAddress.label} — {selectedAddress.fullName}</p>
                  <p className="text-xs sm:text-sm text-[#6B6560] break-words">
                    {selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}, {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}
                  </p>
                </div>
              )}
            </div>

            {/* STEP 2 — Review */}
            {step >= 2 && (
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#C8922A]" />
                    </div>
                    <h2 className="font-display font-light text-xl text-[#1A1A1A]">Review Items</h2>
                  </div>
                  {step > 2 && (
                    <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#C8922A] hover:opacity-80 transition-colors uppercase tracking-wider cursor-pointer">
                      Change
                    </button>
                  )}
                </div>

                {step === 2 && (
                  <div className="space-y-6 text-left">
                    <div className="divide-y divide-[#E8E2D8]">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-[#FAFAF4] border border-[#E8E2D8] shrink-0">
                            {item.product?.images?.[0]?.url ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-[#9A8A70]" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-light text-[#1A1A1A] text-sm sm:text-base leading-tight mb-1">{item.product?.name}</p>
                            <div className="flex items-center gap-2 mb-2">
                              {item.product?.unit && <span className="text-[10px] font-semibold text-[#9A8A70] uppercase bg-[#FAFAF4] px-1.5 py-0.5 rounded-xs">{item.product.unit}</span>}
                              <span className="text-xs font-medium text-[#6B6560]">Qty: <span className="font-bold text-[#1A1A1A]">{item.quantity}</span></span>
                            </div>
                            <p className="font-display italic text-base text-[#C8922A]">
                              ₹{(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setStep(3)}
                      className="w-full bg-[#1A1A1A] text-white py-4 rounded-xs font-semibold text-xs tracking-wider uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {step > 2 && (
                  <div className="p-4 bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg text-sm text-[#6B6560] text-left">
                    {items.length} item{items.length !== 1 ? 's' : ''} reviewed
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 — Payment */}
            {step >= 3 && (
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 sm:p-6 md:p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-[#E8E2D8] mb-8">
                  <div className="w-10 h-10 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-[#C8922A]" />
                  </div>
                  <h2 className="font-display font-light text-xl text-[#1A1A1A]">Select Payment Method</h2>
                </div>

                <div className="space-y-8">
                  <div className="grid gap-4 sm:grid-cols-2 relative">
                    {/* Pay Online */}
                    <button
                      type="button"
                      onClick={() => !placing && setSelectedMethod('RAZORPAY')}
                      className={`group relative flex flex-col items-center gap-3 p-6 rounded-lg border transition-all duration-300 text-center overflow-hidden
                        ${selectedMethod === 'RAZORPAY' 
                          ? 'border-[#1A1A1A] bg-[#FAFAF4]' 
                          : 'border-[#E8E2D8] bg-white'}
                        ${placing ? 'pointer-events-none' : 'cursor-pointer'}
                        ${selectedMethod && selectedMethod !== 'RAZORPAY' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                      `}
                    >
                      {selectedMethod === 'RAZORPAY' && (
                        <div className="absolute top-3 right-3 bg-[#1A1A1A] text-white rounded-full p-1 z-10">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      
                      {placing && selectedMethod === 'RAZORPAY' && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                          <LoaderCircle className="w-6 h-6 text-[#1A1A1A] animate-spin mb-1" />
                          <span className="text-[9px] font-semibold text-[#1A1A1A] uppercase tracking-wider">Opening Gateway...</span>
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                        ${selectedMethod === 'RAZORPAY' ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAFAF4] border border-[#E8E2D8] text-[#C8922A]'}
                      `}>
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A]">Pay Online</h4>
                        <p className="text-[10px] text-[#6B6560] uppercase tracking-wider mt-1">UPI · Cards · Netbanking</p>
                      </div>
                    </button>

                    {/* Cash on Delivery */}
                    <button
                      type="button"
                      onClick={() => !placing && setSelectedMethod('COD')}
                      className={`group relative flex flex-col items-center gap-3 p-6 rounded-lg border transition-all duration-300 text-center overflow-hidden
                        ${selectedMethod === 'COD' 
                          ? 'border-[#1A1A1A] bg-[#FAFAF4]' 
                          : 'border-[#E8E2D8] bg-white'}
                        ${placing ? 'pointer-events-none' : 'cursor-pointer'}
                        ${selectedMethod && selectedMethod !== 'COD' ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                      `}
                    >
                      {selectedMethod === 'COD' && (
                        <div className="absolute top-3 right-3 bg-[#1A1A1A] text-white rounded-full p-1 z-10">
                          <Check className="w-3 h-3" />
                        </div>
                      )}

                      {placing && selectedMethod === 'COD' && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-20">
                          <LoaderCircle className="w-6 h-6 text-[#1A1A1A] animate-spin mb-1" />
                          <span className="text-[9px] font-semibold text-[#1A1A1A] uppercase tracking-wider">Placing Order...</span>
                        </div>
                      )}

                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300
                        ${selectedMethod === 'COD' ? 'bg-[#1A1A1A] text-white' : 'bg-[#FAFAF4] border border-[#E8E2D8] text-[#C8922A]'}
                      `}>
                        <Banknote className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1A1A1A]">Cash on Delivery</h4>
                        <p className="text-[10px] text-[#6B6560] uppercase tracking-wider mt-1">Pay on delivery</p>
                      </div>
                    </button>
                  </div>

                  {/* Unified Action Button */}
                  <div className="pt-4 border-t border-[#E8E2D8] text-center">
                    <button
                      onClick={() => handleCreateOrder(selectedMethod)}
                      disabled={!selectedMethod || placing}
                      className={`group relative w-full py-4 rounded-xs font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2
                        ${!selectedMethod 
                          ? 'bg-[#FAFAF4] text-[#9A8A70] border border-[#E8E2D8] cursor-not-allowed' 
                          : 'bg-[#1A1A1A] text-white hover:opacity-90 cursor-pointer'}
                      `}
                    >
                      {placing ? (
                        <>
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          {!selectedMethod && <span>Select Payment Method</span>}
                          {selectedMethod === 'RAZORPAY' && (
                            <>
                              <span>Pay ₹{total.toLocaleString('en-IN')} Online</span>
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                          {selectedMethod === 'COD' && (
                            <>
                              <span>Confirm Order (Pay on Delivery)</span>
                              <CheckCircle className="w-4 h-4" />
                            </>
                          )}
                        </>
                      )}
                    </button>
                    
                    <p className="text-[10px] text-[#6B6560] text-center mt-4 uppercase tracking-wider font-medium">
                      By placing this order, you agree to our <Link to="/privacy" className="underline hover:text-[#1A1A1A]">Terms & Policies</Link>
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[9px] text-[#9A8A70] mt-2 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> Secure Checkout</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Direct Village Shipping</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right column — Order Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-white border border-[#E8E2D8] rounded-xl sticky top-24 overflow-hidden text-left">
              <button
                onClick={() => setShowItems(!showItems)}
                className="w-full flex items-center justify-between p-4 border-b border-[#E8E2D8] lg:cursor-default bg-white"
              >
                <h2 className="font-display font-light text-lg text-[#1A1A1A] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#C8922A]" />
                  Order Summary
                </h2>
                <span className="lg:hidden text-[#6B6560]">
                  {showItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {/* Items list */}
              <div className={`overflow-hidden transition-all ${showItems ? 'max-h-96' : 'max-h-0 lg:max-h-none'}`}>
                <div className="p-4 divide-y divide-[#E8E2D8] max-h-72 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                      <div className="relative shrink-0">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://placehold.co/48x48/fdfbf7/9a8a70?text=Achaar'}
                          alt={item.product?.name}
                          className="w-12 h-12 rounded-md object-cover bg-[#FAFAF4] border border-[#E8E2D8]"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A1A1A] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans font-semibold text-[#1A1A1A] text-xs leading-tight truncate">{item.product?.name}</p>
                        {item.product?.unit && <p className="text-[10px] text-[#6B6560]">{item.product.unit}</p>}
                      </div>
                      <p className="font-display italic text-[#C8922A] text-sm shrink-0">
                        ₹{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="p-4 space-y-3 border-t border-[#E8E2D8]">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6560]">Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6560] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#9A8A70]" /> Delivery
                  </span>
                  <span className="font-bold text-green-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> FREE
                  </span>
                </div>

                <div className="flex justify-between text-sm font-semibold pt-3 border-t border-[#E8E2D8]">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="font-display italic text-base text-[#C8922A]">₹{total.toFixed(2)}</span>
                </div>

                <div className="text-[10px] text-[#9A8A70] text-center pt-2">
                  Prices inclusive of all taxes • INR
                </div>
              </div>

              {/* Trust badges */}
              <div className="px-4 pb-4 grid grid-cols-3 gap-2 border-t border-[#E8E2D8] pt-4">
                {[
                  { icon: <MdSecurity className="w-5 h-5 text-[#C8922A]" />, label: 'Secure\nPayment' },
                  { icon: <MdLocalShipping className="w-5 h-5 text-[#C8922A]" />, label: 'Fresh\nDelivery' },
                  { icon: <MdAssignmentReturn className="w-5 h-5 text-[#C8922A]" />, label: 'Easy\nReturns' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 p-2 bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg">
                    <div className="bg-white p-1.5 rounded-md border border-[#E8E2D8]">{icon}</div>
                    <p className="text-[8px] text-[#6B6560] font-semibold text-center leading-tight whitespace-pre-line uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {paymentLoading === 'verifying' && (
        <div className="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-xs mx-4 border border-[#E8E2D8] shadow-none">
            <LoaderCircle className="w-8 h-8 text-[#C8922A] animate-spin mx-auto mb-4" />
            <p className="text-[#1A1A1A] font-semibold text-sm">
              Confirming your payment...
            </p>
            <p className="text-[#6B6560] text-xs mt-1">
              Please do not close or refresh this page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}