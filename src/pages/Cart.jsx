import React, { useContext, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

const Cart = () => {
  const {
    products,
    cartItems,
    currency,
    updateQuantity,
    removeFromCart
  } = useContext(ShopContext);

  // ================= BUILD CART =================
  const cartData = useMemo(() => {
    const items = [];

    for (const productId in cartItems) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;

      for (const size in cartItems[productId]) {
        for (const color in cartItems[productId][size]) {
          const quantity = cartItems[productId][size][color];

          items.push({
            ...product,
            size,
            color,
            quantity
          });
        }
      }
    }

    return items;
  }, [cartItems, products]);

  // ================= TOTAL =================
  const subtotal = cartData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 50 : 0;
  const total = subtotal + delivery;

  if (cartData.length === 0) {
    return (
      <div className="p-10 text-center">
        Cart is empty
        <br />
        <Link to="/" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl mb-6">Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= ITEMS ================= */}
        <div className="lg:col-span-2 space-y-6">

          {cartData.map((item, i) => (
            <div key={i} className="flex gap-4 border-b pb-4">

              {/* IMAGE */}
              <img
                src={
                  item.image?.[0]?.startsWith("http")
                    ? item.image[0]
                    : `${API_URL}/${item.image?.[0]}`
                }
                className="w-24 h-24 object-cover"
                alt=""
              />

              {/* INFO */}
              <div className="flex-1">

                <p>{item.name}</p>

                <p className="text-sm text-gray-500">
                  Size: {item.size}
                </p>

                <p className="text-sm text-gray-500">
                  Color: {item.color}
                </p>

                <p className="mt-2">
                  {currency}{item.price}
                </p>

                {/* ================= QUANTITY ================= */}
                <div className="flex gap-2 mt-2 items-center">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.size,
                        item.color,
                        item.quantity - 1
                      )
                    }
                    className="px-3 border"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item._id,
                        item.size,
                        item.color,
                        item.quantity + 1
                      )
                    }
                    className="px-3 border"
                  >
                    +
                  </button>

                </div>

                {/* REMOVE */}
                <button
                  onClick={() =>
                    removeFromCart(item._id, item.size, item.color)
                  }
                  className="text-red-500 text-sm mt-2"
                >
                  Remove
                </button>

              </div>

              {/* TOTAL */}
              <div className="font-medium">
                {currency}
                {item.price * item.quantity}
              </div>

            </div>
          ))}

        </div>

        {/* ================= SUMMARY ================= */}
        <div className="border p-6">

          <h2 className="font-semibold mb-4">Summary</h2>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency}{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{currency}{delivery}</span>
          </div>

          <div className="flex justify-between font-bold mt-4">
            <span>Total</span>
            <span>{currency}{total}</span>
          </div>

          <Link to="/place-order">
            <button className="w-full bg-black text-white py-3 mt-6">
              Checkout
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Cart;