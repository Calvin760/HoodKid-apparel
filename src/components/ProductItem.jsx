import { useContext, memo } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { optimizeCloudinaryImage } from '../utils/cloudinary';

const ProductItem = ({ id, image, name, price, colours }) => {
  const { currency } = useContext(ShopContext);

  const colourCount = colours?.length ?? 0;
  const colourLabel =
    colourCount > 0
      ? `${colourCount} COLOUR${colourCount > 1 ? 'S' : ''}`
      : 'SINGLE COLOUR';

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
      <div className="mt-3 px-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
          {colourLabel}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900 leading-tight line-clamp-2">
          {name}
        </p>

        <p className="mt-1 text-sm font-bold text-black">
          {currency} {price}
        </p>
      </div>
    </Link>
  );
};

export default memo(ProductItem);