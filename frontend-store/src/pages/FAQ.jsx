import { HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How long does delivery take?',
    answer: 'Most orders are freshly packed and shipped directly from our village facility. Delivery across India typically takes 3-6 business days.',
  },
  {
    question: 'Do you offer cash on delivery?',
    answer: 'Yes, Cash on Delivery (COD) is available at checkout for all major pin codes without any additional handling charges.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Once shipped, you will receive tracking details via email/SMS. You can also view live order progress on our Track Order page.',
  },
  {
    question: 'Can I return an opened jar?',
    answer: 'For food safety and hygiene reasons, we cannot accept returns of jars that have been opened or had their safety seals broken, unless the product arrived damaged.',
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#FAFAF4] page-enter py-28 text-[#6B6560]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 text-left">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-lg bg-[#F2EDE0] border border-[#E8E2D8] flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-[#C8922A]" />
          </div>
          <h1 className="font-display font-light text-4xl text-[#1A1A1A]">Frequently Asked Questions</h1>
          <p className="text-xs text-[#9A8A70] uppercase tracking-wider max-w-2xl mx-auto">
            Everything you need to know about our slow-cured Rajasthani pickles.
          </p>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 sm:p-6 shadow-none">
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="group rounded-lg border border-[#E8E2D8] bg-white overflow-hidden">
                <summary className="list-none cursor-pointer px-5 py-4 font-semibold text-[#1A1A1A] flex items-center justify-between gap-4 select-none">
                  <span className="text-sm">{item.question}</span>
                  <span className="text-[#C8922A] text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-xs text-[#6B6560] leading-relaxed border-t border-[#E8E2D8]/30 pt-3">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
