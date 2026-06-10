import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package, ChevronRight, Clock, Truck, CheckCircle,
  XCircle, RefreshCw, ShoppingBag
} from 'lucide-react';
import { ordersApi } from '../api';
import toast from 'react-hot-toast';

const ORDER_STATUS_FILTERS = [
  { value: '',           label: 'All Orders' },
  { value: 'PENDING',    label: 'Pending' },
  { value: 'CONFIRMED',  label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED',    label: 'Shipped' },
  { value: 'DELIVERED',  label: 'Delivered' },
  { value: 'CANCELLED',  label: 'Cancelled' },
];

function StatusBadge({ status }) {
  const map = {
    PENDING:    { bg: 'bg-[#F2EDE0] text-[#9A8A70]', border: 'border-[#E8E2D8]', icon: Clock, label: 'Pending' },
    CONFIRMED:  { bg: 'bg-blue-50 text-blue-700', border: 'border-blue-200', icon: CheckCircle, label: 'Confirmed' },
    PROCESSING: { bg: 'bg-[#FAFAF4] text-[#C8922A]', border: 'border-[#E8E2D8]', icon: RefreshCw, label: 'Processing' },
    SHIPPED:    { bg: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200', icon: Truck, label: 'Shipped' },
    DELIVERED:  { bg: 'bg-green-50 text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'Delivered' },
    CANCELLED:  { bg: 'bg-red-50 text-red-700', border: 'border-red-200', icon: XCircle, label: 'Cancelled' },
  };
  const s = map[status] || map.PENDING;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-[10px] font-semibold uppercase tracking-wider border ${s.bg} ${s.border} ${s.text}`}>
      <Icon className="w-3 h-3" /> {s.label}
    </span>
  );
}

function OrderCard({ order, onCancel }) {
  const navigate = useNavigate();
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const firstItem = order.items?.[0];
  const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-xl hover:border-[#C8922A] transition-all duration-300 overflow-hidden shadow-none text-left">
      <div className="flex items-center justify-between p-4 border-b border-[#E8E2D8] bg-[#FAFAF4]">
        <div className="min-w-0">
          <p className="text-[9px] font-semibold text-[#9A8A70] uppercase tracking-wider mb-1">Order Ref</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-[#1A1A1A] text-xs tracking-tight">{order.orderNumber}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8E2D8] hidden xs:block" />
            <span className="text-xs font-medium text-[#6B6560]">{formattedDate}</span>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="p-4 sm:p-5 flex gap-4">
        {firstItem?.product?.images?.[0] ? (
          <img
            src={firstItem.product.images[0].url}
            alt={firstItem.productName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover bg-[#FAFAF4] border border-[#E8E2D8] shrink-0"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md bg-[#FAFAF4] border border-[#E8E2D8] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-8 h-8 text-[#9A8A70]" />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p className="font-display font-light text-[#1A1A1A] text-sm sm:text-base leading-tight line-clamp-2 mb-1.5">
            {firstItem?.productName}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-[#9A8A70] uppercase tracking-wider bg-[#F2EDE0] px-2 py-0.5 rounded-xs">
              {itemCount} Jar{itemCount !== 1 ? 's' : ''}
            </span>
            {order.items.length > 1 && (
              <span className="text-[10px] font-semibold text-[#6B6560]">+{order.items.length - 1} more</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0 flex flex-col justify-center">
          <p className="text-[9px] font-semibold text-[#9A8A70] uppercase tracking-wider mb-1">Total</p>
          <p className="font-display italic text-base sm:text-xl text-[#C8922A]">₹{Number(order.total).toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-[#E8E2D8] bg-[#FAFAF4]">
        <div className="min-w-0">
          {order.trackingNumber ? (
            <div className="flex items-center gap-1.5 text-xs text-[#6B6560]">
              <Truck className="w-3.5 h-3.5 text-[#C8922A]" />
              <span className="font-mono font-bold text-[#1A1A1A] truncate max-w-[120px] sm:max-w-none">{order.trackingNumber}</span>
            </div>
          ) : (
             <p className="text-[9px] font-semibold text-[#9A8A70] uppercase tracking-wider">Awaiting Dispatch</p>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-3">
          {canCancel && (
            <button
              onClick={(e) => { e.stopPropagation(); onCancel(order.id); }}
              className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded-xs transition-colors uppercase tracking-wider cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="group flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A] hover:text-[#C8922A] transition-colors uppercase tracking-widest cursor-pointer"
          >
            Details <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="bg-white border border-[#E8E2D8] rounded-xl p-4 sm:p-6 md:p-8 animate-pulse space-y-4">
      <div className="flex justify-between items-center pb-4 border-b border-[#E8E2D8]">
        <div className="h-4 bg-[#E8E2D8]/50 rounded w-1/3" />
        <div className="h-6 bg-[#E8E2D8]/50 rounded w-16" />
      </div>
      <div className="h-20 bg-[#E8E2D8]/30 rounded-lg" />
    </div>
  );
}

export default function Orders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 8;

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (statusFilter) params.status = statusFilter;
      
      const { data } = await ordersApi.myOrders(params);
      setItems(data.data || []);
      setTotal(data.meta?.total || 0);
    } catch {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    setPage(1);
    setStatusFilter('');
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const cancelOrder = async (id) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersApi.cancel(id);
      toast.success('Order cancelled successfully');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-[#FAFAF4] pt-24 md:pt-32 pb-24 px-4 luxury-grain relative overflow-hidden text-[#6B6560]">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#6B6560]/80 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-10">
          <Link to="/" className="hover:text-[#C8922A] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <Link to="/account" className="hover:text-[#C8922A] transition-colors">Account</Link>
          <ChevronRight className="w-3 h-3 text-[#E8E2D8]" />
          <span className="text-[#1A1A1A]">Order History</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12 text-left">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-light text-[#1A1A1A] leading-tight">
              Order <span className="italic text-[#C8922A]">History</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-8 bg-[#C8922A]" />
              <p className="text-xs text-[#6B6560]/80 font-medium uppercase tracking-widest">Track and manage reservations</p>
            </div>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center p-1.5 bg-[#F2EDE0] border border-[#E8E2D8] rounded-xs mb-12 overflow-x-auto no-scrollbar whitespace-nowrap gap-1">
          {ORDER_STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => { setStatusFilter(value); setPage(1); }}
              className={`px-5 py-2.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer ${
                statusFilter === value 
                  ? 'bg-[#1A1A1A] text-white' 
                  : 'text-[#6B6560] hover:text-[#1A1A1A] hover:bg-[#FAFAF4]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <OrderSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-[#E8E2D8] p-16 md:p-24 text-center rounded-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[#FAFAF4] border border-[#E8E2D8] rounded-full flex items-center justify-center mx-auto mb-6 text-[#C8922A]">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-light text-[#1A1A1A] mb-2">
                {statusFilter ? 'No orders with this status' : 'No Orders Found'}
              </h3>
              <p className="text-[#6B6560] text-xs mb-8 max-w-xs mx-auto leading-relaxed">
                {statusFilter ? 'Try clearing the status filter or select another one.' : 'You have not reserved any pickle jars yet.'}
              </p>
              {!statusFilter && (
                <Link to="/products" className="btn-primary py-3.5 px-8 text-xs tracking-[0.12em]">
                  Start Shopping
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {items.map((item) => (
                <OrderCard key={item.id} order={item} onCancel={cancelOrder} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-3 rounded-xs border border-[#E8E2D8] bg-white text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider hover:bg-[#FAFAF4] disabled:opacity-40 transition-all cursor-pointer"
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xs text-xs font-semibold transition-all border cursor-pointer ${
                      page === p
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-[#6B6560] border-[#E8E2D8] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-3 rounded-xs border border-[#E8E2D8] bg-white text-[#1A1A1A] font-semibold text-xs uppercase tracking-wider hover:bg-[#FAFAF4] disabled:opacity-40 transition-all cursor-pointer"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
