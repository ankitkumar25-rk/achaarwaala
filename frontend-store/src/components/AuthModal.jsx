import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader, X } from 'lucide-react';
import { useAuthStore } from '../store';
import { auth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import logoImg from '../assets/images/logo_black.svg';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, verifyFirebase } = useAuthStore();
  
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep(1);
      setPhone('');
      setOtp('');
      setName('');
      setEmail('');
      setFirebaseIdToken('');
      
      // Initialize Recaptcha if auth is configured
      if (auth && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {}
        });
      }
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!auth) {
      toast.error('Firebase not configured. Check .env');
      return;
    }
    if (!phone || phone.length < 10) return toast.error('Enter a valid phone number');
    
    setSubmitting(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`; 
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setStep(2);
      toast.success('OTP Sent!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    
    setSubmitting(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      setFirebaseIdToken(idToken);
      
      try {
        await verifyFirebase({ idToken });
        toast.success('Logged in successfully!');
        closeAuthModal();
      } catch (backendErr) {
        // If backend throws an error, it might need name/email for registration
        setStep(3);
      }
    } catch (err) {
      console.error(err);
      toast.error('Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await verifyFirebase({ idToken: firebaseIdToken, name, email });
      toast.success('Welcome to Achaarwaala!');
      closeAuthModal();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to complete registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-[#FFFFFF] rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Invisible Recaptcha */}
        <div id="recaptcha-container"></div>

        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 text-[#6B6560] hover:text-[#1A1A1A] transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Pane (Branding) */}
        <div className="md:w-2/5 bg-[#2E5731] p-8 text-white flex flex-col justify-between hidden md:flex">
          <div>
            <h2 className="text-2xl font-display font-medium mb-3">
              {step === 1 ? 'Login' : step === 2 ? 'Verify' : 'Sign Up'}
            </h2>
            <p className="text-[#E8E2D8] text-sm font-sans leading-relaxed">
              Get access to your Orders, Wishlist and special heritage recommendations.
            </p>
          </div>
          <div className="flex justify-center mb-8">
            <img src={logoImg} alt="Achaarwaala" className="h-24 w-auto object-contain brightness-0 invert opacity-90" />
          </div>
        </div>

        {/* Right Pane (Form) */}
        <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col">
          
          <div className="md:hidden flex justify-center mb-6">
            <img src={logoImg} alt="Achaarwaala" className="h-12 w-auto object-contain" />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-6">
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#6B6560] mb-2">Enter Mobile Number</label>
                  <div className="flex border-b border-[#E8E2D8] focus-within:border-[#D98C00] transition-colors">
                    <span className="py-3 px-2 text-[#1A1A1A] font-medium">+91</span>
                    <input
                      type="tel"
                      required
                      autoFocus
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="10-digit mobile number"
                      className="w-full bg-transparent p-3 outline-none text-[#1A1A1A]"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-[#9A8A70] leading-relaxed">
                  By continuing, you agree to Achaarwaala's <a href="#" className="text-[#D98C00] hover:underline">Terms of Use</a> and <a href="#" className="text-[#D98C00] hover:underline">Privacy Policy</a>.
                </p>

                <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-sm font-bold tracking-wider flex items-center justify-center gap-2 bg-[#D98C00] hover:bg-[#B53728]">
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  {submitting ? 'REQUESTING OTP...' : 'REQUEST OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="text-center mb-6">
                  <p className="text-sm text-[#6B6560]">Please enter the OTP sent to</p>
                  <p className="font-medium text-[#1A1A1A]">+91 {phone}</p>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    autoFocus
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-[#FAFAF4] border border-[#E8E2D8] p-4 text-[#1A1A1A] focus:border-[#D98C00] focus:outline-none transition-colors"
                  />
                </div>

                <button type="submit" disabled={submitting || otp.length !== 6} className="btn-primary w-full py-4 text-sm font-bold tracking-wider flex items-center justify-center gap-2 bg-[#D98C00] hover:bg-[#B53728]">
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  {submitting ? 'VERIFYING...' : 'VERIFY'}
                </button>

                <div className="text-center mt-4">
                  <button type="button" onClick={() => setStep(1)} className="text-xs font-medium text-[#D98C00] hover:underline">
                    Not your number? Change it
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="mb-6">
                  <p className="text-sm text-[#6B6560]">Almost there! Please tell us your name.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#6B6560] mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border-b border-[#E8E2D8] focus:border-[#D98C00] p-3 outline-none text-[#1A1A1A] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#6B6560] mb-2">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For order updates"
                    className="w-full border-b border-[#E8E2D8] focus:border-[#D98C00] p-3 outline-none text-[#1A1A1A] transition-colors"
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-sm font-bold tracking-wider flex items-center justify-center gap-2 bg-[#D98C00] hover:bg-[#B53728]">
                  {submitting && <Loader className="w-4 h-4 animate-spin" />}
                  {submitting ? 'SAVING...' : 'CONTINUE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
