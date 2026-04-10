import React, { useContext, useMemo, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import { useLocation } from 'react-router-dom'

const Collection = () => {
  const location = useLocation()
  const { products } = useContext(ShopContext)

  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // filter state
  const [category, setCategory] = useState('all')
  const [gender, setGender] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [colour, setColour] = useState('all')

  const colours = ['all', 'black', 'white', 'red', 'blue', 'green', 'brown', 'yellow', 'pink', 'purple', 'grey']

  const filteredProducts = useMemo(() => {
    let list = [...products]

    if (category !== 'all') list = list.filter(p => p.category === category)
    if (gender !== 'all') list = list.filter(p => p.gender === gender)
    if (colour !== 'all') list = list.filter(p => p.colour === colour)

    if (priceRange !== 'all') {
      if (priceRange === 'low') list = list.filter(p => p.price < 1000)
      if (priceRange === 'mid') list = list.filter(p => p.price >= 1000 && p.price <= 3000)
      if (priceRange === 'high') list = list.filter(p => p.price > 3000)
    }

    return list
  }, [products, category, gender, priceRange, colour])

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
          className="flex items-center gap-2 border rounded-full px-4 py-2 text-sm whitespace-nowrap"
        >
          ☰ Filters
        </button>

        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter('gender')
          }}
          className="border rounded-full px-4 py-2 text-sm whitespace-nowrap"
        >
          Gender ▾
        </button>

        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter('colour')
          }}
          className="border rounded-full px-4 py-2 text-sm whitespace-nowrap"
        >
          Colour ▾
        </button>

        <button
          onClick={() => {
            setShowFilters(true)
            setActiveFilter('price')
          }}
          className="border rounded-full px-4 py-2 text-sm whitespace-nowrap"
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
              {['all', 'shorts', 'tops', 'hoodies'].map(item => (
                <label key={item} className="flex items-center gap-2">
                  <input type="radio" checked={category === item} onChange={() => setCategory(item)} />
                  <span className="capitalize">{item}</span>
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Gender</h3>
              {['all', 'unisex', 'male', 'female'].map(item => (
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
            {filteredProducts.map(item => (
              <ProductItem
                key={item._id}
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        </section>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">

            {/* HEADER */}
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

            {/* BACK BUTTON */}
            {activeFilter && (
              <button
                onClick={() => setActiveFilter(null)}
                className="text-sm mb-4"
              >
                ← Back
              </button>
            )}

            <div className="space-y-6">

              {/* CATEGORY */}
              {!activeFilter && (
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  {['all', 'shorts', 'tops', 'hoodies'].map(item => (
                    <label key={item} className="flex items-center gap-2 py-1">
                      <input type="radio" checked={category === item} onChange={() => setCategory(item)} />
                      <span className="capitalize">{item}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* GENDER */}
              {(activeFilter === null || activeFilter === 'gender') && (
                <div>
                  <h3 className="font-semibold mb-3">Gender</h3>
                  {['all', 'unisex', 'male', 'female'].map(item => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="radio" checked={gender === item} onChange={() => setGender(item)} />
                      <span className="capitalize">{item}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* COLOUR */}
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

              {/* PRICE */}
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

              {/* APPLY */}
              <button
                onClick={() => {
                  setShowFilters(false)
                  setActiveFilter(null)
                }}
                className="w-full bg-black text-white py-3 rounded-full mt-4"
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