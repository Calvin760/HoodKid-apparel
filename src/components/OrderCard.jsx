import OrderItems from "./OrderItems";
import OrderShippingInfo from "./OrderShippingInfo";
import OrderStatusSelect from "./OrderStatusSelect";

const OrderCard = ({ order, updateStatus }) => {
    return (
        <div className="border p-4">

            <p className="font-medium">
                Order ID: {order._id}
            </p>

            <p className="text-sm text-gray-500">
                {order.shippingInfo?.name || "No name"}
            </p>

            <div className="mt-3 text-sm space-y-2">
                <p>Total: R {order.total}</p>

                <div>
                    <span>Payment:</span>
                    <span className="ml-2 font-semibold text-green-600">
                        {order.paymentStatus}
                    </span>
                </div>

                <div>
                    <span>Method:</span>
                    <span className="ml-2 font-semibold">
                        {order.deliveryMethod || "Not specified"}
                    </span>
                </div>

                <OrderStatusSelect
                    order={order}
                    updateStatus={updateStatus}
                />
            </div>

            <OrderShippingInfo order={order} />

            <OrderItems items={order.items} />
        </div>
    );
};

export default OrderCard;