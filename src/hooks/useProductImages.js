import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const getImage = img =>
    img?.startsWith("http") ? img : `${API_URL}/${img}`;

export const useProductImages = (images = []) => {
    const [index, setIndex] = useState(0);
    const [image, setImage] = useState("");
    const [isFading, setIsFading] = useState(false);

    const touchStartX = useRef(null);
    const fadeTimeout = useRef(null);

    useEffect(() => {
        if (!images.length) return;
        setIndex(0);
        setImage(getImage(images[0]));
    }, [images]);

    const changeImage = newIndex => {
        if (newIndex === index) return;

        clearTimeout(fadeTimeout.current);
        setIsFading(true);

        fadeTimeout.current = setTimeout(() => {
            setIndex(newIndex);
            setImage(getImage(images[newIndex]));
            setIsFading(false);
        }, 200);
    };

    const onTouchStart = e => {
        touchStartX.current = e.touches[0].clientX;
    };

    const onTouchEnd = e => {
        if (!touchStartX.current || images.length <= 1) return;

        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) < 50) return;

        changeImage(
            diff > 0
                ? (index + 1) % images.length
                : (index - 1 + images.length) % images.length
        );

        touchStartX.current = null;
    };

    return {
        image,
        index,
        isFading,
        changeImage,
        onTouchStart,
        onTouchEnd
    };
};