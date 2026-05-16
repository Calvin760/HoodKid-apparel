export const validateOrder = ({
    cartItems,
    form,
    deliveryMethod,
}) => {
    if (!cartItems.length) return "Your cart is empty"
    if (!form.email) return "Email is required"

    if (deliveryMethod === "delivery" && !form.address) {
        return "Address is required for delivery"
    }

    return null
}