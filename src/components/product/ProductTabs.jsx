import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const TABS = [
    { id: 'description', label: 'Description' },
    { id: 'reviews', label: 'Reviews' },
];

/* ============================================================
   STAR RATING
   ============================================================ */
const StarRating = ({ value, size = 14 }) => (
    <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((n) => (
            <FiStar
                key={n}
                size={size}
                strokeWidth={2}
                className={n <= value ? 'fill-black stroke-black' : 'stroke-gray-300'}
            />
        ))}
    </div>
);

/* ============================================================
   REVIEW CARD
   ============================================================ */
const ReviewCard = ({ review }) => {
    const date = review.createdAt
        ? new Date(review.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
        : null;

    return (
        <article className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-sm">{review.userName || 'Anonymous'}</p>
                {date && <p className="text-xs text-gray-400">{date}</p>}
            </div>
            <StarRating value={review.rating || 0} />
            {review.comment && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                </p>
            )}
        </article>
    );
};

/* ============================================================
   REVIEWS SUMMARY
   ============================================================ */
const ReviewsSummary = ({ reviews }) => {
    if (!reviews.length) return null;
    const avg =
        reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;

    return (
        <div className="flex items-center gap-3 mb-6">
            <StarRating value={Math.round(avg)} size={18} />
            <p className="text-sm text-gray-600">
                <span className="font-bold text-black">{avg.toFixed(1)}</span> · {reviews.length}{' '}
                {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
        </div>
    );
};

/* ============================================================
   MAIN
   ============================================================ */
const ProductTabs = ({ description, reviews = [] }) => {
    const [active, setActive] = useState('description');

    return (
        <div className="mt-16">
            {/* TAB LIST */}
            <div role="tablist" className="flex gap-6 border-b border-gray-200">
                {TABS.map((tab) => {
                    const selected = active === tab.id;
                    return (
                        <button
                            key={tab.id}
                            role="tab"
                            id={`tab-${tab.id}`}
                            aria-controls={`panel-${tab.id}`}
                            aria-selected={selected}
                            onClick={() => setActive(tab.id)}
                            className={`pb-3 text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${selected
                                    ? 'border-b-2 border-black text-black'
                                    : 'border-b-2 border-transparent text-gray-500 hover:text-black'
                                }`}
                        >
                            {tab.label}
                            {tab.id === 'reviews' && reviews.length > 0 && (
                                <span className="ml-2 text-xs text-gray-400">({reviews.length})</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* DESCRIPTION PANEL */}
            {active === 'description' && (
                <div
                    role="tabpanel"
                    id="panel-description"
                    aria-labelledby="tab-description"
                    className="mt-6 text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl"
                >
                    {description || 'Premium quality product.'}
                </div>
            )}

            {/* REVIEWS PANEL */}
            {active === 'reviews' && (
                <div
                    role="tabpanel"
                    id="panel-reviews"
                    aria-labelledby="tab-reviews"
                    className="mt-6 max-w-3xl"
                >
                    <ReviewsSummary reviews={reviews} />

                    {reviews.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No reviews yet. Be the first to review this product.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((r) => (
                                <ReviewCard key={r._id || r.id} review={r} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductTabs;