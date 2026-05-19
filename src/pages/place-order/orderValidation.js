const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateOrder = ({ cartItems, form, deliveryMethod }) => {
    if (!cartItems.length) return 'Your cart is empty';

    if (!form.name?.trim()) return 'Name is required';

    if (!form.email?.trim() || !isValidEmail(form.email))
        return 'Please enter a valid email';

    if (!form.phone?.trim()) return 'Phone is required';

    if (deliveryMethod === 'delivery') {
        if (!form.address?.trim()) return 'Address is required for delivery';
        if (!form.city?.trim()) return 'City is required for delivery';
    }

    return null;
};