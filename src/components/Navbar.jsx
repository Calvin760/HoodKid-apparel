import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import {
  FiX,
  FiSearch,
  FiShoppingCart,
  FiChevronRight,
  FiHeart,
  FiPackage,
  FiUser
} from "react-icons/fi";
import { useUser, useClerk } from "@clerk/clerk-react";


const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { openSignIn } = useClerk();

  const { setShowSearch, getCartCount, getWishListCount, search } =
    useContext(ShopContext);

  const navigate = useNavigate();
  const location = useLocation();

  // ================= CLERK AUTH =================
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleLogin = () => {
    openSignIn();
  };

  const logout = async () => {
    await signOut();
    navigate("/");
  };

  /* ================= LOCK BODY SCROLL ================= */
  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "auto";
  }, [visible]);

  /* ================= CLOSE SIDEBAR ON ROUTE CHANGE ================= */
  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  return (
    <div className={`${!visible ? "sticky top-0" : "relative"} z-50 bg-white font-medium`}>

      {/* ================= MOBILE NAV ================= */}
      <div className="flex items-center justify-between px-4 py-4 sm:hidden">
        <div className="flex items-center gap-4">
          <svg onClick={() => setVisible(true)} className="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>

          <FiSearch
            className="w-6 h-6 cursor-pointer"
            onClick={() => setShowSearch(true)}
          />
        </div>

        <Link to="/">
          <h1 className="text-lg font-semibold tracking-wide">HOODKID.</h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <FiShoppingCart className="w-6 h-6" />
            {getCartCount() > 0 && (
              <span className="absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center text-[9px] bg-black text-white">
                {getCartCount()}
              </span>
            )}

          </Link>

          {user ? (
            <div className="group relative">

              <Link to="/account" className="relative">
                <FiUser className="w-6 h-6" />
              </Link>

            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="border px-4 py-2 text-sm"
            >
              Login
            </button>
          )}
          
          {/* <Link to="/account" className="relative">
            <FiUser className="w-6 h-6" />
          </Link> */}
        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}
      <div className="hidden sm:flex items-center justify-between py-6 px-2">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-wide">HOODKID.</h1>
        </Link>

        <ul className="flex gap-8 text-base">
          {[
            { to: "/", label: "Home" },
            { to: "/collection", label: "Collection" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" }
          ].map(link => (
            <NavLink key={link.to} to={link.to} className="relative pb-1">
              {({ isActive }) => (
                <>
                  <span className={isActive ? "text-black" : "text-gray-500"}>
                    {link.label}
                  </span>
                  <span className={`absolute left-0 bottom-0 h-[2px] bg-black transition-all ${isActive ? "w-full" : "w-0"}`} />
                </>
              )}
            </NavLink>
          ))}
        </ul>

        <div className="flex items-center gap-6">

          {/* SEARCH */}
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2">
            <img src={assets.search_icon} className="w-4" alt="" />
            <input
              readOnly
              onClick={() => setShowSearch(true)}
              type="text"
              placeholder="Search"
              value={search}
              className="outline-none bg-transparent text-sm w-28"
            />
          </div>

          {/* WISHLIST */}
          <Link to="/wishlist" className="relative">
            <FiHeart className="w-6 h-6" />
            <span className="absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center text-[9px] bg-black text-white">
              {getWishListCount()}
            </span>
          </Link>

          {/* CART */}
          <Link to="/cart" className="relative">
            <FiShoppingCart className="w-6 h-6" />
            <span className="absolute -right-1.5 -bottom-1.5 w-4 h-4 flex items-center justify-center text-[9px] bg-black text-white">
              {getCartCount()}
            </span>
          </Link>

          {/* PROFILE (CLERK) */}
          {user ? (
            <div className="group relative">
              <FiUser className="w-7 h-7" />

              <div className="group-hover:block hidden absolute right-0 pt-4">
                <div className="flex flex-col gap-2 w-44 py-3 px-5 bg-white text-black border shadow-md">
                  <Link to="/account">My Profile</Link>
                  <Link to="/orders">Orders</Link>
                  <button onClick={logout} className="text-left">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="border px-4 py-2 text-sm"
            >
              Login
            </button>
          )}

        </div>
      </div>
      {/* ================= MOBILE SIDEBAR ================= */}
      <div className={`fixed inset-0 z-50 ${visible ? "block" : "hidden"}`}>
        <div
          onClick={() => setVisible(false)}
          className="absolute inset-0 bg-black/40"
        />

        <div
          className={`absolute top-0 left-0 h-full w-[85%] max-w-sm bg-white shadow-xl transition-transform duration-300 ${visible ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <FiX size={22} onClick={() => setVisible(false)} className="cursor-pointer" />
          </div>

          <div className="flex flex-col py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu
            </div>

            {[
              { to: "/", label: "Home" },
              { to: "/collection", label: "Collections", arrow: true },
              { to: "/account", label: "My Account", arrow: true },
            ].map((item, i) => (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-3 flex items-center justify-between rounded-md mx-2 transition
        ${isActive
                    ? "bg-gray-100 font-semibold"
                    : "hover:bg-gray-50"
                  }`
                }
              >
                <span>{item.label}</span>
                {item.arrow && <FiChevronRight className="text-gray-400" />}
              </NavLink>
            ))}
          </div>

          <div className="my-2 border-t border-gray-100" />

          <div className="flex flex-col py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Account & Activity
            </div>

            <NavLink to="/cart" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-md hover:bg-gray-50 transition">
              <FiShoppingCart className="text-gray-600" />
              <span className="flex-1">Cart</span>
              <span className="text-sm text-gray-500">{getCartCount()}</span>
            </NavLink>

            <NavLink to="/wishlist" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-md hover:bg-gray-50 transition">
              <FiHeart className="text-gray-600" />
              <span className="flex-1">Favourites</span>
              <span className="text-sm text-gray-500">{getWishListCount()}</span>
            </NavLink>

            <NavLink to="/orders" className="flex items-center gap-3 px-4 py-3 mx-2 rounded-md hover:bg-gray-50 transition">
              <FiPackage className="text-gray-600" />
              <span className="flex-1">Orders</span>
            </NavLink>
          </div>

          <div className="absolute bottom-0 left-0 w-full border-t px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm">
                {(user?.firstName?.charAt(0).toUpperCase() || "U").toUpperCase()}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;