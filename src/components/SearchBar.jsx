import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'
import { FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const SearchBar = () => {

    const API_URL = import.meta.env.VITE_API_URL
    const {
        search,
        setSearch,
        showSearch,
        setShowSearch,
        products
    } = useContext(ShopContext)

    const trending = ['Caution capsule', 'Hoodies', 'Mini-skirt']
    const popular = ['Menace', 'Shorts', 'Pants', 'Panel Cap']

    const [page, setPage] = useState(0)
    const ITEMS_PER_PAGE = 4

    const formatImages = (imgs) => {
        if (!imgs || imgs.length === 0) return []

        return imgs.map(img =>
            img.startsWith("http")
                ? img
                : `${API_URL}/${img}`
        )
    }

    const results = useMemo(() => {
        if (!search.trim()) return []

        const q = search.toLowerCase()

        return products.filter(p => {
            return (
                p.name?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q) ||
                p.subcategory?.toLowerCase().includes(q)
            )
        })
    }, [search, products])

    const paginatedResults = results.slice(
        page * ITEMS_PER_PAGE,
        (page + 1) * ITEMS_PER_PAGE
    )

    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE)

    const handleClose = () => {
        setShowSearch(false)
        setSearch("")
        setPage(0)
    }

    const handleTrendingClick = (item) => {
        setSearch(item)
        setPage(0)
    }

    return showSearch ? (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">

            {/* HEADER */}
            <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 px-4 md:px-6 py-4">

                    {/* SEARCH INPUT */}
                    <div className="flex-1 flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-black focus-within:bg-white">
                        <FiSearch size={18} strokeWidth={2.5} className="text-gray-600 flex-shrink-0" />

                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setPage(0)
                            }}
                            autoFocus
                            placeholder="Search products..."
                            className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    {/* CLOSE BUTTON */}
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
                        aria-label="Close search"
                    >
                        <FiX size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </header>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                    {/* EMPTY STATE - Trending & Popular */}
                    {search.length === 0 && (
                        <div className="space-y-12 animate-fadeIn">

                            {/* Trending Section */}
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                        Trending Searches
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">What's hot right now</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {trending.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => handleTrendingClick(item)}
                                            className="group px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 hover:border-black hover:bg-black hover:text-white transition-all duration-200 text-left"
                                        >
                                            <span className="flex items-center justify-between">
                                                <span>{item}</span>
                                                <FiChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:translate-x-1 transform" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Popular Section */}
                            <section>
                                <div className="mb-6">
                                    <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                                        Popular Products
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Customer favorites</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    {popular.map((item, idx) => (
                                        <button
                                            key={item}
                                            onClick={() => handleTrendingClick(item)}
                                            style={{ animationDelay: `${idx * 50}ms` }}
                                            className="group px-6 py-4 bg-black text-white border border-black rounded-xl text-sm font-semibold hover:bg-gray-900 transition-all duration-200 text-center"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <span>{item}</span>
                                                <FiChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 group-hover:translate-x-1 transform" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Separator */}
                            <div className="border-t border-gray-100" />

                            {/* CTA */}
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">Start typing to search our collection</p>
                            </div>

                        </div>
                    )}

                    {/* SEARCH RESULTS */}
                    {search.length > 0 && (
                        <div className="space-y-8 animate-fadeIn">

                            {/* HEADER */}
                            <div className="flex items-baseline justify-between border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                        Search Results
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Found <span className="font-bold text-black">{results.length}</span> product{results.length !== 1 ? 's' : ''}
                                    </p>
                                </div>

                                {/* Search Info */}
                                {results.length > 0 && (
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                                            Showing {Math.min((page + 1) * ITEMS_PER_PAGE, results.length)} of {results.length}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* NO RESULTS */}
                            {results.length === 0 && (
                                <div className="py-16 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FiSearch size={28} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">No results found</h3>
                                    <p className="text-gray-500 text-sm mb-6">Try different keywords or browse our collection</p>
                                    <button
                                        onClick={() => setSearch("")}
                                        className="px-6 py-2 bg-black text-white rounded-lg font-semibold text-sm hover:bg-gray-900 transition-colors duration-200"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}

                            {results.length > 0 && (
                                <>
                                    {/* 📱 MOBILE / TABLET - Infinite Scroll Style */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:hidden gap-4">
                                        {results.map((item, idx) => (
                                            <Link
                                                key={item._id}
                                                to={`/product/${item._id}`}
                                                onClick={() => {
                                                    setShowSearch(false)
                                                    setSearch("")
                                                }}
                                                style={{ animationDelay: `${idx * 50}ms` }}
                                                className="animate-scaleIn"
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
                                                    colours={item.colours}
                                                />
                                            </Link>
                                        ))}
                                    </div>

                                    {/* 🖥 DESKTOP - Grid with Pagination */}
                                    <div className="hidden xl:block space-y-8">

                                        {/* GRID */}
                                        <div className="grid grid-cols-4 gap-6">
                                            {paginatedResults.map((item, idx) => (
                                                <Link
                                                    key={item._id}
                                                    to={`/product/${item._id}`}
                                                    onClick={() => {
                                                        setShowSearch(false)
                                                        setSearch("")
                                                    }}
                                                    style={{ animationDelay: `${idx * 50}ms` }}
                                                    className="animate-scaleIn"
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
                                                        colours={item.colours}
                                                    />
                                                </Link>
                                            ))}
                                        </div>

                                        {/* PAGINATION CONTROLS */}
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-center gap-4 py-8 border-t border-gray-100">

                                                <button
                                                    onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                                                    disabled={page === 0}
                                                    className="p-3 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                                                >
                                                    <FiChevronLeft size={20} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                                                </button>

                                                <div className="flex items-center gap-2">
                                                    {Array.from({ length: totalPages }).map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => setPage(idx)}
                                                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${page === idx
                                                                    ? 'bg-black text-white'
                                                                    : 'border border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {idx + 1}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        setPage(prev =>
                                                            (prev + 1) * ITEMS_PER_PAGE < results.length ? prev + 1 : prev
                                                        )
                                                    }
                                                    disabled={(page + 1) * ITEMS_PER_PAGE >= results.length}
                                                    className="p-3 border border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 group"
                                                >
                                                    <FiChevronRight size={20} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>
                    )}

                </div>
            </div>

            {/* STYLES */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');

                * {
                    font-family: 'Poppins', system-ui, -apple-system, sans-serif;
                }

                /* Smooth scrolling */
                div::-webkit-scrollbar {
                    width: 8px;
                }

                div::-webkit-scrollbar-track {
                    background: transparent;
                }

                div::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 4px;
                }

                div::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }

                /* Animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
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

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }

                /* Focus states */
                input:focus {
                    outline: none;
                }

                button:disabled {
                    cursor: not-allowed;
                }

                /* Smooth transitions */
                button, a {
                    transition: all 0.2s ease-out;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .grid {
                        gap: 1rem;
                    }
                }
            `}</style>
        </div>
    ) : null
}

export default SearchBar