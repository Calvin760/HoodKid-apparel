import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = "R";
    const delivery_fee = 90;

    // ================= PRODUCTS =================
    const [products, setProducts] = useState([]);

    // ================= CART (LOCAL) =================
    const [cartItems, setCartItems] = useState({});

    // ================= WISHLIST (BACKEND) =================
    const [wishlistProducts, setWishlistProducts] = useState([]);

    const [search, setSearch] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    // ================= FETCH PRODUCTS =================
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/products");
            if (data.success) setProducts(data.products);
        } catch (err) {
            console.log(err);
        }
    };

    // ================= FETCH WISHLIST =================
    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const { data } = await axios.get(
                "http://localhost:5000/api/users/wishlist",
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success) setWishlistProducts(data.wishlist);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, []);

    // ================= WISHLIST =================
    const toggleWishlist = async (productId) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Login required");
                return;
            }

            const { data } = await axios.post(
                "http://localhost:5000/api/users/wishlist",
                { productId },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (data.success) {
                await fetchWishlist();
            }

        } catch (err) {
            console.log(err);
        }
    };

    // ✅ IMPORTANT: unified ID system
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
    // ================= CONTEXT =================
    const value = {
        products,
        currency,
        delivery_fee,

        // CART
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        removeFromCart,

        // WISHLIST
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