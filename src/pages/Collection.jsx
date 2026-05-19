import React, { useContext, useMemo, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import { useLocation } from 'react-router-dom'
import Loading from '../components/Loading'
import { FiSliders, FiX, FiChevronRight } from 'react-icons/fi'

const API_URL = import.meta.env.VITE_API_URL

const Collection = () => {
  const location = useLocation()
  const { products, toggleWishlist, wishlistIds, search } = useContext(ShopContext)
  const [loading, setLoading] = useState(true)

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // filter state
  const [category, setCategory] = useState('all')
  const [subcategory, setSubcategory] = useState('all')
  const [gender, setGender] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [colour, setColour] = useState('all')

  const colours = ['all', 'black', 'white', 'red', 'blue', 'green', 'brown', 'yellow', 'pink', 'purple', 'grey']
  const colourMap = {
    'black': '#000000',
    'white': '#FFFFFF',
    'red': '#EF4444',
    'blue': '#3B82F6',
    'green': '#10B981',
    'brown': '#92400E',
    'yellow': '#FBBF24',
    'pink': '#EC4899',
    'purple': '#A855F7',
    'grey': '#9CA3AF'
  }

  const formatImages = (imgs) => {
    if (!imgs || imgs.length === 0) return []

    return imgs.map(img =>
      img.startsWith("http")
        ? img
        : `${API_URL}/${img}`
    )
  }

  // Count active filters
  const activeFilterCount = [category, subcategory, gender, priceRange, colour].filter(f => f !== 'all').length

  useEffect(() => {
    if (!products) return

    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 200)

    return () => clearTimeout(timer)

  }, [products])

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (search.trim() !== "") {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q)
      )
    }

    if (category !== 'all') {
      const selected = category.toLowerCase()
      list = list.filter(p => {
        if (!p.category) return false
        if (Array.isArray(p.category)) {
          return p.category.some(cat =>
            String(cat).toLowerCase() === selected
          )
        }
        return String(p.category).toLowerCase() === selected
      })
    }

    if (subcategory !== 'all') {
      const selected = subcategory.toLowerCase()
      list = list.filter(p => {
        if (!p.subcategory) return false
        if (Array.isArray(p.subcategory)) {
          return p.subcategory.some(cat =>
            String(cat).toLowerCase() === selected
          )
        }
        return String(p.subcategory).toLowerCase() === selected
      })
    }

    if (gender !== 'all') {
      const selected = gender.toLowerCase()
      list = list.filter(p =>
        p.gender?.toLowerCase() === selected
      )
    }

    if (colour !== 'all') {
      const selected = colour.toLowerCase()
      list = list.filter(p =>
        Array.isArray(p.colours) &&
        p.colours.some(c =>
          c.name?.toLowerCase() === selected
        )
      )
    }

    if (priceRange !== 'all') {
      list = list.filter(p => {
        const price = Number(p.price)
        if (priceRange === 'low') return price < 300
        if (priceRange === 'mid') return price >= 300 && price <= 500
        if (priceRange === 'high') return price > 500
        return true
      })
    }

    return list
  }, [products, subcategory, category, gender, priceRange, colour, search])

  useEffect(() => {
    if (location.state) {
      if (location.state.category) {
        setCategory(location.state.category)
      }
      if (location.state.gender) {
        setGender(location.state.gender)
      }
      if (location.state.subcategory) {
        setSubcategory(location.state.subcategory)
      }
    }
  }, [location.state])

  const resetFilters = () => {
    setCategory('all')
    setSubcategory('all')
    setGender('all')
    setPriceRange('all')
    setColour('all')
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">

        {/* HEADER */}
        <div className="mb-8 border-b border-gray-100 pb-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                New Trainers & Gear
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Showing <span className="font-bold text-black">{filteredProducts.length}</span> of {products.length} products
              </p>
            </div>

            {/* MOBILE FILTER BUTTON */}
            <button
              onClick={() => {
                setShowFilters(true)
                setActiveFilter(null)
              }}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition-colors duration-200 relative"
            >
              <FiSliders size={18} strokeWidth={2.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-black text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

          {/* DESKTOP FILTERS */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">

              {/* RESET FILTERS */}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-sm font-semibold text-gray-600 hover:text-black border border-gray-300 rounded-lg transition-colors duration-200"
                >
                  Reset Filters
                </button>
              )}

              {/* CATEGORY */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                  Category
                </h3>
                <div className="space-y-2">
                  {['all', 'shorts', 'tops', 'hoodies', 'pants'].map(item => (
                    <label
                      key={item}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-200"
                    >
                      <input
                        type="radio"
                        checked={category === item}
                        onChange={() => setCategory(item)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="capitalize font-medium text-sm text-gray-700 group-hover:text-black transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GENDER */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                  Gender
                </h3>
                <div className="space-y-2">
                  {['all', 'unisex', 'men', 'women'].map(item => (
                    <label
                      key={item}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-200"
                    >
                      <input
                        type="radio"
                        checked={gender === item}
                        onChange={() => setGender(item)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="capitalize font-medium text-sm text-gray-700 group-hover:text-black transition-colors">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* PRICE */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'low', label: 'Under R 300' },
                    { value: 'mid', label: 'R 300 – R 500' },
                    { value: 'high', label: 'Over R 500' }
                  ].map(item => (
                    <label
                      key={item.value}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors duration-200"
                    >
                      <input
                        type="radio"
                        checked={priceRange === item.value}
                        onChange={() => setPriceRange(item.value)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="font-medium text-sm text-gray-700 group-hover:text-black transition-colors">
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* COLOUR */}
              <div>
                <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                  Color
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {colours.map(c => (
                    <button
                      key={c}
                      onClick={() => setColour(c)}
                      className={`relative group transition-transform duration-200 ${colour === c ? 'scale-110' : 'hover:scale-105'
                        }`}
                      title={c}
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${colour === c
                            ? 'border-black ring-2 ring-black ring-offset-2'
                            : 'border-gray-300 hover:border-black'
                          }`}
                        style={{
                          backgroundColor: c === 'all' ? '#F5F5F5' : colourMap[c] || '#E5E7EB'
                        }}
                      />
                      <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        {c}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* PRODUCTS GRID */}
          <section>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.305 3.305a7.5 7.5 0 0010.345 10.345z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm mb-6">Try adjusting your filters</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition-colors duration-200"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((item, idx) => {
                  const isWishlisted = wishlistIds.includes(item._id)

                  return (
                    <div
                      key={item._id}
                      className="relative group animate-scaleIn"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      {/* WISHLIST BUTTON */}
                      <button
                        onClick={() => toggleWishlist(item._id)}
                        className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 group-hover:opacity-100 opacity-0 sm:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isWishlisted ? "black" : "none"}
                          stroke="black"
                          strokeWidth="2"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                          />
                        </svg>
                      </button>

                      {/* PRODUCT ITEM */}
                      <div className="relative overflow-hidden rounded-lg">
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

                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-xl animate-slideUp">

            {/* DRAWER HEADER */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-lg text-gray-900">
                {activeFilter === 'gender'
                  ? 'Gender'
                  : activeFilter === 'colour'
                    ? 'Color'
                    : activeFilter === 'price'
                      ? 'Price Range'
                      : 'Filters'}
              </h2>

              <button
                onClick={() => {
                  setShowFilters(false)
                  setActiveFilter(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <FiX size={24} strokeWidth={2.5} />
              </button>
            </div>

            {/* BACK BUTTON */}
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 hover:text-black border-b border-gray-100 w-full text-left transition-colors duration-200"
              >
                ← Back to Filters
              </button>
            )}

            <div className="p-6 space-y-6">

              {/* CATEGORY - Always shown */}
              {!activeFilter && (
                <div>
                  <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {['all', 'shorts', 'tops', 'hoodies', 'pants'].map(item => (
                      <label key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          checked={category === item}
                          onChange={() => setCategory(item)}
                          className="w-4 h-4"
                        />
                        <span className="capitalize font-medium text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* GENDER */}
              {(activeFilter === null || activeFilter === 'gender') && (
                <div>
                  <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Gender
                  </h3>
                  <div className="space-y-2">
                    {['all', 'unisex', 'men', 'women'].map(item => (
                      <label key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          checked={gender === item}
                          onChange={() => setGender(item)}
                          className="w-4 h-4"
                        />
                        <span className="capitalize font-medium text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* COLOUR */}
              {(activeFilter === null || activeFilter === 'colour') && (
                <div>
                  <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Color
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {colours.map(c => (
                      <button
                        key={c}
                        onClick={() => setColour(c)}
                        className={`relative transition-transform duration-200 ${colour === c ? 'scale-110' : 'hover:scale-105'
                          }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${colour === c
                              ? 'border-black ring-2 ring-black ring-offset-2'
                              : 'border-gray-300 hover:border-black'
                            }`}
                          style={{
                            backgroundColor: c === 'all' ? '#F5F5F5' : colourMap[c] || '#E5E7EB'
                          }}
                        >
                          {c !== 'all' && (
                            <span className="text-xs font-bold text-white opacity-0 group-hover:opacity-100">
                              {c.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PRICE */}
              {(activeFilter === null || activeFilter === 'price') && (
                <div>
                  <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-wider">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Prices' },
                      { value: 'low', label: 'Under R 300' },
                      { value: 'mid', label: 'R 300 – R 500' },
                      { value: 'high', label: 'Over R 500' }
                    ].map(item => (
                      <label key={item.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          checked={priceRange === item.value}
                          onChange={() => setPriceRange(item.value)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowFilters(false)
                    setActiveFilter(null)
                  }}
                  className="w-full bg-black text-white py-3 px-4 rounded-lg font-bold text-sm hover:bg-gray-900 transition-colors duration-200"
                >
                  Apply Filters
                </button>

                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      resetFilters()
                      setShowFilters(false)
                      setActiveFilter(null)
                    }}
                    className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors duration-200"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

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
          animation: scaleIn 0.2s ease-out;
        }

        /* Smooth scrollbar */
        .max-h-\[90vh\]::-webkit-scrollbar {
          width: 6px;
        }

        .max-h-\[90vh\]::-webkit-scrollbar-track {
          background: transparent;
        }

        .max-h-\[90vh\]::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        .max-h-\[90vh\]::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        input[type="radio"] {
          cursor: pointer;
          accent-color: #000;
        }
      `}</style>
    </div>
  )
}

export default Collection