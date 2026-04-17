import React, { useEffect, useState } from "react"
import axios from "axios"

const PaymentSuccess = () => {

    const [status, setStatus] = useState("Processing payment...")

    useEffect(() => {
        const saveOrder = async () => {
            try {
                console.log("🔥 Payment success page loaded")

                // ✅ Get stored order
                const stored = localStorage.getItem("orderData")
                console.log("📦 Stored data:", stored)

                if (!stored) {
                    setStatus("No order data found ❌")
                    return
                }

                const parsed = JSON.parse(stored)

                // ✅ Build payload matching backend
                const orderPayload = {
                    items: parsed.cartData,

                    shippingInfo: {
                        name: parsed.form.name,
                        email: parsed.form.email,
                        phone: parsed.form.phone,
                        address: parsed.form.address,
                        city: parsed.form.city,
                        notes: parsed.form.notes
                    },

                    subtotal: parsed.total - 100, // adjust if needed
                    delivery: 100,
                    total: parsed.total
                }

                console.log("📤 Sending order:", orderPayload)

                // ✅ Get token
                const token = localStorage.getItem("token")

                if (!token) {
                    setStatus("User not authenticated ❌")
                    return
                }

                // ✅ Send request WITH token
                const res = await axios.post(
                    "http://localhost:5000/api/orders",
                    orderPayload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                console.log("✅ Response:", res.data)

                if (res.data.success) {
                    setStatus("Order saved successfully ✅")

                    // ✅ Clear stored order
                    localStorage.removeItem("orderData")
                } else {
                    setStatus("Failed to save order ❌")
                }

            } catch (err) {
                console.log("❌ ERROR:", err.response?.data || err.message)
                setStatus("Error saving order ❌")
            }
        }

        saveOrder()
    }, [])

    return (
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-xl font-bold">{status}</h1>
        </div>
    )
}

export default PaymentSuccess