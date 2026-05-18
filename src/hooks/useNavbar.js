import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

export const useNavbar = () => {
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
  }, [visible]);

  /* Close sidebar on route change */
  useEffect(() => {
    setVisible(false);
  }, [location.pathname]);

  return {
    visible,
    setVisible,
    user,
    handleLogin,
    logout,
    handleLogoClick,
  };
};