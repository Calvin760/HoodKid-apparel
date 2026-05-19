const DesktopFilters = ({
    category,
    setCategory,
    gender,
    setGender,
    priceRange,
    setPriceRange,
    colour,
    setColour,
    colours,
    colourMap,
    activeFilterCount,
    resetFilters
}) => {
    return (
        <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">

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
                            >
                                <div
                                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${colour === c
                                            ? 'border-black ring-2 ring-black ring-offset-2'
                                            : 'border-gray-300 hover:border-black'
                                        }`}
                                    style={{
                                        backgroundColor: c === 'all'
                                            ? '#F5F5F5'
                                            : colourMap[c] || '#E5E7EB'
                                    }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </aside>
    )
}

export default DesktopFilters