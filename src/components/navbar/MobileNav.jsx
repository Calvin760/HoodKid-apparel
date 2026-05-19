import { Link } from 'react-router-dom';
import { useContext, memo } from 'react';
import { FiMenu, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

import { ShopContext } from '../../context/ShopContext';
import { useNavbar } from '../../context/NavbarContext';
import { badge, iconButton } from '../../styles/navbarClasses';

const MobileNav = () => {
    const { setShowSearch, getCartCount } = useContext(ShopContext);
    const { setVisible, user, handleLogin, handleLogoClick } = useNavbar();

    const cartCount = getCartCount();
    const cartLabel = cartCount > 99 ? '99+' : cartCount;

    return (
        <nav
            className="flex items-center justify-between px-4 py-4 sm:hidden"
            aria-label="Mobile navigation"
        >
            {/* LEFT */}
            <div className="flex gap-4">
                <button
                    onClick={() => setVisible(true)}
                    aria-label="Open menu"
                    className="flex items-center"
                >
                    <FiMenu className={iconButton} strokeWidth={2.5} />
                </button>

                <button
                    onClick={() => setShowSearch(true)}
                    aria-label="Open search"
                    className="flex items-center"
                >
                    <FiSearch className={iconButton} strokeWidth={2.5} />
                </button>
            </div>

            {/* LOGO */}
            <button
                onClick={handleLogoClick}
                className="text-lg font-black tracking-tight cursor-pointer"
                aria-label="Go to homepage"
            >
                HOODKID.
            </button>

            {/* RIGHT */}
            <div className="flex gap-4 items-center">
                <Link
                    to="/cart"
                    className="relative flex items-center"
                    aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
                >
                    <FiShoppingCart className={iconButton} strokeWidth={2.5} />
                    {cartCount > 0 && <span className={badge}>{cartLabel}</span>}
                </Link>

                {user ? (
                    <Link to="/account" aria-label="My account" className="flex items-center">
                        <FiUser className={iconButton} strokeWidth={2.5} />
                    </Link>
                ) : (
                    <button onClick={handleLogin} aria-label="Sign in" className="flex items-center">
                        <FiUser className={iconButton} strokeWidth={2.5} />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default memo(MobileNav);