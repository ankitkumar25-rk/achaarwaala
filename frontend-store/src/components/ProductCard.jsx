import { Link } from 'react-router-dom';
import { useCartStore } from '../store';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addItem);

  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="product-card group relative flex flex-col h-full bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl overflow-hidden transition-all duration-300 shadow-none"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#FAFAF4] border-b border-[#E8E2D8]">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            loading="lazy"
            width={300}
            height={375}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8 bg-[#FAFAF4]">
            <span className="font-sans text-[10px] tracking-widest text-[#9A8A70]">ACHAARWAALA</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="text-[9px] font-sans font-medium uppercase tracking-[0.12em] bg-[#1A1A1A] text-[#FFFFFF] px-2.5 py-1 rounded-sm">
              Bestseller
            </span>
          )}
          {product.stock <= 0 && (
            <span className="text-[9px] font-sans font-medium uppercase tracking-[0.12em] bg-red-100 border border-red-200 text-red-700 px-2.5 py-1 rounded-sm">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between text-left space-y-4">
        <div className="space-y-1.5">
          <span className="font-sans text-xs uppercase tracking-[0.14em] text-[#9A8A70] block">
            {product.category?.name || 'SLOW-CURED IN MUSTARD OIL'}
          </span>
          <h3 className="font-display text-xl text-[#1A1A1A] group-hover:text-[#C8922A] transition-colors leading-snug font-light">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#FAFAF4]">
          <div className="flex items-baseline gap-2">
            <span className="font-display italic text-lg text-[#C8922A]">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <span className="text-sm line-through text-[#6B6560]/70">
                ₹{product.mrp}
              </span>
            )}
          </div>
          <span className="text-xs font-sans uppercase tracking-wider text-[#6B6560]">
            {product.unit || '500g'}
          </span>
        </div>
      </div>
    </Link>
  );
}
