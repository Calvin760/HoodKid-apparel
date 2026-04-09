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
        setBestSeller(bestProduct.slice(4, 8))
    }, [])

    return (
        <div className='my-10'>

            {/* ================= MOBILE VIDEO ================= */}
            <div className="block sm:hidden mb-10">

                {/* Video */}
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

                {/* Text BELOW */}
                <div className="px-6 py-6 text-center">
                    <h1 className="text-2xl font-bold tracking-wide">
                        NEW SEASON DROP
                    </h1>
                    <p className="text-gray-600 text-xs tracking-widest mb-2">
                        LEVEL UP YOUR LOOK
                    </p>
                    <button className="mt-4 px-6 py-2 bg-black text-white text-sm font-semibold">
                        SHOP NOW
                    </button>
                </div>
            </div>


            {/* ================= DESKTOP VIDEO ================= */}
            <div className="hidden sm:block relative w-full h-[75vh] sm:h-[70vh] overflow-hidden mb-10">

                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src={assets.Hero} type="video/mp4" />
                </video>

                <div className="absolute inset-0 flex flex-col justify-center items-start px-6 sm:px-10 md:px-16 bg-black/40">

                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        BEST SELLERS
                    </h1>

                    <button className="bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-black hover:text-white transition">
                        SHOP NOW
                    </button>
                </div>
            </div>


            {/* 🧱 TITLE */}
            {/* <div className='text-center text-3xl py-8 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum is simply dummy text of the printing and typesetting industry.
                </p>
            </div> */}


            {/* 🛍️ PRODUCTS */}
            <div className='px-0 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>

                {/* 📱 MOBILE: FULL WIDTH SLIDER */}
                <div className='flex sm:hidden overflow-x-auto scrollbar-hide'>

                    {
                        bestSeller.map((item, index) => (
                            <div key={index} className='min-w-[100%] px-4 relative'>

                                {/* ❤️ Wishlist */}
                                <button className='absolute top-4 right-6 z-10 bg-white p-2 rounded-full shadow'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" strokeWidth={1.5}
                                        stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.255 1.01-4 2.475C11.755 4.76 10.24 3.75 8.5 3.75 6.015 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25z" />
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


                {/* 💻 DESKTOP GRID */}
                <div className='hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {
                        bestSeller.map((item, index) => (
                            <div key={index} className='relative'>

                                <button className='absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow hover:bg-black hover:text-white transition'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" strokeWidth={1.5}
                                        stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.255 1.01-4 2.475C11.755 4.76 10.24 3.75 8.5 3.75 6.015 3.75 4 5.765 4 8.25c0 7.22 8 11.25 8 11.25s8-4.03 8-11.25z" />
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