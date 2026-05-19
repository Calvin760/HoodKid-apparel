import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';

const AddToCartPopup = ({ product, size, color, onClose, autoDismissMs = 5000 }) => {
    // Auto-dismiss
    useEffect(() => {
        if (!autoDismissMs) return;
        const id = setTimeout(onClose, autoDismissMs);
        return () => clearTimeout(id);
    }, [autoDismissMs, onClose]);

    // Escape to close
    useEffect(() => {
        const handleKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    const variantParts = [size, color?.name].filter(Boolean);

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none"
            role="status"
            aria-live="polite"
        >
            {/* Click-outside backdrop (transparent, doesn't dim) */}
            <button
                onClick={onClose}
                aria-label="Dismiss notification"
                className="absolute inset-0 pointer-events-auto cursor-default"
                tabIndex={-1}
            />

            <div className="relative w-full max-w-md mx-4 mb-6 bg-white rounded-lg shadow-2xl p-5 pointer-events-auto animate-slide-up">
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                    <FiX size={18} strokeWidth={2.5} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full flex-shrink-0">
                        <FiCheck size={20} strokeWidth={3} className="text-green-700" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">Added to bag</p>
                        <p className="text-xs text-gray-500 truncate">
                            {product.name}
                            {variantParts.length > 0 && ` • ${variantParts.join(' • ')}`}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors duration-200"
                    >
                        Continue
                    </button>

                    <Link
                        to="/cart"
                        onClick={onClose}
                        className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-bold text-center hover:bg-gray-900 transition-colors duration-200"
                    >
                        View Bag
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AddToCartPopup;