import { NavLink, Link } from "react-router-dom";
import { useContext, memo } from "react";
import { FiShoppingCart, FiHeart, FiUser } from "react-icons/fi";

import { ShopContext } from "../../context/ShopContext";
import { useNavbar } from "../../hooks/useNavbar";
import { assets } from "../../assets/assets";
import { badge } from "../../styles/navbarClasses";

const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/collection", label: "Collection" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" }
];

const DesktopNav = () => {
    const {
        setShowSearch,
        getCartCount,
        getWishListCount,
        search
    } = useContext(ShopContext);

    const {
        user,
        handleLogin,
        logout,
        handleLogoClick
    } = useNavbar();

    return (
        <div className="hidden sm:flex items-center justify-between py-6 px-2 text-[#f5f5f5]">
            {/* LOGO */}
            <h1
                onClick={handleLogoClick}
                className="text-2xl font-bold tracking-wide cursor-pointer"
            >
                HOODKID.
            </h1>

            {/* NAV LINKS */}
            <ul className="flex gap-8 text-sm uppercase tracking-wide">
                {NAV_LINKS.map(({ to, label }) => (
                    <NavLink key={to} to={to} className="relative pb-1 group">
                        {({ isActive }) => (
                            <>
                                <span
                                    className={`transition-colors ${isActive
                                            ? "text-white"
                                            : "text-gray-400 group-hover:text-white"
                                        }`}
                                >
                                    {label}
                                </span>

                                <span
                                    className={`absolute left-0 bottom-0 h-[1.5px] bg-white/80 transition-all
                    ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                  `}
                                />
                            </>
                        )}
                    </NavLink>
                ))}
            </ul>

            {/* ACTIONS */}
            <div className="flex items-center gap-6">
                {/* SEARCH */}
                <div
                    onClick={() => setShowSearch(true)}
                    className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 cursor-pointer border border-white"
                >
                    <img src={assets.search_icon} className="w-4 invert brightness-0 contrast-200" alt="search" />
                    <input
                        readOnly
                        value={search}
                        placeholder="Search"
                        className="bg-transparent outline-none text-sm w-28 text-white placeholder-white"
                    />
                </div>

                {/* WISHLIST */}
                <Link to="/wishlist" className="relative">
                    <FiHeart className="w-6 h-6 text-gray-300 hover:text-white transition" />
                    {getWishListCount() > 0 && (
                        <span className={badge}>{getWishListCount()}</span>
                    )}
                </Link>

                {/* CART */}
                <Link to="/cart" className="relative">
                    <FiShoppingCart className="w-6 h-6 text-gray-300 hover:text-white transition" />
                    {getCartCount() > 0 && (
                        <span className={badge}>{getCartCount()}</span>
                    )}
                </Link>

                {/* USER MENU */}
                {user ? (
                    <div className="group relative">
                        <FiUser className="w-7 h-7 cursor-pointer text-gray-300 hover:text-white transition" />

                        <div className="absolute right-0 pt-4 hidden group-hover:block">
                            <div className="flex flex-col gap-2 w-44 py-3 px-5 bg-[#111111] text-[#f5f5f5] border border-white/10 shadow-lg">
                                <Link to="/account" className="hover:text-white">
                                    My Profile
                                </Link>
                                <Link to="/orders" className="hover:text-white">
                                    Orders
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-left text-gray-400 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="border border-white/40 px-5 py-2 text-sm uppercase tracking-wide hover:border-white transition"
                    >
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default memo(DesktopNav);