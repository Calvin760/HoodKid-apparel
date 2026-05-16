const OrderStatusSelect = ({ order, updateStatus }) => {
    return (
        <div>
            <span>Status:</span>
            <select
                value={order.status}
                onChange={(e) =>
                    updateStatus(order._id, "status", e.target.value)
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
    );
};

export default OrderStatusSelect;