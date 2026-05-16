import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAdminOrders, updateOrderStatus } from "../api/ordersApi";

export const useAdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        try {
            const data = await fetchAdminOrders();
            setOrders(data);
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, field, value) => {
        try {
            setOrders(prev =>
                prev.map(order =>
                    order._id === id ? { ...order, [field]: value } : order
                )
            );

            await updateOrderStatus(id, { [field]: value });

            toast.success("Order updated");
        } catch (err) {
            toast.error("Update failed");
            loadOrders();
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    return {
        orders,
        loading,
        updateStatus,
        reload: loadOrders,
    };
};