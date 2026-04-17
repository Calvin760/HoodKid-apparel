import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from "axios"

const PlaceOrder = () => {

  const { cartItems, products, currency } = useContext(ShopContext)

  // ================= CART =================
  const cartData = useMemo(() => {
    const items = []

    for (const productId in cartItems) {
      const product = products.find(p => p._id === productId)
      if (!product) continue

      for (const size in cartItems[productId]) {
        for (const color in cartItems[productId][size]) {
          const quantity = cartItems[productId][size][color]

          if (quantity > 0) {
            items.push({
              productId,
              name: product.name,
              price: product.price,
              size,
              color,
              quantity
            })
          }
        }
      }
    }

    return items
  }, [cartItems, products])

  const subtotal = cartData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const delivery = subtotal > 0 ? 100 : 0
  const total = Number(subtotal + delivery)

  // ================= FORM =================
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    try {

      if (!form.email || !form.name || !form.address) {
        toast.error("Please fill all required fields")
        return
      }

      localStorage.setItem("orderData", JSON.stringify({
        cartData,
        total,
        email: form.email,
        form
      }))

      const { data } = await axios.post(
        "http://localhost:5000/api/pay",
        {
          total,
          email: form.email
        }
      )

      window.location.href = data.checkoutUrl

    } catch (err) {
      console.log(err)
      toast.error("Payment failed")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10">

      {/* ================= FORM ================= */}
      <div className="space-y-8">

        <div>
          <h2 className="text-2xl font-semibold">Delivery Details</h2>
          <p className="text-sm text-gray-500">
            Please enter your delivery information accurately.
          </p>
        </div>

        {/* CONTACT */}
        <div className="space-y-4">
          <h3 className="font-medium">Contact</h3>

          <div className="space-y-1">
            <label className="text-sm">Full Name *</label>
            <input
              name="name"
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">Email *</label>
            <input
              name="email"
              onChange={handleChange}
              placeholder="e.g. john@email.com"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">Phone</label>
            <input
              name="phone"
              onChange={handleChange}
              placeholder="e.g. 076 123 4567"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        {/* ADDRESS */}
        <div className="space-y-4">
          <h3 className="font-medium">Shipping Address</h3>

          <div className="space-y-1">
            <label className="text-sm">Address *</label>
            <textarea
              name="address"
              onChange={handleChange}
              placeholder="Street, suburb, building, etc."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">City</label>
            <input
              name="city"
              onChange={handleChange}
              placeholder="e.g. Johannesburg"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>
        </div>

        {/* NOTES */}
        <div className="space-y-1">
          <label className="text-sm">Delivery Notes</label>
          <textarea
            name="notes"
            onChange={handleChange}
            placeholder="Optional: gate code, instructions, etc."
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

      </div>

      {/* ================= SUMMARY ================= */}
      <div className="lg:sticky top-20 h-fit border rounded-2xl p-6 shadow-sm space-y-4">

        <h2 className="text-xl font-semibold">Order Summary</h2>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {cartData.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>{currency}{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2 text-sm">
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
          className="w-full bg-black text-white py-3 rounded-full mt-4 hover:opacity-90 transition"
        >
          Pay Now
        </button>

      </div>

    </div>
  )
}

export default PlaceOrder