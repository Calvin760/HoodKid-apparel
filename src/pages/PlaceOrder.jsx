import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const { cartItems, products, currency } = useContext(ShopContext)

  // 🔥 SAME CART LOGIC AS CART PAGE
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

  const subtotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const delivery = subtotal > 0 ? 100 : 0
  const total = subtotal + delivery

  // 🔥 CUSTOMER FORM
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = () => {

    if (!form.name || !form.phone || !form.address) {
      toast.error("Fill required fields")
      return
    }

    const orderData = {
      customer: form,
      items: cartData,
      subtotal,
      delivery,
      total
    }

    console.log("FINAL ORDER:", orderData)

    // 👉 NEXT: PayFast integration here
  }

  if (cartData.length === 0) {
    return <div className="p-10 text-center">No items in cart</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">

      {/* ================= DELIVERY FORM ================= */}
      <div className="space-y-6">

        <h2 className="text-xl font-semibold">Delivery Info</h2>

        <input name="name" onChange={handleChange} placeholder="Full Name *" className="w-full border p-3" />
        <input name="phone" onChange={handleChange} placeholder="Phone Number *" className="w-full border p-3" />

        <textarea name="address" onChange={handleChange} placeholder="Delivery Address *" className="w-full border p-3 h-24" />

        <input name="city" onChange={handleChange} placeholder="City" className="w-full border p-3" />

        <textarea name="notes" onChange={handleChange} placeholder="Notes (gate code, etc.)" className="w-full border p-3 h-20" />

      </div>

      {/* ================= ORDER SUMMARY ================= */}
      <div className="border p-6 h-fit">

        <h2 className="text-lg font-semibold mb-6">Your Order</h2>

        <div className="space-y-4 text-sm">

          {cartData.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.name} ({item.size}) x {item.quantity}
              </span>
              <span>{currency}{item.price * item.quantity}</span>
            </div>
          ))}

        </div>

        <div className="border-t mt-6 pt-4 space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currency}{subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{currency}{delivery}</span>
          </div>

          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{currency}{total}</span>
          </div>

        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-black text-white py-4 mt-6"
        >
          Proceed to Payment
        </button>

      </div>

    </div>
  )
}

export default PlaceOrder