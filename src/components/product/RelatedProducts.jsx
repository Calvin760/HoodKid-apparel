import { useMemo, memo } from 'react';
import ProductCard from './ProductCard'; // from the BestSeller/Headwear refactor
import { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

const RelatedProducts = ({ product, products, limit = 4 }) => {
    const { toggleWishlist, wishlistIds } = useContext(ShopContext);

    const related = useMemo(() => {
        if (!product || !products?.length) return [];
        const category = product.category?.toLowerCase();
        return products
            .filter(
                (p) =>
                    p.category?.toLowerCase() === category && p._id !== product._id
            )
            .slice(0, limit);
    }, [product, products, limit]);

    if (related.length === 0) return null;

    const isWishlisted = (id) => wishlistIds.includes(id);

    return (
        <section className="mt-16">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6">
                You May Also Like
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                {related.map((item) => (
                    <ProductCard
                        key={item._id}
                        product={item}
                        liked={isWishlisted(item._id)}
                        onToggleWishlist={toggleWishlist}
                        heartPosition="top-2 right-2 sm:top-3 sm:right-3"
                    />
                ))}
            </div>
        </section>
    );
};

export default memo(RelatedProducts);