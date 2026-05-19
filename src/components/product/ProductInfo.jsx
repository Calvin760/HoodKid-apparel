import { toast } from 'react-toastify';
import { FiHeart } from 'react-icons/fi';

const ProductInfo = ({
    product,
    currency,
    size,
    setSize,
    color,
    setColor,
    addToCart,
    toggleWishlist,
    isFav,
    onAdded,
}) => {
    const colors = product.colours || product.colors || [];
    const sizes = product.sizes || [];

    const handleAddToCart = () => {
        if (sizes.length && !size) {
            toast.error('Please select a size');
            return;
        }
        if (colors.length && !color) {
            toast.error('Please select a colour');
            return;
        }
        addToCart(product._id, size, color?.name);
        onAdded();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {product.name}
                </h1>
                <p className="mt-1 text-xs tracking-widest text-gray-500 uppercase">
                    {product.category}
                </p>
                <p className="mt-3 text-lg font-bold">
                    {currency} {product.price}
                </p>
            </div>

            {/* COLOURS */}
            {colors.length > 0 && (
                <div>
                    <p className="text-sm font-bold mb-3">
                        Colour: <span className="font-normal text-gray-600">{color?.name || 'Select'}</span>
                    </p>
                    <div className="flex gap-3 flex-wrap">
                        {colors.map((c) => {
                            const selected = color?.name === c.name;
                            return (
                                <button
                                    key={c.name}
                                    onClick={() => setColor(c)}
                                    aria-label={`Select colour ${c.name}`}
                                    aria-pressed={selected}
                                    title={c.name}
                                    style={{ backgroundColor: c.value }}
                                    className={`w-9 h-9 rounded-full border-2 transition-transform duration-200 ${selected ? 'border-black scale-110' : 'border-gray-300 hover:scale-105'
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SIZES */}
            <div>
                <p className="text-sm font-bold mb-3">Size</p>
                {sizes.length ? (
                    <div className="flex gap-2 flex-wrap">
                        {sizes.map((s) => {
                            const selected = size === s;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setSize(s)}
                                    aria-pressed={selected}
                                    className={`min-w-[3rem] border px-3 py-2 text-sm font-bold transition-colors duration-200 ${selected
                                            ? 'bg-black text-white border-black'
                                            : 'border-gray-300 hover:border-black'
                                        }`}
                                >
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No sizes available</p>
                )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-3 mt-2">
                <button
                    onClick={handleAddToCart}
                    className="bg-black text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
                >
                    Add to Bag
                </button>

                <button
                    onClick={() => toggleWishlist(product._id)}
                    aria-pressed={isFav}
                    className={`border py-3 text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-colors duration-200 ${isFav
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:border-black'
                        }`}
                >
                    <FiHeart
                        size={18}
                        strokeWidth={2.5}
                        className={isFav ? 'fill-white' : ''}
                    />
                    {isFav ? 'Saved' : 'Add to Favourites'}
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;