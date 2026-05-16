import { useMemo } from "react"
import { DELIVERY_FEE, DELIVERY_METHODS } from "./constants"

export const useCartSummary = (cartItems, products, deliveryMethod) => {
    const productMap = useMemo(() => {
        return products.reduce((acc, product) => {
            acc[product._id] = product
            return acc
        }, {})
    }, [products])

    const items = useMemo(() => {
        const result = []

        for (const productId in cartItems) {
            const product = productMap[productId]
            if (!product) continue

            for (const size in cartItems[productId]) {
                for (const color in cartItems[productId][size]) {
                    const quantity = cartItems[productId][size][color]

                    if (quantity > 0) {
                        result.push({
                            productId,
                            name: product.name,
                            price: product.price,
                            size,
                            color,
                            quantity,
                        })
                    }
                }
            }
        }

        return result
    }, [cartItems, productMap])

    const subtotal = useMemo(
        () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        [items]
    )

    const delivery =
        deliveryMethod === DELIVERY_METHODS.DELIVERY && subtotal > 0
            ? DELIVERY_FEE
            : 0

    const total = subtotal + delivery

    return { items, subtotal, delivery, total }
}