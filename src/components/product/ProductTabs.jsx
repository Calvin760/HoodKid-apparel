import { useState } from "react";

const ProductTabs = ({ description }) => {
    const [active, setActive] = useState("description");

    return (
        <div className="mt-16">
            <div className="flex gap-6 border-b">
                {["description", "reviews"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={`pb-3 capitalize ${active === tab ? "border-b-2 border-black" : ""
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {active === "description" && (
                <div className="mt-6 text-gray-600 max-w-3xl">
                    {description || "Premium quality product."}
                </div>
            )}

            {active === "reviews" && (
                <div className="mt-6 space-y-4">
                    {[1, 2, 3].map(r => (
                        <div key={r} className="border-b pb-3">
                            <p className="font-medium">User {r}</p>
                            <p className="text-gray-500">★★★★★</p>
                            <p className="text-sm text-gray-600">
                                Great product, highly recommend!
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductTabs;