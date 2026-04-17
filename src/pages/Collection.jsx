import React, { useContext, useMemo, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import { useLocation } from 'react-router-dom'

const Collection = () => {
  const location = useLocation()
  const { products, toggleWishlist, wishlistIds, search } = useContext(ShopContext)

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // filter state
  const [category, setCategory] = useState('all')
  const [gender, setGender] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [colour, setColour] = useState('all')

  const colours = ['all', 'black', 'white', 'red', 'blue', 'green', 'brown', 'yellow', 'pink', 'purple', 'grey']
  
  const formatImages = (imgs) => {
    if (!imgs || imgs.length === 0) return []

    return imgs.map(img =>
      img.startsWith("http")
        ? img
        : `http://localhost:5000/${img}`
    )
  }

  const filteredProducts = useMemo(() => {
    let list = [...products]

    // 🔍 SEARCH (case-insensitive)
    if (search.trim() !== "") {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q)
      )
    }

    // 📦 CATEGORY (array + case-insensitive)
    // 📦 CATEGORY (string OR array, case-insensitive)
    if (category !== 'all') {
      const selected = category.toLowerCase()

      list = list.filter(p => {
        if (!p.category) return false

        // if category is an array
        if (Array.isArray(p.category)) {
          return p.category.some(cat =>
            String(cat).toLowerCase() === selected
          )
        }

        // if category is a string
        return String(p.category).toLowerCase() === selected
      })
    }

    // 🚻 GENDER (case-insensitive)
    if (gender !== 'all') {
      const selected = gender.toLowerCase()

      list = list.filter(p =>
        p.gender?.toLowerCase() === selected
      )
    }

    // 🎨 COLOUR (from colours array)
    if (colour !== 'all') {
      const selected = colour.toLowerCase()

      list = list.filter(p =>
        Array.isArray(p.colours) &&
        p.colours.some(c =>
          c.name?.toLowerCase() === selected
        )
      )
    }

    // 💰 PRICE
    if (priceRange !== 'all') {
      list = list.filter(p => {
        const price = Number(p.price)
        if (priceRange === 'low') return price < 1000
        if (priceRange === 'mid') return price >= 1000 && price <= 3000
        if (priceRange === 'high') return price > 3000
        return true
      })
    }

    return list
  }, [products, category, gender, priceRange, colour, search])

  useEffect(() => {
    if (location.state) {
      if (location.state.category) {
        setCategory(location.state.category)
      }
      if (location.state.gender) {
        setGender(location.state.gender)
      }
    }
  }, [location.state])

  return (
    <div className="max-w-[1400px] mx-auto px-4">

      {/* Title */}
      <h1 className="text-xl font-semibold py-4">
        New Trainers & Gear ({filteredProducts.length})
      </h1>

      {/* MOBILE FILTER BAR */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4">
        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter(null)
          }}
          className="flex items-center gap-2 border px-4 py-2 text-sm whitespace-nowrap"
        >
          ☰ Filters
        </button>

        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter('gender')
          }}
          className="border px-4 py-2 text-sm whitespace-nowrap"
        >
          Gender ▾
        </button>

        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter('colour')
          }}
          className="border px-4 py-2 text-sm whitespace-nowrap"
        >
          Colour ▾
        </button>

        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter('price')
          }}
          className="border px-4 py-2 text-sm whitespace-nowrap"
        >
          Price ▾
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* DESKTOP FILTERS */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">

            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              {['all', 'shorts', 'tops', 'hoodies', 'pants'].map(item => (
                <label key={item} className="flex items-center gap-2">
                  <input type="radio" checked={category === item} onChange={() => setCategory(item)} />
                  <span className="capitalize">{item}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Gender</h3>
              {['all', 'unisex', 'men', 'women'].map(item => (
                <label key={item} className="flex items-center gap-2">
                  <input type="radio" checked={gender === item} onChange={() => setGender(item)} />
                  <span className="capitalize">{item}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Shop By Price</h3>
              <label className="flex items-center gap-2">
                <input type="radio" checked={priceRange === 'all'} onChange={() => setPriceRange('all')} /> All
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={priceRange === 'low'} onChange={() => setPriceRange('low')} /> Under 1,000
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={priceRange === 'mid'} onChange={() => setPriceRange('mid')} /> 1,000 – 3,000
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={priceRange === 'high'} onChange={() => setPriceRange('high')} /> Over 3,000
              </label>
            </div>
          </div>
        </aside>

        {/* PRODUCTS */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5">

            {filteredProducts.map(item => {

              const isWishlisted = wishlistIds.includes(item._id)

              return (
                <div key={item._id} className="relative">

                  {/* ❤️ Wishlist Icon */}
                  <button
                    onClick={() => toggleWishlist(item._id)}
                    className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur p-2 rounded-full shadow-sm transition hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={isWishlisted ? "black" : "none"}
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

                  {/* PRODUCT (UNCHANGED) */}
                  <ProductItem
                    id={item._id}
                    name={item.name}
                    image={
                      item.colours?.length && item.colours[0].images?.length
                        ? formatImages(item.colours[0].images)
                        : formatImages(item.image)
                    }
                    price={item.price}
                  />

                </div>
              )
            })}

          </div>
        </section>
        
      </div>

      {/* MOBILE FILTER DRAWER (UNCHANGED) */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">
                {activeFilter === 'gender'
                  ? 'Gender'
                  : activeFilter === 'colour'
                    ? 'Colour'
                    : activeFilter === 'price'
                      ? 'Shop By Price'
                      : 'Filters'}
              </h2>

              <button onClick={() => {
                setShowFilters(false)
                setActiveFilter(null)
              }}>
                ✕
              </button>
            </div>

            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="text-sm mb-4"
              >
                ← Back
              </button>
            )}

            <div className="space-y-6">

              {!activeFilter && (
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  {['all', 'shorts', 'tops', 'hoodies', 'pants'].map(item => (
                    <label key={item} className="flex items-center gap-2 py-1">
                      <input type="radio" checked={category === item} onChange={() => setCategory(item)} />
                      <span className="capitalize">{item}</span>
                    </label>
                  ))}
                </div>
              )}

              {(activeFilter === null || activeFilter === 'gender') && (
                <div>
                  <h3 className="font-semibold mb-3">Gender</h3>
                  {['all', 'unisex', 'men', 'women'].map(item => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="radio" checked={gender === item} onChange={() => setGender(item)} />
                      <span className="capitalize">{item}</span>
                    </label>
                  ))}
                </div>
              )}

              {(activeFilter === null || activeFilter === 'colour') && (
                <div>
                  <h3 className="font-semibold mb-3">Colour</h3>
                  <div className="grid grid-cols-3 gap-x-2 gap-y-3">
                    {colours.map(c => (
                      <button key={c} onClick={() => setColour(c)} className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full border ${colour === c ? 'ring-2 ring-black scale-110' : ''}`}
                          style={{ backgroundColor: c === 'all' ? '#fff' : c }}
                        />
                        <span className="text-sm capitalize">{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(activeFilter === null || activeFilter === 'price') && (
                <div>
                  <h3 className="font-semibold mb-2">Shop By Price</h3>
                  <label className="flex items-center gap-2 py-1">
                    <input type="radio" checked={priceRange === 'all'} onChange={() => setPriceRange('all')} /> All
                  </label>
                  <label className="flex items-center gap-2 py-1">
                    <input type="radio" checked={priceRange === 'low'} onChange={() => setPriceRange('low')} /> Under 1,000
                  </label>
                  <label className="flex items-center gap-2 py-1">
                    <input type="radio" checked={priceRange === 'mid'} onChange={() => setPriceRange('mid')} /> 1,000 – 3,000
                  </label>
                  <label className="flex items-center gap-2 py-1">
                    <input type="radio" checked={priceRange === 'high'} onChange={() => setPriceRange('high')} /> Over 3,000
                  </label>
                </div>
              )}

              <button
                onClick={() => {
                  setShowFilters(false)
                  setActiveFilter(null)
                }}
                className="w-full bg-black text-white py-3 mt-4"
              >
                Apply Filters
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Collection