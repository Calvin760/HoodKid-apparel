import { Link } from "react-router-dom";
import ProductItem from "../ProductItem";
import { formatImages } from "../../utils/formatImages";

const RelatedProducts = ({ product, products }) => {
    const related = products
        .filter(p => p.category === product.category && p._id !== product._id)
        .slice(0, 4);

    return (
        <div className="mt-16">
            <h2 className="text-xl font-semibold mb-6">You May Also Like</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map(item => (
                    <Link key={item._id} to={`/product/${item._id}`}>
                        <ProductItem
                            id={item._id}
                            name={item.name}
                            image={
                                item.colours?.[0]?.images?.length
                                    ? formatImages(item.colours[0].images)
                                    : formatImages(item.image)
                            }
                            price={item.price}
                            colours={item.colours}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;