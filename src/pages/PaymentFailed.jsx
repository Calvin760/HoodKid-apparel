import { Link, useSearchParams } from 'react-router-dom';
import { FiAlertCircle, FiShoppingBag, FiHelpCircle } from 'react-icons/fi';

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('m_payment_id');

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center bg-white border border-gray-200 rounded-lg p-8 sm:p-10 shadow-sm">
                {/* ICON */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                    <FiAlertCircle size={32} strokeWidth={2.5} className="text-red-700" />
                </div>

                {/* TITLE */}
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
                    Payment Not Completed
                </h1>

                {orderId && (
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                        Order #{orderId.slice(-8)}
                    </p>
                )}

                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    Your payment was cancelled or could not be processed.
                    <span className="block mt-1 font-bold text-black">
                        You have not been charged.
                    </span>
                </p>

                {/* WHAT TO DO NEXT */}
                <div className="text-left bg-gray-50 border border-gray-100 rounded-lg p-4 mb-8 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        What you can do
                    </p>

                    <div className="flex items-start gap-3">
                        <FiShoppingBag size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-gray-700" />
                        <p className="text-sm text-gray-700">
                            Your cart has been kept. Head back and try again.
                        </p>
                    </div>

                    <div className="flex items-start gap-3">
                        <FiHelpCircle size={16} strokeWidth={2.5} className="mt-0.5 flex-shrink-0 text-gray-700" />
                        <p className="text-sm text-gray-700">
                            If you keep having trouble,{' '}
                            <Link to="/contact" className="font-bold underline hover:no-underline">
                                contact us
                            </Link>{' '}
                            and we&apos;ll help.
                        </p>
                    </div>
                </div>

                {/* CTAS */}
                <div className="flex flex-col gap-3">
                    <Link
                        to="/cart"
                        className="bg-black text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
                    >
                        Return to Cart
                    </Link>

                    <Link
                        to="/collection"
                        className="border border-gray-300 py-3 text-sm font-bold uppercase tracking-wide hover:border-black hover:bg-gray-50 transition-colors duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;