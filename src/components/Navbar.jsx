import { assets } from "../assets/assets";
import { Link, NavLink } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {

  const [vissible, setVissible] = useState(false)
  const {setShowSearch} = useContext(ShopContext)

  useEffect(() => {
    document.body.style.overflow = vissible ? 'hidden' : 'auto'
  }, [vissible])

  return (
    <div className={`${!vissible ? 'sticky top-0' : 'relative'} z-50 bg-white font-medium`}>

      {/* ================= MOBILE NAV ================= */}
      <div className="flex items-center justify-between px-4 py-4 sm:hidden">

        {/* LEFT (Search + Menu) */}
        <div className="flex items-center gap-4">

          {/* Menu */}
          <svg
            onClick={() => setVissible(true)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          {/* Search */}
          <svg onClick={() => setShowSearch(true)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor"
            className="size-6 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.6-5.4a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>

        </div>

        {/* CENTER (Logo) */}
        <Link to='/'>
          <h1 className="text-black text-lg font-bold tracking-wide">
            HOODKID.
          </h1>
        </Link>

        {/* RIGHT (Cart + Profile) */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <Link to='/cart' className='relative'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="currentColor"
              className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white text-[8px] rounded-full'>
              5
            </p>
          </Link>

          {/* Profile */}
          <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />

        </div>
      </div>

      {/* ================= DESKTOP NAV ================= */}
      <div className="hidden sm:flex items-center justify-between py-5">

        {/* Logo */}
        <Link to='/'>
          <h1 className="text-black text-xl font-bold tracking-wide">
            HOODKID.
          </h1>
        </Link>

        {/* Links */}
        <ul className="flex gap-5 text-sm text-gray-700">
          <NavLink to='/'><p>Home</p></NavLink>
          <NavLink to='/collection'><p>Collection</p></NavLink>
          <NavLink to='/about'><p>About</p></NavLink>
          <NavLink to='/contact'><p>Contact</p></NavLink>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-6">

          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition rounded-full px-4 py-2 w-fit focus-within:bg-white focus-within:ring-1 focus-within:ring-black">

            {/* Search Icon */}
            <img src={assets.search_icon} className="w-3 cursor-pointer" alt="" />

            <input
              onClick={()=>setShowSearch(true)}
              type="text"
              placeholder="Search"
              className="outline-none bg-transparent text-sm w-28 focus:w-44 transition-all duration-300 placeholder-gray-500"
            />
          </div>

          {/* ❤️ Wishlist (DESKTOP ONLY) */}
          <Link to='/wishlist' className='relative hidden sm:block'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white rounded-full text-[8px]'>2</p>
          </Link>

          {/* Cart */}
          <Link to='/cart' className='relative'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              strokeWidth="1.5" stroke="currentColor"
              className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white text-[8px] rounded-full'>
              5
            </p>
          </Link>
          {/* Profile */}
          <div className='group relative'>
            <img className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
            <div className='group-hover:block hidden absolute right-0 pt-4'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p className='cursor-pointer hover:text-black'>My profile</p>
                <p className='cursor-pointer hover:text-black'>Orders</p>
                <p className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className={`fixed top-0 right-0 h-full w-full bg-white transform transition-transform duration-300 ${vissible ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVissible(false)} className='flex items-center gap-4 p-3'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVissible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
          <NavLink onClick={() => setVissible(false)} className='py-2 pl-6 border' to='/wishlist'>WISHLIST</NavLink>
        </div>
      </div>

    </div>
  )
}

export default Navbar