import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Loading from "../components/Loading";

import { useProductImages } from "../hooks/useProductImages";
import ProductGallery from "../components/product/ProductGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductTabs from "../components/product/ProductTabs";
import RelatedProducts from "../components/product/RelatedProducts";
import AddToCartPopup from "../components/product/AddToCartPopup";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, toggleWishlist, wishlistIds } =
    useContext(ShopContext);

  const product = products.find(p => p._id === productId);

  const [size, setSize] = useState("");
  const [color, setColor] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  if (!product) return <Loading />;

  const images =
    color?.images?.length ? color.images : product.image || [];

  const imageState = useProductImages(images);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ProductGallery images={images} {...imageState} />

        <ProductInfo
          product={product}
          currency={currency}
          size={size}
          setSize={setSize}
          color={color}
          setColor={setColor}
          addToCart={addToCart}
          toggleWishlist={toggleWishlist}
          isFav={wishlistIds.includes(product._id)}
          onAdded={() => setShowPopup(true)}
        />
      </div>

      <ProductTabs description={product.description} />
      <RelatedProducts product={product} products={products} />

      {showPopup && (
        <AddToCartPopup
          product={product}
          size={size}
          color={color}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Product;