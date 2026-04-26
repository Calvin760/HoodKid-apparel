import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from './ProductItem'
import Loading from './Loading'

const Headwear = () => {

    const API_URL = import.meta.env.VITE_API_URL

    const {
        products,
        toggleWishlist,
        wishlistIds
    } = useContext(ShopContext)

    const [headwear, setHeadwear] = useState([])
    const [loading, setLoading] = useState(true)

    const formatImages = (imgs) => {
        if (!imgs || imgs.length === 0) return []

        return imgs.map(img =>
            img.startsWith("http")
                ? img
                : `${API_URL}/${img}`
        )
    }

    useEffect(() => {
        if (!products || products.length === 0) {
            setLoading(true)
            return
        }

        const filtered = products
            .filter(item => item.category?.toLowerCase() === 'headwear')
            .slice(-4                                                                                                                                             ) // ✅ last 4 headwear items

        setHeadwear(filtered)
        setLoading(false)
    }, [products])

    const isWishlisted = (id) => wishlistIds.includes(id)

    if (loading) {
        return <Loading text="Loading headwear..." />
    }

    return (
        <div className="my-10">

            {/* ================= TEXT HEADER ================= */}
            <div className="text-center mb-6 px-4">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
                    HEADWEAR
                </h2>
                <p className="text-gray-500 text-sm mt-1 tracking-widest">
                    TOP OFF YOUR LOOK
                </p>
            </div>

            {/* ================= PRODUCTS ================= */}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

                {/* 📱 MOBILE (2 columns) */}
                <div className="sm:hidden grid grid-cols-2 gap-4">

                    {headwear.map((item) => {

                        const liked = isWishlisted(item._id)

                        return (
                            <div key={item._id} className='relative'>

                                <button
                                    onClick={() => toggleWishlist(item._id)}
                                    className="absolute top-2 right-2 z-10 bg-white/90 p-2 rounded-full shadow-sm"
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
                                    colours={item.colours}
                                />

                            </div>
                        )
                    })}

                </div>

                {/* 💻 DESKTOP */}
                <div className='hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>

                    {headwear.map((item) => {

                        const liked = isWishlisted(item._id)

                        return (
                            <div key={item._id} className='relative group'>

                                <button
                                    onClick={() => toggleWishlist(item._id)}
                                    className="absolute top-3 right-3 z-10 bg-white/90 p-2 rounded-full shadow-sm"
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
                                    colours={item.colours}
                                />

                            </div>
                        )
                    })}

                </div>

            </div>
        </div>
    )
}

export default Headwear