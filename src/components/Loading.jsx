import React from "react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
    );
};

export default Loading;