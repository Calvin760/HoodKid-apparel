import React from 'react'
import { assets } from "../assets/assets";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="w-full">

      {/* ================= MOBILE ================= */}
      <div className="block sm:hidden">

        {/* Image (cut bottom by reducing height) */}
        <div className="w-full h-[75vh] overflow-hidden relative">
          <img
            src={assets.p29}
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Optional light overlay */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Text BELOW image */}
        <div className="text-center px-6 py-6 flex flex-col items-center">
          <h1 className="text-2xl font-bold tracking-wide">
            ANTI-PILLING FLEECE
          </h1>

          {/* CTA group */}
          <div className="flex flex-col items-center mt-2 gap-1">
            <p className="text-gray-600 text-xs tracking-widest">
              Soft feel. No compromises.
            </p>

            <Link
              to="/collection"
              state={{ subcategory: 'anti pilling fleece' }} // 👈 change based on hero
            >
              <button className="mt-2 px-6 py-2 bg-black text-white text-sm font-semibold">
                SHOP NOW
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden sm:block relative w-full h-[80vh] overflow-hidden">

        <div className="grid grid-cols-2 h-full">
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

          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-wide">
            NEW SEASON DROP
          </h1>
          
          <Link
            to="/collection"
            state={{ subcategory: 'anti pilling fleece' }} // 👈 change based on hero
          >
            <button className="mt-6 px-6 py-2 bg-white text-black text-sm font-semibold hover:bg-black hover:text-white transition">
              SHOP NOW
            </button>
          </Link>

        </div>

      </div>

    </div>
  )
}

export default Hero