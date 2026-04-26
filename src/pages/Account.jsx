import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi'
import Loading from '../components/Loading'
import { useUser, useClerk } from '@clerk/clerk-react'

const Account = () => {

    const navigate = useNavigate()
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()

    // ✅ FIX: redirect if NOT logged in
    useEffect(() => {
        if (isLoaded && !user) {
            window.location.href =
                "https://flowing-hen-56.accounts.dev/sign-in";
        }
    }, [isLoaded, user]);

    if (!isLoaded) {
        return <Loading />
    }

    // still loading user → show loader
    if (!user) {
        return <Loading />
    }

    // Clerk fields
    const name =
        user.fullName ||
        user.firstName ||
        "User"

    const email =
        user.primaryEmailAddress?.emailAddress || ""

    const isAdmin =
        user.publicMetadata?.role === "admin"

    const logout = async () => {
        await signOut()
        navigate("/signin")
    }

    return (
        <div className="px-6 sm:px-12 py-16 max-w-5xl mx-auto text-black">

            <h1 className="text-3xl sm:text-4xl font-semibold mb-10">
                My Account
            </h1>

            <div className="border border-gray-200 p-6 rounded-xl mb-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center">
                    {name?.charAt(0)}
                </div>

                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-gray-500 text-sm">{email}</p>
                </div>
            </div>

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

                <Link to='/profile' className="border p-6 rounded-xl flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                    <FiUser size={22} />
                    <div>
                        <p className="font-medium">Profile</p>
                        <p className="text-sm text-gray-500">Edit your details</p>
                    </div>
                </Link>

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