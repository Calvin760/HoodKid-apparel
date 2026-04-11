import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

const WishList = () => {

  const {
    wishlistProducts,
    toggleWishlist,
    addToCart,
    currency
  } = useContext(ShopContext)

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
        <Link to="/" className="underline">Explore Products</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold mb-10">Your Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {wishlistProducts.map((item) => (
          <div key={item._id} className="relative group">

            {/* REMOVE */}
            <button
              onClick={() => {
                toggleWishlist(item._id)
                toast.info("Removed from wishlist")
              }}
              className="absolute top-2 right-2 bg-white px-2 py-1 text-sm border"
            >
              ✕
            </button>

            {/* IMAGE */}
            <Link to={`/product/${item._id}`}>
              <div className="bg-gray-100 p-4 rounded-lg">
                <img
                  src={item.image[0]}
                  className="h-40 object-contain mx-auto"
                  alt=""
                />
              </div>
            </Link>

            {/* INFO */}
            <p className="mt-3 text-sm">{item.name}</p>
            <p className="font-medium">
              {currency}{item.price}
            </p>

            {/* ACTIONS */}
            <div className="mt-3 flex flex-col gap-2">

              <Link
                to={`/product/${item._id}`}
                className="border text-center py-2 text-sm"
              >
                View Product
              </Link>

              <button
                onClick={() => {
                  const success = addToCart(item._id, item.sizes?.[0])

                  if (success) {
                    toast.success("Added to cart")
                  }
                }}
                className="bg-black text-white py-2 text-sm"
              >
                Add to Cart
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default WishList