import { Link } from "react-router-dom";
import { FiMenu, FiSearch, FiShoppingCart, FiUser } from "react-icons/fi";
import { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import { useNavbar } from "../../hooks/useNavbar";
import { badge, iconButton } from "../../styles/navbarClasses";

const MobileNav = () => {
    const { setShowSearch, getCartCount } = useContext(ShopContext);
    const { setIsSidebarOpen, user, handleLogin, handleLogoClick } = useNavbar();

    return (
        <div className="flex items-center justify-between px-4 py-4 sm:hidden">
            <div className="flex gap-4">
                <FiMenu
                    onClick={() => setIsSidebarOpen(true)}
                    className={iconButton}
                />

                <FiSearch
                    className={iconButton}
                    onClick={() => setShowSearch(true)}
                />
            </div>

            <h1
                onClick={handleLogoClick}
                className="text-lg font-semibold cursor-pointer"
            >
                HOODKID.
            </h1>

            <div className="flex gap-4">
                <Link to="/cart" className="relative">
                    <FiShoppingCart className={iconButton} />
                    {getCartCount() > 0 && (
                        <span className={badge}>{getCartCount()}</span>
                    )}
                </Link>

                <button onClick={handleLogin}>
                    <FiUser className={iconButton} />
                </button>
            </div>
        </div>
    );
};

export default MobileNav;