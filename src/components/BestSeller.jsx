import { useContext, useEffect, useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';
import Loading from './Loading';
import { optimizeCloudinaryVideo } from '../utils/cloudinary';

const API_URL = import.meta.env.VITE_API_URL;

/* ============================================================
   HELPERS
   ============================================================ */
const resolveUrl = (src) =>
    !src ? '' : src.startsWith('http') ? src : `${API_URL}/${src}`;

const formatImages = (imgs = []) => imgs.map(resolveUrl);

const pickProductImages = (product) => {
    const colourImages = product.colours?.[0]?.images;
    return formatImages(colourImages?.length ? colourImages : product.image);
};

/* ============================================================
   WISHLIST BUTTON
   ============================================================ */
const WishlistButton = ({ liked, onClick, className = '' }) => (
    <button
        onClick={onClick}
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={liked}
        className={`absolute z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition-transform duration-200 ${className}`}
    >
        <FiHeart
            size={18}
            strokeWidth={2}
            className={liked ? 'fill-black stroke-black' : 'stroke-black'}
        />
    </button>
);

/* ============================================================
   PRODUCT CARD (wishlist + ProductItem combined)
   ============================================================ */
const BestSellerCard = ({ product, liked, onToggleWishlist, heartPosition }) => (
    <>
        <WishlistButton
            liked={liked}
            onClick={() => onToggleWishlist(product._id)}
            className={heartPosition}
        />
        <ProductItem
            id={product._id}
            name={product.name}
            image={pickProductImages(product)}
            price={product.price}
            colours={product.colours}
        />
    </>
);

/* ============================================================
   HERO VIDEO BANNER
   ============================================================ */
const HeroVideo = ({ src }) => {
    if (!src) return null;

    return (
        <>
            {/* MOBILE */}
            <div className="block sm:hidden mb-10">
                <div className="relative w-full h-[75vh] overflow-hidden">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay loop muted playsInline preload="metadata"
                    >
                        <source src={src} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/30" />
                </div>

                <div className="text-center px-6 py-6 flex flex-col items-center">
                    <h1 className="text-2xl font-black tracking-tight">
                        CAUTION CAPSULE
                    </h1>
                    <p className="mt-2 text-xs tracking-widest text-gray-600 uppercase">
                        White is the statement
                    </p>
                    <Link to="/collection" state={{ subcategory: 'caution capsule' }}>
                        <button className="mt-4 px-6 py-2.5 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors duration-200">
                            SHOP NOW
                        </button>
                    </Link>
                </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden sm:block relative w-full h-[75vh] overflow-hidden mb-10">
                <video
                    className="w-full h-full object-cover"
                    autoPlay loop muted playsInline preload="metadata"
                >
                    <source src={src} type="video/mp4" />
                </video>

                <div className="absolute inset-0 flex flex-col justify-center items-start px-16 bg-black/40">
                    <h2 className="text-white text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                        WEAR IF<br />YOU&apos;RE REAL
                    </h2>
                    <p className="mt-2 text-sm tracking-widest text-gray-300 uppercase">
                        Built for speed & style
                    </p>
                    <Link to="/collection" state={{ subcategory: 'caution capsule' }}>
                        <button className="mt-6 px-8 py-2.5 bg-white text-black text-sm font-bold border border-white hover:bg-black hover:text-white transition-colors duration-200">
                            SHOP NOW
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
const BestSeller = () => {
    const { products, toggleWishlist, wishlistIds } = useContext(ShopContext);
    const [loading, setLoading] = useState(true);

    const bestSeller = useMemo(() => {
        if (!products?.length) return [];
        return products.filter((p) => p.bestseller).slice(0, 4);
    }, [products]);

    const heroProduct = useMemo(
        () => products?.find((p) => p.hero === 'hero1'),
        [products]
    );

    const heroVideoUrl = useMemo(
        () =>
            heroProduct?.video
                ? optimizeCloudinaryVideo(resolveUrl(heroProduct.video))
                : null,
        [heroProduct]
    );

    useEffect(() => {
        setLoading(!products?.length);
    }, [products]);

    const isWishlisted = (id) => wishlistIds.includes(id);

    if (loading) return <Loading text="Loading best seller collection..." />;

    return (
        <section className="my-10">
            <HeroVideo src={heroVideoUrl} />

            <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
                {/* MOBILE CAROUSEL */}
                <div className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory sm:hidden">
                    {bestSeller.map((item) => (
                        <div key={item._id} className="relative min-w-[90%] px-4 snap-center">
                            <BestSellerCard
                                product={item}
                                liked={isWishlisted(item._id)}
                                onToggleWishlist={toggleWishlist}
                                heartPosition="top-4 right-6"
                            />
                        </div>
                    ))}
                </div>

                {/* DESKTOP GRID */}
                <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {bestSeller.map((item) => (
                        <div key={item._id} className="relative group">
                            <BestSellerCard
                                product={item}
                                liked={isWishlisted(item._id)}
                                onToggleWishlist={toggleWishlist}
                                heartPosition="top-3 right-3"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(BestSeller);