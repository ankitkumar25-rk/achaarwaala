import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { productsApi, categoriesApi } from '../api';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

import imgLeft from '../assets/images/78d24d8c-b63f-4b3e-a9f3-6f5752927c0a.png';
import imgTopRight from '../assets/images/60bc9565-b5f4-454d-a8e5-36addfed5fd0 (1).png';
import imgBottomRight from '../assets/images/b085284f-af0d-4da2-8ead-aa66bd3075eb.png';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'price-asc',      label: 'Price: Low to High' },
  { value: 'price-desc',     label: 'Price: High to Low' },
  { value: 'name-asc',       label: 'Name A-Z' },
];

export default function Products() {
  const [filters, setFilters] = useState({ page: 1, limit: 20 });
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  const setFilter = useCallback((key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  }, []);

  const clearFilter = useCallback((key) => {
    setFilters((f) => {
      const n = { ...f };
      delete n[key];
      return { ...n, page: 1 };
    });
  }, []);

  const handleSearchChange = (val) => {
    setSearchInput(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (val.trim()) {
        setFilter('search', val.trim());
      } else {
        clearFilter('search');
      }
    }, 450);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    clearFilter('search');
  };

  const [sort, order] = sortValue.split('-');

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters, sort, order],
    queryFn: () => productsApi.list({ ...filters, sort, order }).then((r) => r.data),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn:  () => categoriesApi.list().then((r) => r.data.data),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  const resolvedCategories = catData || [];

  const resolvedProductsData = data || {
    data: [],
    meta: {
      total: 0,
      totalPages: 1,
      currentPage: 1
    }
  };

  const pageNumbers = resolvedProductsData?.meta?.totalPages > 1
    ? Array.from({ length: resolvedProductsData.meta.totalPages }, (_, i) => i + 1)
    : [];

  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": "Shop Handcrafted Pickles & Traditional Achaar",
    "description": "Explore Achaarwaala's catalog of premium handcrafted pickles. From raw mango and green chilli to ker sangri and garlic, buy authentic pickles online with direct village delivery.",
    "url": window.location.href
  };

  return (
    <div className="min-h-screen bg-[#FAFAF4] pt-24 md:pt-32 pb-24 px-4 luxury-grain relative overflow-hidden text-[#6B6560]">
      <SEO
        title="Shop Handcrafted Pickles & Authentic Indian Achaar"
        description="Explore the Achaarwaala catalog for authentic hand-picked village pickles, including raw mango, ker sangri, garlic, and special Rajasthani achaar. Handcrafted without artificial preservatives."
        keywords="buy achaar online, village pickles, handmade mango pickle, ker sangri achaar, garlic pickle online, authentic rajasthani pickles, Achaarwaala products"
        schemaMarkup={shopSchema}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-6 sm:mb-10">
          <Link to="/" className="hover:text-[#1A1A1A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#C8922A]">Shop All Products</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 sm:mb-12">
          {/* Title and stats */}
          <div className="space-y-2 shrink-0 text-left">
            <h1 className="text-3xl sm:text-4xl font-display font-light text-[#1A1A1A] leading-tight">
              All <span className="italic text-[#C8922A]">Collections</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-8 bg-[#C8922A]" />
              <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">{resolvedProductsData?.meta?.total || 0} premium items available</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-lg xl:max-w-xl relative group">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search for mango pickle, ker sangri, garlic, achaar..."
              className="w-full pl-6 pr-12 py-3 sm:py-3.5 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] text-[#1A1A1A] font-sans text-xs sm:text-sm placeholder-[#6B6560]/60 focus:outline-none focus:border-[#C8922A] transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-[#6B6560] hover:text-[#1A1A1A] p-1 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <Search className="w-4 h-4 text-[#C8922A] shrink-0" />
            </div>
          </div>

          {/* Sort selection */}
          <div className="shrink-0 w-full md:w-auto flex items-center gap-3 relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider cursor-pointer transition-all"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
            
            <div className="relative flex-1 md:flex-none">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full md:w-56 px-6 py-3.5 flex items-center justify-between rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider focus:outline-none focus:border-[#C8922A] transition-all cursor-pointer"
              >
                <span>{SORT_OPTIONS.find(o => o.value === sortValue)?.label}</span>
                <span className={`transition-transform duration-200 text-[10px] shrink-0 text-[#C8922A] ${showSortDropdown ? 'rotate-180' : ''}`}>▼</span>
              </button>
              
              {showSortDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSortDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl shadow-xs py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden text-left">
                    {SORT_OPTIONS.map((o) => {
                      const isSelected = o.value === sortValue;
                      return (
                        <button
                          key={o.value}
                          onClick={() => {
                            setSortValue(o.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#FAFAF4] text-[#1A1A1A]'
                              : 'text-[#6B6560] hover:bg-[#FAFAF4] hover:text-[#1A1A1A]'
                          }`}
                        >
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Sidebar Filters */}
          <aside className={`${
            showFilters ? 'fixed inset-0 z-40 md:static md:z-auto' : 'hidden md:block'
          } w-full md:w-64 md:shrink-0`}>
            {showFilters && (
              <div
                className="md:hidden fixed inset-0 bg-black/30"
                onClick={() => setShowFilters(false)}
              />
            )}
            <div className={`${
              showFilters ? 'fixed inset-y-0 left-0 w-80 max-w-full md:static z-50 bg-[#FAFAF4]' : ''
            } md:bg-transparent transition-transform duration-300 md:transform-none`}>
              <div className="p-4 md:p-0">
                <div className="flex items-center justify-between md:hidden mb-4">
                  <h2 className="text-lg font-display text-[#1A1A1A] font-light">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 text-[#6B6560]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-5 space-y-5 text-left shadow-none">
                  {/* Categories */}
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-[0.14em] text-[#9A8A70] mb-3">Category</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="cat" checked={!filters.category} onChange={() => clearFilter('category')} className="accent-[#C8922A]" />
                        <span className="text-sm text-[#6B6560] hover:text-[#1A1A1A] transition-colors">All Categories</span>
                      </label>
                      {resolvedCategories?.map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cat" checked={filters.category === cat.slug} onChange={() => setFilter('category', cat.slug)} className="accent-[#C8922A]" />
                          <span className="text-sm text-[#6B6560] hover:text-[#1A1A1A] transition-colors">{cat.name}</span>
                          <span className="ml-auto text-xs text-[#6B6560]/60">({cat._count?.products || 0})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-[0.14em] text-[#9A8A70] mb-3">Price Range</h3>
                    <div className="flex gap-2 flex-col">
                      <input type="number" placeholder="Min ₹" className="input-field py-2 text-sm" onBlur={(e) => e.target.value ? setFilter('minPrice', e.target.value) : clearFilter('minPrice')} />
                      <input type="number" placeholder="Max ₹" className="input-field py-2 text-sm" onBlur={(e) => e.target.value ? setFilter('maxPrice', e.target.value) : clearFilter('maxPrice')} />
                    </div>
                  </div>

                  {/* Premium Only */}
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={filters.isFeatured === 'true'} onChange={(e) => e.target.checked ? setFilter('isFeatured', 'true') : clearFilter('isFeatured')} className="accent-[#C8922A] w-4 h-4 rounded-xs" />
                      <span className="text-sm text-[#6B6560] font-medium">✨ Featured Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl animate-pulse aspect-[3/4]" />
                ))}
              </div>
            ) : resolvedProductsData?.data?.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-16 md:p-24 text-center">
                <div className="w-16 h-16 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
                  🔍
                </div>
                <h3 className="text-xl font-display font-light text-[#1A1A1A] mb-2">No Products Found</h3>
                <p className="text-xs text-[#6B6560] mb-8 max-w-xs mx-auto leading-relaxed">Try adjusting your filters or search terms to find our heritage batches.</p>
                <button
                  onClick={() => {
                    setFilters({ page: 1, limit: 20 });
                    setSearchInput('');
                  }}
                  className="btn-primary py-3 px-8 text-xs tracking-[0.12em]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {resolvedProductsData?.data?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {resolvedProductsData?.meta?.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8 flex-wrap">
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    onClick={() => setFilters((f) => ({ ...f, page }))}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                      filters.page === page
                        ? 'bg-[#C8922A] text-[#FFFFFF]'
                        : 'bg-[#FFFFFF] text-[#6B6560] border border-[#E8E2D8] hover:border-[#C8922A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
