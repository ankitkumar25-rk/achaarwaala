import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { productsApi } from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { useCartStore } from '../store';

import imgLeft from '../assets/images/78d24d8c-b63f-4b3e-a9f3-6f5752927c0a.png';
import imgTopRight from '../assets/images/60bc9565-b5f4-454d-a8e5-36addfed5fd0 (1).png';
import imgBottomRight from '../assets/images/b085284f-af0d-4da2-8ead-aa66bd3075eb.png';

// ── Hero Section ─────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="w-full bg-transparent py-16 lg:py-28 px-6 sm:px-10 lg:px-16 flex items-center min-h-[580px] border-b border-[#E8E2D8] marwadi-texture">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Text */}
        <div className="lg:col-span-6 flex flex-col items-start text-left max-w-xl">
          <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#B53728] mb-4">
            HANDCRAFTED IN LOHAGAAL · EST. 1946
          </span>
          <h1 className="font-display text-[52px] md:text-[58px] lg:text-[68px] font-light text-[#D98C00] leading-[1.1] mb-6">
            Village Heritage <br />
            <span className="italic font-normal text-[#E5B800]">Modern Luxury.</span>
          </h1>
          <p className="font-sans text-sm text-[#6B6560] leading-[1.75] mb-8 max-w-lg">
            Generations of family heritage, sun-cured in pure mustard oil and hand-milled spices. Slow-crafted pickles from Lohagaal, Rajasthan. Not made for the masses; made for those who preserve the past.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto">
            <Link
              to="/products"
              className="btn-primary py-3.5 px-8 text-xs tracking-[0.12em] text-center"
            >
              SHOP COLLECTIONS
            </Link>
            <Link
              to="/our-story"
              className="font-sans text-xs uppercase tracking-[0.12em] text-[#B53728] hover:text-[#D98C00] transition-colors py-2 text-center font-medium"
            >
              OUR ORIGINS →
            </Link>
          </div>
        </div>

        {/* Right Column: Gallery Wall Collage */}
        <div className="lg:col-span-6 w-full hidden lg:flex justify-end items-center">
          <div className="relative w-full max-w-[500px] h-[520px]">

            {/* Frame 1 — large portrait, top-left, tilt left */}
            <div className="absolute top-0 left-0 w-[47%] bg-white p-[7px] border border-[#E8E2D8] shadow-[0_6px_24px_rgba(0,0,0,0.13)]"
              style={{ transform: 'rotate(-4deg)', zIndex: 2, aspectRatio: '4/5' }}>
              <img src="/images/categories/jaali-wali-kairi.jpg" alt="Jaali Wali Kairi" className="w-full h-full object-cover" />
            </div>

            {/* Frame 2 — small square, top-right, tilt right */}
            <div className="absolute top-0 right-4 w-[34%] bg-white p-[7px] border border-[#E8E2D8] shadow-[0_6px_24px_rgba(0,0,0,0.13)]"
              style={{ transform: 'rotate(3.5deg)', zIndex: 3, aspectRatio: '1/1' }}>
              <img src="/images/categories/nimbu.jpg" alt="Nimbu" className="w-full h-full object-cover" />
            </div>

            {/* Frame 3 — medium portrait, center, slight tilt — hero frame */}
            <div className="absolute top-[22%] left-[24%] w-[44%] bg-white p-[7px] border border-[#E8E2D8] shadow-[0_10px_40px_rgba(0,0,0,0.20)]"
              style={{ transform: 'rotate(-1.5deg)', zIndex: 5, aspectRatio: '3/4' }}>
              <img src="/images/categories/desi-mirch.jpg" alt="Desi Mirch" className="w-full h-full object-cover" />
            </div>

            {/* Frame 4 — small square, bottom-left, tilt right */}
            <div className="absolute bottom-8 left-2 w-[33%] bg-white p-[7px] border border-[#E8E2D8] shadow-[0_6px_24px_rgba(0,0,0,0.13)]"
              style={{ transform: 'rotate(3deg)', zIndex: 3, aspectRatio: '1/1' }}>
              <img src="/images/categories/awla.jpg" alt="Awla" className="w-full h-full object-cover" />
            </div>

            {/* Frame 5 — medium portrait, bottom-right, slight tilt */}
            <div className="absolute bottom-2 right-2 w-[40%] bg-white p-[7px] border border-[#E8E2D8] shadow-[0_6px_24px_rgba(0,0,0,0.13)]"
              style={{ transform: 'rotate(-2.5deg)', zIndex: 2, aspectRatio: '4/5' }}>
              <img src="/images/categories/sangri.jpg" alt="Sangri" className="w-full h-full object-cover" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

// ── Signature Series Section ─────────────────────────────────
function SignatureSeriesSection({ products }) {
  const displayProducts = products && products.length >= 3 ? products.slice(0, 3) : products.slice(0, 3);

  return (
    <section className="bg-[#FAFAF4] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="text-left">
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70] block mb-2">
              SUMMER HARVEST
            </span>
            <h2 className="font-display text-3.5xl md:text-[40px] font-light text-[#1A1A1A]">
              The Signature Series
            </h2>
          </div>
          
          {/* Nav arrows for layout feel */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 border border-[#E8E2D8] rounded-full flex items-center justify-center text-[#6B6560] hover:bg-[#1A1A1A] hover:text-[#FFFFFF] hover:border-[#1A1A1A] transition-all" aria-label="Previous">
              ←
            </button>
            <button className="w-10 h-10 border border-[#E8E2D8] rounded-full flex items-center justify-center text-[#6B6560] hover:bg-[#1A1A1A] hover:text-[#FFFFFF] hover:border-[#1A1A1A] transition-all" aria-label="Next">
              →
            </button>
          </div>
        </div>

        {/* 3 cards horizontally */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Spirit / Story Section ───────────────────────────────────
function SpiritSection() {
  return (
    <section className="py-20 lg:py-28 px-6 sm:px-10 lg:px-16 bg-[#FAFAF4] border-b border-[#E8E2D8] marwadi-texture-story">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch relative z-10">
        {/* Left Column: 45% */}
        <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#E8E2D8] aspect-[4/5] lg:aspect-auto relative">
          <img
            src={imgLeft}
            alt="Rustic bowl of achaar in Rajasthani village setting"
            className="w-full h-full object-cover"
          />
          <span className="absolute top-4 left-4 text-[9px] font-sans uppercase tracking-[0.14em] bg-[#1A1A1A] text-[#FFFFFF] px-3 py-1 rounded-xs">
            LEGACY SINCE 1946
          </span>
        </div>

        {/* Right Column: 55% */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E8E2D8] p-8 md:p-12 flex flex-col justify-between rounded-xl text-left">
          <div className="space-y-6">
            <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70] block">
              ANCESTRAL LEGACY
            </span>
            <h2 className="font-display italic text-4xl md:text-[45px] text-[#1A1A1A] leading-tight font-light">
              The Spirit of the Sun
            </h2>
            <p className="font-sans text-sm text-[#6B6560] leading-[1.75]">
              Under the shade of ancient neem trees, the women of Lohagaal gather to cure Rajasthan's harvest. Guided by recipes spoken, never written, they salt and spice each slice by hand, trusting the slow dry heat of the desert sun to cure the vintage.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 border-t border-[#E8E2D8] pt-8 mt-10">
            <div className="bg-[#F2EDE0] p-6 rounded-lg space-y-1">
              <span className="font-display text-[40px] text-[#1A1A1A] font-light block leading-none">
                75+
              </span>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[#9A8A70]">
                Years of Craft
              </p>
            </div>
            <div className="bg-[#F2EDE0] p-6 rounded-lg space-y-1">
              <span className="font-display text-[40px] text-[#1A1A1A] font-light block leading-none">
                100%
              </span>
              <p className="font-sans text-[10px] uppercase tracking-wider text-[#9A8A70]">
                Sun-Cured Devotion
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4">
            <Link to="/our-story" className="font-sans text-[11px] uppercase tracking-[0.12em] text-[#1A1A1A] hover:text-[#C8922A] transition-colors inline-flex items-center gap-1 font-medium">
              DISCOVER OUR JOURNAL →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Rare Batches Section ─────────────────────────────────────
function RareBatchesSection({ handleAddToCart }) {
  return (
    <section className="bg-[#FAFAF4] py-20 lg:py-28 px-6 sm:px-10 lg:px-16 border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-sans text-[10px] uppercase tracking-[0.14em] text-[#9A8A70] block mb-2">
            THE WINTER ARCHIVE
          </span>
          <h2 className="font-display text-3.5xl md:text-[40px] font-light text-[#1A1A1A]">
            Rare Batches
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl overflow-hidden flex flex-row items-center h-48 sm:h-56">
            {/* Image left (40%) */}
            <div className="w-[40%] h-full relative overflow-hidden bg-[#FAFAF4]">
              <img
                src={imgTopRight}
                alt="Sun-Dried Sangri Achaar"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.12em] bg-[#F2EDE0] text-[#9A8A70] px-2.5 py-1 rounded-sm">
                30 JARS ONLY
              </span>
            </div>
            {/* Content right (60%) */}
            <div className="w-[60%] p-6 flex flex-col justify-between h-full text-left">
              <div className="space-y-1">
                <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#9A8A70]">
                  Desert Vintage
                </span>
                <h3 className="font-display text-lg sm:text-xl text-[#1A1A1A] truncate font-light">
                  Sun-Dried Sangri
                </h3>
                <p className="font-sans text-xs text-[#6B6560] line-clamp-2 leading-relaxed hidden sm:block">
                  Wild Ker Sangri berries dry-cured with native dry-climate desert spices.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display italic text-lg text-[#C8922A]">
                  ₹1,850
                </span>
                <button
                  onClick={() => handleAddToCart({ id: 'rare-1', name: 'Sun-Dried Sangri', price: 1850, slug: 'sun-dried-sangri', images: [{ url: imgTopRight }] })}
                  className="w-9 h-9 rounded-sm bg-[#1A1A1A] flex items-center justify-center text-[#FFFFFF] hover:bg-[#C8922A] transition-colors cursor-pointer"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl overflow-hidden flex flex-row items-center h-48 sm:h-56">
            {/* Image left (40%) */}
            <div className="w-[40%] h-full relative overflow-hidden bg-[#FAFAF4]">
              <img
                src={imgBottomRight}
                alt="Ancestral Oil Blend"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[8px] sm:text-[9px] font-sans uppercase tracking-[0.12em] bg-[#F2EDE0] text-[#9A8A70] px-2.5 py-1 rounded-sm">
                SMALL BATCH
              </span>
            </div>
            {/* Content right (60%) */}
            <div className="w-[60%] p-6 flex flex-col justify-between h-full text-left">
              <div className="space-y-1">
                <span className="font-sans text-[9px] uppercase tracking-[0.12em] text-[#9A8A70]">
                  Family Reserve
                </span>
                <h3 className="font-display text-lg sm:text-xl text-[#1A1A1A] truncate font-light">
                  Ancestral Oil
                </h3>
                <p className="font-sans text-xs text-[#6B6560] line-clamp-2 leading-relaxed hidden sm:block">
                  Pure cold-pressed mustard oil infused with three generations of secret pickle masalas.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display italic text-lg text-[#C8922A]">
                  ₹550
                </span>
                <button
                  onClick={() => handleAddToCart({ id: 'rare-2', name: 'Ancestral Oil', price: 550, slug: 'ancestral-oil', images: [{ url: imgBottomRight }] })}
                  className="w-9 h-9 rounded-sm bg-[#1A1A1A] flex items-center justify-center text-[#FFFFFF] hover:bg-[#C8922A] transition-colors cursor-pointer"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Newsletter Section ───────────────────────────────────────
function JoinTableSection() {
  return (
    <section className="bg-[#FAFAF4] py-20 px-6 sm:px-10 lg:px-16 border border-[#E8E2D8] m-6 sm:m-10 lg:m-16 rounded-xl text-center marwadi-texture overflow-hidden">
      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        {/* Decorative 4-pointed star icon */}
        <div className="text-[#C8922A] flex justify-center">
          <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
          </svg>
        </div>
        
        <h2 className="font-display font-light text-3.5xl md:text-[40px] text-[#1A1A1A] leading-tight">
          Join Our Table
        </h2>
        
        <p className="font-sans text-xs md:text-sm text-[#6B6560] leading-relaxed max-w-sm mx-auto">
          Receive ancestral recipes, seasonal harvest updates, and first access to our limited-batch releases.
        </p>

        <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 mt-8" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="input-field py-3 px-4 flex-1 text-xs"
            required
          />
          <button 
            type="submit" 
            className="btn-primary py-3.5 px-8 text-[11px] tracking-[0.12em]"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}

// ── Main Page Component ──────────────────────────────────────
export default function Home() {
  const addToCart = useCartStore((s) => s.addItem);

  const { data: featuredData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.featured().then((r) => r.data.data),
    staleTime: 1000 * 60 * 10,
  });

  const featuredProducts = (featuredData && featuredData.length >= 3) ? featuredData : (featuredData || []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to Selection`);
  };

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://achaarwaala.com/#website",
        "url": "https://achaarwaala.com",
        "name": "Achaarwaala",
        "description": "Authentic handcrafted Indian pickles (achaar) online with traditional varieties straight from Lohagaal, Jhunjhunu, Rajasthan.",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://achaarwaala.com/products?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "en-US"
      },
      {
        "@type": "Store",
        "@id": "https://achaarwaala.com/#organization",
        "name": "Achaarwaala",
        "url": "https://achaarwaala.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://achaarwaala.com/favicon-32x32.png"
        },
        "description": "Premium D2C e-commerce platform offering authentic handcrafted Indian achaar varieties from Lohagaal, Jhunjhunu, Rajasthan.",
        "telephone": "+91-8104937078",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ward no 11, Udaipurwati, Lohagaal",
          "addressLocality": "Udaipurwati, Jhunjhunu",
          "addressRegion": "Rajasthan",
          "postalCode": "333012",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91-8104937078",
          "contactType": "customer support",
          "email": "contact@achaarwaala.com"
        }
      }
    ]
  };

  return (
    <div className="bg-[#FAFAF4] luxury-grain min-h-screen text-[#1A1A1A]">
      <SEO 
        title="Authentic Handcrafted Indian Pickles (Achaar) Online"
        description="Explore varieties of handcrafted Rajasthani pickles (achaar) from Achaarwaala. Order Raw Mango, Ker Sangri, Lemon, Garlic, and Chilli pickles straight from the village of Lohagaal."
        keywords="authentic Indian pickles, buy achaar online, Rajasthani achaar, homemade pickles, Lohagaal pickle, Ker Sangri achaar, garlic achaar, green chilli pickle, mango pickle, Achaarwaala"
        schemaMarkup={homeSchema}
      />
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Signature Series */}
      <SignatureSeriesSection products={featuredProducts} />

      {/* 3. Spirit of the Sun */}
      <SpiritSection />

      {/* 4. Rare Batches */}
      <RareBatchesSection handleAddToCart={handleAddToCart} />

      {/* 5. Join Our Table */}
      <JoinTableSection />
    </div>
  );
}
