import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function CategoriesInfo() {
  return (
    <div className="min-h-screen bg-[#FAFAF4] pt-24 md:pt-32 pb-24 px-4 luxury-grain text-[#6B6560]">
      <SEO
        title="Categories Info & Heritage"
        description="Discover the stories, ancient methods, and categories behind Achaarwaala's artisanal pickles."
        keywords="achaar categories, ancient pickle methods, rajasthani heritage, mango pickle, ker sangri"
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
          
          {/* Category 1 */}
          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square bg-[#E8E2D8] rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🥭</div>
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <h3 className="text-2xl font-display text-[#1A1A1A]">Mango Specialities</h3>
              <p className="text-sm leading-relaxed">
                Raw mangoes have been the cornerstone of Indian pickling for centuries. Harvested precisely before the monsoon, our mangoes are cut, sun-dried, and marinated in traditional spices. This category pays homage to the grandmothers who mastered the balance of sour and spicy.
              </p>
              <Link to="/categories/mango-achaar" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Mango Pickles →
              </Link>
            </div>
          </div>

          {/* Category 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square bg-[#E8E2D8] rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🌶️</div>
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <h3 className="text-2xl font-display text-[#1A1A1A]">Artisanal Chilli</h3>
              <p className="text-sm leading-relaxed">
                The fiery green and red chillies of Rajasthan are legendary. Our artisanal chilli pickles involve slitting the chillies by hand and stuffing them with a rich, smoked spice blend containing split mustard and dry mango powder. A true testament to the bold flavors of the desert.
              </p>
              <Link to="/categories/chilli-achaar" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Chilli Pickles →
              </Link>
            </div>
          </div>

          {/* Category 3 */}
          <div className="flex flex-col md:flex-row gap-8 items-center border-b border-[#E8E2D8] pb-12">
            <div className="md:w-1/3 aspect-square bg-[#E8E2D8] rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🌵</div>
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <h3 className="text-2xl font-display text-[#1A1A1A]">Desert Delicacies</h3>
              <p className="text-sm leading-relaxed">
                Featuring wild-harvested desert beans and berries like Ker and Sangri. These ingredients survive the harsh, arid climate, developing intense, earthy flavors. Traditionally reserved for royalty and special occasions, these pickles bring the authentic taste of Marwar to your table.
              </p>
              <Link to="/categories/desert-achaar" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Desert Delicacies →
              </Link>
            </div>
          </div>

          {/* Category 4 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="md:w-1/3 aspect-square bg-[#E8E2D8] rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🍋</div>
            </div>
            <div className="md:w-2/3 space-y-4 text-left">
              <h3 className="text-2xl font-display text-[#1A1A1A]">Heritage Blends</h3>
              <p className="text-sm leading-relaxed">
                Unique, oil-free, or slow-fermented pickles like our Ancestral Lemon Pickle. These blends are often used as digestives and are cured purely with rock salt, black pepper, and time. They highlight the medicinal and Ayurvedic roots of traditional Indian pickling.
              </p>
              <Link to="/categories/heritage-blends" className="text-xs uppercase tracking-wider text-[#C8922A] hover:text-[#1A1A1A] transition-colors font-semibold">
                Shop Heritage Blends →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
