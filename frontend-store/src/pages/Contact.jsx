import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you for contacting us! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF4] text-[#6B6560] py-16 lg:py-24 page-enter">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70]">
            INQUIRIES
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6.5xl font-light text-[#1A1A1A] leading-tight">
            Get in <span className="italic text-[#1A1A1A]">Touch</span>
          </h1>
          <p className="font-sans text-sm text-[#6B6560] max-w-2xl mx-auto leading-relaxed">
            Reach out to our estate kitchen for special requests, bulk reserve inquiries, or customer support.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-8 space-y-8 text-left rounded-xl shadow-none">
              <h2 className="font-display font-light text-2xl text-[#1A1A1A]">Estate Contacts</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center shrink-0 text-[#C8922A] rounded-lg">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-0.5">Email Us</p>
                    <a href="mailto:contact@achaarwaala.com" className="text-xs font-semibold text-[#1A1A1A] hover:text-[#C8922A] transition-colors">
                      contact@achaarwaala.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center shrink-0 text-[#C8922A] rounded-lg">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-0.5">Call or WhatsApp</p>
                    <a href="tel:+918107872468" className="text-xs font-semibold text-[#1A1A1A] hover:text-[#C8922A] transition-colors block mb-1">
                      +91 81078 72468 (Call)
                    </a>
                    <a href="https://wa.me/919602560933" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#C8922A] hover:opacity-80 transition-colors">
                      +91 96025 60933 (WhatsApp)
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center shrink-0 text-[#C8922A] rounded-lg">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-0.5">Estate Location</p>
                    <p className="text-xs font-semibold text-[#1A1A1A] leading-relaxed">
                      Lohagaal Village,<br />
                      Jhunjhunu, Rajasthan – 333012
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center shrink-0 text-[#C8922A] rounded-lg">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-0.5">Working Hours</p>
                    <p className="text-xs font-semibold text-[#1A1A1A]">
                      Mon - Sat: 9:00 AM - 6:00 PM<br />
                      Sunday: Closed (Resting batch curing)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-8 md:p-12 text-left rounded-xl shadow-none">
              <h2 className="font-display font-light text-2xl text-[#1A1A1A] mb-6">Send a Dispatch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70]">Your Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="input-field text-xs py-3 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className="input-field text-xs py-3 px-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70]">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How may we assist you?"
                    className="input-field text-xs py-3 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70]">Message Details</label>
                  <textarea
                    required
                    rows="5"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write details of your request or feedback here..."
                    className="input-field text-xs py-3 px-4 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary py-3 px-8 text-[11px] tracking-[0.12em] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Sending...' : (
                    <>
                      <Send className="w-4 h-4" />
                      DISPATCH MESSAGE
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
