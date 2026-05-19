import DesktopFilters from "./DesktopFilters";

const MobileFilters = ({ open, onClose, ...props }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-0 top-0 h-full w-80 bg-white p-6">
                <button
                    onClick={onClose}
                    className="mb-6 font-bold text-sm"
                >
                    Close ✕
                </button>

                <DesktopFilters {...props} />
            </div>
        </div>
    );
};

export default MobileFilters;