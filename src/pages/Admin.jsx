import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductItem from "../components/ProductItem";
import { FaBox, FaPlus, FaClipboardList } from "react-icons/fa";
import { useAuth } from "@clerk/clerk-react";

const Admin = () => {

    const API_URL = import.meta.env.VITE_API_URL

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("products");
    const [orders, setOrders] = useState([]);
    const [orderLoading, setOrderLoading] = useState(false);
    const [search, setSearch] = useState("");

    const { getToken } = useAuth();

    const CATEGORY_OPTIONS = [
        { label: "Tops", value: "tops" },
        { label: "Shorts", value: "shorts" },
        { label: "Hoodies", value: "hoodies" },
        { label: "Pants", value: "pants" },
        { label: "Headwear", value: "headwear" },
    ];

    const SUBCATEGORY_OPTIONS = [
        { label: "Caution Capsule", value: "caution capsule" },
        { label: "Menace To the society", value: "menace to the society" },
        { label: "The Boxed Cropped T", value: "the boxed cropped t" },
        { label: "Anti Pilling Fleece", value: "anti pilling fleece" },
    ];

    // ================= FORM =================
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "",
        gender: "",
        bestseller: false,
        latestCollection: false,
        sizes: [],
        colours: [],
        images: [],
        video: null,
        hero: ""
    });

    const [editId, setEditId] = useState(null);

    const [colorInput, setColorInput] = useState({
        name: "",
        value: "#000000"
    });

    // ================= FETCH =================
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/api/products`);
            setProducts(data.products || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            setOrderLoading(true);

            const token = await getToken();

            const { data } = await axios.get(
                `${API_URL}/api/orders/admin`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(data.orders || []);

        } catch (err) {
            console.log(err);
        } finally {
            setOrderLoading(false);
        }
    };

    useEffect(() => {
        if (tab === "products") fetchProducts();
        if (tab === "orders") fetchOrders();
    }, [tab]);

    // ================= HANDLERS =================
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const toggleSize = (size) => {
        setForm((prev) => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const addColor = () => {
        if (!colorInput.name) return;

        setForm((prev) => ({
            ...prev,
            colours: [...prev.colours, colorInput]
        }));

        setColorInput({ name: "", value: "#000000" });
    };

    const removeColor = (i) => {
        setForm((prev) => ({
            ...prev,
            colours: prev.colours.filter((_, index) => index !== i)
        }));
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await getToken(); // ✅ Clerk token

            const formData = new FormData();

            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", form.price);
            formData.append("category", form.category.toLowerCase());
            formData.append("subcategory", form.subcategory.toLowerCase());
            formData.append("gender", form.gender);
            formData.append("bestseller", form.bestseller);
            formData.append("latestCollection", form.latestCollection);
            formData.append("sizes", JSON.stringify(form.sizes));
            formData.append("colours", JSON.stringify(form.colours));
            formData.append("hero", form.hero);
            if (form.video) {
                formData.append("video", form.video);
            }

            form.images.forEach((img) => {
                formData.append("images", img);
            });

            // ================= UPDATE =================
            if (editId) {
                await axios.put(
                    `${API_URL}/api/products/${editId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // ✅ FIXED
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            // ================= CREATE =================
            else {
                await axios.post(
                    `${API_URL}/api/products`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // ✅ FIXED
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
            }

            resetForm();
            fetchProducts();

        } catch (err) {
            console.log(err);
        }
    };

    // ================= DELETE =================
    const deleteProduct = async (id) => {
        try {
            const token = await getToken(); // ✅ Clerk token

            await axios.delete(
                `${API_URL}/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchProducts();

        } catch (err) {
            console.log(err);
        }
    };

    // ================= EDIT =================
    const editProduct = (item) => {
        setEditId(item._id);

        setForm({
            name: item.name,
            description: item.description || "",
            price: item.price,
            category: item.category,
            subcategory: item.subcategory,
            gender: item.gender || "",
            bestseller: item.bestseller || false,
            latestCollection: item.latestCollection || false,
            sizes: item.sizes || [],
            colours: item.colours || [],
            images: [],
            video: null,
            hero: item.hero || ""
        });

        setTab("create");
    };

    const resetForm = () => {
        setEditId(null);
        setForm({
            name: "",
            description: "",
            price: "",
            category: "",
            subcategory: "",
            gender: "",
            bestseller: false,
            latestCollection: false,
            sizes: [],
            colours: [],
            images: [],
            video: null,
            hero: ""
        });
    };

    const filteredOrders = orders
        .filter(order => order.paymentStatus === "paid")
        .filter(order => {
            const q = search.toLowerCase();

            return (
                order._id.toLowerCase().includes(q) ||
                order.shippingInfo?.name?.toLowerCase().includes(q) ||
                order.shippingInfo?.phone?.includes(q)
            );
        });

    // ================= UI =================
    return (
        <div className="p-6">

            <h1 className="text-2xl font-semibold mb-4">Admin Panel</h1>

            {/* SEGMENTED */}
            <div className="bg-gray-100 p-1 rounded-xl flex gap-1 mb-6 w-full md:w-fit">
                <button onClick={() => setTab("products")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tab === "products" ? "bg-black text-white" : ""}`}>
                    <FaBox /> <span className="hidden sm:inline">Products</span>
                </button>

                <button onClick={() => setTab("create")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tab === "create" ? "bg-black text-white" : ""}`}>
                    <FaPlus /> <span className="hidden sm:inline">Create</span>
                </button>

                <button onClick={() => setTab("orders")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${tab === "orders" ? "bg-black text-white" : ""}`}>
                    <FaClipboardList /> <span className="hidden sm:inline">Orders</span>
                </button>
            </div>

            {/* PRODUCTS */}
            {tab === "products" && (
                loading ? <p>Loading...</p> :
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((item) => (
                            <div key={item._id} className="border p-4 rounded-lg">
                                <ProductItem id={item._id} name={item.name} image={item.image} price={item.price} />

                                {/* <p className="mt-2 font-medium">{item.name}</p> */}
                                <p className="text-sm text-gray-500">{item.gender}</p>

                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => editProduct(item)} className="text-blue-600">Edit</button>
                                    <button onClick={() => deleteProduct(item._id)} className="text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
            )}

            {/* CREATE */}
            {tab === "create" && (
                <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">

                    <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2" />

                    <textarea name="description" value={form.description} onChange={handleChange}
                        placeholder="Description" className="border p-2" />

                    <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2" />

                    {/* CATEGORY */}
                    <select name="category" value={form.category} onChange={handleChange} className="border p-2">
                        <option value="">Category</option>
                        {CATEGORY_OPTIONS.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>

                    {/* SUBCATEGORY */}
                    <select name="subcategory" value={form.subcategory} onChange={handleChange} className="border p-2">
                        <option value="">Subcategory</option>
                        {SUBCATEGORY_OPTIONS.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>

                    {/* GENDER */}
                    <select name="gender" value={form.gender} onChange={handleChange} className="border p-2">
                        <option value="">Gender</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Unisex">Unisex</option>
                    </select>

                    {/* CHECKBOXES */}
                    <label className="flex gap-2 items-center">
                        <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleChange} />
                        Bestseller
                    </label>

                    <label className="flex gap-2 items-center">
                        <input type="checkbox" name="latestCollection" checked={form.latestCollection} onChange={handleChange} />
                        Latest Collection
                    </label>

                    {/* SIZES */}
                    <div>
                        <p>Sizes</p>
                        <div className="flex gap-2 flex-wrap">
                            {["XS", "S", "M", "L", "XL", "26", "28", "29", "30", "32", "34", "36","38","40", "42"].map(s => (
                                <button type="button" key={s}
                                    onClick={() => toggleSize(s)}
                                    className={`border px-3 py-1 ${form.sizes.includes(s) ? "bg-black text-white" : ""}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* COLOURS */}
                    <div>
                        <p>Colours</p>

                        <div className="flex gap-2">
                            <input placeholder="Name" value={colorInput.name}
                                onChange={(e) => setColorInput({ ...colorInput, name: e.target.value })}
                                className="border p-2" />

                            <input type="color" value={colorInput.value}
                                onChange={(e) => setColorInput({ ...colorInput, value: e.target.value })} />

                            <button type="button" onClick={addColor}>Add</button>
                        </div>

                        <div className="flex gap-2 mt-2 flex-wrap">
                            {form.colours.map((c, i) => (
                                <div key={i} className="flex items-center gap-1 border px-2 py-1">
                                    <div style={{ background: c.value }} className="w-4 h-4" />
                                    {c.name}
                                    <button type="button" onClick={() => removeColor(i)}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IMAGES */}
                    <input type="file" multiple onChange={(e) => setForm({ ...form, images: Array.from(e.target.files) })} />

                    <div className="flex gap-2">
                        {form.images.map((img, i) => (
                            <img key={i} src={URL.createObjectURL(img)} className="w-16 h-16 object-cover" />
                        ))}
                    </div>

                    {editId && products.find(p => p._id === editId)?.video && (
                        <video className="w-full mt-2" controls>
                            <source
                                src={
                                    products.find(p => p._id === editId).video.startsWith("http")
                                        ? products.find(p => p._id === editId).video
                                        : `${API_URL}/${products.find(p => p._id === editId).video}`
                                }
                                type="video/mp4"
                            />
                        </video>
                    )}

                    <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                            setForm({
                                ...form,
                                video: e.target.files[0]
                            })
                        }
                        className="border p-2"
                    />

                    {/* HERO SELECTION */}
                    <div>
                        <p className="mb-1">Hero Section</p>

                        <select
                            name="hero"
                            value={form.hero}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        >
                            <option value="">Not a hero product</option>
                            <option value="hero1">Hero 1</option>
                            <option value="hero2">Hero 2</option>
                            <option value="hero3">Hero 3</option>
                        </select>
                    </div>

                    <button className="bg-black text-white py-2">
                        {editId ? "Update Product" : "Add Product"}
                    </button>

                </form>
            )}

            {tab === "orders" && (
                <div>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search by ID, name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 mb-4 w-full md:w-1/3"
                    />

                    {/* LOADING */}
                    {orderLoading ? (
                        <p>Loading orders...</p>
                    ) : filteredOrders.length === 0 ? (
                        <p>No paid orders found</p>
                    ) : (
                        <div className="space-y-6">

                            {filteredOrders.map((order) => (
                                <div key={order._id} className="border p-4 rounded">

                                    <p className="font-medium">
                                        Order ID: {order.orderNumber || order._id}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {order.shippingInfo?.name || "No name"}
                                    </p>

                                    <div className="mt-2 text-sm space-y-1">
                                        <p>Total: R {order.total}</p>

                                        <p>
                                            Payment:
                                            <span className="ml-2 font-semibold text-green-600">
                                                {order.paymentStatus}
                                            </span>
                                        </p>

                                        <p>
                                            Method:
                                            <span className="ml-2 font-semibold">
                                                {order.deliveryMethod || "N/A"}
                                            </span>
                                        </p>
                                    </div>

                                    {/* SHIPPING INFO */}
                                    {order.deliveryMethod === "delivery" && (
                                        <div className="mt-3 text-sm">
                                            <p>
                                                Phone: {order.shippingInfo?.phone || "No phone"}
                                            </p>
                                            <p>
                                                Address: {order.shippingInfo?.address || "No address"}
                                            </p>
                                        </div>
                                    )}

                                    {/* PICKUP */}
                                    {order.deliveryMethod === "pickup" && (
                                        <p className="mt-3 text-blue-600 text-sm">
                                            Customer will collect (Pickup)
                                        </p>
                                    )}

                                    {/* ITEMS */}
                                    <div className="mt-3 text-xs text-gray-600">
                                        {order.items.map((i, idx) => (
                                            <p key={idx}>
                                                {i.name} ({i.size} / {i.color}) × {i.quantity}
                                            </p>
                                        ))}
                                    </div>

                                </div>
                            ))}

                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Admin;