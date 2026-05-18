import { navbarBase, stickyNavbar, relativeNavbar } from "../../styles/navbarClasses";
import { useNavbar } from "../../hooks/useNavbar";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
  const { visible, setVisible } = useNavbar();

  return (
    <div
      className={`${visible ? relativeNavbar : stickyNavbar} ${navbarBase}`}
    >
      <MobileNav />
      <DesktopNav />
      <MobileSidebar />
    </div>
  );
};

export default Navbar;