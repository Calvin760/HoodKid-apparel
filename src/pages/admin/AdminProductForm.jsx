import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';
import { FiX, FiPlus, FiUpload } from 'react-icons/fi';

import Loading from '../../components/Loading';
import {
    CATEGORY_OPTIONS,
    SUBCATEGORY_OPTIONS,
    SIZE_OPTIONS,
    HERO_OPTIONS,
    GENDER_OPTIONS,
    EMPTY_PRODUCT_FORM,
} from './constants';

const API_URL = import.meta.env.VITE_API_URL;

const labeled = 'block';
const labelText = 'text-xs font-bold uppercase tracking-widest text-gray-600 mb-1';
const input = 'w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none';

const AdminProductForm = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const location = useLocation();
    const { getToken } = useAuth();

    const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
    const [colorInput, setColorInput] = useState({ name: '', value: '#000000' });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(isEdit);
    const [existingProduct, setExistingProduct] = useState(null);
    const imageUrlsRef = useRef([]);

    // Hydrate the form from a product object (from router state or fetched)
    const hydrateForm = (p) => {
        setExistingProduct(p);
        setForm({
            ...EMPTY_PRODUCT_FORM,
            name: p.name || '',
            description: p.description || '',
            price: p.price || '',
            category: p.category || '',
            subcategory: p.subcategory || '',
            gender: p.gender || '',
            bestseller: p.bestseller || false,
            latestCollection: p.latestCollection || false,
            sizes: p.sizes || [],
            colours: p.colours || [],
            hero: p.hero || '',
        });
    };

    // Load product for editing — prefer router state, fall back to fetch,
    // fall back to product list lookup if the fetch endpoint doesn't exist.
    useEffect(() => {
        if (!isEdit) return;

        // Option A: product passed via router state (fast path, no server call)
        if (location.state?.product) {
            hydrateForm(location.state.product);
            setLoading(false);
            return;
        }

        // Option B: page was refreshed — state is gone, try fetching from list
        let cancelled = false;
        (async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/products`);
                if (cancelled) return;

                const product = (data.products || []).find((p) => p._id === id);
                if (!product) {
                    toast.error('Product not found');
                    navigate('/admin/products');
                    return;
                }

                hydrateForm(product);
            } catch (err) {
                if (cancelled) return;
                console.error('Load product failed:', err);
                toast.error('Could not load product');
                navigate('/admin/products');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, isEdit, location.state, navigate]);

    // Revoke blob URLs on unmount
    useEffect(() => {
        return () => {
            imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const toggleSize = (size) =>
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size],
        }));

    const addColor = () => {
        if (!colorInput.name.trim()) {
            toast.error('Colour name required');
            return;
        }
        setForm((prev) => ({ ...prev, colours: [...prev.colours, colorInput] }));
        setColorInput({ name: '', value: '#000000' });
    };

    const removeColor = (i) =>
        setForm((prev) => ({
            ...prev,
            colours: prev.colours.filter((_, idx) => idx !== i),
        }));

    const handleImagesChange = (e) => {
        imageUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        const files = Array.from(e.target.files);
        imageUrlsRef.current = files.map((f) => URL.createObjectURL(f));
        setForm((prev) => ({ ...prev, images: files }));
    };

    const validate = () => {
        if (!form.name.trim()) return 'Name is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
            return 'Price must be a positive number';
        if (!form.category) return 'Category is required';
        if (!isEdit && form.images.length === 0) return 'At least one image is required';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        setSubmitting(true);
        try {
            const token = await getToken();
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('category', form.category.toLowerCase());
            formData.append('subcategory', form.subcategory.toLowerCase());
            formData.append('gender', form.gender);
            formData.append('bestseller', form.bestseller);
            formData.append('latestCollection', form.latestCollection);
            formData.append('sizes', JSON.stringify(form.sizes));
            formData.append('colours', JSON.stringify(form.colours));
            formData.append('hero', form.hero);
            if (form.video) formData.append('video', form.video);
            form.images.forEach((img) => formData.append('images', img));

            const url = isEdit
                ? `${API_URL}/api/products/${id}`
                : `${API_URL}/api/products`;
            const method = isEdit ? 'put' : 'post';

            await axios[method](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(isEdit ? 'Product updated' : 'Product created');
            navigate('/admin/products');
        } catch (err) {
            console.error('Submit failed:', err);
            toast.error(err.response?.data?.message || 'Could not save product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading text="Loading product..." />;

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
            <div className={labeled}>
                <label className={labelText}>Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={input} />
            </div>

            <div className={labeled}>
                <label className={labelText}>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className={`${input} resize-none`}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={labeled}>
                    <label className={labelText}>Price (R) *</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className={input}
                    />
                </div>
                <div className={labeled}>
                    <label className={labelText}>Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className={input}>
                        <option value="">Select</option>
                        {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={labeled}>
                    <label className={labelText}>Category *</label>
                    <select name="category" value={form.category} onChange={handleChange} className={input}>
                        <option value="">Select</option>
                        {CATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
                <div className={labeled}>
                    <label className={labelText}>Subcategory</label>
                    <select name="subcategory" value={form.subcategory} onChange={handleChange} className={input}>
                        <option value="">Select</option>
                        {SUBCATEGORY_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} />
                    Bestseller
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="latestCollection" checked={form.latestCollection} onChange={handleChange} />
                    Latest Collection
                </label>
            </div>

            <div>
                <label className={labelText}>Sizes</label>
                <div className="flex gap-2 flex-wrap">
                    {SIZE_OPTIONS.map((s) => {
                        const selected = form.sizes.includes(s);
                        return (
                            <button
                                type="button"
                                key={s}
                                onClick={() => toggleSize(s)}
                                className={`min-w-[3rem] px-3 py-1.5 text-sm font-bold border transition-colors duration-200 ${selected ? 'bg-black text-white border-black' : 'border-gray-300 hover:border-black'
                                    }`}
                            >
                                {s}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <label className={labelText}>Colours</label>
                <div className="flex gap-2">
                    <input
                        placeholder="Name"
                        value={colorInput.name}
                        onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                        className={`${input} flex-1`}
                    />
                    <input
                        type="color"
                        value={colorInput.value}
                        onChange={(e) => setColorInput({ ...colorInput, value: e.target.value })}
                        className="w-12 h-10 border border-gray-300 cursor-pointer"
                    />
                    <button
                        type="button"
                        onClick={addColor}
                        className="flex items-center gap-1 px-3 bg-black text-white text-sm font-bold hover:bg-gray-900 transition-colors duration-200"
                    >
                        <FiPlus size={14} /> Add
                    </button>
                </div>

                {form.colours.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {form.colours.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 border border-gray-300 px-2 py-1 text-sm">
                                <span className="w-4 h-4 border border-gray-300" style={{ background: c.value }} />
                                {c.name}
                                <button
                                    type="button"
                                    onClick={() => removeColor(i)}
                                    className="text-gray-400 hover:text-black"
                                    aria-label={`Remove ${c.name}`}
                                >
                                    <FiX size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className={labelText}>
                    Images {!isEdit && '*'} {isEdit && '(leave blank to keep existing)'}
                </label>
                <input type="file" multiple accept="image/*" onChange={handleImagesChange} className={input} />
                {form.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {form.images.map((img, i) => (
                            <img
                                key={i}
                                src={imageUrlsRef.current[i]}
                                alt={`Preview ${i + 1}`}
                                className="w-20 h-20 object-cover border border-gray-200"
                            />
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label className={labelText}>Video (optional)</label>
                {isEdit && existingProduct?.video && !form.video && (
                    <video controls className="w-full max-w-sm mb-2">
                        <source
                            src={
                                existingProduct.video.startsWith('http')
                                    ? existingProduct.video
                                    : `${API_URL}/${existingProduct.video}`
                            }
                            type="video/mp4"
                        />
                    </video>
                )}
                <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setForm({ ...form, video: e.target.files[0] || null })}
                    className={input}
                />
            </div>

            <div className={labeled}>
                <label className={labelText}>Hero Section</label>
                <select name="hero" value={form.hero} onChange={handleChange} className={input}>
                    {HERO_OPTIONS.map((h) => (
                        <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="px-6 py-3 border border-gray-300 text-sm font-bold uppercase tracking-wide hover:bg-gray-50 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 text-sm font-bold uppercase tracking-wide hover:bg-gray-900 disabled:opacity-50 transition-colors duration-200"
                >
                    <FiUpload size={14} />
                    {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
                </button>
            </div>
        </form>
    );
};

export default AdminProductForm;