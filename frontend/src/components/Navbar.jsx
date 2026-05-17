import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { token, setToken, userData, ownerToken } = useContext(AppContext);
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    navigate("/");
    localStorage.removeItem("token");
  };

  return (
    <div
      className={` absolute top-0 left-0 w-full z-50 transition-all duration-300 ${
        isHome
          ? "bg-transparent text-black border-b border-white/20"
          : "text-black border-b-2"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3 md:py-0">
        <NavLink to="/">
          <img
            className="w-24 md:w-32 cursor-pointer"
            src={assets.logo}
            alt="Postura Logo"
          />
        </NavLink>

        <ul className="hidden cursor-pointer md:flex items-start gap-6 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-black cursor-pointer ${isActive ? "text-green-800" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/workout"
            className={({ isActive }) =>
              `hover:text-black cursor-pointer ${isActive ? "text-green-800" : ""}`
            }
          >
            Workout
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `hover:text-black ${isActive ? "text-green-800" : ""}`
            }
          >
            About
          </NavLink>
        </ul>

        <div className="flex items-center gap-2 md:gap-4">
          {token && userData ? (
            <div className="hidden md:block">
              <div className="flex items-center gap-2 cursor-pointer group relative">
                <img
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  src={userData.profilePic}
                  alt="profile"
                />
                <img
                  className="w-2 md:w-2.5"
                  src={assets.dropdown}
                  alt="dropdown"
                />
                <div className="absolute top-0 right-0 pt-14 text-sm md:text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                  <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                    <p
                      onClick={() => navigate("/my-profile")}
                      className="hover:text-black cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p
                      onClick={() => navigate("/my-payments")}
                      className="hover:text-black cursor-pointer"
                    >
                      Payments
                    </p>
                    <p
                      onClick={logout}
                      className="hover:text-black cursor-pointer"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <p
                onClick={() => navigate("/owner-dashboard")}
                className="hidden sm:block cursor-pointer text-black text-xs md:text-base font-medium"
              >
                Owner Dashboard
              </p>
              {!ownerToken && (
                <button
                  onClick={() => navigate("/login")}
                  className="text-xs md:text-base border border-green-800 px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-green-800 hover:text-white transition whitespace-nowrap"
                >
                  Create Account
                </button>
              )}
            </div>
          )}

          {/* Hamburger Menu Icon */}
          <div className="md:hidden flex items-center ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-black"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {showMenu ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden ${showMenu ? "block" : "hidden"} bg-white border-b-2 border-gray-200 shadow-md absolute w-56 right-0`}
      >
        <ul className="flex flex-col items-center gap-4 py-6 text-black font-medium">
          <NavLink
            to="/"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `hover:text-green-800 ${isActive ? "text-green-800" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/workout"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `hover:text-green-800 ${isActive ? "text-green-800" : ""}`
            }
          >
            Workout
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setShowMenu(false)}
            className={({ isActive }) =>
              `hover:text-green-800 ${isActive ? "text-green-800" : ""}`
            }
          >
            About
          </NavLink>

          {token && userData ? (
            <>
              <div className="w-full border-t border-gray-200 my-1"></div>
              <p
                onClick={() => {
                  navigate("/my-profile");
                  setShowMenu(false);
                }}
                className="hover:text-green-800 cursor-pointer"
              >
                My Profile
              </p>
              <p
                onClick={() => {
                  navigate("/my-payments");
                  setShowMenu(false);
                }}
                className="hover:text-green-800 cursor-pointer"
              >
                Payments
              </p>
              <p
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="hover:text-green-800 cursor-pointer"
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <div className="w-full border-t border-gray-200 my-1"></div>
              <p
                onClick={() => {
                  navigate("/owner-dashboard");
                  setShowMenu(false);
                }}
                className="hover:text-green-800 cursor-pointer text-sm"
              >
                Owner Dashboard
              </p>
              {!ownerToken && (
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowMenu(false);
                  }}
                  className="border border-white md:border-green-800 px-4 py-2 rounded-md hover:bg-white md:hover:bg-green-800 hover:text-white transition"
                >
                  Create Account
                </button>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
