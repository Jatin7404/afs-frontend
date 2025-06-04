import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">
                PrepEase
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/quiz"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Quiz
              </Link>
              <Link
                to="/interview-questions"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Interview Questions
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                  >
                    Bookmarks
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-900 hover:text-gray-700"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link
                to="/quiz"
                className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Quiz
              </Link>
              <Link
                to="/interview-questions"
                className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium"
              >
                Interview Questions
              </Link>
              {user && (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/bookmarks"
                    className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Bookmarks
                  </Link>
                </>
              )}
              {user ? (
                <button
                  onClick={logout}
                  className="block w-full text-left text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
