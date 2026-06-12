import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import imgLeft from '../assets/images/78d24d8c-b63f-4b3e-a9f3-6f5752927c0a.png';
import imgTopRight from '../assets/images/60bc9565-b5f4-454d-a8e5-36addfed5fd0 (1).png';
import imgBottomRight from '../assets/images/b085284f-af0d-4da2-8ead-aa66bd3075eb.png';

const Marquee = ({ text }) => {
  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-12 relative flex">
      {/* Absolute gradient masks for smooth fade on edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#111111] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#111111] to-transparent z-10"></div>
      
      <div className="flex animate-[marquee_40s_linear_infinite] shrink-0">
        <span className="font-display text-4xl lg:text-5xl text-[#C8922A] mx-4 font-light tracking-wider">
          {text}
        </span>
        <span className="font-display text-4xl lg:text-5xl text-[#C8922A] mx-4 font-light tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
};

export default function OurStory() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://achaarwaala.com/our-story"
    },
    "name": "Our Story - The Heritage of Achaarwaala",
    "description": "Discover the 1000-year-old legend of Lohagaal and the artisanal sun-curing traditions that define Achaarwaala's heritage."
  };

  return (
    <div className="bg-[#FAFAF4] min-h-screen">
      <SEO 
        title="Our Heritage | Achaarwaala"
        description="Discover the 1000-year-old legend of Lohagaal and the artisanal sun-curing traditions that define Achaarwaala's heritage."
        schemaMarkup={schema}
      />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* CHAPTER I */}
      <section className="w-full bg-[#1A1A1A] marwadi-texture-dark relative py-24 lg:py-32 overflow-hidden border-b border-[#E8E2D8]/10">
        {/* Subtle texture over dark bg */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #C8922A 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 text-left">
            <span className="font-display text-[80px] lg:text-[100px] font-extralight text-[#C8922A] opacity-40 leading-none block mb-6">I</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-6">
              THE LEGEND · EST. 1000+ YEARS
            </span>
            <h2 className="font-display text-5xl lg:text-[56px] font-light text-[#FFFFFF] leading-[1.1] mb-4">
              Where Iron Melted
            </h2>
            <p className="font-display italic text-2xl text-[#C8922A] mb-8 font-light">
              The story of a village born from a miracle
            </p>
            <p className="font-sans text-[15px] leading-[1.85] text-[#D1CEC7] max-w-lg">
              After the great war of Kurukshetra, the victorious Pandavas traveled through the Thar. They stopped at a sacred kund to bathe — and as they stepped in, the iron armour fused to their battle-worn bodies began to dissolve. The iron melted. The village born around that kund was named Lohagaal — <span className="italic">Loha</span> (iron) + <span className="italic">Gal</span> (to melt).
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] rounded-xl overflow-hidden border border-[#C8922A]/20 shadow-2xl relative">
              <img src={imgLeft} alt="Ancient architecture glowing in golden light" className="w-full h-full object-cover filter brightness-75 sepia-[0.3]" />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER II */}
      <section className="w-full bg-transparent marwadi-texture relative py-24 lg:py-32 border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 text-left">
            <span className="font-display text-[80px] lg:text-[100px] font-extralight text-[#C8922A] opacity-40 leading-none block mb-6">II</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-6">
              THE SACRED KUND
            </span>
            <h2 className="font-display text-4xl lg:text-[56px] font-light text-[#1A1A1A] leading-[1.1] mb-8">
              Rajasthan's Hidden Ganga
            </h2>
            <p className="font-sans text-[15px] leading-[1.85] text-[#6B6560] max-w-lg mb-8">
              In the heart of the Thar desert, where water is a miracle, Lohagaal holds a kund that never runs dry. All year, water flows — an impossibility in this land of sand and sun. Families travel from across Rajasthan to immerse the ashes of their loved ones here, just as one would at the Ganga. Every Sawan, thousands bathe in its waters. The village breathes with pilgrims.
            </p>
            <div className="border-l border-[#C8922A] pl-6 py-2">
              <p className="font-display italic text-xl text-[#1A1A1A]">Year-round water · In the heart of the Thar desert</p>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img src={imgTopRight} alt="Sacred kund water with floating marigolds" className="w-full h-full object-cover filter sepia-[0.1]" />
            </div>
          </div>
        </div>
      </section>

      {/* CHAPTER III */}
      <section className="w-full relative py-32 lg:py-48 overflow-hidden border-b border-[#E8E2D8] flex items-center justify-center">
        {/* Large background photo with overlay */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1463130456064-072044813db1?auto=format&fit=crop&q=80&w=1600" alt="Ancient tree branches" className="w-full h-full object-cover opacity-[0.15] grayscale" />
          <div className="absolute inset-0 bg-[#FAFAF4]/70 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center">
          <span className="font-display text-[80px] lg:text-[100px] font-extralight text-[#C8922A] opacity-40 leading-none block mb-6">III</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-6">
            THE JAAL WALI KERI
          </span>
          <h2 className="font-display text-4xl lg:text-[56px] font-light text-[#1A1A1A] leading-[1.1] mb-10">
            The Trees That Refused to Leave
          </h2>
          <p className="font-sans text-[15px] leading-[1.85] text-[#6B6560] max-w-2xl mx-auto mb-16 text-left sm:text-center">
            Lohagaal is surrounded by ancient mango trees — but not just any mango. The <span className="italic">jaal wali keri</span>, a rare variety found only in this microclimate, grows here in abundance. In a desert where nothing should flourish, these trees produce fruit every season without fail. For the women of the village, making achaar was never a hobby. It was the only way to preserve the harvest — and feed a family through the year.
          </p>
          
          <div className="px-4 sm:px-12 py-10 bg-[#FFFFFF]/80 border border-[#E8E2D8] rounded-2xl backdrop-blur-sm shadow-sm relative">
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-[#C8922A] opacity-30 font-display">"</span>
            <p className="font-display italic text-[28px] md:text-[36px] leading-[1.3] text-[#1A1A1A] mb-4">
              <span className="font-['Noto_Sans_Devanagari']">अचार बनाना कोई शौक नहीं था। यह बचने का एक तरीका था।</span>
            </p>
            <p className="font-sans text-xs italic text-[#9A8A70] uppercase tracking-widest">
              Achaar-making was not a hobby. It was survival.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER IV */}
      <section className="w-full bg-transparent marwadi-texture relative py-24 lg:py-32 border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-0">
          <div className="w-full lg:w-7/12 lg:pr-12">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#E8E2D8] shadow-md z-10 relative">
              <img src={imgBottomRight} alt="Vibrant mela gathering with warm colors" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-6/12 bg-[#F2EDE0] p-10 sm:p-14 lg:p-16 rounded-xl border border-[#E8E2D8] lg:-ml-16 z-20 relative shadow-xl">
            <span className="font-display text-[80px] lg:text-[100px] font-extralight text-[#C8922A] opacity-40 leading-none block mb-4">IV</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-4">
              THE GATHERING
            </span>
            <h2 className="font-display text-4xl lg:text-[48px] font-light text-[#1A1A1A] leading-[1.1] mb-6">
              When the Village Comes Alive
            </h2>
            <p className="font-sans text-[15px] leading-[1.85] text-[#6B6560]">
              Every year, Lohagaal holds its mela. Pilgrims arrive. Old families reunite. Children who left for cities return. And at every household — the smell is the same: mustard oil heating, whole spices crackling, jars being filled for relatives to carry back. The achaar is not just food. It is the parting gift. The taste of home in a sealed jar.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTER V */}
      <section className="w-full bg-[#1A1A1A] marwadi-texture-dark relative py-24 lg:py-32 overflow-hidden border-b border-[#E8E2D8]/10">
        
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center">
          <span className="font-display text-[80px] lg:text-[100px] font-extralight text-[#C8922A] opacity-40 leading-none block mb-6">V</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-6">
            THE CRAFT
          </span>
          <h2 className="font-display text-4xl lg:text-[56px] font-light text-[#FFFFFF] leading-[1.1] mb-8">
            85 Recipes. Written Nowhere.
          </h2>
          <p className="font-sans text-[15px] leading-[1.85] text-[#D1CEC7] max-w-2xl mx-auto mb-16 text-left sm:text-center">
            In our factory in Lohagaal, 85 different varieties of achaar are made. No printed recipe book exists. The ratios — how much rai, how long in the sun, which oil for which fruit — live only in memory. Passed from grandmother to daughter to granddaughter. Ker. Sangri. Gunda. Lesua. These are not exotic ingredients to us. They are childhood.
          </p>
        </div>

        {/* Marquee Banner */}
        <div className="relative z-10 bg-[#111111] border-y border-[#C8922A]/20">
          <Marquee text="Ker Sangri · Jaal Wali Keri · Gunda · Haldi · Lesua · Nimbu · Hari Mirch · Karonda · Baans · Amla · " />
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 border border-[#C8922A]/30 rounded-full px-8 py-3 bg-[#C8922A]/5">
            <span className="font-sans text-xs tracking-widest text-[#C8922A] uppercase"><span className="font-bold">85</span> Varieties</span>
            <span className="hidden sm:block text-[#C8922A]/40">•</span>
            <span className="font-sans text-xs tracking-widest text-[#C8922A] uppercase"><span className="font-bold">1</span> Village</span>
            <span className="hidden sm:block text-[#C8922A]/40">•</span>
            <span className="font-sans text-xs tracking-widest text-[#C8922A] uppercase"><span className="font-bold">0</span> Printed Recipes</span>
          </div>
        </div>
      </section>

      {/* CHAPTER VI */}
      <section className="w-full bg-transparent marwadi-texture relative py-32 lg:py-48 text-center">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <span className="font-display text-[80px] lg:text-[100px] font-extralight text-[#C8922A] opacity-40 leading-none block mb-6">VI</span>
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-8">
            TODAY
          </span>
          <h2 className="font-display text-5xl lg:text-[64px] font-light text-[#1A1A1A] leading-[1.1] mb-4">
            From Lohagaal, To You.
          </h2>
          <p className="font-display italic text-2xl text-[#C8922A] mb-10">
            Same sun. Same soil. Same hands.
          </p>
          <p className="font-sans text-[15px] leading-[1.85] text-[#6B6560] mb-16">
            We didn't change the recipe. We didn't move the factory. We didn't replace the sun with a dehydrator. We only added one thing — a way to reach you. Every jar that leaves Lohagaal carries a thousand years of story. We hope it reaches your table, and stays in your memory.
          </p>
          <Link to="/products" className="btn-primary py-4 px-12 text-[13px] tracking-[0.15em] bg-[#1A1A1A] hover:bg-[#C8922A]">
            SHOP THE COLLECTION
          </Link>
        </div>
      </section>
      
    </div>
  );
}
