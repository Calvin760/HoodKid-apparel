import React from 'react'
import { assets } from "../assets/assets";

const Hero = () => {
  return (
    <div className="relative w-full h-[80vh] overflow-hidden">

      {/* Mobile Image (ONLY on small screens) */}
      <div className="block sm:hidden h-full">
        <img
          src={assets.p29}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Desktop Images (hidden on small screens) */}
      <div className="hidden sm:grid grid-cols-2 h-full">
        <img
          src={assets.p26}
          alt=""
          className="w-full h-full object-cover"
        />
        <img
          src={assets.p30}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

        <p className="text-white text-sm tracking-widest mb-3">
          LEVEL UP YOUR LOOK
        </p>

        <h1 className="text-white text-3xl sm:text-6xl font-bold tracking-wide">
          NEW SEASON DROP
        </h1>

        <button className="mt-6 px-6 py-2 bg-white text-black text-sm font-semibold hover:bg-black hover:text-white transition">
          SHOP NOW
        </button>

      </div>

    </div>
  )
}

export default Hero