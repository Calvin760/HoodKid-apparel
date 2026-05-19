const CollectionHeader = ({ count, total, activeCount, onOpenFilters }) => (
    <div className="mb-8 flex justify-between items-end border-b pb-6">
        <div>
            <h1 className="text-4xl font-black">New Trainers & Gear</h1>
            <p className="text-sm text-gray-500">
                Showing <b>{count}</b> of {total}
            </p>
        </div>

        <button
            onClick={onOpenFilters}
            className="lg:hidden bg-black text-white px-4 py-2 rounded relative"
        >
            Filters
            {activeCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black w-5 h-5 text-xs rounded-full flex items-center justify-center">
                    {activeCount}
                </span>
            )}
        </button>
    </div>
);

export default CollectionHeader;