import { createElement } from 'react';
import { ShieldCheck, Lock, Database, Mail } from 'lucide-react';

export default function Privacy() {
  const blocks = [
    { icon: Lock, title: 'What we protect', text: 'We encrypt and protect your account details, phone number, and delivery addresses.' },
    { icon: Database, title: 'How we use data', text: 'We use your details strictly to fulfill pickle orders, send tracking updates, and manage accounts.' },
    { icon: Mail, title: 'Communication', text: 'We only contact you for receipt copies, shipping status, and support responses.' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF4] page-enter py-28 text-[#6B6560]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-left">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-lg bg-[#F2EDE0] border border-[#E8E2D8] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[#C8922A]" />
          </div>
          <h1 className="font-display font-light text-4xl text-[#1A1A1A]">Privacy Policy</h1>
          <p className="text-xs text-[#9A8A70] uppercase tracking-wider max-w-2xl mx-auto">
            This policy outlines how we handle and protect your personal information.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {blocks.map(({ icon, title, text }) => (
            <div key={title} className="bg-white border border-[#E8E2D8] rounded-xl p-5 text-left">
              {createElement(icon, { className: 'w-5 h-5 text-[#C8922A] mb-3' })}
              <h2 className="font-semibold text-sm text-[#1A1A1A] mb-2">{title}</h2>
              <p className="text-xs text-[#6B6560] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 space-y-4 text-xs text-[#6B6560] leading-relaxed">
          <p>
            We respect your privacy and never sell or share your contact info. Access to customer profiles is limited to essential shipping agents and order processors.
          </p>
          <p>
            If you wish to modify or request deletion of your account records, please contact our support team and we will assist you.
          </p>
        </div>
      </div>
    </div>
  );
}
