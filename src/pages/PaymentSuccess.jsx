import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { ShopContext } from "../context/ShopContext";
import { useEffect } from "react";

const PaymentSuccess = () => {

    const { setCartItems } = useContext(ShopContext);

    useEffect(() => {

        setCartItems({})

        localStorage.removeItem("cart")

    }, [setCartItems])

    return (
        <div className="h-screen flex items-center justify-center px-4">

            <div className="max-w-md w-full text-center border rounded-xl p-8 shadow-sm bg-white">

                {/* ICON */}
                <div className="text-5xl mb-4">🎉</div>

                {/* TITLE */}
                <h1 className="text-2xl font-bold mb-2">
                    Payment Successful
                </h1>

                {/* MESSAGE */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Thank you for your purchase. Your order has been placed successfully and is now being processed.
                    We truly appreciate your support 🙏
                </p>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3">

                    <Link
                        to="/orders"
                        className="bg-black text-white py-3 rounded hover:opacity-90 transition"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/collection"
                        className="border py-3 rounded hover:bg-gray-100 transition"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>

        </div>
    )
}

export default PaymentSuccess