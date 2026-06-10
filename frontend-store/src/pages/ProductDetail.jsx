import { useState, useEffect, useCallback, useRef } from 'react';
import ZoomableImage from '../components/ZoomableImage';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Heart, Share2, Star,
  ChevronRight, Plus,
  Minus, Check, Award, Package, AlertCircle,
  MessageSquare, Pencil, ImagePlus, X
} from 'lucide-react';
import { 
  MdSecurity, MdLocalShipping, MdAssignmentReturn 
} from 'react-icons/md';
import toast from 'react-hot-toast';
import { productsApi, usersApi, uploadApi } from '../api';
import { useCartStore, useAuthStore } from '../store';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { trackViewContent, trackAddToCart } from '../utils/metaPixel';

import imgLeft from '../assets/images/78d24d8c-b63f-4b3e-a9f3-6f5752927c0a.png';
import imgTopRight from '../assets/images/60bc9565-b5f4-454d-a8e5-36addfed5fd0 (1).png';
import imgBottomRight from '../assets/images/b085284f-af0d-4da2-8ead-aa66bd3075eb.png';

/* ------ helpers ------ */
function StarRating({ rating, size = 'sm', interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${sz} transition-colors ${
            n <= (interactive ? hovered || rating : rating)
              ? 'text-[#C8922A] fill-[#C8922A]'
              : 'text-[#E8E2D8] fill-[#E8E2D8]'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onMouseEnter={() => interactive && setHovered(n)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(n)}
        />
      ))}
    </div>
  );
}

function avgRating(reviews) {
  if (!reviews?.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

/* ------ Image Gallery ------ */
function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);

  if (!images?.length) {
    return (
      <div className="aspect-square rounded-xl bg-[#FAFAF4] flex items-center justify-center border border-[#E8E2D8]">
        <Package className="w-16 h-16 text-[#9A8A70]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image with zoom */}
      <ZoomableImage 
        src={images[active]?.url} 
        alt={images[active]?.altText || name} 
        className="aspect-square rounded-xl overflow-hidden bg-[#FAFAF4] border border-[#E8E2D8] group shadow-none"
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.slice(0, 3).map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActive(i)}
              className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                i === active 
                  ? 'border-[#C8922A] scale-102' 
                  : 'border-[#E8E2D8] hover:border-[#C8922A]'
              }`}
            >
               <img 
                 src={img.url} 
                 alt={img.altText || name} 
                 className="w-full h-full object-cover" 
                 loading="lazy" 
               />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------ Review Card ------ */
function ReviewCard({ review }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E8E2D8] space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
           {review.user?.avatarUrl ? (
             <img src={review.user.avatarUrl} alt={review.user.name} className="w-9 h-9 rounded-full object-cover" loading="lazy" width={36} height={36} />
           ) : (
            <div className="w-9 h-9 rounded-full bg-[#FAFAF4] text-[#1A1A1A] border border-[#E8E2D8] flex items-center justify-center text-sm font-medium shrink-0">
              {review.user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="text-left">
            <p className="font-semibold text-[#1A1A1A] text-sm">{review.user?.name || 'Anonymous'}</p>
            <p className="text-xs text-[#6B6560]/75">{date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} />
          {review.isVerified && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-700">
              <Check className="w-3 h-3" /> Verified Purchase
            </span>
          )}
        </div>
      </div>
      <div className="text-left">
        {review.title && (
          <p className="font-semibold text-[#1A1A1A] text-sm mb-1">"{review.title}"</p>
        )}
        {review.body && (
          <p className="text-[#6B6560] text-sm leading-relaxed">{review.body}</p>
        )}
      </div>
    </div>
  );
}

/* ------ Write Review Form ------ */
function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      await usersApi.addReview({ productId, rating, title, body });
      toast.success('Review submitted!');
      setRating(0); setTitle(''); setBody('');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="p-5 rounded-lg bg-[#FFFFFF] border border-[#E8E2D8] space-y-4 text-left">
      <h4 className="font-display font-light text-lg text-[#1A1A1A] flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-[#C8922A]" /> Write a Review
      </h4>
      <div>
        <p className="text-xs text-[#6B6560] mb-2 font-medium">Your Rating *</p>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
          placeholder="Review title (optional)"
        />
      </div>
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="input-field resize-none"
          placeholder="Share your experience with this product..."
        />
      </div>
      <button type="submit" disabled={submitting || !rating} className="btn-primary w-full justify-center">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

/* -------- MAIN PAGE -------- */
export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItem  = useCartStore((s) => s.addItem);
  const user     = useAuthStore((s) => s.user);
  const location = useLocation();
  const { isWishlisted, toggleWishlist: triggerWishlist, isPending: isWishlistPending } = useWishlist();

  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [related, setRelated]   = useState([]);
  const [qty, setQty]           = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewsShown, setReviewsShown] = useState(4);

  // Customization state removed

  const MOCK_PRODUCTS = [
    {
      id: 'prod-1',
      name: 'Heritage Mango Pickle',
      slug: 'heritage-mango',
      price: 450,
      mrp: 550,
      unit: '500g',
      weight: 500,
      sku: 'AW-MNG-01',
      isFeatured: true,
      stock: 50,
      images: [{ id: 'img-1', url: imgBottomRight, isPrimary: true }],
      category: { name: 'Mango Specialities', slug: 'mango-achaar' },
      shortDesc: 'Traditional Rajasthani sun-dried Raw Mango Pickle, slow-cured in pure mustard oil and authentic spices.',
      description: 'Our signature Heritage Mango Pickle (Aam ka Achaar) is prepared using the finest handpicked green mangoes from local orchards. We follow a century-old traditional recipe: sun-dried to perfection, slow-cured in rich mustard oil, and infused with freshly ground fennel, fenugreek, and mustard seeds. 100% natural, preservative-free, and guaranteed to remind you of home.',
      reviews: [
        { id: 'rev-1', rating: 5, title: 'Incredible taste!', body: 'Exactly like the one my grandmother used to make in Rajasthan. Perfectly sour and spicy.', user: { name: 'Ramesh Sharma' }, isVerified: true, createdAt: '2026-05-15T12:00:00Z' },
        { id: 'rev-2', rating: 5, title: 'Superb quality', body: 'Very fresh spice blend and not too oily. Will definitely order again.', user: { name: 'Priya Patel' }, isVerified: true, createdAt: '2026-05-18T12:00:00Z' }
      ],
      _count: { reviews: 2 }
    },
    {
      id: 'prod-2',
      name: 'Rustic Chilli Pickle',
      slug: 'rustic-chilli',
      price: 425,
      mrp: 499,
      unit: '500g',
      weight: 500,
      sku: 'AW-CHL-02',
      isFeatured: true,
      stock: 40,
      images: [{ id: 'img-2', url: imgLeft, isPrimary: true }],
      category: { name: 'Artisanal Chilli', slug: 'chilli-achaar' },
      shortDesc: 'Fiery Rajasthani Green Chilli Pickle with a rich smoked spice blend, cured in cold-pressed mustard oil.',
      description: 'A spicy lover\'s dream! Our Rustic Chilli Pickle is crafted using premium, thick green chillies harvested at peak ripeness. The chillies are slit, stuffed with our secret spice blend of split mustard, dry mango powder, and cumin, and matured slowly under the Rajasthani sun. It brings a perfect kick to any meal.',
      reviews: [
        { id: 'rev-3', rating: 5, title: 'Spicy and delicious', body: 'A bit hot but extremely flavorful. Goes wonderfully with parathas.', user: { name: 'Ankit Kumar' }, isVerified: true, createdAt: '2026-05-10T12:00:00Z' }
      ],
      _count: { reviews: 1 }
    },
    {
      id: 'prod-3',
      name: 'Ker Sangri Achaar',
      slug: 'ker-sangri',
      price: 599,
      mrp: 699,
      unit: '400g',
      weight: 400,
      sku: 'AW-KER-03',
      isFeatured: true,
      stock: 25,
      images: [{ id: 'img-3', url: imgTopRight, isPrimary: true }],
      category: { name: 'Desert Delicacies', slug: 'desert-achaar' },
      shortDesc: 'Authentic Marwari royal delicacy featuring wild-harvested desert Ker and Sangri beans.',
      description: 'Ker Sangri is the crown jewel of Rajasthani cuisine. Made from wild-harvested dried desert beans (Sangri) and desert berries (Ker), this pickle is cooked with dried red chillies, raisins, and traditional spices. Prepared in small artisanal batches to maintain its rich heritage flavor.',
      reviews: [
        { id: 'rev-4', rating: 5, title: 'Royal taste indeed', body: 'I could not find this quality anywhere else online. Worth every rupee.', user: { name: 'Sanjay Singh' }, isVerified: true, createdAt: '2026-05-20T12:00:00Z' }
      ],
      _count: { reviews: 1 }
    },
    {
      id: 'prod-4',
      name: 'Ancestral Lemon Pickle',
      slug: 'ancestral-lemon',
      price: 399,
      mrp: 450,
      unit: '500g',
      weight: 500,
      sku: 'AW-LMN-04',
      isFeatured: false,
      stock: 35,
      images: [{ id: 'img-4', url: imgBottomRight, isPrimary: true }],
      category: { name: 'Heritage Blends', slug: 'heritage-blends' },
      shortDesc: 'Oil-free tangy Lemon Pickle, naturally fermented and cured with black salt and carom seeds.',
      description: 'An oil-free, healthy digestive pickle made using juicy, thin-skinned lemons. The lemons are cured with black salt, rock salt, carom seeds (ajwain), and black pepper. It is naturally aged over months until the lemon skins become tender and develop a rich, dark sweet-and-sour glaze.',
      reviews: [],
      _count: { reviews: 0 }
    },
    {
      id: 'prod-5',
      name: 'Spicy Garlic Pickle',
      slug: 'spicy-garlic',
      price: 480,
      mrp: 520,
      unit: '400g',
      weight: 400,
      sku: 'AW-GRL-05',
      isFeatured: true,
      stock: 15,
      images: [{ id: 'img-5', url: imgLeft, isPrimary: true }],
      category: { name: 'Heritage Blends', slug: 'heritage-blends' },
      shortDesc: 'Pungent and spicy whole Garlic clove pickle, seasoned with split mustard and fenugreek seeds.',
      description: 'Whole peeled garlic cloves slow-cooked in mustard oil with high-grade split red chillies, mustard, and fennel. This pickle is rich, pungent, and makes an excellent immunity booster besides being highly delicious.',
      reviews: [],
      _count: { reviews: 0 }
    },
    {
      id: 'prod-6',
      name: 'Dry Mango (Amchur) Special',
      slug: 'dry-mango-amchur',
      price: 350,
      mrp: 399,
      unit: '250g',
      weight: 250,
      sku: 'AW-AMC-06',
      isFeatured: false,
      stock: 60,
      images: [{ id: 'img-6', url: imgTopRight, isPrimary: true }],
      category: { name: 'Mango Specialities', slug: 'mango-achaar' },
      shortDesc: 'Sun-dried sour mango slices seasoned with local Rajasthani spices, oil-free.',
      description: 'Made from premium dried green mango slices (Amchur), this oil-free dry pickle is coated in black salt, cumin, and red chilli. Perfect companion for travels and lightweight meals.',
      reviews: [],
      _count: { reviews: 0 }
    }
  ];

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productsApi.getBySlug(slug);
      setProduct(data.data);
      trackViewContent(data.data);
      if (data.data.category?.slug) {
        productsApi.list({ category: data.data.category.slug, limit: 4 })
          .then((r) => setRelated(r.data.data?.filter((p) => p.id !== data.data.id).slice(0, 4) || []))
          .catch((err) => {
            console.error('Failed to load related products:', err);
            setRelated([]);
          });
      }
    } catch {
      const mockProd = MOCK_PRODUCTS.find(p => p.slug === slug);
      if (mockProd) {
        setProduct(mockProd);
        const mockRelated = MOCK_PRODUCTS.filter(p => p.category?.slug === mockProd.category?.slug && p.id !== mockProd.id).slice(0, 4);
        setRelated(mockRelated);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
    } finally { setLoading(false); }
   }, [slug, navigate]);

  useEffect(() => { fetchProduct(); setQty(1); }, [fetchProduct]);

  const handleAddToCart = async (redirectToCheckOut = false) => {

    
    if (redirectToCheckOut) {
      setBuyingNow(true);
    } else {
      setAddingToCart(true);
    }

    try {
      await addItem(product.id, qty, {});
      trackAddToCart(product, qty);
      
      if (redirectToCheckOut) {
        navigate('/checkout');
      } else {
        toast.success(
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-700" />
            <span><b>{product.name}</b> added to cart!</span>
          </div>,
          { duration: 3000 }
        );
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
      setBuyingNow(false);
    }
  };

  const inWishlist = product ? isWishlisted(product.id) : false;

  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to use wishlist');
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    try {
      if (inWishlist) {
        await triggerWishlist({ productId: product.id, isWishlisted: true });
        toast.success('Removed from wishlist');
      } else {
        await triggerWishlist({ productId: product.id, isWishlisted: false });
        toast.success('Added to wishlist!');
      }
    } catch { toast.error('Failed to update wishlist'); }
  };

  const shareProduct = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };



  /* --- Loading skeleton --- */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse bg-[#FAFAF4] min-h-screen">
        <div className="h-4 w-48 bg-[#E8E2D8] rounded mb-8" />
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square rounded-xl bg-[#E8E2D8]" />
          <div className="space-y-4">
            <div className="h-3 w-24 bg-[#E8E2D8] rounded" />
            <div className="h-8 w-3/4 bg-[#E8E2D8] rounded" />
            <div className="h-4 w-1/3 bg-[#E8E2D8] rounded" />
            <div className="h-6 w-1/4 bg-[#E8E2D8] rounded" />
            <div className="h-24 bg-[#E8E2D8] rounded" />
            <div className="h-12 bg-[#E8E2D8] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discountPct = product.mrp
    ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100)
    : 0;
  const avg = avgRating(product.reviews);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= (product.lowStockAlert || 10);

  const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'reviews',     label: `Reviews (${product._count?.reviews || 0})` },
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map(img => img.url) || [],
    "description": product.shortDesc || product.description || 'Premium village style pickles handcrafted with love by Achaarwaala.',
    "sku": product.sku || `AW-${product.id}`,
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2030-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Achaarwaala"
      }
    },
    ...(product.reviews?.length > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": avg.toFixed(1),
        "reviewCount": product.reviews.length
      }
    } : {})
  };

  return (
    <div className="min-h-screen bg-[#FAFAF4] page-enter pb-16">
      <SEO
        title={product.name}
        description={product.shortDesc || `Buy ${product.name} online at Achaarwaala. Handcrafted village style pickles with fast delivery across India.`}
        image={product.images?.[0]?.url || '/images/og-default.jpg'}
        keywords={`${product.name}, buy ${product.name} online, village style pickles, authentic rajasthani achaar, Achaarwaala`}
        schemaMarkup={productSchema}
      />
      
      {/* Breadcrumb */}
      <div className="bg-[#FFFFFF] border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B6560] uppercase tracking-wider">
            <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
            <Link to="/products" className="hover:text-[#C8922A] transition-colors">Products</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
                <Link to={`/categories/${product.category.slug}`} className="hover:text-[#C8922A] transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
            <span className="text-[#1A1A1A] font-medium truncate max-w-40">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* -- Main product section -- */}
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Images */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ImageGallery images={product.images} name={product.name} />
          </div>

          {/* Product info */}
          <div className="space-y-6 text-left">
            {/* Category + badges */}
            <div className="flex items-center flex-wrap gap-2">
              {product.category && (
                <Link
                  to={`/categories/${product.category.slug}`}
                  className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#9A8A70] hover:text-[#C8922A] transition-colors"
                >
                  {product.category.name}
                </Link>
              )}
              {product.isFeatured && (
                <span className="text-[9px] font-sans font-medium uppercase tracking-[0.12em] bg-[#1A1A1A] text-[#FFFFFF] px-2.5 py-0.5 rounded-sm">
                  Bestseller
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display text-3xl xl:text-4.5xl font-light text-[#1A1A1A] leading-tight">
              {product.name}
            </h1>

            {/* Rating summary */}
            {product._count?.reviews > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={Math.round(avg)} />
                <span className="font-sans text-xs font-semibold text-[#1A1A1A]">{avg.toFixed(1)}</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-xs text-[#9A8A70] hover:text-[#C8922A] transition-colors uppercase tracking-wider font-semibold"
                >
                  {product._count.reviews} review{product._count.reviews !== 1 ? 's' : ''}
                </button>
              </div>
            )}

            {/* Short desc */}
            {product.shortDesc && (
              <p className="font-sans text-sm text-[#6B6560] leading-relaxed">{product.shortDesc}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-2 border-t border-[#E8E2D8]">
              <span className="font-display italic text-3xl text-[#C8922A]">₹{Number(product.price).toFixed(2)}</span>
              <span className="text-xs text-[#6B6560]">/ {product.unit}</span>
              {discountPct > 0 && (
                <div className="flex items-baseline gap-2 ml-4">
                  <span className="text-sm text-[#6B6560]/75 line-through">₹{Number(product.mrp).toFixed(2)}</span>
                  <span className="text-[10px] font-sans font-medium uppercase tracking-wider bg-[#F2EDE0] text-[#9A8A70] px-2 py-0.5 rounded-xs">
                    {discountPct}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="text-xs">
              {!inStock ? (
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <AlertCircle className="w-4 h-4" /> Out of Stock
                </div>
              ) : lowStock ? (
                <div className="flex items-center gap-2 text-[#C8922A] font-semibold">
                  <Package className="w-4 h-4" /> Only {product.stock} left in this batch!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <Check className="w-4 h-4" /> Fresh Batch Available ({product.stock} Jars)
                </div>
              )}
            </div>



            {/* Qty + add to cart */}
            {inStock && (
              <div className="space-y-4 pt-2 border-t border-[#E8E2D8]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 border border-[#E8E2D8] bg-white rounded-lg px-2 py-1">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 hover:bg-[#FAFAF4] flex items-center justify-center transition-colors rounded-sm"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#6B6560]" />
                    </button>
                    <span className="w-10 text-center font-semibold text-[#1A1A1A] text-sm">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                      className="w-8 h-8 hover:bg-[#FAFAF4] flex items-center justify-center transition-colors rounded-sm"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#6B6560]" />
                    </button>
                  </div>
                  <p className="text-xs font-sans text-[#6B6560] uppercase tracking-wider">
                    Total: <span className="font-display italic text-lg text-[#C8922A] ml-1">₹{(Number(product.price) * qty).toFixed(2)}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Buy Now Button (Primary Solid Hero Button) */}
                  <button
                    onClick={() => handleAddToCart(true)}
                    disabled={addingToCart || buyingNow}
                    className="w-full bg-[#1A1A1A] text-[#FFFFFF] py-4 rounded-xs font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all cursor-pointer"
                  >
                    {buyingNow ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Checkout...
                      </span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Buy Now (Direct Checkout)
                      </>
                    )}
                  </button>

                  <div className="flex gap-3">
                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(false)}
                      disabled={addingToCart || buyingNow}
                      className="flex-1 py-3.5 border border-[#1A1A1A] text-[#1A1A1A] font-semibold rounded-xs text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#FAFAF4] active:scale-98 transition-all cursor-pointer"
                      id={`add-to-cart-${product.id}`}
                    >
                      {addingToCart ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-[#1A1A1A] border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </span>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" /> Add to Cart
                        </>
                      )}
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={toggleWishlist}
                      disabled={isWishlistPending}
                      className={`w-14 rounded-xs border flex items-center justify-center transition-all cursor-pointer ${
                        inWishlist
                          ? 'border-red-200 bg-red-50 text-red-600'
                          : 'border-[#E8E2D8] hover:border-red-300 text-[#9A8A70] hover:text-red-500 hover:bg-[#FAFAF4]'
                      }`}
                      aria-label="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-600 text-red-600' : ''}`} />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={shareProduct}
                      className="w-14 rounded-xs border border-[#E8E2D8] flex items-center justify-center text-[#9A8A70] hover:text-[#1A1A1A] hover:bg-[#FAFAF4] transition-all cursor-pointer"
                      aria-label="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Go to cart link */}
            <div className="pt-2">
              <Link to="/cart" className="text-xs font-semibold text-[#1A1A1A] hover:text-[#C8922A] transition-colors flex items-center gap-1.5 uppercase tracking-wider">
                <ShoppingCart className="w-4 h-4" /> View Cart
              </Link>
            </div>
            
            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E8E2D8]">
              {[
                { icon: <MdSecurity className="w-5 h-5 text-[#C8922A]" />, label: 'Secure Payment', sub: 'SSL encrypted' },
                { icon: <MdLocalShipping className="w-5 h-5 text-[#C8922A]" />, label: 'Fast Delivery',  sub: 'Free above ₹999' },
                { icon: <MdAssignmentReturn className="w-5 h-5 text-[#C8922A]" />, label: 'Easy Returns', sub: '7-day policy' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-[#F2EDE0] rounded-lg">
                  <div className="bg-white p-2 rounded-lg border border-[#E8E2D8] mb-1">{icon}</div>
                  <p className="text-[10px] font-bold text-[#1A1A1A] leading-tight">{label}</p>
                  <p className="text-[9px] text-[#6B6560]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tags + certifications */}
            {(product.tags?.length > 0 || product.certifications?.length > 0) && (
              <div className="space-y-3 pt-2">
                {product.tags?.length > 0 && (
                  <div className="bg-[#FFFFFF] border border-[#E8E2D8] p-5 rounded-lg flex flex-wrap gap-2">
                    {product.tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-[#FAFAF4] hover:bg-[#F2EDE0] text-[#6B6560] text-xs font-semibold rounded-full transition-colors">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                {product.certifications?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {product.certifications.map((c) => (
                      <span key={c} className="flex items-center gap-1 px-2.5 py-1 bg-[#FAFAF4] text-[#9A8A70] text-xs font-bold rounded-full border border-[#E8E2D8]">
                        <Award className="w-3 h-3" /> {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* -- Tabs -- */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl overflow-hidden shadow-none">
          {/* Tab bar */}
          <div className="flex border-b border-[#E8E2D8] bg-[#F2EDE0] overflow-x-auto">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-6 py-4 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all border-b-2 ${
                  activeTab === id
                    ? 'border-[#C8922A] text-[#1A1A1A] bg-white'
                    : 'border-transparent text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#FAFAF4]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="p-6 xl:p-8">
            {/* Description */}
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none text-[#6B6560] leading-relaxed space-y-4 text-left">
                {product.description ? (
                  <p className="text-sm">{product.description}</p>
                ) : (
                  <p className="text-[#9A8A70] italic">No description available.</p>
                )}

                {/* SKU / weight */}
                <div className="grid sm:grid-cols-2 gap-4 not-prose pt-6 border-t border-[#E8E2D8]">
                  {[
                    { label: 'Size',     value: product.unit || '—' },
                    { label: 'Weight',   value: product.weight ? `${product.weight}g` : '—' },
                    { label: 'Category', value: product.category?.name || '—' },
                    { label: 'SKU',      value: product.sku || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-[#E8E2D8]/50 text-xs font-sans">
                      <span className="text-[#9A8A70] uppercase tracking-wider">{label}</span>
                      <span className="font-semibold text-[#1A1A1A]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating summary */}
                {product.reviews?.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 p-5 bg-[#FAFAF4] rounded-lg border border-[#E8E2D8]">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left shrink-0">
                      <p className="font-display text-5xl font-light text-[#1A1A1A] leading-none mb-1">{avg.toFixed(1)}</p>
                      <StarRating rating={Math.round(avg)} size="sm" />
                      <p className="text-xs text-[#6B6560] mt-2 font-medium uppercase tracking-wider">{product._count?.reviews} reviews</p>
                    </div>
                    {/* Rating breakdown */}
                    <div className="flex-1 w-full space-y-1.5">
                      {[5, 4, 3, 2, 1].map((n) => {
                        const count = product.reviews.filter((r) => r.rating === n).length;
                        const pct = product.reviews.length ? (count / product.reviews.length) * 100 : 0;
                        return (
                          <div key={n} className="flex items-center gap-2 text-xs">
                            <span className="w-3 text-[#6B6560] font-medium">{n}</span>
                            <Star className="w-3 h-3 text-[#C8922A] fill-[#C8922A] shrink-0" />
                            <div className="flex-1 h-1.5 bg-[#E8E2D8]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#C8922A] rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-6 text-[#9A8A70] text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Write review */}
                {user ? (
                  <ReviewForm productId={product.id} onSuccess={fetchProduct} />
                ) : (
                  <div className="p-6 bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg text-center text-xs text-[#6B6560]">
                    Please{' '}
                    <Link to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} className="text-[#C8922A] font-semibold hover:underline">
                      Login
                    </Link>{' '}
                    to write a review.
                  </div>
                )}

                {/* Review list */}
                {product.reviews?.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#E8E2D8]" />
                    <p className="font-semibold text-[#6B6560]">No reviews yet</p>
                    <p className="text-xs text-[#9A8A70]">Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {product.reviews.slice(0, reviewsShown).map((r) => (
                      <ReviewCard key={r.id} review={r} />
                    ))}
                    {reviewsShown < product.reviews.length && (
                      <button
                        onClick={() => setReviewsShown((n) => n + 4)}
                        className="w-full py-3 text-xs uppercase tracking-wider font-semibold text-[#1A1A1A] border border-[#E8E2D8] rounded-lg hover:bg-[#FAFAF4] transition-all"
                      >
                        Show more reviews ({product.reviews.length - reviewsShown} remaining)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* -- Related products -- */}
        {related.length > 0 && (
          <section className="text-left">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-light text-2xl text-[#1A1A1A]">
                You Might Also Like
              </h2>
              <Link to={`/categories/${product.category?.slug}`} className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] hover:text-[#C8922A] transition-colors">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
