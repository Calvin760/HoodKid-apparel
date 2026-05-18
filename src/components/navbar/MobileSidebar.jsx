import { NavLink } from "react-router-dom";
import { useContext, memo } from "react";
import {
  FiX,
  FiChevronRight,
  FiShoppingCart,
  FiHeart,
  FiPackage
} from "react-icons/fi";

import { ShopContext } from "../../context/ShopContext";
import { useNavbar } from "../../hooks/useNavbar";

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
      {/* OVERLAY */}
      <div
        onClick={() => setVisible(false)}
        className="absolute inset-0 bg-black/40"
      />

      {/* SIDEBAR */}
      <aside
        className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl
          transition-transform duration-300
          ${visible ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <FiX
            size={22}
            onClick={() => setVisible(false)}
            className="cursor-pointer"
          />
        </div>

        {/* MENU */}
        <nav className="flex flex-col py-2">
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menu
          </p>

          {MENU_LINKS.map(({ to, label, arrow }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-4 py-3 mx-2 flex items-center justify-between rounded-md transition
                 ${isActive
                  ? "bg-gray-100 font-semibold"
                  : "hover:bg-gray-50"}
                `
              }
            >
              <span>{label}</span>
              {arrow && <FiChevronRight className="text-gray-400" />}
            </NavLink>
          ))}
        </nav>

        <div className="my-2 border-t border-gray-100" />

        {/* ACTIVITY */}
        <nav className="flex flex-col py-2">
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account & Activity
          </p>

          {ACTIVITY_LINKS.map(({ to, label, icon: Icon, countKey }) => (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-3 px-4 py-3 mx-2 rounded-md hover:bg-gray-50 transition"
            >
              <Icon className="text-gray-600" />
              <span className="flex-1">{label}</span>
              {countKey && (
                <span className="text-sm text-gray-500">
                  {getCount(countKey)}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* FOOTER */}
        <footer className="absolute bottom-0 left-0 w-full border-t px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">
              {(user?.firstName?.[0] || "U").toUpperCase()}
            </div>
            <p className="font-medium">{user?.firstName || ""}</p>
          </div>

          {user ? (
            <button onClick={logout} className="text-sm hover:underline">
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="text-sm hover:underline"
            >
              Login
            </button>
          )}
        </footer>
      </aside>
    </div>
  );
};

export default memo(MobileSidebar);