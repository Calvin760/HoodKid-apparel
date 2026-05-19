import ProductItem from "../ProductItem";
import { formatImages } from "../../utils/formatImages";

const ProductGrid = ({ products, toggleWishlist }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(item => (
            <div key={item._id} className="relative group">
                <button
                    onClick={() => toggleWishlist(item._id)}
                    className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full"
                >
                    ♥
                </button>

                <ProductItem
                    id={item._id}
                    name={item.name}
                    price={item.price}
                    image={
                        item.colours?.[0]?.images?.length
                            ? formatImages(item.colours[0].images)
                            : formatImages(item.image)
                    }
                />
            </div>
        ))}
    </div>
);

export default ProductGrid;