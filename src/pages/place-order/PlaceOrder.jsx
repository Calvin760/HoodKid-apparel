import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { FiArrowLeft, FiLock, FiTruck, FiMapPin, FiShield } from 'react-icons/fi';

import { useCartSummary } from './useCartSummary';
import { useOrderForm } from './useOrderForm';
import { validateOrder } from './orderValidation';
import { submitPayfastPayment } from './payfast';
import { DELIVERY_FEE, DELIVERY_METHODS } from './constants';
import { ShopContext } from '../../context/ShopContext';

const API_URL = import.meta.env.VITE_API_URL;

const PICKUP_LOCATION = {
    name: 'HOODKID Store',
    address: 'Mabopane Station, Pretoria, South Africa',
    readyIn: 'Ready within 24 hours',
};

/* ============================================================
   FIELD
   ============================================================ */
const Field = ({
    label,
    name,
    value,
    onChange,
    required,
    type = 'text',
    as = 'input',
    placeholder,
    disabled,
}) => {
    const Component = as;
    return (
        <label className="block">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
                {label} {required && <span className="text-black">*</span>}
            </span>
            <Component
                name={name}
                type={type}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                rows={as === 'textarea' ? 3 : undefined}
                className={`mt-2 w-full border border-gray-300 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors duration-200 disabled:bg-gray-50 ${as === 'textarea' ? 'resize-none' : ''
                    }`}
            />
        </label>
    );
};

/* ============================================================
   SECTION HEADING
   ============================================================ */
const SectionHeading = ({ step, title, hint }) => (
    <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-1">
            <span className="w-7 h-7 rounded-full bg-black text-white text-xs font-black flex items-center justify-center">
                {step}
            </span>
            <h2 className="text-lg sm:text-xl font-black tracking-tight uppercase">
                {title}
            </h2>
        </div>
        {hint && <p className="text-sm text-gray-500 ml-10">{hint}</p>}
    </div>
);

/* ============================================================
   DELIVERY METHOD CARDS
   ============================================================ */
const DeliveryMethodCards = ({ value, onChange }) => {
    const methods = [
        {
            id: DELIVERY_METHODS.DELIVERY,
            icon: FiTruck,
            label: 'Delivery',
            sub: `R${DELIVERY_FEE} · 2-5 business days`,
        },
        {
            id: DELIVERY_METHODS.PICKUP,
            icon: FiMapPin,
            label: 'Pickup',
            sub: 'FREE · Ready in 24 hours',
        },
    ];

    return (
        <div role="radiogroup" aria-label="Delivery method" className="grid grid-cols-2 gap-3">
            {methods.map(({ id, icon: Icon, label, sub }) => {
                const selected = value === id;
                return (
                    <button
                        key={id}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => onChange(id)}
                        className={`text-left p-4 border-2 transition-colors duration-200 ${selected ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <Icon size={20} strokeWidth={2.5} className="mb-2" />
                        <p className="font-black uppercase tracking-wide text-sm">{label}</p>
                        <p className={`text-xs mt-1 ${selected ? 'text-white/70' : 'text-gray-500'}`}>
                            {sub}
                        </p>
                    </button>
                );
            })}
        </div>
    );
};

/* ============================================================
   MAIN
   ============================================================ */
const PlaceOrder = () => {
    const { cartItems, products, currency } = useContext(ShopContext);
    const { getToken } = useAuth();
    const { openSignIn } = useClerk();

    const [deliveryMethod, setDeliveryMethod] = useState(DELIVERY_METHODS.DELIVERY);
    const [submitting, setSubmitting] = useState(false);

    const { items, subtotal, delivery, total } = useCartSummary(
        cartItems,
        products,
        deliveryMethod
    );

    const { form, handleChange } = useOrderForm();

    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const isDelivery = deliveryMethod === DELIVERY_METHODS.DELIVERY;

    const handlePlaceOrder = async () => {
        try {
            const token = await getToken();

            if (!token) {
                openSignIn({
                    afterSignInUrl: window.location.pathname,
                    afterSignUpUrl: window.location.pathname,
                });
                return;
            }

            const error = validateOrder({
                cartItems: items,
                form,
                deliveryMethod,
            });

            if (error) {
                toast.error(error);
                return;
            }

            setSubmitting(true);

            const { data } = await axios.post(
                `${API_URL}/api/payfast/create-payment`,
                { cartData: items, form, subtotal, total, deliveryMethod },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (!data?.orderId) throw new Error('No orderId returned from server');

            submitPayfastPayment({ orderId: data.orderId, total });
            // No setSubmitting(false) — navigating to PayFast
        } catch (err) {
            console.error('Place order failed:', err);
            toast.error(err.response?.data?.message || err.message || 'Failed to initiate payment');
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            {/* HEADER */}
            <div className="mb-10 sm:mb-12">
                <Link
                    to="/cart"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mb-4 transition-colors duration-200"
                >
                    <FiArrowLeft size={14} strokeWidth={2.5} />
                    Back to Bag
                </Link>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                    Checkout
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'} · {currency} {total}
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
                {/* LEFT: FORM */}
                <div className="lg:col-span-2 space-y-12">
                    {/* STEP 1 — DELIVERY METHOD */}
                    <section>
                        <SectionHeading
                            step="1"
                            title="Delivery Method"
                            hint="Choose how you'd like to receive your order"
                        />
                        <DeliveryMethodCards value={deliveryMethod} onChange={setDeliveryMethod} />
                    </section>

                    {/* STEP 2 — CONTACT */}
                    <section>
                        <SectionHeading
                            step="2"
                            title="Contact Details"
                            hint="We'll send your order confirmation here"
                        />
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <Field
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    disabled={submitting}
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <Field
                                label="Email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                placeholder="jane@example.com"
                            />
                            <Field
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                disabled={submitting}
                                placeholder="+27 12 345 6789"
                            />
                        </div>
                    </section>

                    {/* STEP 3 — ADDRESS OR PICKUP */}
                    <section>
                        <SectionHeading
                            step="3"
                            title={isDelivery ? 'Shipping Address' : 'Pickup Location'}
                            hint={
                                isDelivery
                                    ? 'Where should we send your order?'
                                    : 'Collect your order here'
                            }
                        />

                        {isDelivery ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Address"
                                        name="address"
                                        as="textarea"
                                        value={form.address}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                        placeholder="Street, suburb, building..."
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Field
                                        label="City"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        required
                                        disabled={submitting}
                                        placeholder="Johannesburg"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Delivery Notes (optional)"
                                        name="notes"
                                        as="textarea"
                                        value={form.notes}
                                        onChange={handleChange}
                                        disabled={submitting}
                                        placeholder="Gate code, leave with neighbour, etc."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="border border-gray-200 p-5 flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <FiMapPin size={20} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <p className="font-black uppercase tracking-wide text-sm">
                                        {PICKUP_LOCATION.name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{PICKUP_LOCATION.address}</p>
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-3">
                                        {PICKUP_LOCATION.readyIn}
                                    </p>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT: ORDER SUMMARY */}
                <aside className="lg:sticky lg:top-24 h-fit">
                    <div className="bg-gray-50 border border-gray-200 p-6">
                        <h2 className="text-sm font-black uppercase tracking-widest mb-5 pb-4 border-b border-gray-200">
                            Order Summary
                        </h2>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-5">
                            {items.map((item) => (
                                <div
                                    key={`${item.productId}-${item.size}-${item.color}`}
                                    className="flex justify-between text-sm gap-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold truncate">{item.name}</p>
                                        {(item.size || item.color) && (
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.size}{item.size && item.color ? ' · ' : ''}{item.color} × {item.quantity}
                                            </p>
                                        )}
                                    </div>
                                    <span className="font-bold whitespace-nowrap">
                                        {currency} {item.price * item.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 pt-5 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold">{currency} {subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Delivery</span>
                                <span className="font-bold">
                                    {!isDelivery
                                        ? 'FREE'
                                        : delivery === 0
                                            ? '—'
                                            : `${currency} ${delivery}`}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-baseline mt-5 pt-5 border-t border-gray-200">
                            <span className="text-sm font-bold uppercase tracking-wide">Total</span>
                            <span className="text-2xl font-black tracking-tight">
                                {currency} {total}
                            </span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={submitting || items.length === 0}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            <FiLock size={14} strokeWidth={2.5} />
                            {submitting ? 'Processing...' : `Pay ${currency} ${total}`}
                        </button>

                        {/* TRUST INDICATORS */}
                        <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FiShield size={14} strokeWidth={2.5} className="flex-shrink-0" />
                                <span>Secure payment via PayFast</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <FiTruck size={14} strokeWidth={2.5} className="flex-shrink-0" />
                                <span>Free returns within 14 days</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PlaceOrder;