import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const resolveUrl = (src) =>
    !src ? '' : src.startsWith('http') ? src : `${API_URL}/${src}`;

const ProductGallery = ({
    images = [],
    index,
    isFading,
    changeImage,
    onTouchStart,
    onTouchEnd,
    productName = 'Product',
}) => {
    // Arrow-key navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowRight') changeImage((index + 1) % images.length);
            if (e.key === 'ArrowLeft') changeImage((index - 1 + images.length) % images.length);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [index, images.length, changeImage]);

    if (!images.length) {
        return (
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-sm text-gray-400 uppercase tracking-widest">
                No image
            </div>
        );
    }

    const currentImage = resolveUrl(images[index]);

    return (
        <>
            {/* Thumbnails (desktop) */}
            <div className="hidden lg:flex flex-col gap-3">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => changeImage(i)}
                        aria-label={`View image ${i + 1} of ${images.length}`}
                        aria-current={i === index}
                        className={`w-20 h-20 overflow-hidden border-2 transition-colors duration-200 ${i === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <img
                            src={resolveUrl(img)}
                            alt={`${productName} view ${i + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>

            {/* Main image */}
            <div
                className="flex flex-col items-center justify-center p-4"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <img
                    draggable={false}
                    src={currentImage}
                    alt={`${productName} — image ${index + 1} of ${images.length}`}
                    className={`max-h-[500px] object-contain transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'
                        }`}
                />

                {/* Dots (mobile) */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 lg:hidden" role="tablist" aria-label="Product images">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => changeImage(i)}
                                aria-label={`Go to image ${i + 1}`}
                                aria-selected={i === index}
                                role="tab"
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === index ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductGallery;