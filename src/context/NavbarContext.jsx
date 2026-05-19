// src/context/NavbarContext.jsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

const NavbarContext = createContext(null);

export const NavbarProvider = ({ children }) => {
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();
    const { openSignIn, signOut } = useClerk();

    const handleLogin = () => {
        if (user) {
            navigate("/account");
            return;
        }

        openSignIn({
            afterSignInUrl: "/",
            afterSignUpUrl: "/",
        });
    };

    const logout = async () => {
        await signOut();
        navigate("/");
    };

    const handleLogoClick = () => {
        if (location.pathname === "/") {
            window.location.reload();
        } else {
            navigate("/");
        }
    };

    /* Lock body scroll */
    useEffect(() => {
        document.body.style.overflow = visible ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [visible]);

    /* Close sidebar on route change */
    useEffect(() => {
        setVisible(false);
    }, [location.pathname]);

    return (
        <NavbarContext.Provider
            value={{
                visible,
                setVisible,
                user,
                handleLogin,
                logout,
                handleLogoClick,
            }}
        >
            {children}
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => {
    const ctx = useContext(NavbarContext);

    if (!ctx) {
        throw new Error(
            "useNavbar must be used inside NavbarProvider"
        );
    }

    return ctx;
};