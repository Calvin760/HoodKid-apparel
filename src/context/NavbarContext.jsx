// src/context/NavbarContext.jsx
import { createContext, useContext, useState } from "react";

const NavbarContext = createContext(null);

export const NavbarProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);

    return (
        <NavbarContext.Provider value={{ visible, setVisible }}>
            {children}
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => {
    const ctx = useContext(NavbarContext);
    if (!ctx) {
        throw new Error("useNavbar must be used inside NavbarProvider");
    }
    return ctx;
};