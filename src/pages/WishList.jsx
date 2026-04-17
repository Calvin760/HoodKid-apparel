import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const WishList = () => {

  const {
    wishlistProducts,
    wishlistIds,
    toggleWishlist
  } = useContext(ShopContext)

  const API_URL = "http://localhost:5000"

  // ================= EMPTY STATE =================
  if (!wishlistProducts.length) {
    return (
      <div className="max-w-4xl mx-auto p-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Your Wishlist is Empty
        </h2>
        <Link to="/" className="underline">
          Explore Products
        </Link>
      </div>
    )
  }

  // ================= UI =================
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold mb-10">
        Your Wishlist
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {wishlistProducts.map((item) => {

          const isWishlisted = wishlistIds.includes(item._id)

          return (
            <div key={item._id} className="relative group">

              {/* REMOVE */}
              <button
                onClick={() => toggleWishlist(item._id)}
                className="absolute top-2 right-2 bg-white px-2 py-1 text-sm border"
              >
                ✕
              </button>

              {/* IMAGE */}
              <Link to={`/product/${item._id}`}>
                <div className="bg-gray-100 p-4">
                  <img
                    src={
                      item.image?.[0]?.startsWith("http")
                        ? item.image[0]
                        : `${API_URL}/${item.image?.[0]}`
                    }
                    className="h-40 object-contain mx-auto"
                    alt={item.name}
                  />
                </div>
              </Link>

              {/* INFO */}
              <p className="mt-3 text-sm">{item.name}</p>
              <p className="font-medium">
                R{item.price}
              </p>

              {/* ACTIONS */}
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to={`/product/${item._id}`}
                  className="border text-center py-2 text-sm"
                >
                  View Product
                </Link>
              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default WishList