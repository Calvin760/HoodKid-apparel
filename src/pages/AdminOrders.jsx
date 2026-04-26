import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:5000";

    // ================= FETCH ORDERS =================
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await axios.get(
                `${API_URL}/api/orders/admin`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setOrders(data.orders || []);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ================= UPDATE STATUS =================
    const updateStatus = async (id, field, value) => {
        try {
            const token = localStorage.getItem("token");

            // ✅ Optimistic UI update
            setOrders(prev =>
                prev.map(order =>
                    order._id === id
                        ? { ...order, [field]: value }
                        : order
                )
            );

            await axios.put(
                `${API_URL}/api/orders/${id}/status`,
                { [field]: value },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Order updated");

        } catch (err) {
            console.log(err);
            toast.error("Update failed");

            // ❗ fallback: refetch to fix wrong state
            fetchOrders();
        }
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="p-6">
                <p>Loading orders...</p>
            </div>
        );
    }

    // ================= EMPTY =================
    if (!orders.length) {
        return (
            <div className="p-6">
                <p>No orders found</p>
            </div>
        );
    }

    // ================= UI =================
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Paid Orders</h1>

            <div className="space-y-6">
                {orders
                    .filter(order => order.paymentStatus === "paid")
                    .map((order) => (
                        <div key={order._id} className="border p-4">

                            <p className="font-medium">
                                Order ID: {order._id}
                            </p>

                            <p className="text-sm text-gray-500">
                                {order.shippingInfo?.name || "No name"}
                            </p>

                            <div className="mt-3 text-sm space-y-2">
                                <p>Total: R {order.total}</p>

                                {/* PAYMENT */}
                                <div>
                                    <span>Payment:</span>
                                    <span className="ml-2 font-semibold text-green-600">
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                {/* DELIVERY METHOD */}
                                <div>
                                    <span>Method:</span>
                                    <span className="ml-2 font-semibold">
                                        {order.deliveryMethod || "Not specified"}
                                    </span>
                                </div>

                                {/* DELIVERY STATUS */}
                                <div>
                                    <span>Status:</span>
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                order._id,
                                                "status",
                                                e.target.value
                                            )
                                        }
                                        className="ml-2 border px-2 py-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* CONDITIONAL SHIPPING INFO */}
                            {order.deliveryMethod === "delivery" && (
                                <div className="mt-4 text-sm space-y-1">
                                    <p>
                                        Phone: {order.shippingInfo?.phone || "No phone"}
                                    </p>
                                    <p>
                                        Address: {order.shippingInfo?.address || "No address"}
                                    </p>
                                </div>
                            )}

                            {/* PICKUP MESSAGE */}
                            {order.deliveryMethod === "pickup" && (
                                <div className="mt-4 text-sm text-blue-600">
                                    Customer will collect (Pickup)
                                </div>
                            )}

                            {/* ITEMS */}
                            <div className="mt-4 text-xs text-gray-600 space-y-1">
                                {order.items.map((i, idx) => (
                                    <p key={idx}>
                                        {i.name} ({i.size} / {i.color}) × {i.quantity}
                                    </p>
                                ))}
                            </div>

                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AdminOrders;