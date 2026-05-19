import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

import ProductItem from '../../components/ProductItem';
import Loading from '../../components/Loading';

const API_URL = import.meta.env.VITE_API_URL;

const AdminProducts = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/api/products`);
            setProducts(data.products || []);
        } catch (err) {
            console.error('Fetch products failed:', err);
            toast.error('Could not load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (item) => {
        // Pass the full product through router state so the form
        // doesn't need to re-fetch it from the server.
        navigate(`/admin/edit/${item._id}`, { state: { product: item } });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

        setDeletingId(id);
        try {
            const token = await getToken();
            await axios.delete(`${API_URL}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Product deleted');
            setProducts((prev) => prev.filter((p) => p._id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
            toast.error(err.response?.data?.message || 'Could not delete product');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <Loading text="Loading products..." />;

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-4">No products yet.</p>
                <Link
                    to="/admin/create"
                    className="inline-block bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 transition-colors duration-200"
                >
                    Add Your First Product
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
                <div key={item._id} className="border border-gray-200 p-3 rounded">
                    <ProductItem
                        id={item._id}
                        name={item.name}
                        image={item.image}
                        price={item.price}
                        colours={item.colours}
                    />

                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        {item.gender && (
                            <p className="text-xs text-gray-500 uppercase tracking-widest">
                                {item.gender}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(item)}
                                className="flex-1 flex items-center justify-center gap-1 border border-gray-300 py-1.5 text-xs font-bold uppercase tracking-wide hover:border-black transition-colors duration-200"
                            >
                                <FiEdit2 size={12} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item._id, item.name)}
                                disabled={deletingId === item._id}
                                className="flex-1 flex items-center justify-center gap-1 border border-red-300 text-red-600 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-red-50 disabled:opacity-50 transition-colors duration-200"
                            >
                                <FiTrash2 size={12} /> {deletingId === item._id ? '...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminProducts;