import { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContext'

export const useFilteredProducts = ({
    products,
    category,
    subcategory,
    gender,
    priceRange,
    colour
}) => {
    const { search } = useContext(ShopContext)

    return useMemo(() => {
        let list = [...products]

        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(p => p.name?.toLowerCase().includes(q))
        }

        if (category !== 'all') {
            list = list.filter(p =>
                Array.isArray(p.category)
                    ? p.category.some(c => c.toLowerCase() === category)
                    : p.category?.toLowerCase() === category
            )
        }

        if (subcategory !== 'all') {
            list = list.filter(p =>
                Array.isArray(p.subcategory)
                    ? p.subcategory.some(s => s.toLowerCase() === subcategory)
                    : p.subcategory?.toLowerCase() === subcategory
            )
        }

        if (gender !== 'all') {
            list = list.filter(p => p.gender?.toLowerCase() === gender)
        }

        if (colour !== 'all') {
            list = list.filter(p =>
                p.colours?.some(c => c.name?.toLowerCase() === colour)
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
    }, [products, category, subcategory, gender, priceRange, colour, search])
}