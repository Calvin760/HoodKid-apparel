import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';
import { assets } from '../assets/assets';

const BestSeller = () => {

    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => (item.bestseller))
        setBestSeller(bestProduct.slice(4, 8)) // ✅ ONLY 4 PRODUCTS
    }, [])

    return (
        <div className='my-10'>

            {/* 🔥 VIDEO HERO SECTION */}
            <div className="relative w-full h-[75vh] sm:h-[85vh] overflow-hidden mb-10">

                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={assets.Hero} type="video/mp4" />
                </video>

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16 bg-black/40">

                    <h1 className="
                        text-white 
                        text-2xl 
                        sm:text-4xl 
                        md:text-5xl 
                        lg:text-6xl 
                        font-bold 
                        mb-3 sm:mb-4
                    ">
                        BEST SELLERS
                    </h1>

                    <button className="
                        bg-white text-black 
                        px-4 py-2 
                        sm:px-6 sm:py-2.5 
                        text-xs sm:text-sm 
                        font-medium 
                        hover:bg-black hover:text-white 
                        transition
                    ">
                        SHOP NOW
                    </button>
                </div>
            </div>

            {/* 🧱 TITLE */}
            <div className='text-center text-3xl py-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum is simply dummy text of the printing and typesetting industry.
                </p>
            </div>

            {/* 🛍️ PRODUCT GRID / SCROLL */}
            <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

                {/* 📱 MOBILE: HORIZONTAL SCROLL */}
                <div className='flex sm:hidden overflow-x-auto gap-4 scrollbar-hide'>
                    {
                        bestSeller.map((item, index) => (
                            <div key={index} className='min-w-[70%] relative'>

                                {/* ❤️ WISHLIST ICON */}
                                <button className='absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.255 1.01-4 2.475C11.755 4.76 10.24 3.75 8.5 3.75 6.015 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25z"
                                        />
                                    </svg>
                                </button>

                                <ProductItem
                                    id={item._id}
                                    name={item.name}
                                    image={item.image}
                                    price={item.price}
                                />
                            </div>
                        ))
                    }
                </div>

                {/* 💻 DESKTOP: GRID */}
                <div className='hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {
                        bestSeller.map((item, index) => (
                            <div key={index} className='relative'>

                                {/* ❤️ WISHLIST ICON */}
                                <button className='absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-black hover:text-white transition'>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.255 1.01-4 2.475C11.755 4.76 10.24 3.75 8.5 3.75 6.015 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25z"
                                        />
                                    </svg>
                                </button>

                                <ProductItem
                                    id={item._id}
                                    name={item.name}
                                    image={item.image}
                                    price={item.price}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default BestSeller