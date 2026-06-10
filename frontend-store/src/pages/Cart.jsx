import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Tag, Truck, Package, Gift, ChevronRight, RefreshCw,
  Pencil, Image as ImageIcon, CheckCircle
} from 'lucide-react';
import { useCartStore, useAuthStore } from '../store';
import toast from 'react-hot-toast';

import { 
  MdSecurity, MdLocalShipping, MdAssignmentReturn 
} from 'react-icons/md';

/* -- Quantity stepper -- */
function QtyControl({ item }) {
  const updateItem = useCartStore((s) => s.updateItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const [loading, setLoading] = useState(false);

  const change = async (newQty) => {
    setLoading(true);
    try {
      if (newQty < 1) await removeItem(item.productId);
      else await updateItem(item.productId, newQty);
    } finally { setLoading(false); }
  };

  return (
    <div className={`flex items-center gap-1 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <button
        onClick={() => change(item.quantity - 1)}
        className="w-8 h-8 rounded-xs border border-[#E8E2D8] flex items-center justify-center hover:border-[#C8922A] hover:bg-[#FAFAF4] transition-all bg-white"
      >
        <Minus className="w-3.5 h-3.5 text-[#6B6560]" />
      </button>
      <span className="w-10 text-center font-semibold text-[#1A1A1A]">{item.quantity}</span>
      <button
        onClick={() => change(item.quantity + 1)}
        className="w-8 h-8 rounded-xs border border-[#E8E2D8] flex items-center justify-center hover:border-[#C8922A] hover:bg-[#FAFAF4] transition-all bg-white"
      >
        <Plus className="w-3.5 h-3.5 text-[#6B6560]" />
      </button>
    </div>
  );
}

/* -- Single cart row -- */
function CartItem({ item }) {
  const removeItem = useCartStore((s) => s.removeItem);
  const [removing, setRemoving] = useState(false);

  const img = item.product?.images?.[0];
  const lineTotal = (Number(item.price) * item.quantity).toFixed(2);

  const handleRemove = async () => {
    if (!confirm('Remove this item?')) return;
    setRemoving(true);
    await removeItem(item.productId);
    toast.success('Removed from cart');
  };

  return (
    <div className={`flex gap-3 sm:gap-6 p-4 sm:p-6 transition-all ${removing ? 'opacity-30 scale-95' : ''}`}>
      {/* Image */}
      <Link to={`/products/${item.product?.slug}`} className="shrink-0">
        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-[#FAFAF4] border border-[#E8E2D8] transition-all">
           {img ? (
             <img src={img.url} alt={item.product?.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
           ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#FAFAF4]">
              <Package className="w-8 h-8 text-[#9A8A70]" />
            </div>
          )}
        </div>
      </Link>

      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col justify-between text-left">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
          <div className="min-w-0">
            <Link to={`/products/${item.product?.slug}`}>
              <h3 className="font-display font-light text-[#1A1A1A] text-sm sm:text-base hover:text-[#C8922A] transition-colors leading-snug line-clamp-2">
                {item.product?.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              {item.product?.unit && (
                <span className="text-[10px] sm:text-xs font-semibold text-[#9A8A70] uppercase tracking-wider bg-[#F2EDE0] px-1.5 py-0.5 rounded-xs">{item.product.unit}</span>
              )}
              <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                ₹{Number(item.price).toFixed(2)}
                <span className="text-[10px] font-normal text-[#6B6560] ml-1 italic">each</span>
              </p>
            </div>
          </div>

          {/* Line total */}
          <div className="sm:text-right shrink-0 mt-1 sm:mt-0">
            <p className="font-display italic text-base sm:text-xl text-[#C8922A] leading-none">₹{lineTotal}</p>
            {item.quantity > 1 && (
              <p className="text-[9px] sm:text-xs text-[#6B6560] mt-1 font-medium italic">{item.quantity} units</p>
            )}
          </div>
        </div>

        {/* Customization Details */}
        <div className="space-y-1.5 mt-2.5">
          {item.customizationText && (
            <div className="flex items-center gap-2 bg-[#F2EDE0] border border-[#E8E2D8] rounded-xs px-2.5 py-1.5">
              <Pencil className="w-3 h-3 text-[#9A8A70] shrink-0" />
              <p className="text-[10px] font-medium text-[#1A1A1A] truncate">
                <span className="font-bold uppercase text-[8px] tracking-widest opacity-60 mr-1">Label Text:</span>
                "{item.customizationText}"
              </p>
            </div>
          )}
          {item.customizationImageUrl && (
            <div className="flex items-center gap-2 bg-[#F2EDE0] border border-[#E8E2D8] rounded-xs px-2.5 py-1.5">
               <ImageIcon className="w-3 h-3 text-[#9A8A70] shrink-0" />
               <a href={item.customizationImageUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#C8922A] hover:underline flex items-center gap-1">
                 View Custom Seal <ArrowRight className="w-2.5 h-2.5" />
               </a>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E8E2D8]/50">
          <QtyControl item={item} />
          <button
            onClick={handleRemove}
            disabled={removing}
            className="flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-red-600 hover:text-red-800 uppercase tracking-widest transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* -- Skeleton loader -- */
function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-0">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-4 p-5 border-b border-[#E8E2D8]">
          <div className="w-24 h-24 rounded-lg bg-[#E8E2D8]/50 shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="h-4 bg-[#E8E2D8]/50 rounded w-3/4" />
            <div className="h-3 bg-[#E8E2D8]/50 rounded w-1/4" />
            <div className="h-8 bg-[#E8E2D8]/50 rounded w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Cart() {
  const items     = useCartStore((s) => s.items);
  const isLoading = useCartStore((s) => s.isLoading);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotalFn = useCartStore((s) => s.subtotal);
  const user      = useAuthStore((s) => s.user);

  const subtotal = subtotalFn();
  const shipping = 0; // Free shipping on all orders!
  const total    = subtotal + shipping;

  const handleClear = async () => {
    if (!confirm('Clear all items from cart?')) return;
    await clearCart();
    toast.success('Cart cleared');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF4] luxury-grain pt-28 sm:pt-32 pb-20 sm:pb-24 px-3 sm:px-4 relative overflow-hidden text-[#6B6560]">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">Shopping Cart</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4 text-left">
            <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A] leading-tight">
              Your <span className="italic text-[#C8922A]">Jar Reserve</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-8 bg-[#C8922A]" />
              <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">{items.length} unique item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchCart()}
                className="px-6 py-3 rounded-xs border border-[#E8E2D8] bg-white text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider hover:bg-[#FAFAF4] transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-3 rounded-xs border border-red-200 bg-red-50 text-red-700 font-semibold text-xs uppercase tracking-wider hover:bg-red-100 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Clear Cart
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-white border border-[#E8E2D8] rounded-xl"><CartSkeleton /></div>
            <div className="lg:col-span-2 bg-white border border-[#E8E2D8] rounded-xl h-64 animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          /* -- Empty state -- */
          <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-16 md:p-24 text-center max-w-2xl mx-auto shadow-none relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-light text-[#1A1A1A] mb-2">Your Cart is Empty</h3>
              <p className="text-[#6B6560] text-xs mb-8 max-w-md mx-auto leading-relaxed">Discover our range of handcrafted, Rajasthani sun-cured pickles and reserve your first batch.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Link to="/products" className="btn-primary py-3.5 px-8 text-xs tracking-[0.12em]">
                  <Gift className="w-4 h-4" /> Browse Collections
                </Link>
                {user && (
                  <Link to="/orders" className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider rounded-xs hover:bg-[#FAFAF4] transition-all">
                    <Package className="w-4 h-4" /> Track Orders
                  </Link>
                )}
              </div>

              {/* Quick categories */}
              <div className="pt-8 border-t border-[#E8E2D8]">
                <p className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] mb-4">Explore Heritage Series</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    ['Mango Specialities', '/categories/mango-achaar'],
                    ['Artisanal Chilli', '/categories/chilli-achaar'],
                    ['Desert Delicacies', '/categories/desert-achaar'],
                    ['Heritage Blends', '/categories/heritage-blends'],
                  ].map(([label, to]) => (
                    <Link key={to} to={to} className="px-3 py-1.5 bg-[#FAFAF4] border border-[#E8E2D8] text-[#1A1A1A] text-xs font-semibold rounded-full hover:bg-[#F2EDE0] transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* -- Cart items -- */}
            <div className="lg:col-span-3 bg-white border border-[#E8E2D8] rounded-xl overflow-hidden shadow-none">
              {shipping === 0 && (
                <div className="px-6 py-4 bg-green-50/50 border-b border-[#E8E2D8] flex items-center gap-2 text-xs font-bold text-green-700">
                  <CheckCircle className="w-5 h-5 text-green-600" /> You've unlocked FREE delivery across India!
                </div>
              )}

              {/* Items list */}
              <div className="divide-y divide-[#E8E2D8]">
                {items.map((item) => (
                  <CartItem key={item.id ?? item.productId} item={item} />
                ))}
              </div>

              {/* Continue shopping */}
              <div className="p-6 border-t border-[#E8E2D8] bg-[#FAFAF4] text-left">
                <Link to="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-[#1A1A1A] hover:text-[#C8922A] uppercase tracking-wider transition-colors">
                  <Gift className="w-4 h-4" /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* -- Order summary -- */}
            <div className="lg:col-span-2 space-y-4 sticky top-24 text-left">
              <div className="bg-white border border-[#E8E2D8] p-6 rounded-xl shadow-none">
                <div className="flex items-center gap-3 pb-4 border-b border-[#E8E2D8] mb-6">
                  <div className="w-10 h-10 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5 text-[#C8922A]" />
                  </div>
                  <h2 className="font-display font-light text-xl text-[#1A1A1A]">Order Summary</h2>
                </div>

                <div className="space-y-4">
                  {/* Per-item breakdown */}
                  <div className="space-y-3 pb-4 border-b border-[#E8E2D8] max-h-52 overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                      <div key={item.id ?? item.productId} className="flex justify-between text-xs gap-4">
                        <span className="text-[#6B6560] truncate flex-1">
                          {item.product?.name} <span className="text-[10px] font-bold text-[#9A8A70]">×{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-[#1A1A1A] shrink-0">
                          ₹{(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6560]">Subtotal</span>
                    <span className="font-semibold text-[#1A1A1A]">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span className="text-[#6B6560] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#9A8A70]" /> Delivery
                    </span>
                    <span className="font-bold text-green-700 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> FREE
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-semibold pt-4 border-t border-[#E8E2D8] mt-2">
                    <span className="text-[#1A1A1A]">Total</span>
                    <span className="font-display italic text-lg text-[#C8922A]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link to="/checkout" className="btn-primary w-full justify-center mt-6 py-3.5 text-xs tracking-[0.12em] rounded-xs">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                {!user && (
                  <p className="text-center text-xs text-[#6B6560] mt-3">
                    Have an account?{' '}
                    <Link to="/login?redirect=/checkout" className="text-[#C8922A] font-semibold hover:underline">
                      Login
                    </Link>{' '}
                    for a faster checkout.
                  </p>
                )}
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <MdSecurity className="w-5 h-5 text-[#C8922A]" />, label: 'Secure\nPayment' },
                  { icon: <MdLocalShipping className="w-5 h-5 text-[#C8922A]" />, label: 'Fresh\nDelivery' },
                  { icon: <MdAssignmentReturn className="w-5 h-5 text-[#C8922A]" />, label: 'Easy\nReturns' },
                ].map(({ icon, label }) => (
                  <div key={label} className="bg-white border border-[#E8E2D8] p-4 flex flex-col items-center gap-2 text-center rounded-xl">
                    <div className="bg-[#FAFAF4] border border-[#E8E2D8] p-2 rounded-lg">{icon}</div>
                    <p className="text-[9px] font-semibold text-[#6B6560] leading-tight whitespace-pre-line uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}