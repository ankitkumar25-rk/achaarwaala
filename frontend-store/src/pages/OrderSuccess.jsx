import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Package, Calendar, CreditCard } from 'lucide-react';
import { ordersApi, productsApi } from '../api';
import toast from 'react-hot-toast';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await ordersApi.getById(orderId);
        setOrder(data.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        toast.error('Could not load order details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId, navigate]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await productsApi.featured();
        const boughtIds = order?.items?.map(item => item.productId) || [];
        const filtered = (data.data || []).filter(p => !boughtIds.includes(p.id)).slice(0, 3);
        setRecommendations(filtered);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };
    if (order) {
      fetchRecommendations();
    }
  }, [order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF4] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C8922A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getStatusDisplay = () => {
    const status = order?.paymentStatus || 'PENDING';

    switch (status) {
      case 'PAID':
        return {
          title: "Order Confirmed!",
          message: "Payment Received Successfully",
          badge: {
            text: "PAID",
            className: "bg-green-50 border border-green-200 text-green-700",
            dotColor: "bg-green-600"
          }
        };
      case 'COD_PENDING':
        return {
          title: "Order Placed!",
          message: "Cash on Delivery",
          badge: {
            text: "Pay on Delivery",
            className: "bg-[#F2EDE0] border border-[#E8E2D8] text-[#9A8A70]",
            dotColor: "bg-[#9A8A70]"
          }
        };
      default: // PENDING
        return {
          title: "Order Placed!",
          message: "Payment Processing...",
          badge: {
            text: "Processing",
            className: "bg-orange-50 border border-orange-200 text-orange-700",
            dotColor: "bg-orange-600"
          }
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="min-h-screen bg-[#FAFAF4] flex items-center justify-center px-4 py-12 text-[#6B6560]">
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">
        {/* Animated checkmark */}
        <div className="w-20 h-20 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="font-display font-light text-3xl text-[#1A1A1A] mb-2">
          {display.title}
        </h1>
        <p className="text-[#C8922A] text-xs font-semibold uppercase tracking-widest mb-8">
          {display.message}
        </p>

        {/* Order details card */}
        <div className="bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg p-5 text-left mb-8 space-y-3">
          <div className="flex justify-between items-center border-b border-[#E8E2D8]/50 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A8A70] flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Order ID
            </span>
            <span className="font-mono text-xs font-bold text-[#1A1A1A]">
              {order?.orderNumber || order?.id?.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#E8E2D8]/50 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A8A70] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date
            </span>
            <span className="text-xs font-semibold text-[#1A1A1A]">
              {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-[#E8E2D8]/50 pb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A8A70] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Total Amount
            </span>
            <span className="font-display italic text-[#C8922A] text-base">
              ₹{Number(order?.total).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A8A70] flex items-center gap-1.5">
              Status
            </span>
            <span className={`${display.badge.className} font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-xs`}>
              {display.badge.text}
            </span>
          </div>
        </div>

        <p className="text-xs mb-8 max-w-xs mx-auto leading-relaxed">
          We will process and ship your fresh batch immediately. A confirmation update has been sent.
        </p>

        {/* Recommended Products Upsell Section */}
        {recommendations.length > 0 && (
          <div className="mt-8 pt-8 border-t border-[#E8E2D8] text-left mb-8">
            <h3 className="font-display font-light text-base text-[#1A1A1A] mb-1">Slow-Cured Rajasthani Pickles</h3>
            <p className="text-[9px] text-[#9A8A70] mb-4 uppercase tracking-wider font-semibold">Other favorites you might love</p>
            
            <div className="grid grid-cols-3 gap-3">
              {recommendations.map((prod) => (
                <Link 
                  key={prod.id} 
                  to={`/products/${prod.slug}`} 
                  className="bg-white border border-[#E8E2D8] rounded-lg p-2 flex flex-col group hover:border-[#C8922A] transition-all duration-300"
                >
                  <div className="aspect-square rounded-md overflow-hidden bg-[#FAFAF4] mb-2 shrink-0 border border-[#E8E2D8]/30">
                    <img 
                      src={prod.images?.[0]?.url || 'https://placehold.co/120x120?text=Pickle'} 
                      alt={prod.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                  </div>
                  <h4 className="text-[10px] font-semibold text-[#1A1A1A] truncate leading-tight">{prod.name}</h4>
                  <p className="text-[10px] font-display italic text-[#C8922A] mt-0.5">₹{Number(prod.price).toFixed(0)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/orders/${orderId}`)}
            className="w-full bg-[#1A1A1A] text-white rounded-xs py-4 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all cursor-pointer"
          >
            <span>View Order Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <Link
            to="/products"
            className="w-full border border-[#1A1A1A] text-[#1A1A1A] rounded-xs py-3.5 font-semibold text-xs uppercase tracking-wider hover:bg-[#FAFAF4] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
