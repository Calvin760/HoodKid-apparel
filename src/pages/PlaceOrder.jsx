import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

const API_URL = import.meta.env.VITE_API_URL
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL

// PayFast (safe frontend env values only)
const PAYFAST_PROCESS_URL = import.meta.env.VITE_PAYFAST_PROCESS_URL
const PAYFAST_MERCHANT_ID = import.meta.env.VITE_PAYFAST_MERCHANT_ID
const PAYFAST_MERCHANT_KEY = import.meta.env.VITE_PAYFAST_MERCHANT_KEY

const PlaceOrder = () => {
  const { cartItems, products, currency } = useContext(ShopContext)
  const { getToken } = useAuth()

  const [deliveryMethod, setDeliveryMethod] = useState("delivery")

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

  const delivery = deliveryMethod === "delivery" && subtotal > 0 ? 80 : 0
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
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ================= ORDER =================
  const handlePlaceOrder = async () => {
    try {
      const token = await getToken()

      if (!token) {
        toast.error("Please login to place an order")
        return
      }

      if (cartData.length === 0) {
        toast.error("Your cart is empty")
        return
      }

      if (!form.email) {
        toast.error("Email is required")
        return
      }

      if (deliveryMethod === "delivery" && !form.address) {
        toast.error("Address is required for delivery")
        return
      }

      // ================= CREATE ORDER =================
      const { data } = await axios.post(
        `${API_URL}/api/payfast/create-payment`,
        {
          cartData,
          form,
          total,
          subtotal,
          deliveryMethod
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const orderId = data.orderId

      // ================= PAYFAST =================
      const formEl = document.createElement("form")
      formEl.method = "POST"
      formEl.action = PAYFAST_PROCESS_URL

      const fields = {
        merchant_id: PAYFAST_MERCHANT_ID,
        merchant_key: PAYFAST_MERCHANT_KEY,
        return_url: `${FRONTEND_URL}/payment-success`,
        cancel_url: `${FRONTEND_URL}/cancel`,
        notify_url: `${API_URL}/api/payfast/notify`,
        m_payment_id: orderId,
        amount: total,
        item_name: "Order Payment"
      }

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value
        formEl.appendChild(input)
      })

      document.body.appendChild(formEl)
      formEl.submit()

    } catch (err) {
      console.log(err)
      toast.error("Failed to initiate payment")
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ================= TOGGLE ================= */}
      <div className="bg-gray-100 p-1 flex w-fit mb-8">
        <button
          onClick={() => setDeliveryMethod("delivery")}
          className={`px-5 py-2 text-sm font-medium transition ${deliveryMethod === "delivery"
              ? "bg-black text-white"
              : "text-gray-600"
            }`}
        >
          Delivery
        </button>

        <button
          onClick={() => setDeliveryMethod("pickup")}
          className={`px-5 py-2 text-sm font-medium transition ${deliveryMethod === "pickup"
              ? "bg-black text-white"
              : "text-gray-600"
            }`}
        >
          Pickup
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* ================= FORM ================= */}
        <div className="space-y-8">

          <div>
            <h2 className="text-2xl font-semibold">
              {deliveryMethod === "delivery"
                ? "Delivery Details"
                : "Pickup Details"}
            </h2>

            <p className="text-sm text-gray-500">
              {deliveryMethod === "delivery"
                ? "Enter your delivery information"
                : "Enter your details for pickup confirmation"}
            </p>
          </div>

          {/* CONTACT */}
          <div className="space-y-4">
            <h3 className="font-medium">Contact</h3>

            <input
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-3 focus:ring-2 focus:ring-black outline-none"
            />

            <input
              name="email"
              onChange={handleChange}
              placeholder="Email *"
              className="w-full border p-3 focus:ring-2 focus:ring-black outline-none"
            />

            <input
              name="phone"
              onChange={handleChange}
              placeholder="Phone"
              className="w-full border p-3 focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* DELIVERY ONLY */}
          {deliveryMethod === "delivery" && (
            <>
              <div className="space-y-4">
                <h3 className="font-medium">Shipping Address</h3>

                <textarea
                  name="address"
                  onChange={handleChange}
                  placeholder="Street, suburb, building, etc."
                  className="w-full border p-3 focus:ring-2 focus:ring-black outline-none"
                />

                <input
                  name="city"
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full border p-3 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              <textarea
                name="notes"
                onChange={handleChange}
                placeholder="Delivery notes (optional)"
                className="w-full border p-3 focus:ring-2 focus:ring-black outline-none"
              />
            </>
          )}

          {/* PICKUP ONLY */}
          {deliveryMethod === "pickup" && (
            <div>
              <h3 className="font-medium mb-2">Pickup Location</h3>

              <div className="border p-4">
                <p className="font-medium">HOODKID Store</p>
                <p className="text-sm text-gray-500">
                  Mabopane Station, Pretoria, South Africa
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Ready within 24 hours
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="lg:sticky top-20 h-fit border p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {cartData.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {currency}{item.price * item.quantity}
                </span>
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
            className="w-full bg-black text-white py-3 mt-4 hover:opacity-90 transition"
          >
            Pay {currency}{total}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder