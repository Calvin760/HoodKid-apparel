import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'

const Cart = () => {

  const {
    products,
    cartItems,
    currency,
    updateQuantity,
    removeFromCart
  } = useContext(ShopContext)

  // 🔥 BUILD CART DATA
  const cartData = useMemo(() => {
    const items = []

    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId)

      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size]

        if (quantity > 0) {
          items.push({
            ...product,
            size,
            quantity
          })
        }
      }
    }

    return items
  }, [cartItems, products])

  // 🔥 CALCULATE TOTAL
  const subtotal = cartData.reduce((acc, item) => {
    return acc + item.price * item.quantity
  }, 0)

  const delivery = subtotal > 0 ? 100 : 0
  const total = subtotal + delivery

  if (cartData.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="underline">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ================= ITEMS ================= */}
        <div className="lg:col-span-2 space-y-6">

          {cartData.map((item, index) => (
            <div key={index} className="flex gap-6 border-b pb-6">

              {/* IMAGE */}
              <img
                src={item.image[0]}
                className="w-24 h-24 object-cover bg-gray-100"
                alt=""
              />

              {/* INFO */}
              <div className="flex-1">

                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>

                <p className="mt-2">
                  {currency}{item.price}
                </p>

                {/* QUANTITY */}
                <div className="flex items-center gap-3 mt-3">

                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity - 1)
                    }
                    className="px-3 border"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.size, item.quantity + 1)
                    }
                    className="px-3 border"
                  >
                    +
                  </button>

                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className="text-sm text-red-500 mt-3"
                >
                  Remove
                </button>

              </div>

              {/* TOTAL */}
              <div className="font-medium">
                {currency}{item.price * item.quantity}
              </div>

            </div>
          ))}

        </div>

        {/* ================= SUMMARY ================= */}
        <div className="border p-6 h-fit">

          <h2 className="text-lg font-semibold mb-6">Summary</h2>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currency}{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{currency}{delivery}</span>
            </div>

            <div className="flex justify-between font-semibold text-base border-t pt-4">
              <span>Total</span>
              <span>{currency}{total}</span>
            </div>

          </div>

          <Link to="/place-order">
            <button className="w-full bg-black text-white py-4 mt-6">
              Checkout
            </button>
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Cart