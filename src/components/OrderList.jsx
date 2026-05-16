import OrderCard from "./OrderCard";

const OrderList = ({ orders, updateStatus }) => {
    const paidOrders = orders.filter(o => o.paymentStatus === "paid");

    return (
        <div className="space-y-6">
            {paidOrders.map(order => (
                <OrderCard
                    key={order._id}
                    order={order}
                    updateStatus={updateStatus}
                />
            ))}
        </div>
    );
};

export default OrderList;