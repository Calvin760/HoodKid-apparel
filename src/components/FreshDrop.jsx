import { React, useContext } from 'react';
import { Link } from 'react-router-dom'
import { ShopContext } from "../context/ShopContext";
import { optimizeCloudinaryVideo } from "../utils/cloudinary";


const FreshDrop = () => {

    const { products } = useContext(ShopContext);
    const API_URL = import.meta.env.VITE_API_URL;

    const heroProduct = products?.find(
        (item) => item.hero === "hero2"
    );

    const heroProduct2 = products?.find(
        (item) => item.hero === "hero3"
    );

    const getVideo = (product) => {
        if (!product?.video) return null;

        return product.video.startsWith("http")
            ? product.video
            : `${API_URL}/${product.video}`;
    };


    const heroVideo = optimizeCloudinaryVideo(
        getVideo(heroProduct)
    );
    const heroVideo2 = optimizeCloudinaryVideo(
        getVideo(heroProduct2)
    );
    // const heroImage = getImage(heroProduct);

    if (!heroProduct) return null;
    return (
        <div className='my-20'>

            {/* ================= HERO ================= */}
            <div className="relative w-full h-[65vh] overflow-hidden mb-16">

                <video
                    className="w-full h-full object-cover scale-105"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-16">

                    <h2 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                        FRESH
                        <br />
                        ENERGY
                    </h2>

                    <p className="text-gray-300 text-sm mt-2 tracking-widest">
                        ENGINEERED FOR IMPACT
                    </p>

                    <Link to="/collection" state={{ subcategory: 'anti pilling fleece' }}>
                        <button className="mt-6 px-7 py-2 bg-white text-black text-sm font-bold tracking-wide hover:bg-black hover:text-white border border-white transition">
                            EXPLORE
                        </button>
                    </Link>
                </div>
            </div>

            {/* ================= STATEMENT TEXT (PUMA STYLE) ================= */}
            <div className="px-6 sm:px-[8vw] mb-16">

                <div className="max-w-3xl">

                    <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight">
                        BUILT TO MOVE.
                        <br />
                        DESIGNED TO DISRUPT.
                    </h3>

                    <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                        This is not just another drop. It’s a shift in energy — where performance meets street precision.
                        Every detail is tuned for motion, speed, and presence.
                    </p>

                </div>

            </div>

            {/* ================= PORTRAIT PRODUCT VIDEO ================= */}
            <div className="px-6 sm:px-[8vw]">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* VIDEO */}
                    <div className="relative w-full h-[75vh] sm:h-[80vh] overflow-hidden rounded-2xl">

                        <video
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                        >
                            {/* 🔥 YOUR PORTRAIT PRODUCT VIDEO */}
                            <source src={heroVideo2} type="video/mp4" />
                        </video>

                        <div className="absolute inset-0 bg-black/20"></div>

                    </div>

                    {/* TEXT SIDE */}
                    <div className="flex flex-col justify-center">

                        <h4 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            NEXT GEN STREETWEAR
                        </h4>

                        <p className="mt-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                            Precision cuts. Lightweight feel. Maximum attitude.
                            Built for creators, movers, and rule breakers.
                        </p>

                        <Link to="/collection" state={{ subcategory: 'menace to the society' }}>
                            <button className="mt-6 w-fit px-6 py-2 bg-black text-white text-sm font-semibold hover:bg-white hover:text-black border border-black transition">
                                SHOP THE DROP
                            </button>
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default FreshDrop