import React, { useContext, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth, useClerk } from "@clerk/clerk-react"


import { useCartSummary } from "./useCartSummary"
import { useOrderForm } from "./useOrderForm"
import { validateOrder } from "./orderValidation"
import { submitPayfastPayment } from "./payfast"
import { DELIVERY_METHODS } from "./constants"
import { ShopContext } from "../../context/ShopContext"

const API_URL = import.meta.env.VITE_API_URL


const PlaceOrder = () => {
    const { cartItems, products, currency } = useContext(ShopContext)
    const { getToken } = useAuth()
    const { openSignIn } = useClerk()

    const [deliveryMethod, setDeliveryMethod] = useState(
        DELIVERY_METHODS.DELIVERY
    )

    const { items, subtotal, delivery, total } =
        useCartSummary(cartItems, products, deliveryMethod)

    const { form, handleChange } = useOrderForm()

    const handlePlaceOrder = async () => {
        try {
            const token = await getToken()

            if (!token) {
                openSignIn({
                    afterSignInUrl: window.location.pathname,
                    afterSignUpUrl: window.location.pathname,
                })
                return
            }

            const error = validateOrder({
                cartItems: items,
                form,
                deliveryMethod,
            })

            if (error) {
                toast.error(error)
                return
            }

            const { data } = await axios.post(
                `${API_URL}/api/payfast/create-payment`,
                {
                    cartData: items,
                    form,
                    subtotal,
                    total,
                    deliveryMethod,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )

            submitPayfastPayment({
                orderId: data.orderId,
                total,
            })
        } catch (err) {
            console.error(err)
            toast.error("Failed to initiate payment")
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* ================= DELIVERY TOGGLE ================= */}
            <div className="bg-gray-100 p-1 flex w-fit mb-8">
                <button
                    onClick={() => setDeliveryMethod(DELIVERY_METHODS.DELIVERY)}
                    className={`px-5 py-2 text-sm font-medium transition ${deliveryMethod === DELIVERY_METHODS.DELIVERY
                            ? "bg-black text-white"
                            : "text-gray-600"
                        }`}
                >
                    Delivery
                </button>

                <button
                    onClick={() => setDeliveryMethod(DELIVERY_METHODS.PICKUP)}
                    className={`px-5 py-2 text-sm font-medium transition ${deliveryMethod === DELIVERY_METHODS.PICKUP
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
                            {deliveryMethod === DELIVERY_METHODS.DELIVERY
                                ? "Delivery Details"
                                : "Pickup Details"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {deliveryMethod === DELIVERY_METHODS.DELIVERY
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
                    {deliveryMethod === DELIVERY_METHODS.DELIVERY && (
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
                    {deliveryMethod === DELIVERY_METHODS.PICKUP && (
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
                        {items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span>
                                    {item.name} × {item.quantity}
                                </span>
                                <span>
                                    {currency}
                                    {item.price * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>
                                {currency}
                                {subtotal}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>
                                {currency}
                                {delivery}
                            </span>
                        </div>

                        <div className="flex justify-between font-semibold text-base">
                            <span>Total</span>
                            <span>
                                {currency}
                                {total}
                            </span>
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