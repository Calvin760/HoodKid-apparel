import { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Loading from './Loading';

const API_URL = import.meta.env.VITE_API_URL;

const resolveUrl = (src) =>
    !src ? '' : src.startsWith('http') ? src : `${API_URL}/${src}`;

const pickProductImages = (product) => {
    const colourImages = product.colours?.[0]?.images;
    const source = colourImages?.length ? colourImages : product.image;
    return (source || []).map(resolveUrl);
};

const LatestCollection = ({ limit = 8 }) => {
    const { products, toggleWishlist, wishlistIds } = useContext(ShopContext);

    const latestProducts = useMemo(() => {
        if (!products?.length) return null;
        return products
            .filter((p) => p.latestCollection === true)
            .slice(0, limit);
    }, [products, limit]);

    const isWishlisted = (id) => wishlistIds.includes(id);

    if (latestProducts === null) {
        return <Loading text="Loading latest collection..." />;
    }

    if (latestProducts.length === 0) return null;

    return (
        <section className="my-10">
            {/* MOBILE: horizontal scroll */}
            <div className="sm:hidden px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                <div className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-3 px-4">
                    {latestProducts.map((item) => (
                        <div
                            key={item._id}
                            className="relative flex-shrink-0 w-[65%] snap-start"
                        >
                            <WishlistButton
                                liked={isWishlisted(item._id)}
                                onClick={() => toggleWishlist(item._id)}
                            />
                            <ProductItem
                                id={item._id}
                                name={item.name}
                                image={pickProductImages(item)}
                                price={item.price}
                                colours={item.colours}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* DESKTOP: grid */}
            <div className="hidden sm:block max-w-[1200px] mx-auto px-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
                    {latestProducts.map((item) => (
                        <div key={item._id} className="relative group">
                            <WishlistButton
                                liked={isWishlisted(item._id)}
                                onClick={() => toggleWishlist(item._id)}
                            />
                            <ProductItem
                                id={item._id}
                                name={item.name}
                                image={pickProductImages(item)}
                                price={item.price}
                                colours={item.colours}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/* ============================================================
   WISHLIST BUTTON
   ============================================================ */
const WishlistButton = ({ liked, onClick }) => (
    <button
        onClick={onClick}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={liked}
        className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition-transform duration-200"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? 'black' : 'none'}
            stroke="black"
            strokeWidth="1.5"
            className="w-5 h-5"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
        </svg>
    </button>
);

export default LatestCollection;