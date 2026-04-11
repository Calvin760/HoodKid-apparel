import { assets } from "../assets/assets";
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {

  const [vissible, setVissible] = useState(false)
  const { setShowSearch, getCartCount, getWishListCount } = useContext(ShopContext)

  useEffect(() => {
    document.body.style.overflow = vissible ? 'hidden' : 'auto'
  }, [vissible])

  return (
    <div className={`${!vissible ? 'sticky top-0' : 'relative'} z-50 bg-white font-medium`}>

      {/* ================= MOBILE NAV ================= */}
      <div className="flex items-center justify-between px-4 py-5 sm:hidden">

        {/* LEFT */}
        <div className="flex items-center gap-5">

          <svg
            onClick={() => setVissible(true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>

          <svg
            onClick={() => setShowSearch(true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.6-5.4a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>

        </div>

        {/* CENTER */}
        <Link to='/'>
          <h1 className="text-black text-xl font-bold tracking-wide">
            HOODKID.
          </h1>
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-5">

          <Link to='/cart' className='relative'>
            <svg className="size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className='absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-red-500 text-white text-[9px] rounded-full'>
              {getCartCount()}
            </p>
          </Link>

          <img className='w-6 cursor-pointer' src={assets.profile_icon} alt="" />

        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}
      <div className="hidden sm:flex items-center justify-between py-6 px-2">

        {/* Logo */}
        <Link to='/'>
          <h1 className="text-black text-2xl font-bold tracking-wide">
            HOODKID.
          </h1>
        </Link>

        {/* LINKS */}
        <ul className="flex gap-8 text-base font-medium">

          {[
            { to: "/", label: "Home" },
            { to: "/collection", label: "Collection" },
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" }
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative pb-1 transition ${isActive ? 'text-black' : 'text-gray-500'}`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute left-0 bottom-0 h-[2px] bg-black transition-all duration-300 ${isActive ? 'w-full' : 'w-0'
                      }`}
                  />
                </>
              )}
            </NavLink>
          ))}

        </ul>

        {/* RIGHT */}
        <div className="flex items-center gap-7">

          {/* SEARCH */}
          <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition rounded-full px-4 py-2">

            <img src={assets.search_icon} className="w-4 cursor-pointer" alt="" />

            <input
              onClick={() => setShowSearch(true)}
              type="text"
              placeholder="Search"
              className="outline-none bg-transparent text-sm w-32 focus:w-52 transition-all"
            />

          </div>

          {/* WISHLIST */}
          <Link to='/wishlist' className='relative'>
            <svg xmlns="http://www.w3.org/2000/svg" className="size-6"
              fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <p className='absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-red-500 text-white text-[9px] rounded-full'>
              {getWishListCount()}
            </p>
          </Link>

          {/* CART */}
          <Link to='/cart' className='relative'>
            <svg xmlns="http://www.w3.org/2000/svg" className="size-6"
              fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className='absolute right-[-6px] bottom-[-6px] w-4 text-center leading-4 bg-red-500 text-white text-[9px] rounded-full'>
              {getCartCount()}
            </p>
          </Link>

          {/* PROFILE */}
          <div className='group relative'>
            <img className='w-6 cursor-pointer' src={assets.profile_icon} alt="" />

            <div className='group-hover:block hidden absolute right-0 pt-4'>
              <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-white text-black border shadow-md rounded'>

                <Link to='/profile' className='hover:opacity-70'>
                  My Profile
                </Link>

                <Link to='/orders' className='hover:opacity-70'>
                  Orders
                </Link>

                <button
                  onClick={() => {
                    // later: clear auth token / session
                    console.log("logout")
                  }}
                  className='text-left hover:opacity-70'
                >
                  Logout
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className={`fixed top-0 right-0 h-full w-full bg-white transform transition-transform duration-300 ${vissible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col text-gray-700 text-base'>
          <div onClick={() => setVissible(false)} className='flex items-center gap-4 p-4 text-lg'>
            <img className='h-5 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>

          <NavLink onClick={() => setVissible(false)} className='py-3 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-3 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-3 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-3 pl-6 border' to='/contact'>CONTACT</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-3 pl-6 border' to='/wishlist'>WISHLIST</NavLink>
        </div>
      </div>

    </div>
  )
}

export default Navbar