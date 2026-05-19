import { useContext, useState, useRef, useEffect, memo } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiChevronDown } from 'react-icons/fi';

import { ShopContext } from '../../context/ShopContext';
import { useNavbar } from '../../context/NavbarContext';
import { badge } from '../../styles/navbarClasses';

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/collection', label: 'Collection' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
];

/* ============================================================
   ICON BUTTON WITH BADGE
   ============================================================ */
const IconLink = ({ to, icon: Icon, count, label }) => (
    <Link
        to={to}
        aria-label={count > 0 ? `${label}, ${count} ${count === 1 ? 'item' : 'items'}` : label}
        className="relative flex items-center text-gray-300 hover:text-white transition-colors duration-200"
    >
        <Icon className="w-6 h-6" strokeWidth={2} />
        {count > 0 && <span className={badge}>{count > 99 ? '99+' : count}</span>}
    </Link>
);

/* ============================================================
   USER MENU (click-to-open, keyboard accessible)
   ============================================================ */
const UserMenu = ({ onLogout }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click + Escape key
    useEffect(() => {
        if (!open) return;
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const handleKey = (e) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Account menu"
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-1 text-gray-300 hover:text-white transition-colors duration-200"
            >
                <FiUser className="w-6 h-6" strokeWidth={2} />
                <FiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-44 py-2 bg-[#111] border border-white/10 shadow-lg"
                >
                    <Link
                        to="/account"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block px-5 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                    >
                        My Profile
                    </Link>
                    <Link
                        to="/orders"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="block px-5 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
                    >
                        Orders
                    </Link>
                    <button
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                        className="w-full text-left px-5 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

/* ============================================================
   MAIN
   ============================================================ */
const DesktopNav = () => {
    const { setShowSearch, getCartCount, getWishListCount } = useContext(ShopContext);
    const { user, handleLogin, logout, handleLogoClick } = useNavbar();

    const cartCount = getCartCount();
    const wishlistCount = getWishListCount();

    return (
        <nav
            className="hidden sm:flex items-center justify-between py-6 px-2 text-[#f5f5f5]"
            aria-label="Main navigation"
        >
            {/* LOGO */}
            <button
                onClick={handleLogoClick}
                className="text-2xl font-black tracking-tight cursor-pointer"
                aria-label="Go to homepage"
            >
                HOODKID.
            </button>

            {/* NAV LINKS */}
            <ul className="flex gap-8 text-sm uppercase tracking-wide">
                {NAV_LINKS.map(({ to, label }) => (
                    <li key={to}>
                        <NavLink to={to} className="relative pb-1 group block">
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`transition-colors duration-200 ${isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-white'
                                            }`}
                                    >
                                        {label}
                                    </span>
                                    <span
                                        className={`absolute left-0 bottom-0 h-[1.5px] bg-white/80 transition-all duration-200 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                            }`}
                                    />
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>

            {/* ACTIONS */}
            <div className="flex items-center gap-6">
                {/* SEARCH TRIGGER */}
                <button
                    onClick={() => setShowSearch(true)}
                    aria-label="Open search"
                    className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 border border-white/40 hover:border-white text-sm text-gray-300 hover:text-white transition-colors duration-200"
                >
                    <FiSearch className="w-4 h-4" strokeWidth={2.5} />
                    <span>Search</span>
                </button>

                <IconLink to="/wishlist" icon={FiHeart} count={wishlistCount} label="Wishlist" />
                <IconLink to="/cart" icon={FiShoppingCart} count={cartCount} label="Cart" />

                {user ? (
                    <UserMenu onLogout={logout} />
                ) : (
                    <button
                        onClick={handleLogin}
                        className="border border-white/40 px-5 py-2 text-sm font-bold uppercase tracking-wide hover:border-white hover:bg-white hover:text-black transition-colors duration-200"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default memo(DesktopNav);