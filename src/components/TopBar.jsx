import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const DEFAULT_MESSAGES = [
    "Welcome to HOODKID — Wear If You're Real",
    'Free shipping on orders over R500',
];

const TopBar = ({
    messages = DEFAULT_MESSAGES,
    rotationMs = 4000,
    dismissible = true,
    storageKey = 'hoodkid-topbar-dismissed',
}) => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [dismissed, setDismissed] = useState(() => {
        if (!dismissible) return false;
        try {
            return sessionStorage.getItem(storageKey) === 'true';
        } catch {
            return false;
        }
    });

    // Rotate messages
    useEffect(() => {
        if (dismissed || messages.length <= 1) return;

        const interval = setInterval(() => {
            setFade(false);
            const timeout = setTimeout(() => {
                setIndex((prev) => (prev + 1) % messages.length);
                setFade(true);
            }, 250);

            // store timeout id so unmount clears it
            interval._fadeTimeout = timeout;
        }, rotationMs);

        return () => {
            clearInterval(interval);
            if (interval._fadeTimeout) clearTimeout(interval._fadeTimeout);
        };
    }, [dismissed, messages.length, rotationMs]);

    const handleDismiss = () => {
        setDismissed(true);
        try {
            sessionStorage.setItem(storageKey, 'true');
        } catch {
            /* private mode — fine to ignore */
        }
    };

    if (dismissed || messages.length === 0) return null;

    return (
        <div
            className="relative w-full bg-white text-black text-center text-xs sm:text-sm py-2 px-10 overflow-hidden border-b border-gray-200"
            role="region"
            aria-label="Site announcements"
            aria-live="polite"
        >
            <p
                className={`font-medium tracking-wide transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {messages[index]}
            </p>

            {dismissible && (
                <button
                    onClick={handleDismiss}
                    aria-label="Dismiss announcement"
                    className="absolute top-1/2 right-3 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                >
                    <FiX size={14} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
};

export default TopBar;