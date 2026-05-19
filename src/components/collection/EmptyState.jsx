const EmptyState = ({ onReset }) => (
    <div className="py-20 text-center">
        <h3 className="text-lg font-bold">No products found</h3>
        <p className="text-gray-500 mb-6">
            Try adjusting your filters
        </p>
        <button
            onClick={onReset}
            className="bg-black text-white px-6 py-2 rounded"
        >
            Reset Filters
        </button>
    </div>
);

export default EmptyState;