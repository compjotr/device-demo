import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-primary text-white"
      : "text-primary hover:bg-primary/10";
  };

  return (
    <nav className="bg-white shadow-md mb-6">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 py-3">
          <Link
            to="/"
            className={`px-4 py-2 rounded-md transition-colors ${isActive(
              "/"
            )}`}
          >
            Home
          </Link>
          <Link
            to="/devices"
            className={`px-4 py-2 rounded-md transition-colors ${isActive(
              "/devices"
            )}`}
          >
            Devices
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
