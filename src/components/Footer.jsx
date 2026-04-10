import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from "../assets/assets"

const Footer = () => {
    return (
        <footer className="bg-white text-black mt-20 border-t border-gray-200">

            {/* ================= DESKTOP FOOTER ================= */}
            <div className="hidden sm:grid grid-cols-4 gap-10 px-10 py-14">

                {/* Column 1 */}
                <div>
                    <h3 className="text-sm font-semibold tracking-widest mb-4">
                        SHOP
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link to="/collection">New Arrivals</Link></li>
                        <li><Link to="/collection">Men</Link></li>
                        <li><Link to="/collection">Women</Link></li>
                        <li><Link to="/collection">Sale</Link></li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div>
                    <h3 className="text-sm font-semibold tracking-widest mb-4">
                        SUPPORT
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>Help Center</li>
                        <li>Shipping</li>
                        <li>Returns</li>
                        <li>Order Status</li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div>
                    <h3 className="text-sm font-semibold tracking-widest mb-4">
                        ABOUT
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>Our Story</li>
                        <li>Sustainability</li>
                        <li>Careers</li>
                        <li>Investors</li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div>
                    <h3 className="text-sm font-semibold tracking-widest mb-4">
                        JOIN US
                    </h3>

                    <p className="text-sm text-gray-500 mb-3">
                        Get updates on new drops and exclusive offers.
                    </p>

                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full px-3 py-2 text-sm bg-gray-100 text-black outline-none border border-gray-300"
                    />

                    <button className="mt-3 w-full bg-black text-white py-2 text-sm font-semibold hover:bg-gray-800 transition">
                        SUBSCRIBE
                    </button>

                    {/* SOCIAL ICONS */}
                    <div className="flex gap-4 mt-5 items-center">
                        <img src={assets.instagram} className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                        <img src={assets.tiktok} className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                        <img src={assets.facebook} className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                        <img src={assets.x} className="w-5 h-5 cursor-pointer hover:scale-110 transition" />
                    </div>
                </div>

            </div>

            {/* ================= MOBILE FOOTER ================= */}
            <div className="sm:hidden px-6 py-10 space-y-8">

                {/* Brand */}
                <div>
                    <h1 className="text-lg font-bold tracking-widest">
                        HOODKID.
                    </h1>
                    <p className="text-xs text-gray-500 mt-2">
                        Level up your look.
                    </p>

                    {/* SOCIAL ICONS MOBILE */}
                    <div className="flex gap-4 mt-4">
                        <img src={assets.instagram} className="w-5 h-5" />
                        <img src={assets.tiktok} className="w-5 h-5" />
                        <img src={assets.facebook} className="w-5 h-5" />
                        <img src={assets.twitter} className="w-5 h-5" />
                    </div>
                </div>

                {/* Sections */}
                <div className="space-y-6 text-sm">

                    <div>
                        <h3 className="font-semibold mb-2 tracking-widest">SHOP</h3>
                        <div className="flex flex-col gap-1 text-gray-600">
                            <Link to="/collection">New Arrivals</Link>
                            <Link to="/collection">Men</Link>
                            <Link to="/collection">Women</Link>
                            <Link to="/collection">Sale</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2 tracking-widest">SUPPORT</h3>
                        <div className="flex flex-col gap-1 text-gray-600">
                            <p>Help Center</p>
                            <p>Shipping</p>
                            <p>Returns</p>
                            <p>Order Status</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2 tracking-widest">ABOUT</h3>
                        <div className="flex flex-col gap-1 text-gray-600">
                            <p>Our Story</p>
                            <p>Sustainability</p>
                            <p>Careers</p>
                        </div>
                    </div>

                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-semibold mb-2 tracking-widest">
                        JOIN US
                    </h3>

                    <input
                        type="email"
                        placeholder="Email address"
                        className="w-full px-3 py-2 text-sm bg-gray-100 text-black outline-none border border-gray-300"
                    />

                    <button className="mt-3 w-full bg-black text-white py-2 text-sm font-semibold">
                        SUBSCRIBE
                    </button>
                </div>

            </div>

            {/* ================= BOTTOM BAR ================= */}
            <div className="border-t border-gray-200 px-6 sm:px-10 py-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-2">

                <p>© {new Date().getFullYear()} HOODKID. All rights reserved.</p>

                <div className="flex gap-4">
                    <p>Privacy</p>
                    <p>Terms</p>
                    <p>Cookies</p>
                </div>

            </div>

        </footer>
    )
}

export default Footer