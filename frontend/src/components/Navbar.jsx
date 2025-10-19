import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

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

        <button className="border border-green-800 px-4 py-2 rounded-md hover:bg-green-800 hover:text-white transition">
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Navbar;
