import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Truck, ClipboardList, ChevronRight } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanId = orderId.trim();
    if (!cleanId) return;
    navigate(`/orders/${cleanId.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF4] luxury-grain pt-32 pb-24 px-4 relative overflow-hidden text-[#6B6560]">
      <div className="max-w-3xl mx-auto relative z-10 text-left">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">Track Order</span>
        </div>

        {/* Header */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A] leading-tight">
            Track <span className="italic text-[#C8922A]">Your Order</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-8 bg-[#C8922A]" />
            <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">Real-time Updates</p>
          </div>
          <p className="text-sm text-[#6B6560] leading-relaxed max-w-2xl">
            Enter your order ID to check the latest status and tracking information of your artisanal pickle jar.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-[#E8E2D8] p-8 rounded-xl space-y-6 mb-8 shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">Order ID</label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="input-field"
                placeholder="Paste your order ID here"
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center gap-2 py-4 text-xs cursor-pointer">
              Track Now <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-lg bg-[#F2EDE0] border border-[#E8E2D8]/50 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E8E2D8] flex items-center justify-center text-[#C8922A]">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#1A1A1A] mb-1">Shipping Updates</p>
                <p className="text-xs text-[#6B6560] leading-relaxed">Once your order leaves our village facility, check the tracking details on your order details page.</p>
              </div>
            </div>
            <div className="p-5 rounded-lg bg-[#F2EDE0] border border-[#E8E2D8]/50 space-y-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-[#E8E2D8] flex items-center justify-center text-[#C8922A]">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-sm text-[#1A1A1A] mb-1">Your Orders</p>
                <p className="text-xs text-[#6B6560] leading-relaxed">
                  Visit <Link to="/orders" className="text-[#C8922A] font-semibold hover:underline">My Orders</Link> to view and manage all your historical reservations in one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
