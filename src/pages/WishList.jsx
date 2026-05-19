import { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

import { ShopContext } from '../context/ShopContext';
import ProductCard from '../components/product/ProductCard';

/* ============================================================
   EMPTY STATE
   ============================================================ */
const EmptyWishlist = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 text-center">
    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
      <FiHeart size={28} strokeWidth={2} className="text-gray-400" />
    </div>

    <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
      Your wishlist is empty
    </h2>
    <p className="text-sm text-gray-500 mb-8">
      Tap the heart on any product to save it for later.
    </p>

    <Link
      to="/collection"
      className="inline-block px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
    >
      Explore Products
    </Link>
  </div>
);

/* ============================================================
   MAIN
   ============================================================ */
const WishList = () => {
  const { wishlistProducts, wishlistIds, toggleWishlist } = useContext(ShopContext);

  const count = wishlistProducts.length;

  // Wishlist lookup as a Set — O(1) per check vs O(n) on Array.includes
  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  if (count === 0) return <EmptyWishlist />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Your Wishlist
          <span className="ml-3 text-sm font-medium text-gray-500">
            ({count} {count === 1 ? 'item' : 'items'})
          </span>
        </h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
        {wishlistProducts.map((item) => (
          <ProductCard
            key={item._id}
            product={item}
            liked={wishlistSet.has(item._id)}
            onToggleWishlist={toggleWishlist}
            heartPosition="top-2 right-2 sm:top-3 sm:right-3"
          />
        ))}
      </div>
    </div>
  );
};

export default WishList;