import { memo } from 'react';
import { FiHeart } from 'react-icons/fi';
import ProductItem from '../ProductItem';

const API_URL = import.meta.env.VITE_API_URL;

const resolveUrl = (src) =>
    !src ? '' : src.startsWith('http') ? src : `${API_URL}/${src}`;

const pickProductImages = (product) => {
    const colourImages = product.colours?.[0]?.images;
    const source = colourImages?.length ? colourImages : product.image;
    return (source || []).map(resolveUrl);
};

const ProductCard = ({ product, liked, onToggleWishlist, heartPosition = 'top-3 right-3' }) => (
    <div className="relative group">
        <button
            onClick={() => onToggleWishlist(product._id)}
            aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={liked}
            className={`absolute z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition-transform duration-200 ${heartPosition}`}
        >
            <FiHeart
                size={18}
                strokeWidth={2}
                className={liked ? 'fill-black stroke-black' : 'stroke-black'}
            />
        </button>

        <ProductItem
            id={product._id}
            name={product.name}
            image={pickProductImages(product)}
            price={product.price}
            colours={product.colours}
        />
    </div>
);

export default memo(ProductCard);