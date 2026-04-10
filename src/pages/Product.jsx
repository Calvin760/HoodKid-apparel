import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Product = () => {

  const { productId } = useParams()
  const { products } = useContext(ShopContext)

  const [product, setProduct] = useState(null)
  const [image, setImage] = useState('')
  const [size, setSize] = useState('')

  // 🔥 GET PRODUCT
  useEffect(() => {
    const found = products.find(p => p._id === productId)
    if (found) {
      setProduct(found)
      setImage(found.image[0])
    }
  }, [productId, products])

  if (!product) return <div className="p-10">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* 🔥 LEFT - THUMBNAILS */}
        <div className="hidden lg:flex flex-col gap-4">
          {product.image.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setImage(img)}
              className={`w-20 h-20 object-cover cursor-pointer border ${
                image === img ? 'border-black' : 'border-gray-200'
              }`}
              alt=""
            />
          ))}
        </div>

        {/* 🔥 CENTER - MAIN IMAGE */}
        <div className="w-full">
          <div className="bg-gray-100 rounded-lg flex items-center justify-center p-6">
            <img
              src={image}
              className="max-h-[500px] object-contain"
              alt=""
            />
          </div>
        </div>

        {/* 🔥 RIGHT - INFO */}
        <div className="flex flex-col gap-6">

          {/* TITLE */}
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-500 text-sm">{product.category}</p>
            <p className="mt-2 text-lg font-medium">R {product.price}</p>
          </div>

          {/* COLOR OPTIONS (JUST IMAGES) */}
          <div>
            <p className="mb-2 font-medium">Available Options</p>
            <div className="flex gap-3">
              {product.image.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setImage(img)}
                  className={`w-16 h-16 object-cover cursor-pointer border ${
                    image === img ? 'border-black' : 'border-gray-200'
                  }`}
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="font-medium">Select Size</p>
              <span className="text-sm text-gray-500">Size Guide</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {product.sizes.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSize(s)}
                  className={`border py-3 ${
                    size === s
                      ? 'border-black'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ADD TO BAG */}
          <button className="bg-black text-white py-4 rounded-full">
            Add to Bag
          </button>

          {/* FAVORITE */}
          <button className="border py-4 rounded-full">
            Favourite ♡
          </button>

        </div>
      </div>
    </div>
  )
}

export default Product