import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const API_URL = import.meta.env.VITE_API_URL;

    const currency = "R";
    const delivery_fee = 90;

    // ================= CLERK AUTH =================
    const { getToken, isSignedIn, isLoaded } = useAuth();

    // ================= STATE =================
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/products`);
            if (data.success) setProducts(data.products);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH WISHLIST =================
    const fetchWishlist = async () => {
        try {
            if (!isSignedIn) return;

            const token = await getToken();

            if (!token) return;

            const { data } = await axios.get(
                `${API_URL}/api/wishlist`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (data.success) {
                setWishlistProducts(data.wishlist || []);
            }

        } catch (error) {
            console.log(error);
        }
    };

    // ================= INIT PRODUCTS =================
    useEffect(() => {
        fetchProducts();
    }, []);

    // ================= INIT WISHLIST =================
    useEffect(() => {
        if (!isLoaded) return;

        if (isSignedIn) {
            fetchWishlist();
        } else {
            setWishlistProducts([]);
        }

    }, [isSignedIn, isLoaded]);

    // ================= TOGGLE WISHLIST =================
    const toggleWishlist = async (productId) => {
        try {
            if (!isSignedIn) {
                toast.error("Please sign in first");
                return;
            }

            const token = await getToken();

            if (!token) {
                toast.error("Authentication failed");
                return;
            }

            const { data } = await axios.post(
                `${API_URL}/api/wishlist`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (data.success) {
                fetchWishlist();
                toast.success(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    // ================= HELPERS =================
    const wishlistIds = wishlistProducts.map(p => p._id);
    const getWishListCount = () => wishlistIds.length;

    // ================= CART =================
    const addToCart = (productId, size, color) => {
        setCartItems((prev) => {
            const updated = { ...prev };

            if (!updated[productId]) updated[productId] = {};
            if (!updated[productId][size]) updated[productId][size] = {};
            if (!updated[productId][size][color]) {
                updated[productId][size][color] = 0;
            }

            updated[productId][size][color] += 1;

            return updated;
        });
    };

    const getCartCount = () => {
        let total = 0;

        for (const productId in cartItems) {
            for (const size in cartItems[productId]) {
                for (const color in cartItems[productId][size]) {
                    total += cartItems[productId][size][color];
                }
            }
        }

        return total;
    };

    const updateQuantity = (productId, size, color, quantity) => {
        setCartItems((prev) => {
            const updated = { ...prev };

            if (!updated[productId]?.[size]?.[color]) return prev;

            if (quantity <= 0) {
                delete updated[productId][size][color];

                if (Object.keys(updated[productId][size]).length === 0) {
                    delete updated[productId][size];
                }

                if (Object.keys(updated[productId]).length === 0) {
                    delete updated[productId];
                }
            } else {
                updated[productId][size][color] = quantity;
            }

            return updated;
        });
    };

    const removeFromCart = (productId, size, color) => {
        updateQuantity(productId, size, color, 0);
    };

    // ================= CONTEXT VALUE =================
    const value = {
        products,
        currency,
        delivery_fee,

        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        removeFromCart,

        wishlistProducts,
        wishlistIds,
        toggleWishlist,
        getWishListCount,

        search,
        setSearch,
        showSearch,
        setShowSearch,
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;