import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom'
import { optimizeCloudinaryImage } from "../utils/cloudinary";

const ProductItem = ({ id, image, name, price, colours}) => {

  const { currency } = useContext(ShopContext)

  // console.log('Colours', colours)
  
  const colourCount = (colours || []).length

  return (
    <Link
      to={`/product/${id}`}
      className="group block"
    >

      {/* IMAGE CARD */}
      <div className="relative bg-[#f5f5f5] aspect-square flex items-center justify-center overflow-hidden">

        <img
          src={optimizeCloudinaryImage(image[0], 600)}
          alt={name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="object-contain transition duration-300 group-hover:scale-105"
        />

      </div>

      {/* INFO */}
      <div className="mt-3 px-1">

        {/* SAME UI — just dynamic */}
        <p className="text-[10px] tracking-widest text-gray-500 uppercase">
          {colourCount > 0
            ? `${colourCount} COLOUR${colourCount > 1 ? "S" : ""}`
            : "SINGLE COLOUR"}
        </p>

        <p className="mt-1 text-sm font-medium text-gray-900 leading-tight">
          {name}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-black">
            {currency} {price}
          </p>
        </div>

      </div>

    </Link>
  )
}

export default ProductItem