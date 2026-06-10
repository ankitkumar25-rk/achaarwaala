import { Link } from 'react-router-dom';
import { createElement } from 'react';
import { RotateCcw, ShieldCheck, Clock3, PackageCheck } from 'lucide-react';

export default function Returns() {
  const points = [
    { icon: Clock3, title: 'Report within 7 days', text: 'Please notify us within 7 days of delivery if there is any damage or spoilage.' },
    { icon: PackageCheck, title: 'Sealed condition', text: 'For safety reasons, non-defective returns are only accepted if jars remain unopened with seals intact.' },
    { icon: ShieldCheck, title: 'Instant replacement', text: 'If a jar arrives broken or damaged during shipping, we will dispatch a replacement immediately.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF4] page-enter py-28 text-[#6B6560]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-left">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-lg bg-[#F2EDE0] border border-[#E8E2D8] flex items-center justify-center">
            <RotateCcw className="w-8 h-8 text-[#C8922A]" />
          </div>
          <h1 className="font-display font-light text-4xl text-[#1A1A1A]">Return Policy</h1>
          <p className="text-xs text-[#9A8A70] uppercase tracking-wider max-w-2xl mx-auto">
            We stand behind the quality of our Rajasthani pickles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {points.map(({ icon, title, text }) => (
            <div key={title} className="bg-white border border-[#E8E2D8] rounded-xl p-5 text-left">
              {createElement(icon, { className: 'w-5 h-5 text-[#C8922A] mb-3' })}
              <h2 className="font-semibold text-sm text-[#1A1A1A] mb-2">{title}</h2>
              <p className="text-xs text-[#6B6560] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 space-y-6 text-xs text-[#6B6560] leading-relaxed">
          <div>
            <h2 className="font-display font-light text-xl text-[#1A1A1A] mb-4">How to Request a Replacement or Refund</h2>
            <ol className="space-y-3">
              <li>1. Navigate to <Link to="/orders" className="text-[#C8922A] font-semibold hover:underline">My Orders</Link> in your account.</li>
              <li>2. Select the order and click the support option, or email us directly with your Order ID.</li>
              <li>3. Send a photo of the damaged/broken jar if applicable. Our village team will verify and ship a fresh batch.</li>
            </ol>
          </div>

          <div className="pt-6 border-t border-[#E8E2D8]">
            <h2 className="font-semibold text-sm text-[#1A1A1A] mb-3">Custom Personalized Jars</h2>
            <p className="leading-relaxed">
              Jars customized with personal family names, seals, or brand logos are cured and printed to order. <span className="font-semibold text-[#1A1A1A]">Personalized jars are non-refundable</span> unless they arrive damaged during transit.
            </p>
          </div>

          <div className="pt-6 border-t border-[#E8E2D8]">
            <h2 className="font-semibold text-sm text-[#1A1A1A] mb-3">Return & Village Facility Address</h2>
            <p className="leading-relaxed font-mono">
              Achaarwaala Curing Facility<br />
              WARD NO. 04, KUMAWAT COLONY,<br />
              SITHAL ROAD, TEHSIL - GUDHA GORJI,<br />
              Chhaosari, Jhunjhunu, Rajasthan - 333012
            </p>
          </div>

          <p className="text-[10px] text-[#9A8A70] italic pt-4">
            Due to the perishable nature of handcrafted food products, general change-of-mind returns are not supported once a jar is unsealed.
          </p>
        </div>
      </div>
    </div>
  );
}
