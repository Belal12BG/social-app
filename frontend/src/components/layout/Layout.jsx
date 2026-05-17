import { useSelector } from "react-redux";
import Navbar from "../navbar/Navbar";
import LeftBar from "../leftbar/LeftBar";
import RightBar from "../rightbar/RightBar";

const Layout = ({ children, showSidebars = true }) => {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light min-vh-100"}>
      <Navbar />
      <div className="d-flex gap-3 container-fluid px-3 pt-2" style={{ maxWidth: 1400, margin: "0 auto" }}>
        {showSidebars && <LeftBar />}
        <div className="flex-grow-1 min-w-0">{children}</div>
        {showSidebars && <RightBar />}
      </div>
    </div>
  );
};

export default Layout;
