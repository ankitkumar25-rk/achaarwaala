import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { categoriesApi } from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

export default function Category() {
  const { slug } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesApi.getBySlug(slug).then(r => r.data.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const categorySchema = data ? {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": data.name,
    "description": data.description || `Premium handcrafted ${data.name} collection at Achaarwaala.`,
    "url": window.location.href
  } : null;

  return (
    <div className="min-h-screen bg-[#FAFAF4] pt-32 pb-24 px-4 luxury-grain relative overflow-hidden text-[#6B6560]">
      <SEO
        title={data?.name || slug}
        description={data?.description || `Explore our premium collection of ${data?.name || slug} at Achaarwaala. Handcrafted in Rajasthan, shipping across India.`}
        keywords={`${data?.name || slug}, buy ${data?.name || slug} online, authentic rajasthani achaar, village pickles, Achaarwaala`}
        schemaMarkup={categorySchema}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <Link to="/products" className="hover:text-[#C8922A] transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">{data?.name || slug}</span>
        </div>

        {/* Header */}
        <div className="space-y-3 mb-12 text-left">
          <h1 className="font-display text-4xl md:text-5xl font-light text-[#1A1A1A] leading-tight">
            {data?.name || slug}
          </h1>
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-8 bg-[#C8922A]" />
            <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">{data?.description || 'Explore our premium collection'}</p>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : data?.products?.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-16 md:p-24 text-center shadow-none relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
                📦
              </div>
              <h3 className="text-xl font-display font-light text-[#1A1A1A] mb-2">No Products Available</h3>
              <p className="text-[#6B6560] text-xs mb-8 max-w-xs mx-auto leading-relaxed">This category doesn't have any products yet. Check back soon!</p>
              <Link to="/products" className="btn-primary py-3 px-8 text-xs tracking-[0.12em]">
                Browse All Products →
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {data?.products?.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
