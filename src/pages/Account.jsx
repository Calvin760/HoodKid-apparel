import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
    FiUser,
    FiShoppingBag,
    FiHeart,
    FiLogOut,
    FiShield,
    FiChevronRight,
} from 'react-icons/fi';
import Loading from '../components/Loading';

const Account = () => {
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const { signOut, redirectToSignIn } = useClerk();

    // Redirect unauthenticated users via Clerk (env-aware, no hardcoded URL)
    useEffect(() => {
        if (isLoaded && !user) {
            redirectToSignIn();
        }
    }, [isLoaded, user, redirectToSignIn]);

    if (!isLoaded || !user) return <Loading />;

    const name = user.fullName || user.firstName || 'User';
    const email = user.primaryEmailAddress?.emailAddress || '';
    const isAdmin = user.publicMetadata?.role === 'admin';
    const initial = (name[0] || 'U').toUpperCase();

    const accountLinks = [
        {
            to: '/orders',
            icon: FiShoppingBag,
            label: 'Orders',
            description: 'Track your purchases',
        },
        {
            to: '/wishlist',
            icon: FiHeart,
            label: 'Wishlist',
            description: 'Saved items',
        },
        {
            to: '/profile',
            icon: FiUser,
            label: 'Profile',
            description: 'Edit your details',
        },
        ...(isAdmin
            ? [{
                to: '/admin',
                icon: FiShield,
                label: 'Admin Panel',
                description: 'Manage store',
            }]
            : []),
    ];

    const handleLogout = async () => {
        await signOut();
        // useEffect above will redirect to sign-in once user becomes null
    };

    return (
        <div className="px-6 sm:px-12 py-16 max-w-5xl mx-auto text-black">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-10">
                My Account
            </h1>

            {/* USER CARD */}
            <div className="border border-gray-200 p-6 rounded-lg mb-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold flex-shrink-0">
                    {initial}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{name}</p>
                    <p className="text-sm text-gray-500 truncate">{email}</p>
                </div>
            </div>

            {/* ACTIONS GRID */}
            <div className="grid sm:grid-cols-2 gap-4">
                {accountLinks.map(({ to, icon: Icon, label, description }) => (
                    <Link
                        key={to}
                        to={to}
                        className="group border border-gray-200 p-6 rounded-lg flex items-center gap-4 hover:bg-gray-50 transition-all duration-200"
                    >
                        <Icon size={22} strokeWidth={2.5} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="font-bold">{label}</p>
                            <p className="text-sm text-gray-500">{description}</p>
                        </div>
                        <FiChevronRight
                            size={18}
                            strokeWidth={2.5}
                            className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200"
                        />
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="border border-gray-200 p-6 rounded-lg flex items-center gap-4 hover:bg-black hover:text-white transition-all duration-200 font-bold text-left"
                >
                    <FiLogOut size={22} strokeWidth={2.5} className="flex-shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Account;