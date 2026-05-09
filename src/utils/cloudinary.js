export const optimizeCloudinaryImage = (url, width = 800) => {
    if (!url) return "";

    // only modify cloudinary images
    if (!url.includes("cloudinary")) return url;

    return url.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width}/`
    );
};

export const optimizeCloudinaryVideo = (url) => {
    if (!url) return "";

    if (!url.includes("cloudinary")) return url;

    return url.replace(
        "/upload/",
        "/upload/q_auto,f_auto/"
    );
};