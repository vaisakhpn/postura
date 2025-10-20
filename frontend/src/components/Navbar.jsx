import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
  };
  console.log(userData);

  return (
    <div
      className={` absolute top-0 left-0 w-full z-50 transition-all duration-300 ${
        isHome
          ? "bg-transparent text-black   border-b border-white/20"
          : " text-black border-b-2   "
      }`}
    >
      <div className="flex items-center  justify-between px-8 py-0">
        <NavLink to="/">
          <img
            className="w-32 cursor-pointer"
            src={assets.logo}
            alt="Postura Logo"
          />
        </NavLink>

        <ul className="hidden md:flex items-start gap-6 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-black ${isActive ? "text-green-800" : ""}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/workout"
            className={({ isActive }) =>
              `hover:text-black ${isActive ? "text-green-800" : ""}`
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
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="sm:w-14 w-8 rounded-full object-cover sm:h-10 h-8"
              src={userData.profilePic}
              alt="profile"
            />
            <img className="w-2.5" src={assets.dropdown} alt="dropdown" />
            <div className="absolute top-0 right-0 pt-16 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
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
                <p onClick={logout} className="hover:text-black cursor-pointer">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="border border-green-800 px-4 py-2 rounded-md hover:bg-green-800 hover:text-white transition"
          >
            Create Account
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
