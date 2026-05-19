import { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from './product/ProductCard';
import Loading from './Loading';

const Headwear = ({
    title = 'HEADWEAR',
    subtitle = 'Top off your look',
    category = 'headwear',
    limit = 4,
}) => {
    const { products, toggleWishlist, wishlistIds } = useContext(ShopContext);

    const items = useMemo(() => {
        if (!products?.length) return null; // null = still loading
        return products
            .filter((p) => p.category?.toLowerCase() === category.toLowerCase())
            .slice(-limit);
    }, [products, category, limit]);

    if (items === null) return <Loading text={`Loading ${title.toLowerCase()}...`} />;
    if (items.length === 0) return null;

    const isWishlisted = (id) => wishlistIds.includes(id);

    return (
        <section className="my-10">
            <header className="text-center mb-6 px-4">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {title}
                </h2>
                <p className="mt-1 text-sm tracking-widest text-gray-500 uppercase">
                    {subtitle}
                </p>
            </header>

            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <ProductCard
                            key={item._id}
                            product={item}
                            liked={isWishlisted(item._id)}
                            onToggleWishlist={toggleWishlist}
                            heartPosition="top-2 right-2 sm:top-3 sm:right-3"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Headwear;