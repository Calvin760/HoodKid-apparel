import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import ProductItem from './ProductItem'

const BestSeller = () => {

    const {
        products,
        toggleWishlist,
        wishlistIds // ✅ backend source
    } = useContext(ShopContext)

    const [bestSeller, setBestSeller] = useState([])
    
    const formatImages = (imgs) => {
        if (!imgs || imgs.length === 0) return []

        return imgs.map(img =>
            img.startsWith("http")
                ? img
                : `http://localhost:5000/${img}`
        )
    }
    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller)
        setBestSeller(bestProduct.slice(0, 4))
    }, [products])

    // helper: check wishlist status
    const isWishlisted = (productId) => {
        return wishlistIds.includes(productId)
    }

    return (
        <div className='my-10'>

            {/* ================= MOBILE VIDEO ================= */}
            <div className="block sm:hidden mb-10">

                <div className="w-full h-[75vh] overflow-hidden relative">
                    <video
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={assets.Hero} type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="text-center px-6 py-6 flex flex-col items-center">
                    <h1 className="text-2xl font-bold tracking-wide">
                        NEW SEASON DROP
                    </h1>

                    <div className="flex flex-col items-center mt-2 gap-1">
                        <p className="text-gray-600 text-xs tracking-widest">
                            LEVEL UP YOUR LOOK
                        </p>

                        <Link to="/collection">
                            <button className="mt-2 px-6 py-2 bg-black text-white text-sm font-semibold">
                                SHOP NOW
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* ================= DESKTOP VIDEO ================= */}
            <div className="hidden sm:block relative w-full h-[75vh] overflow-hidden mb-10">

                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={assets.Hero} type="video/mp4" />
                </video>

                <div className="absolute inset-0 flex flex-col justify-center items-start px-16 bg-black/40">

                    <h1 className="text-white text-5xl font-bold mb-4">
                        BEST SELLERS
                    </h1>

                    <Link to="/collection">
                        <button className="mt-6 px-6 py-2 bg-white text-black text-sm font-semibold hover:bg-black hover:text-white transition">
                            SHOP NOW
                        </button>
                    </Link>
                </div>
            </div>

            {/* ================= PRODUCTS ================= */}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

                {/* 📱 MOBILE */}
                <div className='flex sm:hidden overflow-x-auto scrollbar-hide'>

                    {bestSeller.map((item) => {

                        const liked = isWishlisted(item._id)

                        return (
                            <div key={item._id} className='min-w-full px-4 relative'>

                                <button
                                    onClick={() => toggleWishlist(item._id)}
                                    className="absolute top-4 right-6 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm transition hover:scale-110"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={liked ? "black" : "none"}
                                        stroke="black"
                                        strokeWidth="1.5"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                </button>

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
                            </div>
                        )
                    })}

                </div>

                {/* 💻 DESKTOP GRID */}
                <div className='hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>

                    {bestSeller.map((item) => {

                        const liked = isWishlisted(item._id)

                        return (
                            <div key={item._id} className='relative group'>

                                <button
                                    onClick={() => toggleWishlist(item._id)}
                                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm transition hover:scale-110"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill={liked ? "black" : "none"}
                                        stroke="black"
                                        strokeWidth="1.5"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                </button>

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
                            </div>
                        )
                    })}

                </div>

            </div>
        </div>
    )
}

export default BestSeller