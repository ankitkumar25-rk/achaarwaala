import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Trash2, ChevronRight, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersApi } from '../api';
import { useAuthStore } from '../store';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => usersApi.getWishlist().then((r) => r.data.data),
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => usersApi.removeWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: () => toast.error('Failed to remove item'),
  });

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FAFAF4] luxury-grain relative px-4 text-[#6B6560]">
        <div className="w-16 h-16 bg-white border border-[#E8E2D8] rounded-full flex items-center justify-center mb-6 text-[#C8922A] animate-float">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-display font-light text-3xl text-[#1A1A1A] mb-2">Your Wishlist</h2>
        <p className="text-[#6B6560] mb-8 text-center max-w-sm text-xs leading-relaxed">Please log in to view and manage your curated favorite pickles.</p>
        <button 
          onClick={() => navigate('/login?redirect=/wishlist')} 
          className="btn-primary px-8 py-3.5 rounded-xs uppercase tracking-[0.12em] text-xs cursor-pointer"
        >
          Login to Continue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF4] pt-32 pb-24 px-4 luxury-grain relative overflow-hidden text-[#6B6560]">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <Link to="/account" className="hover:text-[#C8922A] transition-colors">Account</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-12 text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A] leading-tight">
              My <span className="italic text-[#C8922A]">Favorites</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-8 bg-[#C8922A]" />
              <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">
                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-[#E8E2D8] rounded-xl animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-16 md:p-24 text-center max-w-2xl mx-auto relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-light text-[#1A1A1A] mb-2">Your Wishlist is Empty</h3>
              <p className="text-[#6B6560] text-xs mb-8 max-w-xs mx-auto leading-relaxed">Save your favorite premium jars here to order later or keep track of your loved Rajasthani curations.</p>
              <Link to="/products" className="btn-primary py-3.5 px-8 text-xs tracking-[0.12em]">
                <ShoppingBag className="w-4 h-4" /> Start Exploring
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 text-left">
            {wishlist.map(({ product }) => (
              <div key={product.id} className="relative group">
                <div className="transition-transform duration-300 group-hover:-translate-y-1">
                  <ProductCard product={product} />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeMutation.mutate(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/95 border border-[#E8E2D8] rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover:scale-100 cursor-pointer"
                  disabled={removeMutation.isPending}
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
