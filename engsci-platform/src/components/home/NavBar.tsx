import { Link } from "react-router-dom";
import logo from "../../assets/logo1.png";
const NavBar = () => {
  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              <img src={logo} alt="EngSci Platform" className="h-20" />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 hover:bg-blue-700 rounded">
              Home
            </Link>
            <Link
              to="/resources"
              className="px-3 py-2 hover:bg-blue-700 rounded"
            >
              Resources
            </Link>
            <Link to="/y1f" className="px-3 py-2 hover:bg-blue-700 rounded">
              Y1F
            </Link>
            <Link to="/y1w" className="px-3 py-2 hover:bg-blue-700 rounded">
              Y1W
            </Link>
            <Link to="/y2f" className="px-3 py-2 hover:bg-blue-700 rounded">
              Y2F
            </Link>
            <Link to="/y2w" className="px-3 py-2 hover:bg-blue-700 rounded">
              Y2W
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
