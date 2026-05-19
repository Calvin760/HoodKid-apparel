import { toast } from "react-toastify";

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
    onAdded
}) => {
    const colors = product.colours || product.colors || [];
    const sizes = product.sizes || [];

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h1 className="text-2xl font-semibold">{product.name}</h1>
                <p className="text-gray-500">{product.category}</p>
                <p className="text-lg font-medium mt-2">
                    {currency}{product.price}
                </p>
            </div>

            {colors.length > 0 && (
                <div>
                    <p className="font-medium mb-2">Colours</p>
                    <div className="flex gap-3 flex-wrap">
                        {colors.map(c => (
                            <button
                                key={c.name}
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full border-2 ${color?.name === c.name
                                        ? "border-black scale-110"
                                        : "border-gray-300"
                                    }`}
                                style={{ backgroundColor: c.value }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <p className="font-medium mb-2">Sizes</p>
                <div className="flex gap-2 flex-wrap">
                    {sizes.length ? (
                        sizes.map(s => (
                            <button
                                key={s}
                                onClick={() => setSize(s)}
                                className={`border px-3 py-1 ${size === s ? "bg-black text-white" : ""
                                    }`}
                            >
                                {s}
                            </button>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">No sizes available</p>
                    )}
                </div>
            </div>

            <button
                onClick={() => {
                    if (!size) return toast.error("Select size");
                    if (colors.length && !color)
                        return toast.error("Select colour");

                    addToCart(product._id, size, color?.name);
                    onAdded();
                }}
                className="bg-black text-white py-3 rounded"
            >
                Add to Bag
            </button>

            <button
                onClick={() => toggleWishlist(product._id)}
                className={`border py-3 rounded ${isFav ? "bg-black text-white" : ""
                    }`}
            >
                {isFav ? "Saved ♥" : "Favourite ♡"}
            </button>
        </div>
    );
};

export default ProductInfo;