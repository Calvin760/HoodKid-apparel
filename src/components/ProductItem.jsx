import { useContext, memo } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { optimizeCloudinaryImage } from '../utils/cloudinary';

const ProductItem = ({ id, image, name, price, colours }) => {
  const { currency } = useContext(ShopContext);

  const colourCount = colours?.length ?? 0;
  const colourLabel =
    colourCount > 0
      ? `${colourCount} Colour${colourCount > 1 ? 's' : ''}`
      : 'Single Colour';

  const primaryImage = image?.[0];

  return (
    <Link
      to={`/product/${id}`}
      className="group block"
      aria-label={`View ${name}`}
    >
      {/* IMAGE CARD */}
      <div className="relative bg-[#f5f5f5] aspect-square flex items-center justify-center overflow-hidden">
        <img
          src={optimizeCloudinaryImage(primaryImage, 600)}
          alt={name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="object-contain transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* INFO */}
      <div className="mt-4 px-1">
        <div className="flex items-start justify-between gap-3">
          {/* LEFT: name + colour count */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-black leading-snug line-clamp-1">
              {name}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {colourLabel}
            </p>
          </div>

          {/* RIGHT: price */}
          <p className="text-sm font-bold text-black whitespace-nowrap">
            {currency} {price}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default memo(ProductItem);