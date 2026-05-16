const OrderItems = ({ items }) => {
    return (
        <div className="mt-4 text-xs text-gray-600 space-y-1">
            {items.map((i, idx) => (
                <p key={idx}>
                    {i.name} ({i.size} / {i.color}) × {i.quantity}
                </p>
            ))}
        </div>
    );
};

export default OrderItems;