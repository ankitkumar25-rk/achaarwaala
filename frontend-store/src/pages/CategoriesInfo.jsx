import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CategoriesInfo() {
  return (
    <div className="min-h-screen bg-[#FAFAF4] pt-24 md:pt-32 pb-24 px-4 luxury-grain text-[#6B6560]">
      <SEO
        title="Categories Info & Heritage"
        description="Discover the stories and traditional methods behind Achaarwaala's pickles — Jaali Wali Kairi, Desi Mirch, Nimbu, Awla, Lahsun, and Sangri from Lohagaal, Rajasthan."
        keywords="jaali wali kairi, desi mirch, nimbu achaar, awla achaar, lahsun achaar, sangri achaar, rajasthani pickle, achaarwaala, lohagaal achaar"
      />

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#9A8A70]">Our Offerings</span>
          <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A]">
            Categories <span className="italic text-[#C8922A]"> & Heritage</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm leading-relaxed mt-6">
            At Achaarwaala, every jar is a testament to ancient culinary traditions. We classify our pickles not just by ingredients, but by the legacy and stories they carry from the heart of Rajasthan.
          </p>
        </div>

        {/* Ancient Methods Section */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-8 md:p-12 text-center rounded-xl shadow-none">
          <div className="w-16 h-16 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
            🏺
          </div>
          <h2 className="text-2xl font-display font-light text-[#1A1A1A] mb-4">The Ancient Art of Curing</h2>
          <p className="text-sm leading-relaxed mb-6">
            Our ancestors relied on the sun, salt, and time. We use pure cold-pressed mustard oil and hand-milled spices, allowing the pickles to sun-cure naturally over several weeks. This age-old fermentation process enhances the flavor profile while preserving the nutritional value without any artificial additives.
          </p>
        </div>

        {/* Categories Breakdown */}
        <div className="space-y-12">

          {/* Block 1 — Jaali Wali Kairi (image left, text right) */}
          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img
                src="/images/categories/jaali-wali-kairi.jpg"
                alt="Lattice-cut raw mango pickle in a clay bowl"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <p className="text-xs text-[#9A8A70] uppercase tracking-[0.15em]">जाली वाली कैरी</p>
              <h3 className="text-2xl font-display text-[#1A1A1A]">Jaali Wali Kairi</h3>
              <p className="text-sm leading-relaxed">
                Raw mangoes hand-cut into a fine lattice — jaali — so every piece soaks up oil and masala evenly. A Lohagaal speciality that takes longer to cut than to cure, because the texture is the whole point. Sour, sharp, and unapologetically traditional.
              </p>
              <Link to="/categories/jaali-wali-kairi" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Jaali Wali Kairi →
              </Link>
            </div>
          </div>

          {/* Block 2 — Desi Mirch (image right, text left) */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img
                src="/images/categories/desi-mirch.jpg"
                alt="Whole red and green chillies stuffed with spice mix"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <p className="text-xs text-[#9A8A70] uppercase tracking-[0.15em]">देसी मिर्च</p>
              <h3 className="text-2xl font-display text-[#1A1A1A]">Desi Mirch</h3>
              <p className="text-sm leading-relaxed">
                Whole green and red chillies, slit and packed with mustard, fennel, and a touch of asafoetida — the way it's done in Rajasthani kitchens, not commercial ones. Built for people who think 'mild' is a missed opportunity.
              </p>
              <Link to="/categories/desi-mirch" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Desi Mirch →
              </Link>
            </div>
          </div>

          {/* Block 3 — Nimbu (image left, text right) */}
          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img
                src="/images/categories/nimbu.jpg"
                alt="Sun-cured whole lemon pickle in glass jar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <p className="text-xs text-[#9A8A70] uppercase tracking-[0.15em]">नींबू</p>
              <h3 className="text-2xl font-display text-[#1A1A1A]">Nimbu</h3>
              <p className="text-sm leading-relaxed">
                Lemons salted and left to the sun for weeks until the rind softens and the bitterness turns into something deep and tangy. No vinegar, no shortcuts — just salt, time, and patience. The achaar dadi's never finished a meal without.
              </p>
              <Link to="/categories/nimbu" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Nimbu Achaar →
              </Link>
            </div>
          </div>

          {/* Block 4 — Awla (image right, text left) */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img
                src="/images/categories/awla.jpg"
                alt="Whole amla gooseberries pickled with spices"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <p className="text-xs text-[#9A8A70] uppercase tracking-[0.15em]">आंवला</p>
              <h3 className="text-2xl font-display text-[#1A1A1A]">Awla</h3>
              <p className="text-sm leading-relaxed">
                Amla — small, sour, and loaded with character — pickled whole or sliced with rock salt and warming spices. Known as much for its place in the kitchen as in the home pharmacy. A taste that grows on you, on purpose.
              </p>
              <Link to="/categories/awla" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Awla Achaar →
              </Link>
            </div>
          </div>

          {/* Block 5 — Lahsun (image left, text right) */}
          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img
                src="/images/categories/lahsun.jpg"
                alt="Whole garlic cloves pickled in oil and spices"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <p className="text-xs text-[#9A8A70] uppercase tracking-[0.15em]">लहसुन</p>
              <h3 className="text-2xl font-display text-[#1A1A1A]">Lahsun</h3>
              <p className="text-sm leading-relaxed">
                Whole garlic cloves slow-pickled until they turn soft, mellow, and deeply savoury — losing their sharpness without losing their punch. Pairs with literally everything. Not for the faint of breath.
              </p>
              <Link to="/categories/lahsun" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Lahsun Achaar →
              </Link>
            </div>
          </div>

          {/* Block 6 — Sangri (image right, text left) */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/3 aspect-square rounded-xl overflow-hidden border border-[#E8E2D8]">
              <img
                src="/images/categories/sangri.jpg"
                alt="Dried sangri desert beans pickled, Rajasthani thali style"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <p className="text-xs text-[#9A8A70] uppercase tracking-[0.15em]">सांगरी</p>
              <h3 className="text-2xl font-display text-[#1A1A1A]">Sangri</h3>
              <p className="text-sm leading-relaxed">
                A wild desert bean, hand-harvested from Khejri trees across Rajasthan and traditionally part of the royal Marwar thali. Earthy, slightly chewy, and almost impossible to find outside the region — until now.
              </p>
              <Link to="/categories/sangri" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Sangri Achaar →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
