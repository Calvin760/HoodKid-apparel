import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi'
import axios from 'axios'

const Account = () => {

    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token")

                if (!token) {
                    navigate("/login")
                    return
                }

                const { data } = await axios.get(
                    "http://localhost:5000/api/auth/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (data.success) {
                    setUser(data.user)
                }

            } catch (err) {
                console.log(err)
                navigate("/login")
            }
        }

        fetchUser()
    }, [navigate])

    const logout = () => {
        localStorage.removeItem("token")
        navigate("/login")
    }

    if (!user) return <p className="p-10">Loading...</p>

    // ✅ SAFE ADMIN CHECK (handles both backend styles)
    const isAdmin =
        user?.isAdmin === true ||
        user?.role === "admin"

    return (
        <div className="px-6 sm:px-12 py-16 max-w-5xl mx-auto text-black">

            <h1 className="text-3xl sm:text-4xl font-semibold mb-10">
                My Account
            </h1>

            {/* USER CARD */}
            <div className="border border-gray-200 p-6 rounded-xl mb-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                    {user.name?.charAt(0)}
                </div>

                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="grid sm:grid-cols-2 gap-6">

                <Link to="/orders" className="border p-6 rounded-xl hover:shadow-md transition flex items-center gap-4">
                    <FiShoppingBag size={22} />
                    <div>
                        <p className="font-medium">Orders</p>
                        <p className="text-sm text-gray-500">Track your purchases</p>
                    </div>
                </Link>

                <Link to="/wishlist" className="border p-6 rounded-xl hover:shadow-md transition flex items-center gap-4">
                    <FiHeart size={22} />
                    <div>
                        <p className="font-medium">Wishlist</p>
                        <p className="text-sm text-gray-500">Saved items</p>
                    </div>
                </Link>

                <div className="border p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                    <FiUser size={22} />
                    <div>
                        <p className="font-medium">Profile</p>
                        <p className="text-sm text-gray-500">Edit your details</p>
                    </div>
                </div>

                {/* ADMIN ONLY */}
                {isAdmin && (
                    <Link
                        to="/admin"
                        className="border p-6 rounded-xl hover:shadow-md transition flex items-center gap-4"
                    >
                        <FiUser size={22} />
                        <div>
                            <p className="font-medium">Admin Panel</p>
                            <p className="text-sm text-gray-500">Manage store</p>
                        </div>
                    </Link>
                )}
                {isAdmin && (
                    <Link
                        to="/admin/orders"
                        className="border p-6 rounded-xl hover:shadow-md transition flex items-center gap-4"
                    >
                        <FiUser size={22} />
                        <div>
                            <p className="font-medium">Admin Orders</p>
                            <p className="text-sm text-gray-500">Manage Orders</p>
                        </div>
                    </Link>
                )}

                <button
                    onClick={logout}
                    className="border p-6 rounded-xl flex items-center gap-4 hover:bg-black hover:text-white transition"
                >
                    <FiLogOut size={22} />
                    Logout
                </button>

            </div>

        </div>
    )
}

export default Account