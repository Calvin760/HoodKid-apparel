import { useContext, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiCheck, FiPackage, FiShoppingBag, FiMail } from 'react-icons/fi';

import { ShopContext } from '../context/ShopContext';

const PaymentSuccess = () => {
    const { setCartItems } = useContext(ShopContext);
    const [searchParams] = useSearchParams();

    // PayFast may return ?m_payment_id=... — surface it if present
    const orderId = searchParams.get('m_payment_id');

    // Clear the cart once payment is confirmed
    useEffect(() => {
        setCartItems({});
        try {
            localStorage.removeItem('cart');
        } catch {
            /* private mode / storage blocked — fine to ignore */
        }
    }, [setCartItems]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center bg-white border border-gray-200 rounded-lg p-8 sm:p-10 shadow-sm">
                {/* SUCCESS ICON */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <FiCheck size={32} strokeWidth={3} className="text-green-700" />
                </div>

                {/* TITLE */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                    Order Confirmed
                </h1>

                {orderId && (
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                        Order #{orderId.slice(-8)}
                    </p>
                )}

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    Thank you for your purchase. Your order is being processed and you&apos;ll
                    receive an email confirmation shortly.
                </p>

                {/* WHAT HAPPENS NEXT */}
                <div className="text-left bg-gray-50 border border-gray-100 rounded-lg p-4 mb-8 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        What happens next
                    </p>

                    <div className="flex items-start gap-3">
                        <FiMail size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-gray-700" />
                        <p className="text-sm text-gray-700">
                            We&apos;ll send a confirmation email with your receipt.
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <FiPackage size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-gray-700" />
                        <p className="text-sm text-gray-700">
                            Your order will be packed and shipped within 1–3 business days.
                        </p>
                    </div>
                </div>

                {/* CTAS */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/orders"
                        className="bg-black text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/collection"
                        className="border border-gray-300 py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 hover:border-black hover:bg-gray-50 transition-colors duration-200"
                    >
                        <FiShoppingBag size={16} strokeWidth={2.5} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;