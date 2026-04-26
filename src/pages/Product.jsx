import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import ProductItem from "../components/ProductItem";
import Loading from "../components/Loading";

// const API_URL = "http://localhost:5000";
const API_URL = import.meta.env.VITE_API_URL

const formatImages = (imgs) => {
  if (!imgs || imgs.length === 0) return []

  return imgs.map(img =>
    img.startsWith("http")
      ? img
      : `${API_URL}/${img}`
  )
}

const Product = () => {
  const { productId } = useParams();

  const {
    products,
    currency,
    addToCart,
    toggleWishlist,
    wishlistIds
  } = useContext(ShopContext);

  const [showCartPopup, setShowCartPopup] = useState(false)
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true)
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const touchStartX = useRef(null);
  const fadeTimeout = useRef(null);

  const changeMobileImage = (newIndex) => {
    if (newIndex === mobileIndex) return;

    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);

    setIsFading(true);

    fadeTimeout.current = setTimeout(() => {
      setMobileIndex(newIndex);
      setIsFading(false);
    }, 200);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || activeImages.length <= 1) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) < 50) {
      touchStartX.current = null;
      return;
    }

    if (diff > 0) {
      changeMobileImage(
        mobileIndex === activeImages.length - 1 ? 0 : mobileIndex + 1
      );
    } else {
      changeMobileImage(
        mobileIndex === 0 ? activeImages.length - 1 : mobileIndex - 1
      );
    }

    touchStartX.current = null;
  };

  const getImage = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_URL}/${img}`;
  };

  const colors = product?.colours || product?.colors || [];
  const sizes = product?.sizes || [];
  const images = product?.image || [];
  const activeImages = color?.images?.length ? color.images : images;

  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (!found) return;

    setProduct(found);
    setMobileIndex(0); // ✅ RESET HERE

    const firstColor = (found.colours || found.colors)?.[0];

    if (firstColor?.images?.length) {
      setColor(firstColor);
      setImage(getImage(firstColor.images[0]));
    } else if (found.image?.length) {
      setColor(null);
      setImage(getImage(found.image[0]));
    }

    setLoading(false);
  }, [productId, products]);

  useEffect(() => {
    if (!activeImages.length) return;
    setImage(getImage(activeImages[mobileIndex]));
  }, [mobileIndex, activeImages]);

  useEffect(() => {
    if (!activeImages.length) return;

    // Clamp index so it never exceeds image count
    const safeIndex = Math.min(mobileIndex, activeImages.length - 1);

    if (safeIndex !== mobileIndex) {
      setMobileIndex(safeIndex);
    }

    setImage(getImage(activeImages[safeIndex]));
  }, [activeImages]);

  useEffect(() => {
    if (showCartPopup) {
      const timer = setTimeout(() => setShowCartPopup(false), 6000)
      return () => clearTimeout(timer)
    }
  }, [showCartPopup])

  const isFav = product ? wishlistIds.includes(product._id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 4);
  }, [product, products]);

  if (loading || !product) {
    return <Loading />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* ================= TOP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* THUMBNAILS */}
        <div className="hidden lg:flex flex-col gap-3">
          {(color?.images?.length ? color.images : images).map((img, i) => (
            <img
              key={i}
              src={getImage(img)}
              onClick={() => {
                const index =
                  (color?.images?.length ? color.images : images).indexOf(img);

                setImage(getImage(img));
                if (index !== -1) setMobileIndex(index);
              }}
              className={`w-20 h-20 object-cover cursor-pointer border ${image === getImage(img)
                  ? "border-black"
                  : "border-gray-200"
                }`}
              alt=""
            />
          ))}
        </div>

        {/* MAIN IMAGE */}
        <div
          className="flex flex-col items-center justify-center p-4 rounded"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >

          <img
            draggable={false}
            src={getImage(image)}
            alt=""
            className={`max-h-[500px] object-contain transition-opacity duration-200 ${isFading ? "opacity-0" : "opacity-100"
              }`}
          />

          {/* DOTS — MOBILE ONLY */}
          {activeImages.length > 1 && (
            <div className="flex gap-2 mt-4 lg:hidden">
              {activeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => changeMobileImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition ${i === mobileIndex
                      ? "bg-black scale-110"
                      : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col gap-5">

          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-lg font-medium mt-2">
              {currency}{product.price}
            </p>
          </div>

          {/* COLORS */}
          {colors.length > 0 && (
            <div>
              <p className="font-medium mb-2">Colours</p>

              <div className="flex gap-3 flex-wrap">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setColor(c);
                      setMobileIndex(0);

                      const firstImg =
                        c.images?.length > 0
                          ? c.images[0]
                          : product.image?.[0];

                      setImage(getImage(firstImg));
                    }}
                    className={`w-8 h-8 rounded-full border-2 ${color?.name === c.name
                        ? "border-black scale-110"
                        : "border-gray-300"
                      }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Selected: {color?.name || "None"}
              </p>
            </div>
          )}

          {/* SIZES */}
          <div>
            <p className="font-medium mb-2">Sizes</p>

            <div className="flex flex-wrap gap-2">
              {sizes.length > 0 ? (
                sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`border px-3 py-1 ${size === s ? "bg-black text-white" : ""
                      }`}
                  >
                    {s}
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-400">No sizes available</p>
              )}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => {
              if (!size) return toast.error("Select size");
              if (colors.length > 0 && !color)
                return toast.error("Select colour");

              addToCart(product._id, size, color?.name);
              setShowCartPopup(true)
            }}
            className="bg-black text-white py-3 rounded"
          >
            Add to Bag
          </button>

          {/* WISHLIST */}
          <button
            onClick={() => toggleWishlist(product._id)}
            className={`border py-3 rounded ${isFav ? "bg-black text-white" : ""
              }`}
          >
            {isFav ? "Saved ♥" : "Favourite ♡"}
          </button>

        </div>
      </div>

      {/* ================= DESCRIPTION + REVIEWS (ADDED ONLY) ================= */}
      <div className="mt-16">

        <div className="flex gap-6 border-b">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-3 ${activeTab === "description"
                ? "border-b-2 border-black"
                : ""
              }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 ${activeTab === "reviews"
                ? "border-b-2 border-black"
                : ""
              }`}
          >
            Reviews
          </button>
        </div>

        {activeTab === "description" && (
          <div className="mt-6 text-gray-600 max-w-3xl">
            {product.description || "Premium quality product."}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((r) => (
              <div key={r} className="border-b pb-3">
                <p className="font-medium">User {r}</p>
                <p className="text-gray-500">★★★★★</p>
                <p className="text-sm text-gray-600">
                  Great product, highly recommend!
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= RELATED ================= */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-6">You May Also Like</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`}>
              <div className="p-3 rounded">

                <ProductItem
                  id={item._id}
                  name={item.name}
                  image={
                    item.colours?.length && item.colours[0].images?.length
                      ? formatImages(item.colours[0].images)
                      : formatImages(item.image)
                  }
                  price={item.price}
                  colours={item.colours}
                />

                <p className="font-medium">

                </p>

              </div>
            </Link>
          ))}
        </div>
      </div>

      {showCartPopup && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">

          {/* BACKDROP (subtle) */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

          {/* POPUP */}
          <div className="relative pointer-events-auto w-full max-w-md mx-4 mb-6 bg-white rounded-2xl shadow-2xl p-5 animate-slideUp">

            {/* TOP */}
            <div className="flex items-center gap-3">

              {/* ICON */}
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-full">
                <span className="text-green-600 text-lg">✓</span>
              </div>

              <div>
                <p className="font-semibold text-sm">Added to bag</p>
                <p className="text-xs text-gray-500">
                  {product.name} {size && `• ${size}`} {color && `• ${color.name}`}
                </p>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-5">

              <button
                onClick={() => setShowCartPopup(false)}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition"
              >
                Continue
              </button>

              <Link
                to="/cart"
                className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm text-center hover:opacity-90 transition"
              >
                View Bag
              </Link>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Product;