import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const Product = () => {

  const { productId } = useParams()

  const {
    products,
    currency,
    addToCart,
    toggleWishlist,
    wishlistItems
  } = useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')
  const [activeTab, setActiveTab] = useState('description')

  // ================= GET PRODUCT =================
  useEffect(() => {
    const found = products.find(p => p._id === productId)
    if (found) {
      setProduct(found)
      setImage(found.image[0])
    }
  }, [productId, products])

  // ================= SAFE WISHLIST CHECK =================
  const isFav = product ? wishlistItems.includes(product._id) : false

  // ================= RELATED =================
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p._id !== product._id)
      .slice(0, 4)
  }, [product, products])

  if (!product) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

      {/* ================= TOP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

        {/* LEFT THUMBNAILS */}
        <div className="hidden lg:flex flex-col gap-4">
          {product.image.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setImage(img)}
              className={`w-20 h-20 object-cover cursor-pointer border ${image === img ? 'border-black' : 'border-gray-200'
                }`}
              alt=""
            />
          ))}
        </div>

        {/* CENTER IMAGE */}
        <div className="w-full">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-4 sm:p-6">
            <img
              src={image}
              className="max-h-[350px] sm:max-h-[500px] object-contain"
              alt=""
            />
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="flex flex-col gap-4 sm:gap-6">

          <div>
            <h1 className="text-xl sm:text-2xl font-semibold">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm">{product.category}</p>
            <p className="mt-2 text-lg font-medium">
              {currency}{product.price}
            </p>
          </div>

          {/* OPTIONS */}
          <div>
            <p className="mb-2 font-medium">Available Options</p>
            <div className="flex gap-3 flex-wrap">
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setImage(img)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 object-cover cursor-pointer border ${image === img ? 'border-black' : 'border-gray-200'
                    }`}
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="font-medium">Select Size</p>
              <span className="text-xs sm:text-sm text-gray-500">
                Size Guide
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {product.sizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSize(s)}
                  className={`border py-2 sm:py-3 text-sm sm:text-base ${size === s
                      ? 'border-black'
                      : 'border-gray-300 hover:border-black'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => {
              if (!size) {
                toast.error("Please select a size")
                return
              }
              addToCart(product._id, size)
              toast.success("Added to cart")
            }}
            className="bg-black text-white py-3 sm:py-4 rounded-full"
          >
            Add to Bag
          </button>

          {/* ❤️ WISHLIST FIXED MOBILE + DESKTOP */}
          <button
            onClick={() => toggleWishlist(product._id)}
            className={`border py-3 sm:py-4 rounded-full text-sm sm:text-base transition ${isFav ? 'bg-black text-white' : ''
              }`}
          >
            {isFav ? 'Saved ♥' : 'Favourite ♡'}
          </button>

        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="mt-12 sm:mt-16">

        <div className="flex gap-6 sm:gap-10 border-b text-sm sm:text-base">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 sm:pb-4 ${activeTab === 'description'
                ? 'border-b-2 border-black'
                : ''
              }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 sm:pb-4 ${activeTab === 'reviews'
                ? 'border-b-2 border-black'
                : ''
              }`}
          >
            Reviews (3)
          </button>
        </div>

        {activeTab === 'description' && (
          <div className="mt-6 text-gray-600 max-w-3xl text-sm sm:text-base">
            <p>
              This is a premium quality product designed for comfort and performance.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="mt-6 space-y-6 text-sm sm:text-base">
            {[1, 2, 3].map((r) => (
              <div key={r} className="border-b pb-4">
                <p className="font-medium">User {r}</p>
                <p className="text-gray-500">★★★★★</p>
                <p className="text-gray-600 mt-2">
                  Great product, highly recommend!
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= RELATED ================= */}
      <div className="mt-16 sm:mt-20">

        <h2 className="text-lg sm:text-xl font-semibold mb-6">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((item) => (
            <Link key={item._id} to={`/product/${item._id}`}>
              <div>
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                  <img
                    src={item.image[0]}
                    className="h-32 sm:h-40 object-contain mx-auto"
                    alt=""
                  />
                </div>

                <p className="mt-2 text-xs sm:text-sm">{item.name}</p>
                <p className="font-medium text-sm sm:text-base">
                  {currency}{item.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  )
}

export default Product