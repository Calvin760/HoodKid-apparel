const API_URL = import.meta.env.VITE_API_URL;

const getImage = img =>
    img.startsWith("http") ? img : `${API_URL}/${img}`;

const ProductGallery = ({
    images,
    image,
    index,
    isFading,
    changeImage,
    onTouchStart,
    onTouchEnd
}) => {
    return (
        <>
            {/* Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3">
                {images.map((img, i) => (
                    <img
                        key={i}
                        src={getImage(img)}
                        onClick={() => changeImage(i)}
                        className={`w-20 h-20 object-cover cursor-pointer border ${i === index ? "border-black" : "border-gray-200"
                            }`}
                    />
                ))}
            </div>

            {/* Main Image */}
            <div
                className="flex flex-col items-center justify-center p-4"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <img
                    draggable={false}
                    src={image}
                    className={`max-h-[500px] object-contain transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"
                        }`}
                />

                {/* Dots */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4 lg:hidden">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => changeImage(i)}
                                className={`w-2.5 h-2.5 rounded-full ${i === index ? "bg-black scale-110" : "bg-gray-300"
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