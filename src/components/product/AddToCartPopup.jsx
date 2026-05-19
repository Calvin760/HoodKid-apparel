import { Link } from "react-router-dom";

const AddToCartPopup = ({ product, size, color, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/10" />

            <div className="relative w-full max-w-md mx-4 mb-6 bg-white rounded-2xl shadow-2xl p-5 animate-slideUp">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                        ✓
                    </div>

                    <div>
                        <p className="font-semibold text-sm">Added to bag</p>
                        <p className="text-xs text-gray-500">
                            {product.name} {size && `• ${size}`} {color && `• ${color.name}`}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 border py-2.5 rounded-lg text-sm"
                    >
                        Continue
                    </button>

                    <Link
                        to="/cart"
                        className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm text-center"
                    >
                        View Bag
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AddToCartPopup;