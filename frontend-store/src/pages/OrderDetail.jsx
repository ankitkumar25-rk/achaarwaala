import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Package, MapPin, CreditCard, Truck,
  Clock, CheckCircle, XCircle, RefreshCw, Copy, Check,
  ChevronRight
} from 'lucide-react';
import { ordersApi } from '../api';
import ZoomableImage from '../components/ZoomableImage';
import toast from 'react-hot-toast';

const STATUSES = [
  { key: 'PENDING',    label: 'Order Placed',   icon: Clock,       desc: 'Your order has been placed' },
  { key: 'CONFIRMED',  label: 'Confirmed',      icon: CheckCircle, desc: 'Order confirmed by curing team' },
  { key: 'PROCESSING', label: 'Processing',     icon: RefreshCw,   desc: 'Being prepared and packed' },
  { key: 'SHIPPED',    label: 'Shipped',        icon: Truck,       desc: 'Out for delivery' },
  { key: 'DELIVERED',  label: 'Delivered',      icon: CheckCircle, desc: 'Delivered successfully' },
];

const STATUS_COLOR = {
  PENDING:    'bg-[#9A8A70]',
  CONFIRMED:  'bg-blue-500',
  PROCESSING: 'bg-[#C8922A]',
  SHIPPED:    'bg-indigo-500',
  DELIVERED:  'bg-green-500',
  CANCELLED:  'bg-red-500',
};

function StatusBadge({ status }) {
  const map = {
    PENDING:    { bg: 'bg-[#F2EDE0] text-[#9A8A70]', border: 'border-[#E8E2D8]', label: 'Pending' },
    CONFIRMED:  { bg: 'bg-blue-50 text-blue-700', border: 'border-blue-200', label: 'Confirmed' },
    PROCESSING: { bg: 'bg-[#FAFAF4] text-[#C8922A]', border: 'border-[#E8E2D8]', label: 'Processing' },
    SHIPPED:    { bg: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200', label: 'Shipped' },
    DELIVERED:  { bg: 'bg-green-50 text-green-700', border: 'border-green-200', label: 'Delivered' },
    CANCELLED:  { bg: 'bg-red-50 text-red-700', border: 'border-red-200', label: 'Cancelled' },
  };
  const s = map[status] || map.PENDING;
  const colorDot = STATUS_COLOR[status] || 'bg-gray-400';
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-xs text-[10px] font-semibold uppercase tracking-wider ${s.bg} ${s.border} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colorDot}`} />
      {s.label}
    </span>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await ordersApi.getById(id);
        setOrder(data.data);
      } catch {
        toast.error('Order not found');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const cancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await ordersApi.cancel(id);
      toast.success('Order cancelled successfully');
      setOrder((o) => ({ ...o, status: 'CANCELLED' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel at this stage');
    } finally { setCancelling(false); }
  };

  const copyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF4] flex items-center justify-center text-[#6B6560]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C8922A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-semibold uppercase tracking-wider">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const isCancelled = order.status === 'CANCELLED';
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const statusIndex = STATUSES.findIndex((s) => s.key === order.status);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#FAFAF4] luxury-grain pt-32 pb-24 px-4 relative overflow-hidden text-[#6B6560]">
      <div className="max-w-5xl mx-auto relative z-10 text-left">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <Link to="/orders" className="hover:text-[#C8922A] transition-colors">Orders</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">Order Details</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A] leading-tight">
              Order <span className="italic text-[#C8922A]">Details</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-8 bg-[#C8922A]" />
              <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">{order.orderNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            {canCancel && (
              <button
                onClick={cancelOrder}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-xs bg-red-50 border border-red-200 text-red-700 font-semibold text-xs uppercase tracking-wider hover:bg-red-100 transition-all cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {/* Order info and date */}
        <p className="text-xs text-[#9A8A70] font-semibold uppercase tracking-wider mb-8">{formattedDate}</p>

        {/* Order Progress */}
        {!isCancelled && (
          <div className="bg-white border border-[#E8E2D8] rounded-xl p-8 space-y-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#C8922A]" />
              </div>
              <h2 className="font-display font-light text-xl text-[#1A1A1A]">Order Progress</h2>
            </div>
            <div className="relative">
              {/* Line */}
              <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-[#E8E2D8]" />
              <div
                className="absolute left-4 top-4 w-[1px] bg-[#C8922A] transition-all duration-500"
                style={{ height: statusIndex >= 0 ? `${(statusIndex / (STATUSES.length - 1)) * 100}%` : '0%' }}
              />
              <div className="space-y-6">
                {STATUSES.map((s, i) => {
                  const done = i <= statusIndex;
                  const active = i === statusIndex;
                  const Icon = s.icon;
                  return (
                     <div key={s.key} className="flex items-start gap-4 relative">
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        done
                          ? 'bg-[#C8922A] text-white'
                          : 'bg-[#FAFAF4] border border-[#E8E2D8] text-[#9A8A70]'
                      } ${active ? 'ring-4 ring-[#C8922A]/10' : ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className={`pt-1 ${done ? 'opacity-100' : 'opacity-60'}`}>
                        <p className={`font-semibold text-xs uppercase tracking-wider ${done ? 'text-[#1A1A1A]' : 'text-[#6B6560]'}`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-[#6B6560] mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="mt-6 p-4 bg-[#FAFAF4] border border-[#E8E2D8] rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#9A8A70] font-semibold uppercase tracking-wider">Tracking Number</p>
                  <p className="font-mono font-bold text-[#1A1A1A] mt-0.5">{order.trackingNumber}</p>
                </div>
                <button
                  onClick={copyTracking}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] text-white rounded-xs text-xs font-semibold hover:opacity-90 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            )}
          </div>
        )}

        {isCancelled && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 flex items-start gap-4 mb-8 text-left">
            <div className="w-10 h-10 rounded-lg bg-white border border-red-200 flex items-center justify-center shrink-0 text-red-600">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-800 mb-1">Order Cancelled</p>
              <p className="text-xs text-red-700 leading-relaxed">This order has been cancelled. Any pre-paid payments will be refunded back to the original source within 5-7 business days.</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-[#C8922A]" />
              </div>
              <h2 className="font-display font-light text-xl text-[#1A1A1A]">Order Items</h2>
            </div>
            <div className="divide-y divide-[#E8E2D8]">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-[#FAFAF4] border border-[#E8E2D8] shrink-0">
                    {item.product?.images?.[0] ? (
                      <ZoomableImage
                        src={item.product.images[0].url}
                        alt={item.productName}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <Package className="w-6 h-6 text-[#9A8A70]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-light text-[#1A1A1A] leading-tight text-sm sm:text-base mb-1">{item.productName}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {item.productUnit && (
                        <span className="text-[10px] font-semibold text-[#9A8A70] uppercase bg-[#FAFAF4] px-1.5 py-0.5 rounded-xs">{item.productUnit}</span>
                      )}
                      <span className="text-xs font-medium text-[#6B6560]">Qty: <span className="font-bold text-[#1A1A1A]">{item.quantity}</span></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display italic text-[#C8922A] text-sm sm:text-base">₹{Number(item.total).toFixed(2)}</p>
                    <p className="text-[10px] text-[#9A8A70] font-medium italic mt-0.5">₹{Number(item.price).toFixed(2)} ea</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price summary card */}
            <div className="bg-[#FAFAF4] border border-[#E8E2D8] p-6 rounded-lg space-y-4 text-left">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
                <CreditCard className="w-4 h-4 text-[#C8922A]" />
                <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1A1A]">Payment Summary</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6560]">Subtotal</span>
                  <span className="font-semibold text-[#1A1A1A]">₹{Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B6560] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#9A8A70]" /> Delivery
                  </span>
                  <span className={`font-bold ${order.shippingCost === 0 ? 'text-green-700' : 'text-[#1A1A1A]'}`}>
                    {order.shippingCost === 0 ? 'FREE' : `₹${Number(order.shippingCost).toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-3 border-t border-[#E8E2D8]">
                  <span className="text-[#1A1A1A]">Total</span>
                  <span className="font-display italic text-[#C8922A] text-base">₹{Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info cards */}
          <div className="space-y-4">
            {/* Delivery address */}
            {(order.address || order.shippingLine1) && (
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
                  <MapPin className="w-4 h-4 text-[#C8922A]" />
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1A1A]">Delivery Address</h3>
                </div>
                <div className="text-xs text-[#6B6560] space-y-1.5">
                  <p className="font-semibold text-[#1A1A1A]">{order.address?.fullName || order.shippingName}</p>
                  <p>{order.address?.line1 || order.shippingLine1}</p>
                  {(order.address?.line2 || order.shippingLine2) && <p>{order.address?.line2 || order.shippingLine2}</p>}
                  <p>{order.address?.city || order.shippingCity}, {order.address?.state || order.shippingState} – {order.address?.pincode || order.shippingPincode}</p>
                  <p className="text-[#9A8A70] font-semibold mt-1">{order.address?.phone || order.shippingPhone}</p>
                </div>
              </div>
            )}

            {/* Payment info */}
            {order.payment && (
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
                  <CreditCard className="w-4 h-4 text-[#C8922A]" />
                  <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1A1A]">Payment</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B6560]">Status</span>
                    <span className={`font-semibold ${
                      order.payment.status === 'PAID' ? 'text-green-700' : 'text-[#C8922A]'
                    }`}>
                      {order.payment.status}
                    </span>
                  </div>
                  {order.payment.method && (
                    <div className="flex justify-between">
                      <span className="text-[#6B6560]">Method</span>
                      <span className="font-semibold text-[#1A1A1A] capitalize">{order.payment.method}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="bg-white border border-[#E8E2D8] rounded-xl p-6 space-y-2 border-l-4 border-l-[#C8922A]">
                <p className="font-semibold text-xs uppercase tracking-wider text-[#1A1A1A]">Order Notes</p>
                <p className="text-xs text-[#6B6560] italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Help section */}
        <div className="bg-[#FAFAF4] border border-[#E8E2D8] rounded-xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-display font-light text-xl text-[#1A1A1A]">Need help with this order?</h3>
            <p className="text-xs text-[#6B6560]">Our village curing facility and support agents are ready to assist you.</p>
          </div>
          <a
            href="mailto:contact@achaarwaala.com"
            className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1A1A] text-white rounded-xs font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all text-center cursor-pointer"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
