import React, { useEffect, useState } from "react";

const TopBar = () => {
    const messages = [
        "Welcom To HoodKid Wear If You're Real",
        "Free shipping for orders over R500+",
    ];

    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {

            // fade out
            setFade(false);

            setTimeout(() => {
                // change text
                setIndex((prev) => (prev + 1) % messages.length);

                // fade in
                setFade(true);
            }, 200);

        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-black text-white text-center text-sm py-2 overflow-hidden">

            <div
                className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"
                    }`}
            >
                {messages[index]}
            </div>

        </div>
    );
};

export default TopBar;