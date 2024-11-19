import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import DeviceCounter from "./DeviceCounter";

const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-primary text-white"
      : "text-primary hover:bg-primary/10";

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex space-x-4">
            <Link
              to={ROUTES.HOME}
              className={`px-4 py-2 rounded-md transition-colors ${isActive(ROUTES.HOME)}`}
            >
              Home
            </Link>
            <Link
              to={ROUTES.DEVICES}
              className={`px-4 py-2 rounded-md transition-colors ${isActive(ROUTES.DEVICES)}`}
            >
              Devices
            </Link>
          </div>
          <DeviceCounter />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
