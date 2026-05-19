import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

import { ShopContext } from '../context/ShopContext';

const API_URL = import.meta.env.VITE_API_URL;

const resolveImage = (img) =>
  !img ? '' : img.startsWith('http') ? img : `${API_URL}/${img}`;

const DELIVERY_FEE = 50;
const FREE_DELIVERY_THRESHOLD = 1000; // adjust or set to null to disable

/* ============================================================
   CART LINE ITEM
   ============================================================ */
const CartLineItem = ({ item, currency, onUpdateQty, onRemove }) => {
  const lineTotal = item.price * item.quantity;
  const imageSrc = resolveImage(item.image?.[0]);

  const dec = () => onUpdateQty(item._id, item.size, item.color, item.quantity - 1);
  const inc = () => onUpdateQty(item._id, item.size, item.color, item.quantity + 1);
  const remove = () => onRemove(item._id, item.size, item.color);

  return (
    <div className="flex gap-4 border-b border-gray-100 pb-6">
      {/* IMAGE */}
      <Link to={`/product/${item._id}`} className="flex-shrink-0">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          className="w-24 h-24 sm:w-28 sm:h-28 object-cover bg-gray-100"
        />
      </Link>

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item._id}`}>
          <p className="font-bold text-sm sm:text-base hover:underline line-clamp-1">
            {item.name}
          </p>
        </Link>

        <div className="mt-1 text-xs text-gray-500 space-y-0.5">
          <p>Size: <span className="text-gray-900 font-medium">{item.size}</span></p>
          <p>Colour: <span className="text-gray-900 font-medium">{item.color}</span></p>
        </div>

        <p className="mt-2 text-sm font-bold">
          {currency} {item.price}
        </p>

        {/* QUANTITY */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-300">
            <button
              onClick={dec}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="p-2 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FiMinus size={14} strokeWidth={2.5} />
            </button>
            <span className="px-3 text-sm font-bold min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={inc}
              aria-label="Increase quantity"
              className="p-2 hover:bg-gray-100 transition-colors duration-200"
            >
              <FiPlus size={14} strokeWidth={2.5} />
            </button>
          </div>

          <button
            onClick={remove}
            aria-label="Remove item"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors duration-200"
          >
            <FiTrash2 size={14} strokeWidth={2.5} />
            Remove
          </button>
        </div>
      </div>

      {/* LINE TOTAL */}
      <div className="text-sm font-bold whitespace-nowrap">
        {currency} {lineTotal}
      </div>
    </div>
  );
};

/* ============================================================
   ORDER SUMMARY
   ============================================================ */
const OrderSummary = ({ currency, subtotal, delivery, total, onCheckout }) => {
  const freeDeliveryRemaining =
    FREE_DELIVERY_THRESHOLD && subtotal < FREE_DELIVERY_THRESHOLD
      ? FREE_DELIVERY_THRESHOLD - subtotal
      : 0;

  return (
    <div className="border border-gray-200 p-6 lg:sticky lg:top-6 h-fit">
      <h2 className="text-lg font-black tracking-tight mb-6">Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-bold">{currency} {subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-bold">
            {delivery === 0 ? 'FREE' : `${currency} ${delivery}`}
          </span>
        </div>
      </div>

      {freeDeliveryRemaining > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          Add {currency} {freeDeliveryRemaining} more for free delivery.
        </p>
      )}

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <span className="font-bold">Total</span>
        <span className="font-black text-lg">{currency} {total}</span>
      </div>

      <button
        onClick={onCheckout}
        className="w-full mt-6 bg-black text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
      >
        Checkout
      </button>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Taxes calculated at checkout
      </p>
    </div>
  );
};

/* ============================================================
   EMPTY STATE
   ============================================================ */
const EmptyCart = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 text-center">
    <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
      Your bag is empty
    </h2>
    <p className="text-sm text-gray-500 mb-8">
      Looks like you haven&apos;t added anything yet.
    </p>
    <Link
      to="/collection"
      className="inline-block px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
    >
      Continue Shopping
    </Link>
  </div>
);

/* ============================================================
   MAIN
   ============================================================ */
const Cart = () => {
  const navigate = useNavigate();
  const { products, cartItems, currency, updateQuantity, removeFromCart } =
    useContext(ShopContext);
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  // Build flat cart list
  const cartData = useMemo(() => {
    const items = [];
    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        for (const color in cartItems[productId][size]) {
          const quantity = cartItems[productId][size][color];
          if (!quantity) continue;
          items.push({ ...product, size, color, quantity });
        }
      }
    }
    return items;
  }, [cartItems, products]);

  // Totals
  const { subtotal, delivery, total } = useMemo(() => {
    const sub = cartData.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const ship =
      sub === 0
        ? 0
        : FREE_DELIVERY_THRESHOLD && sub >= FREE_DELIVERY_THRESHOLD
          ? 0
          : DELIVERY_FEE;
    return { subtotal: sub, delivery: ship, total: sub + ship };
  }, [cartData]);

  // Quantity update with floor at 1 (use Remove to delete)
  const handleUpdateQty = (id, size, color, newQty) => {
    if (newQty < 1) return;
    updateQuantity(id, size, color, newQty);
  };

  const handleCheckout = () => {
    if (!isSignedIn) {
      openSignIn({
        afterSignInUrl: '/place-order',
        afterSignUpUrl: '/place-order',
      });
      return;
    }
    navigate('/place-order');
  };

  if (cartData.length === 0) return <EmptyCart />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-8">
        Bag
        <span className="ml-3 text-sm font-medium text-gray-500">
          ({cartData.length} {cartData.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-6">
          {cartData.map((item) => (
            <CartLineItem
              key={`${item._id}-${item.size}-${item.color}`}
              item={item}
              currency={currency}
              onUpdateQty={handleUpdateQty}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* SUMMARY */}
        <OrderSummary
          currency={currency}
          subtotal={subtotal}
          delivery={delivery}
          total={total}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
};

export default Cart;