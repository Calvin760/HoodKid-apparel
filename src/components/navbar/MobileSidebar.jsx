import { NavLink } from "react-router-dom";
import { useContext, memo } from "react";
import {
  FiX,
  FiChevronRight,
  FiShoppingCart,
  FiHeart,
  FiPackage,
  FiLogOut,
  FiLogIn
} from "react-icons/fi";

import { ShopContext } from "../../context/ShopContext";
import { useNavbar } from "../../context/NavbarContext";

const MENU_LINKS = [
  { to: "/", label: "Home" },
  { to: "/collection", label: "Collections", arrow: true },
  { to: "/account", label: "My Account", arrow: true }
];

const ACTIVITY_LINKS = [
  {
    to: "/cart",
    label: "Cart",
    icon: FiShoppingCart,
    countKey: "cart"
  },
  {
    to: "/wishlist",
    label: "Favourites",
    icon: FiHeart,
    countKey: "wishlist"
  },
  {
    to: "/orders",
    label: "Orders",
    icon: FiPackage
  }
];

const MobileSidebar = () => {
  const { visible, setVisible, user, handleLogin, logout } = useNavbar();
  const { getCartCount, getWishListCount } = useContext(ShopContext);

  const getCount = (key) => {
    if (key === "cart") return getCartCount();
    if (key === "wishlist") return getWishListCount();
    return null;
  };

  return (
    <div className={`fixed inset-0 z-50 ${visible ? "block" : "hidden"}`}>
      {/* OVERLAY - Darker for premium feel */}
      <div
        onClick={() => setVisible(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* SIDEBAR */}
      <aside
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white 
          transition-transform duration-300 ease-out
          ${visible ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
        }}
      >
        {/* HEADER - Premium Close Button */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
          <h2 className="text-lg font-black tracking-tight" style={{ color: "#000" }}>
            MENU
          </h2>
          <button
            onClick={() => setVisible(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 group"
          >
            <FiX
              size={24}
              className="group-hover:rotate-90 transition-transform duration-300"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* MAIN NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-4 space-y-1">
            <p className="px-2 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">
              Navigation
            </p>

            {MENU_LINKS.map(({ to, label, arrow }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `px-4 py-3 mx-0 flex items-center justify-between rounded-lg transition-all duration-200 group font-medium text-sm
                   ${isActive
                    ? "bg-black text-white font-bold"
                    : "text-gray-700 hover:bg-gray-50"}
                  `
                }
              >
                <span>{label}</span>
                {arrow && (
                  <FiChevronRight
                    className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200"
                    strokeWidth={2.5}
                  />
                )}
              </NavLink>
            ))}
          </div>

          <div className="my-2 mx-4 border-t border-gray-100" />

          {/* ACTIVITY SECTION */}
          <div className="px-4 space-y-1">
            <p className="px-2 py-2 text-xs font-black text-gray-400 uppercase tracking-widest">
              Activity
            </p>

            {ACTIVITY_LINKS.map(({ to, label, icon: Icon, countKey }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group font-medium text-sm
                   ${isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-50"}
                  `
                }
              >
                <Icon
                  size={20}
                  strokeWidth={2.5}
                  className="flex-shrink-0"
                />
                <span className="flex-1">{label}</span>
                {countKey && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-black text-white">
                    {getCount(countKey) || 0}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* FOOTER - User & Auth */}
        <footer className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                <div
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                >
                  {(user?.firstName?.[0] || "U").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {user?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "Account"}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors duration-200 group"
              >
                <FiLogOut size={18} strokeWidth={2.5} />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-black text-white font-bold text-sm hover:bg-gray-900 transition-colors duration-200 group"
            >
              <FiLogIn size={18} strokeWidth={2.5} />
              Sign In
            </button>
          )}
        </footer>
      </aside>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;900&display=swap');

        .fixed.inset-0 {
          font-family: 'Poppins', system-ui, -apple-system, sans-serif;
        }

        aside {
          font-family: 'Poppins', system-ui, -apple-system, sans-serif;
        }

        /* Smooth scrolling for activity section */
        nav {
          scroll-behavior: smooth;
        }

        /* Animation for sidebar entrance */
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        aside {
          animation: slideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Smooth transitions for all interactive elements */
        button, a {
          transition: all 0.2s ease-out;
        }

        /* Active link indicator with underline accent */
        .font-bold.bg-black {
          position: relative;
        }

        .font-bold.bg-black::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(180deg, #FFD700 0%, #FFC700 100%);
          border-radius: 0 2px 2px 0;
        }
      `}</style>
    </div>
  );
};

export default memo(MobileSidebar);