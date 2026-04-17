import React, { useContext, useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import ProductItem from "../components/ProductItem";

const API_URL = "http://localhost:5000";

const formatImages = (imgs) => {
  if (!imgs || imgs.length === 0) return []

  return imgs.map(img =>
    img.startsWith("http")
      ? img
      : `http://localhost:5000/${img}`
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

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  const getImage = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_URL}/${img}`;
  };

  const colors = product?.colours || product?.colors || [];
  const sizes = product?.sizes || [];
  const images = product?.image || [];

  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (!found) return;

    setProduct(found);

    const firstColor = (found.colours || found.colors)?.[0];

    if (firstColor?.images?.length) {
      setColor(firstColor);
      setImage(getImage(firstColor.images[0]));
    } else if (found.image?.length) {
      setColor(null);
      setImage(getImage(found.image[0]));
    } else {
      setImage("");
    }
  }, [productId, products]);

  const isFav = product ? wishlistIds.includes(product._id) : false;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p._id !== product._id)
      .slice(0, 4);
  }, [product, products]);

  if (!product) return <div className="p-10">Loading...</div>;

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
              onClick={() => setImage(getImage(img))}
              className={`w-20 h-20 object-cover cursor-pointer border ${image === getImage(img)
                  ? "border-black"
                  : "border-gray-200"
                }`}
              alt=""
            />
          ))}
        </div>

        {/* MAIN IMAGE */}
        <div className="bg-gray-100 flex items-center justify-center p-4 rounded">
          <img
            src={getImage(image)}
            className="max-h-[500px] object-contain"
            alt=""
          />
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
              toast.success("Added to cart");
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
              <div className="bg-gray-100 p-3 rounded">

                <ProductItem
                  id={item._id}
                  name={item.name}
                  image={
                    item.colours?.length && item.colours[0].images?.length
                      ? formatImages(item.colours[0].images)
                      : formatImages(item.image)
                  }
                  price={item.price}
                />

                <p className="mt-2 text-sm">{item.name}</p>
                <p className="font-medium">
                  {currency}{item.price}
                </p>

              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Product;