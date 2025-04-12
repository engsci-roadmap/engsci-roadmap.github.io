import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-800 text-white shadow-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              <img src={logo} alt="EngSci Platform" className="h-16 md:h-20" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 hover:bg-blue-700 rounded">
              Home
            </Link>
            <Link to="/majors" className="px-3 py-2 hover:bg-blue-700 rounded">
              Majors
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

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
          <Link
            to="/"
            className="px-3 py-2 hover:bg-blue-700 rounded"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            to="/majors"
            className="px-3 py-2 hover:bg-blue-700 rounded"
            onClick={toggleMenu}
          >
            Majors
          </Link>
          <Link
            to="/y1f"
            className="px-3 py-2 hover:bg-blue-700 rounded"
            onClick={toggleMenu}
          >
            Y1F
          </Link>
          <Link
            to="/y1w"
            className="px-3 py-2 hover:bg-blue-700 rounded"
            onClick={toggleMenu}
          >
            Y1W
          </Link>
          <Link
            to="/y2f"
            className="px-3 py-2 hover:bg-blue-700 rounded"
            onClick={toggleMenu}
          >
            Y2F
          </Link>
          <Link
            to="/y2w"
            className="px-3 py-2 hover:bg-blue-700 rounded"
            onClick={toggleMenu}
          >
            Y2W
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
