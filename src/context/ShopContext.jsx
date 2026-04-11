import { createContext, useMemo, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = 'R';
    const delivery_fee = 90;

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState([]);

    // ================= CART =================
    const addToCart = (itemId, size) => {

        if (!size) {
            toast.error("Select Size");
            return false;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);
        return true;
    };

    const getCartCount = () => {
        let totalCount = 0;

        for (const productId in cartItems) {
            const sizes = cartItems[productId];

            for (const size in sizes) {
                const quantity = sizes[size];
                if (quantity > 0) totalCount += quantity;
            }
        }

        return totalCount;
    };

    const updateQuantity = (productId, size, quantity) => {
        setCartItems(prev => {
            const updated = { ...prev };

            if (!updated[productId]) updated[productId] = {};

            if (quantity <= 0) {
                delete updated[productId][size];
            } else {
                updated[productId][size] = quantity;
            }

            return updated;
        });
    };

    const removeFromCart = (productId, size) => {
        updateQuantity(productId, size, 0);
    };

    // ================= WISHLIST =================
    const toggleWishlist = (productId) => {
        setWishlistItems(prev => {
            if (prev.includes(productId)) {
                toast.error("Removed from Favourites");
                return prev.filter(id => id !== productId);
                
            } else {
                toast.success("Added To Favourites");
                return [...prev, productId];
            }
        });
    };

    const wishlistProducts = useMemo(() => {
        return products.filter(p => wishlistItems.includes(p._id));
    }, [wishlistItems]);

    const getWishListCount = () => {
        if (!Array.isArray(wishlistItems)) return 0;
        return wishlistItems.length;
    };

    // ================= CONTEXT VALUE =================
    const value = {
        products,
        currency,
        delivery_fee,

        search,
        setSearch,
        showSearch,
        setShowSearch,

        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        removeFromCart,

        wishlistItems,          // ✅ IMPORTANT
        toggleWishlist,
        wishlistProducts,        // ✅ ready-to-use data
        getWishListCount
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;