import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { FiBox, FiPlus, FiClipboard } from 'react-icons/fi';

import AdminProducts from './admin/AdminProducts';
import AdminProductForm from './admin/AdminProductForm';
import AdminOrders from './admin/AdminOrders';

const TABS = [
    { to: '/admin/products', label: 'Products', icon: FiBox },
    { to: '/admin/create', label: 'Create', icon: FiPlus },
    { to: '/admin/orders', label: 'Orders', icon: FiClipboard },
];

const Admin = () => (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-6">
            Admin Panel
        </h1>

        <nav className="bg-gray-100 p-1 flex gap-1 mb-8 w-full sm:w-fit overflow-x-auto scrollbar-hide">
            {TABS.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors duration-200 ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
                        }`
                    }
                >
                    <Icon size={16} strokeWidth={2.5} />
                    {label}
                </NavLink>
            ))}
        </nav>

        <Routes>
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="create" element={<AdminProductForm />} />
            <Route path="edit/:id" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
        </Routes>
    </div>
);

export default Admin;