import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import ProductItem from './ProductItem'
import Loading from './Loading'
import { optimizeCloudinaryVideo } from "../utils/cloudinary";

const BestSeller = () => {

    const API_URL = import.meta.env.VITE_API_URL

    const {
        products,
        toggleWishlist,
        wishlistIds
    } = useContext(ShopContext)

    const [bestSeller, setBestSeller] = useState([])
    const [loading, setLoading] = useState(true)
    const [hasScrolled, setHasScrolled] = useState(false) // ✅ swipe detection

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

        const bestProduct = products.filter((item) => item.bestseller)

        setBestSeller(bestProduct.slice(0, 4))
        setLoading(false)
    }, [products])

    const isWishlisted = (productId) => {
        return wishlistIds.includes(productId)
    }

    const heroProduct = products?.find(
        (item) => item.hero === "hero1"
    
    );

    const getVideo = (product) => {
        if (!product?.video) return null;
        

        return product.video.startsWith("http")
            ? product.video
            : `${API_URL}/${product.video}`;
    };

    const heroVideo1 = optimizeCloudinaryVideo(
        getVideo(heroProduct)
    );
    // console.log("HERO PRODUCT", heroProduct)

    


    if (loading) {
        return <Loading text="Loading best seller collection..." />
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
                        preload="metadata"
                    >
                        <source src={heroVideo1} type="video/mp4" />
                    </video>

                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="text-center px-6 py-6 flex flex-col items-center">
                    <h1 className="text-2xl font-bold tracking-wide">
                        CAUTION CAPSULE
                    </h1>

                    <div className="flex flex-col items-center mt-2 gap-1">
                        <p className="text-gray-600 text-xs tracking-widest">
                            WHITE IS THE STATEMENT
                        </p>

                        <Link
                            to="/collection"
                            state={{ subcategory: "caution capsule" }}
                        >
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
                    preload="metadata"
                >
                    <source src={heroVideo1} type="video/mp4" />
                </video>

                <div className="absolute inset-0 flex flex-col justify-center items-start px-16 bg-black/40">
                    <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        WEAR IF
                        <br />
                        YOU'RE REAL
                    </h2>

                    <p className="text-gray-300 text-sm mt-2 tracking-widest">
                        BUILT FOR SPEED & STYLE
                    </p>

                    <Link
                        to="/collection"
                        state={{ subcategory: "caution capsule" }}
                    >
                        <button className="mt-6 px-7 py-2 bg-white text-black text-sm font-bold tracking-wide hover:bg-black hover:text-white border border-white transition">
                            SHOP NOW
                        </button>
                    </Link>
                </div>
            </div>

            {/* ================= PRODUCTS ================= */}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

                {/* 📱 MOBILE */}
                <div className="relative sm:hidden">

                    {/* FADE EDGES */}
                    <div className="absolute left-0 top-0 h-full w-10 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 h-full w-10 to-transparent z-10 pointer-events-none" />

                    {/* SCROLL AREA */}
                    <div
                        className='flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory'
                        onScroll={() => setHasScrolled(true)}
                    >

                        {bestSeller.map((item) => {

                            const liked = isWishlisted(item._id)

                            return (
                                <div
                                    key={item._id}
                                    className='min-w-[90%] px-4 relative snap-center'
                                >

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
                                        colours={item.colours}
                                    />
                                </div>
                            )
                        })}

                    </div>


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

export default BestSeller