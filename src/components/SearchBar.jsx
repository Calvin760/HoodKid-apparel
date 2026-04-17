import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'

const SearchBar = () => {

    const {
        search,
        setSearch,
        showSearch,
        setShowSearch,
        products
    } = useContext(ShopContext)

    const trending = ['Caution capsule', 'Hoodies', 'Mini-skirt', 'Leggings set']
    const popular = ['Black hoodie', 'White sneakers', 'Tracksuit', 'Cap']

    const [page, setPage] = useState(0)
    const ITEMS_PER_PAGE = 4

    const formatImages = (imgs) => {
        if (!imgs || imgs.length === 0) return []

        return imgs.map(img =>
            img.startsWith("http")
                ? img
                : `http://localhost:5000/${img}`
        )
    }

    const results = useMemo(() => {
        if (!search.trim()) return []
        return products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, products])

    const paginatedResults = results.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE
    )

    return showSearch ? (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">

            {/* 🔥 HEADER */}
            <div className="sticky top-0 z-10 flex justify-center px-4 py-4 border-b">

                <div className="flex items-center gap-4 w-full max-w-3xl">

                    {/* SEARCH BAR */}
                    <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 flex-1">

                        <img src={assets.search_icon} className="w-4" alt="" />

                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(0) // reset page on new search
                            }}
                            autoFocus
                            placeholder="Search products..."
                            className="w-full bg-transparent outline-none text-sm"
                        />
                    </div>

                    {/* CLOSE */}
                    <img
                        onClick={() => setShowSearch(false)}
                        src={assets.cross_icon}
                        className="w-5 cursor-pointer"
                        alt=""
                    />
                </div>
            </div>

            {/* 🔥 CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6 max-w-7xl mx-auto w-full scrollbar-hide">

                {/* EMPTY STATE */}
                {search.length === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Trending */}
                        <div>
                            <h2 className="font-semibold mb-4 text-lg">Trending Searches</h2>
                            <div className="flex flex-wrap gap-2">
                                {trending.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setSearch(item)
                                            setPage(0)
                                        }}
                                        className="px-4 py-2 bg-gray-100 text-sm hover:bg-gray-200 transition"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Popular */}
                        <div>
                            <h2 className="font-semibold mb-4 text-lg">Popular</h2>
                            <div className="flex flex-wrap gap-2">
                                {popular.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setSearch(item)
                                            setPage(0)
                                        }}
                                        className="px-4 py-2 bg-gray-100  text-sm hover:bg-gray-200 transition"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                )}

                {/* RESULTS */}
                {search.length > 0 && (
                    <div>

                        <h2 className="font-semibold mb-6 text-lg">
                            Results ({results.length})
                        </h2>

                        {/* 📱 MOBILE / TABLET */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:hidden gap-5">
                            {results.map((item) => (
                                <Link
                                    key={item._id}
                                    to={`/product/${item._id}`}
                                    onClick={() => setShowSearch(false)}
                                >
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
                                </Link>
                            ))}
                        </div>

                        {/* 🖥 DESKTOP PAGINATION */}
                        <div className="hidden xl:block">

                            {/* GRID */}
                            <div className="grid grid-cols-4 gap-8">
                                {paginatedResults.map((item) => (
                                    <Link
                                        key={item._id}
                                        to={`/product/${item._id}`}
                                        onClick={() => setShowSearch(false)}
                                    >
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
                                    </Link>
                                ))}
                            </div>

                            {/* CONTROLS */}
                            <div className="flex justify-center items-center gap-6 mt-8">

                                <button
                                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                                    disabled={page === 0}
                                    className="px-4 py-2 border rounded disabled:opacity-30"
                                >
                                    Prev
                                </button>

                                <span className="text-sm">
                                    Page {page + 1} of {Math.ceil(results.length / ITEMS_PER_PAGE)}
                                </span>

                                <button
                                    onClick={() =>
                                        setPage(prev =>
                                            (prev + 1) * ITEMS_PER_PAGE < results.length ? prev + 1 : prev
                                        )
                                    }
                                    disabled={(page + 1) * ITEMS_PER_PAGE >= results.length}
                                    className="px-4 py-2 border rounded disabled:opacity-30"
                                >
                                    Next
                                </button>

                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    ) : null
}

export default SearchBar