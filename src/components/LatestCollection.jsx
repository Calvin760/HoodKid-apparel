import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'

const LatestCollection = () => {

    const { products, toggleWishlist, wishlistItems } = useContext(ShopContext)

    const [latestProducts, setLatestProducts] = useState([])

    useEffect(() => {
        setLatestProducts(products.slice(0, 4))
    }, [products])

    return (
        <div className="my-10 px-4 sm:px-0">

            {/* PRODUCTS GRID */}
            <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

                {latestProducts.map((item, index) => {

                    const isWishlisted = wishlistItems.includes(item._id)

                    return (
                        <div key={index} className="relative group">

                            {/* ❤️ WISHLIST BUTTON */}
                            <button
                                onClick={() => toggleWishlist(item._id)}
                                className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm transition hover:scale-110"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={isWishlisted ? "black" : "none"}
                                    stroke="black"
                                    strokeWidth="1.5"
                                    className="w-5 h-5 transition"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                    />
                                </svg>
                            </button>

                            {/* PRODUCT CARD */}
                            <ProductItem
                                id={item._id}
                                image={item.image}
                                name={item.name}
                                price={item.price}
                            />

                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default LatestCollection