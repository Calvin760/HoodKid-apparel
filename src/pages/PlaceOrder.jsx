import { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';

import { ShopContext } from '../context/ShopContext';

const API_URL = import.meta.env.VITE_API_URL;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
const PAYFAST_PROCESS_URL = import.meta.env.VITE_PAYFAST_PROCESS_URL;
const PAYFAST_MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID;
const PAYFAST_MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY;

const DELIVERY_FEE = 80;
const PICKUP_LOCATION = {
  name: 'HOODKID Store',
  address: 'Mabopane Station, Pretoria, South Africa',
  readyIn: 'Ready within 24 hours',
};

/* ============================================================
   HELPERS
   ============================================================ */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const submitPayfastForm = ({ orderId, total }) => {
  const formEl = document.createElement('form');
  formEl.method = 'POST';
  formEl.action = PAYFAST_PROCESS_URL;

  const fields = {
    merchant_id: PAYFAST_MERCHANT_ID,
    merchant_key: PAYFAST_MERCHANT_KEY,
    return_url: `${FRONTEND_URL}/payment-success`,
    cancel_url: `${FRONTEND_URL}/cancel`,
    notify_url: `${API_URL}/api/payfast/notify`,
    m_payment_id: orderId,
    amount: Number(total).toFixed(2),
    item_name: 'Order Payment',
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    formEl.appendChild(input);
  });

  document.body.appendChild(formEl);
  formEl.submit();
};

/* ============================================================
   INPUT FIELD (reduces repetition)
   ============================================================ */
const Field = ({ label, name, value, onChange, required, type = 'text', as = 'input', placeholder }) => {
  const Component = as;
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <Component
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={as === 'textarea' ? 3 : undefined}
        className="mt-1 w-full border border-gray-300 p-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none transition-colors duration-200"
      />
    </label>
  );
};

/* ============================================================
   DELIVERY TOGGLE
   ============================================================ */
const DeliveryToggle = ({ value, onChange }) => (
  <div role="radiogroup" aria-label="Delivery method" className="bg-gray-100 p-1 flex w-fit mb-8">
    {['delivery', 'pickup'].map((method) => {
      const selected = value === method;
      return (
        <button
          key={method}
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(method)}
          className={`px-5 py-2 text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${selected ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
        >
          {method === 'delivery' ? 'Delivery' : 'Pickup'}
        </button>
      );
    })}
  </div>
);

/* ============================================================
   MAIN
   ============================================================ */
const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cartItems, products, currency } = useContext(ShopContext);
  const { getToken, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    address: '',
    city: '',
    notes: '',
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Build cart
  const productMap = useMemo(
    () => products.reduce((acc, p) => ({ ...acc, [p._id]: p }), {}),
    [products]
  );

  const cartData = useMemo(() => {
    const items = [];
    for (const productId in cartItems) {
      const product = productMap[productId];
      if (!product) continue;

      for (const size in cartItems[productId]) {
        for (const color in cartItems[productId][size]) {
          const quantity = cartItems[productId][size][color];
          if (!quantity) continue;
          items.push({
            productId,
            name: product.name,
            price: product.price,
            size,
            color,
            quantity,
          });
        }
      }
    }
    return items;
  }, [cartItems, productMap]);

  // Totals
  const { subtotal, delivery, total } = useMemo(() => {
    const sub = cartData.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const ship = deliveryMethod === 'delivery' && sub > 0 ? DELIVERY_FEE : 0;
    return { subtotal: sub, delivery: ship, total: sub + ship };
  }, [cartData, deliveryMethod]);

  // Validation
  const validate = () => {
    if (cartData.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return false;
    }
    if (!form.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!form.email.trim() || !isValidEmail(form.email)) {
      toast.error('Please enter a valid email');
      return false;
    }
    if (!form.phone.trim()) {
      toast.error('Phone is required');
      return false;
    }
    if (deliveryMethod === 'delivery') {
      if (!form.address.trim()) {
        toast.error('Address is required for delivery');
        return false;
      }
      if (!form.city.trim()) {
        toast.error('City is required for delivery');
        return false;
      }
    }
    return true;
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (!isSignedIn) {
      openSignIn({
        afterSignInUrl: '/place-order',
        afterSignUpUrl: '/place-order',
      });
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    try {
      const token = await getToken();

      const { data } = await axios.post(
        `${API_URL}/api/payfast/create-payment`,
        { cartData, form, total, subtotal, deliveryMethod },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!data?.orderId) throw new Error('No orderId returned from server');

      submitPayfastForm({ orderId: data.orderId, total });
      // No setSubmitting(false) here — page is navigating to PayFast
    } catch (err) {
      console.error('Place order failed:', err);
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">
        Checkout
      </h1>

      <DeliveryToggle value={deliveryMethod} onChange={setDeliveryMethod} />

      <div className="grid lg:grid-cols-2 gap-10">
        {/* FORM */}
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-black tracking-tight">
              {deliveryMethod === 'delivery' ? 'Delivery Details' : 'Pickup Details'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {deliveryMethod === 'delivery'
                ? 'Enter your delivery information'
                : 'Enter your details for pickup confirmation'}
            </p>
          </div>

          {/* CONTACT */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-black uppercase tracking-widest mb-2">
              Contact
            </legend>
            <Field
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Jane Doe"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="jane@example.com"
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="+27 12 345 6789"
            />
          </fieldset>

          {/* DELIVERY-ONLY */}
          {deliveryMethod === 'delivery' && (
            <fieldset className="space-y-4">
              <legend className="text-sm font-black uppercase tracking-widest mb-2">
                Shipping Address
              </legend>
              <Field
                label="Address"
                name="address"
                as="textarea"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="Street, suburb, building, etc."
              />
              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="Johannesburg"
              />
              <Field
                label="Delivery Notes (optional)"
                name="notes"
                as="textarea"
                value={form.notes}
                onChange={handleChange}
                placeholder="Gate code, leave with neighbour, etc."
              />
            </fieldset>
          )}

          {/* PICKUP-ONLY */}
          {deliveryMethod === 'pickup' && (
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">
                Pickup Location
              </h3>
              <div className="border border-gray-200 p-4">
                <p className="font-bold">{PICKUP_LOCATION.name}</p>
                <p className="text-sm text-gray-500 mt-1">{PICKUP_LOCATION.address}</p>
                <p className="text-sm text-gray-500 mt-2">{PICKUP_LOCATION.readyIn}</p>
              </div>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="lg:sticky lg:top-20 h-fit border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-black tracking-tight">Order Summary</h2>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cartData.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex justify-between text-sm gap-3"
              >
                <span className="truncate">
                  {item.name}
                  <span className="text-gray-500"> · {item.size} · {item.color} × {item.quantity}</span>
                </span>
                <span className="font-bold whitespace-nowrap">
                  {currency} {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-bold">{currency} {subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery</span>
              <span className="font-bold">
                {deliveryMethod === 'pickup'
                  ? 'FREE'
                  : delivery === 0
                    ? '—'
                    : `${currency} ${delivery}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-bold">Total</span>
              <span className="font-black text-lg">{currency} {total}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={submitting || cartData.length === 0}
            className="w-full bg-black text-white py-3 mt-4 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {submitting ? 'Processing…' : `Pay ${currency} ${total}`}
          </button>

          <p className="text-xs text-gray-400 text-center">
            You&apos;ll be redirected to PayFast to complete payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;