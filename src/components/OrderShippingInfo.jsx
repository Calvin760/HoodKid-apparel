const OrderShippingInfo = ({ order }) => {
    if (order.deliveryMethod === "delivery") {
        return (
            <div className="mt-4 text-sm space-y-1">
                <p>Phone: {order.shippingInfo?.phone || "No phone"}</p>
                <p>Address: {order.shippingInfo?.address || "No address"}</p>
            </div>
        );
    }

    if (order.deliveryMethod === "pickup") {
        return (
            <div className="mt-4 text-sm text-blue-600">
                Customer will collect (Pickup)
            </div>
        );
    }

    return null;
};

export default OrderShippingInfo;