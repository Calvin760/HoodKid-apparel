const API_URL = import.meta.env.VITE_API_URL;

export const formatImages = (imgs = []) => {
    if (!imgs || !imgs.length) return [];
    return imgs.map(img =>
        img.startsWith("http") ? img : `${API_URL}/${img}`
    );
};