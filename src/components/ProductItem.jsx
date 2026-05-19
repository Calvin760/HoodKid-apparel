import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { optimizeCloudinaryImage } from "../utils/cloudinary";

const ProductItem = ({ id, image, name, price, colours }) => {
  const { currency } = useContext(ShopContext);

  const colourCount = (colours || []).length;

  return (
    <>
      <Link
        to={`/product/${id}`}
        className="group block animate-scaleIn"
      >
        {/* IMAGE CARD */}
        <div className="relative bg-[#f5f5f5] aspect-square flex items-center justify-center overflow-hidden rounded-2xl">

          {/* subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 z-10" />

          <img
            src={optimizeCloudinaryImage(image[0], 600)}
            alt={name}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="
              object-contain
              transition-all
              duration-500
              ease-out
              group-hover:scale-105
              group-hover:-translate-y-1
            "
          />

          {/* hover overlay */}
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-black/80 text-white
              text-[11px] tracking-widest
              py-3 text-center
              translate-y-full
              group-hover:translate-y-0
              transition-transform duration-300
              uppercase z-20
            "
          >
            View Product
          </div>
        </div>

        {/* INFO */}
        <div className="mt-4 px-1">

          <p className="text-[10px] tracking-[0.25em] text-gray-500 uppercase">
            {colourCount > 0
              ? `${colourCount} COLOUR${colourCount > 1 ? "S" : ""}`
              : "Single Colour"}
          </p>

          <p
            className="
              mt-2
              text-sm
              font-semibold
              text-gray-900
              leading-tight
              transition-colors
              duration-300
              group-hover:text-black
            "
          >
            {name}
          </p>

          <div className="mt-2 flex items-center justify-between">

            <p className="text-sm font-bold text-black">
              {currency} {price}
            </p>

          </div>
        </div>
      </Link>

      {/* STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');

        * {
          font-family: 'Poppins', system-ui, -apple-system, sans-serif;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.35s ease-out;
        }

        /* Smooth scrollbar */
        .max-h-\\[90vh\\]::-webkit-scrollbar {
          width: 6px;
        }

        .max-h-\\[90vh\\]::-webkit-scrollbar-track {
          background: transparent;
        }

        .max-h-\\[90vh\\]::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .max-h-\\[90vh\\]::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        input[type="radio"] {
          cursor: pointer;
          accent-color: #000;
        }
      `}</style>
    </>
  );
};

export default React.memo(ProductItem);