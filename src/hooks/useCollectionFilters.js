import { useState } from 'react'

export const useCollectionFilters = () => {
    const [showFilters, setShowFilters] = useState(false)
    const [activeFilter, setActiveFilter] = useState(null)

    const [category, setCategory] = useState('all')
    const [subcategory, setSubcategory] = useState('all')
    const [gender, setGender] = useState('all')
    const [priceRange, setPriceRange] = useState('all')
    const [colour, setColour] = useState('all')

    const colours = ['all', 'black', 'white', 'red', 'blue', 'green', 'brown', 'yellow', 'pink', 'purple', 'grey']
    const colourMap = {
        black: '#000000',
        white: '#FFFFFF',
        red: '#EF4444',
        blue: '#3B82F6',
        green: '#10B981',
        brown: '#92400E',
        yellow: '#FBBF24',
        pink: '#EC4899',
        purple: '#A855F7',
        grey: '#9CA3AF'
    }

    const resetFilters = () => {
        setCategory('all')
        setSubcategory('all')
        setGender('all')
        setPriceRange('all')
        setColour('all')
    }

    const activeFilterCount = [category, subcategory, gender, priceRange, colour]
        .filter(f => f !== 'all').length

    return {
        category,
        subcategory,
        gender,
        priceRange,
        colour,
        setCategory,
        setSubcategory,
        setGender,
        setPriceRange,
        setColour,
        resetFilters,
        activeFilterCount,
        showFilters,
        setShowFilters,
        activeFilter,
        setActiveFilter,
        colours,
        colourMap
    }
}