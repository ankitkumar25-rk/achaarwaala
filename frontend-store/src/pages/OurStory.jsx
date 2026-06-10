import { Sun, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OurStory() {
  const milestones = [
    { year: '1946', title: 'The Earthen Jars', desc: 'Dadaji started curing hand-harvested mangoes in ceramic martabans under the courtyard sun of Lohagaal, Rajasthan.' },
    { year: '1978', title: 'Ancestral Spice Blends', desc: 'Formalized the slow spice-curing ratios and single-origin mustard oil traditions that define our signature batches.' },
    { year: '2012', title: 'The Sacred Inheritance', desc: 'Passed down to the third generation, maintaining the 100% natural, preservative-free promise.' },
    { year: '2026 & Beyond', title: 'The Digital Archive', desc: 'Opening our private family reserve batches to discerning palates across India, shipped directly from our village estate.' }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF4] text-[#6B6560] py-16 lg:py-24 page-enter">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 space-y-20">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70]">
            OUR GENESIS
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6.5xl font-light text-[#1A1A1A] leading-tight">
            The Legend of <span className="italic text-[#1A1A1A]">Lohagaal</span>
          </h1>
          <p className="font-sans text-sm text-[#6B6560] max-w-2xl mx-auto leading-relaxed">
            Preserving Rajasthan's dry-cured culinary heritage through three generations of patient sun-curing.
          </p>
        </div>

        {/* Narrative / Intro */}
        <section className="bg-[#FFFFFF] border border-[#E8E2D8] p-8 md:p-12 relative overflow-hidden rounded-xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-12 h-12 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center text-[#C8922A] shrink-0 rounded-lg">
              <Sun className="w-6 h-6" />
            </div>
            <div className="space-y-4 text-left">
              <h2 className="font-display font-light text-2xl text-[#1A1A1A]">The Slow Curing Philosophy</h2>
              <p className="font-sans text-xs sm:text-sm text-[#6B6560] leading-relaxed">
                Every jar of Achaarwaala is a celebration of time. In an era of chemical ripening and mass machinery, our village kitchen in Lohagaal relies solely on the natural warmth of the Rajasthani sun and the slow infusion of ancestral spices in cold-pressed mustard oil.
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#6B6560] leading-relaxed">
                Our raw mangoes, wild ker, and spicy red chillies are carefully hand-sliced, salted, and spiced by local artisans whose hands carry centuries of regional intelligence. We do not rush the cure. Each batch matures slowly over forty-five days until it reaches absolute spice equilibrium.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-12">
          <div className="text-center">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-2">
              OUR ETHOS
            </span>
            <h2 className="font-display text-3xl font-light text-[#1A1A1A]">Ancestral Pillars</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-[#FFFFFF] p-8 border border-[#E8E2D8] rounded-xl text-left space-y-4">
              <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center text-[#C8922A] rounded-lg">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-display font-light text-lg text-[#1A1A1A]">100% Sun-Cured</h3>
              <p className="font-sans text-xs text-[#6B6560] leading-relaxed">
                Cured entirely under open desert skies in glass jars. We use no artificial heat or pressure.
              </p>
            </div>
            
            <div className="bg-[#FFFFFF] p-8 border border-[#E8E2D8] rounded-xl text-left space-y-4">
              <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center text-[#C8922A] rounded-lg">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-display font-light text-lg text-[#1A1A1A]">Zero Additives</h3>
              <p className="font-sans text-xs text-[#6B6560] leading-relaxed">
                No chemical preservatives, synthetic dyes, or acidity regulators. Natural salt and mustard oil are our only shields.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-8 border border-[#E8E2D8] rounded-xl text-left space-y-4">
              <div className="w-10 h-10 border border-[#E8E2D8] bg-[#FAFAF4] flex items-center justify-center text-[#C8922A] rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-display font-light text-lg text-[#1A1A1A]">Single-Origin</h3>
              <p className="font-sans text-xs text-[#6B6560] leading-relaxed">
                Sourced from family estates in Lohagaal and neighboring village farms to support rural heritage.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="space-y-12 text-left">
          <div className="text-center">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-[#9A8A70] block mb-2">
              THE CHRONICLE
            </span>
            <h2 className="font-display text-3xl font-light text-[#1A1A1A]">Our Slow Journey</h2>
          </div>
          <div className="relative border-l border-[#E8E2D8] ml-4 md:ml-32 space-y-12">
            {milestones.map((m) => (
              <div key={m.year} className="relative pl-8 md:pl-12 group">
                {/* Timeline node */}
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-[#C8922A] -translate-x-1/2 border border-[#FAFAF4] rounded-full" />
                
                {/* Year Label */}
                <span className="hidden md:block absolute right-full mr-8 text-xl font-display font-light text-[#C8922A] top-0.5">{m.year}</span>
                
                <div className="space-y-1.5">
                  <span className="md:hidden block text-xs font-sans tracking-widest text-[#C8922A]">{m.year}</span>
                  <h3 className="font-display font-light text-lg text-[#1A1A1A]">{m.title}</h3>
                  <p className="font-sans text-xs sm:text-sm text-[#6B6560] leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#FFFFFF] border border-[#E8E2D8] p-8 md:p-12 rounded-xl text-center space-y-6">
          <h2 className="font-display font-light text-2xl md:text-3xl text-[#1A1A1A]">Experience the Heritage</h2>
          <p className="font-sans text-xs sm:text-sm text-[#6B6560] max-w-2xl mx-auto leading-relaxed">
            Every jar of our vintage pickles is sealed by hand, numbered, and shipped directly from our estate in Lohagaal. Explore our signature batches to find your perfect pairing.
          </p>
          <div>
            <Link to="/products" className="btn-primary py-3 px-8 text-xs tracking-[0.12em]">
              BROWSE SIGNATURE SERIES →
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
