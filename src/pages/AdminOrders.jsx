import { useAdminOrders } from "../hooks/useAdminOrders";
import OrderList from "../components/OrderList";

const AdminOrders = () => {
    const { orders, loading, updateStatus } = useAdminOrders();

    if (loading) return <p className="p-6">Loading orders...</p>;

    if (!orders.length) return <p className="p-6">No orders found</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Paid Orders</h1>

            <OrderList
                orders={orders}
                updateStatus={updateStatus}
            />
        </div>
    );
};

export default AdminOrders;