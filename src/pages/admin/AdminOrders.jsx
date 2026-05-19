import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import { FiSearch } from 'react-icons/fi';

import Loading from '../../components/Loading';

const API_URL = import.meta.env.VITE_API_URL;

const STATUS_FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'paid', label: 'Paid' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Failed' },
];

const AdminOrders = () => {
    const { getToken } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const token = await getToken();
                const { data } = await axios.get(`${API_URL}/api/orders/admin`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (cancelled) return;
                const sorted = (data.orders || []).sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sorted);
            } catch (err) {
                if (cancelled) return;
                console.error('Fetch admin orders failed:', err);
                toast.error('Could not load orders');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [getToken]);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return orders
            .filter((o) =>
                statusFilter === 'all' ? true : o.paymentStatus?.toLowerCase() === statusFilter
            )
            .filter((o) => {
                if (!q) return true;
                return (
                    o._id?.toLowerCase().includes(q) ||
                    o.orderNumber?.toLowerCase().includes(q) ||
                    o.shippingInfo?.name?.toLowerCase().includes(q) ||
                    o.shippingInfo?.phone?.includes(q) ||
                    o.shippingInfo?.email?.toLowerCase().includes(q)
                );
            });
    }, [orders, search, statusFilter]);

    const counts = useMemo(() => {
        const c = { all: orders.length, paid: 0, pending: 0, failed: 0 };
        orders.forEach((o) => {
            const s = o.paymentStatus?.toLowerCase();
            if (s in c) c[s]++;
        });
        return c;
    }, [orders]);

    if (loading) return <Loading text="Loading orders..." />;

    return (
        <div>
            {/* SEARCH + FILTERS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                    <FiSearch
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search by ID, order#, name, phone, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                </div>

                <div className="flex gap-1">
                    {STATUS_FILTERS.map((f) => {
                        const selected = statusFilter === f.id;
                        return (
                            <button
                                key={f.id}
                                onClick={() => setStatusFilter(f.id)}
                                className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wide border whitespace-nowrap transition-colors duration-200 ${selected ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                                    }`}
                            >
                                {f.label}
                                <span className={selected ? 'text-white/70' : 'text-gray-400'}>
                                    ({counts[f.id] ?? 0})
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-center text-gray-500 py-12 text-sm">No orders match.</p>
            ) : (
                <div className="space-y-4">
                    {filtered.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

const OrderCard = ({ order }) => {
    const date = new Date(order.createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const paymentColor =
        order.paymentStatus?.toLowerCase() === 'paid'
            ? 'text-green-700 bg-green-50'
            : order.paymentStatus?.toLowerCase() === 'pending'
                ? 'text-yellow-700 bg-yellow-50'
                : 'text-red-700 bg-red-50';

    return (
        <article className="border border-gray-200 rounded-lg overflow-hidden">
            <header className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-500 mb-1">{date}</p>
                    <p className="font-bold text-sm">
                        {order.orderNumber || `#${order._id?.slice(-8)}`}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${paymentColor}`}
                    >
                        {order.paymentStatus}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-gray-700 bg-gray-100">
                        {order.deliveryMethod || 'N/A'}
                    </span>
                    <span className="font-bold">R {order.total}</span>
                </div>
            </header>

            <div className="p-5 grid sm:grid-cols-2 gap-5 text-sm">
                {/* CUSTOMER */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Customer
                    </p>
                    <p className="font-bold">{order.shippingInfo?.name || 'No name'}</p>
                    {order.shippingInfo?.email && (
                        <p className="text-gray-600">
                            <a href={`mailto:${order.shippingInfo.email}`} className="hover:underline">
                                {order.shippingInfo.email}
                            </a>
                        </p>
                    )}
                    {order.shippingInfo?.phone && (
                        <p className="text-gray-600">
                            <a href={`tel:${order.shippingInfo.phone}`} className="hover:underline">
                                {order.shippingInfo.phone}
                            </a>
                        </p>
                    )}
                    {order.deliveryMethod === 'delivery' && order.shippingInfo?.address && (
                        <p className="text-gray-600 mt-2">
                            {order.shippingInfo.address}
                            {order.shippingInfo.city && `, ${order.shippingInfo.city}`}
                        </p>
                    )}
                    {order.deliveryMethod === 'pickup' && (
                        <p className="text-blue-600 mt-2 text-xs font-bold uppercase tracking-wide">
                            Customer collection
                        </p>
                    )}
                </div>

                {/* ITEMS */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                        Items ({order.items?.length || 0})
                    </p>
                    <div className="space-y-1">
                        {order.items?.map((i, idx) => (
                            <p key={idx} className="text-gray-700">
                                {i.name}
                                <span className="text-gray-500"> · {i.size} · {i.color} × {i.quantity}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default AdminOrders;