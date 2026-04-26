import React from "react"
import { Link } from "react-router-dom"

const PaymentFailed = () => {
    return (
        <div className="h-screen flex items-center justify-center px-4">

            <div className="max-w-md w-full text-center border rounded-xl p-8 shadow-sm bg-white">

                {/* ICON */}
                <div className="text-5xl mb-4">❌</div>

                {/* TITLE */}
                <h1 className="text-2xl font-bold mb-2">
                    Payment Not Completed
                </h1>

                {/* MESSAGE */}
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    Your payment was not completed or was cancelled.
                    No charges have been made. You can try again anytime.
                </p>

                {/* BUTTONS */}
                <div className="flex flex-col gap-3">

                    <Link
                        to="/cart"
                        className="bg-black text-white py-3 rounded hover:opacity-90 transition"
                    >
                        Return to Cart
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

export default PaymentFailed