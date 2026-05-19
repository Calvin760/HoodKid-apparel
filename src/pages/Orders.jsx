import { useContext, useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiAlertCircle,
} from 'react-icons/fi';

import { ShopContext } from '../context/ShopContext';
import Loading from '../components/Loading';

const API_URL = import.meta.env.VITE_API_URL;

/* ============================================================
   STATUS BADGES
   ============================================================ */
const PAYMENT_STATUS = {
  paid: { label: 'Paid', icon: FiCheckCircle, className: 'text-green-700 bg-green-50' },
  pending: { label: 'Pending', icon: FiClock, className: 'text-yellow-700 bg-yellow-50' },
  failed: { label: 'Failed', icon: FiXCircle, className: 'text-red-700 bg-red-50' },
  cancelled: { label: 'Cancelled', icon: FiXCircle, className: 'text-gray-700 bg-gray-100' },
};

const DELIVERY_STATUS = {
  processing: { label: 'Processing', icon: FiClock },
  shipped: { label: 'Shipped', icon: FiTruck },
  delivered: { label: 'Delivered', icon: FiCheckCircle },
  cancelled: { label: 'Cancelled', icon: FiXCircle },
};

const StatusBadge = ({ status, dictionary, prefix }) => {
  const entry = dictionary[status?.toLowerCase()] || {
    label: status || 'Unknown',
    icon: FiAlertCircle,
    className: 'text-gray-700 bg-gray-100',
  };
  const Icon = entry.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${entry.className || 'text-gray-700 bg-gray-100'}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {prefix && <span className="font-normal normal-case">{prefix}:</span>}
      {entry.label}
    </span>
  );
};

/* ============================================================
   ORDER FILTER TABS
   ============================================================ */
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'paid', label: 'Paid' },
  { id: 'pending', label: 'Pending' },
  { id: 'failed', label: 'Failed' },
];

const OrderFilters = ({ active, onChange, counts }) => (
  <div role="tablist" className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
    {FILTERS.map((f) => {
      const selected = active === f.id;
      const count = counts[f.id] ?? 0;
      return (
        <button
          key={f.id}
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(f.id)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap border transition-colors duration-200 ${selected
              ? 'bg-black text-white border-black'
              : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
            }`}
        >
          {f.label}
          <span className={selected ? 'text-white/70' : 'text-gray-400'}>({count})</span>
        </button>
      );
    })}
  </div>
);

/* ============================================================
   ORDER CARD
   ============================================================ */
const OrderCard = ({ order, currency }) => {
  const date = new Date(order.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const paymentPending = order.paymentStatus?.toLowerCase() === 'pending';
  const paymentFailed = order.paymentStatus?.toLowerCase() === 'failed';
  const canRetryPayment = paymentPending || paymentFailed;

  const itemCount = order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden">
      {/* HEADER */}
      <header className="px-5 sm:px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            Order · {date}
          </p>
          <p className="font-bold text-sm">
            {order.orderNumber || `#${order._id?.slice(-8)}`}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            status={order.paymentStatus}
            dictionary={PAYMENT_STATUS}
            prefix="Payment"
          />
          {order.paymentStatus?.toLowerCase() === 'paid' && (
            <StatusBadge status={order.status} dictionary={DELIVERY_STATUS} prefix="Delivery" />
          )}
        </div>
      </header>

      {/* PAYMENT BANNER */}
      {canRetryPayment && (
        <div
          className={`px-5 sm:px-6 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${paymentFailed ? 'bg-red-50' : 'bg-yellow-50'
            }`}
        >
          <p className="text-sm">
            {paymentFailed
              ? 'Payment failed. You can retry now.'
              : 'Awaiting payment. Complete checkout to confirm your order.'}
          </p>
          <Link
            to={`/payment/retry/${order._id}`}
            className="text-xs font-bold uppercase tracking-wide bg-black text-white px-4 py-2 hover:bg-gray-900 transition-colors duration-200 whitespace-nowrap"
          >
            {paymentFailed ? 'Retry Payment' : 'Complete Payment'}
          </Link>
        </div>
      )}

      {/* BODY */}
      <div className="p-5 sm:p-6 space-y-5">
        {/* SHIPPING */}
        {order.shippingInfo && (
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
              Shipping To
            </p>
            <p className="font-bold">{order.shippingInfo.name}</p>
            <p className="text-gray-600">
              {[
                order.shippingInfo.address,
                order.shippingInfo.city,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
            {order.shippingInfo.phone && (
              <p className="text-gray-600">{order.shippingInfo.phone}</p>
            )}
          </div>
        )}

        {/* ITEMS */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </p>
          <div className="space-y-2">
            {order.items?.map((item, i) => (
              <div
                key={`${item.productId || item._id || i}-${item.size}-${item.color}`}
                className="flex justify-between text-sm gap-3"
              >
                <span className="text-gray-700 min-w-0">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500">
                    {item.size && ` · ${item.size}`}
                    {item.color && ` · ${item.color}`}
                    {' × '}{item.quantity}
                  </span>
                </span>
                <span className="font-bold whitespace-nowrap">
                  {currency} {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TOTAL */}
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
          <span className="text-sm font-bold">Total</span>
          <span className="font-black text-lg">
            {currency} {order.total}
          </span>
        </div>
      </div>
    </article>
  );
};

/* ============================================================
   EMPTY STATES
   ============================================================ */
const EmptyState = ({ title, body, ctaLabel = 'Continue Shopping', ctaTo = '/collection' }) => (
  <div className="max-w-4xl mx-auto px-6 py-20 text-center">
    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
      <FiPackage size={28} strokeWidth={2} className="text-gray-400" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">{title}</h2>
    {body && <p className="text-sm text-gray-500 mb-8">{body}</p>}
    <Link
      to={ctaTo}
      className="inline-block px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
    >
      {ctaLabel}
    </Link>
  </div>
);

/* ============================================================
   MAIN
   ============================================================ */
const Orders = () => {
  const { currency } = useContext(ShopContext);
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setError(null);
        const token = await getToken();
        const { data } = await axios.get(`${API_URL}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;

        if (data.success) {
          const sorted = (data.orders || []).sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sorted);
        } else {
          setError(data.message || 'Could not load orders');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Fetch orders failed:', err);
        setError('Could not load your orders. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  const counts = useMemo(() => {
    const c = { all: orders.length, paid: 0, pending: 0, failed: 0 };
    orders.forEach((o) => {
      const s = o.paymentStatus?.toLowerCase();
      if (s in c) c[s]++;
    });
    return c;
  }, [orders]);

  const visibleOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((o) => o.paymentStatus?.toLowerCase() === filter);
  }, [orders, filter]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading text="Loading your orders..." />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <EmptyState
        title="Sign in to view your orders"
        body="You'll need to be signed in to see your order history."
        ctaLabel="Sign In"
        ctaTo="/account"
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Something went wrong"
        body={error}
        ctaLabel="Try Again"
        ctaTo="/orders"
      />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        body="When you place an order, it'll show up here."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          My Orders
          <span className="ml-3 text-sm font-medium text-gray-500">
            ({orders.length} total)
          </span>
        </h1>
      </header>

      <OrderFilters active={filter} onChange={setFilter} counts={counts} />

      {visibleOrders.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-12">
          No {filter} orders.
        </p>
      ) : (
        <div className="space-y-6">
          {visibleOrders.map((order) => (
            <OrderCard key={order._id} order={order} currency={currency} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;