import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-slate-50 mt-10">
      <div className="px-6 md:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-10 sm:gap-14 py-10 border-t-2 border-b-2 border-gray-200 text-sm">
          <div className="flex flex-col gap-4">
            <img
              className="w-24 md:w-32 cursor-pointer"
              src={assets.logo}
              alt="LOGO"
              onClick={() => navigate("/")}
            />
            <p className="w-full md:w-2/3 text-gray-600 leading-6">
              Postura helps you track your workouts and improve your posture.
              Fast, easy, and hassle-free gym sessions—anytime, anywhere.
            </p>
          </div>
          <div>
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li onClick={() => navigate("/")} className="cursor-pointer">
                Home
              </li>
              <li onClick={() => navigate("/about")} className="cursor-pointer">
                About Us
              </li>
              {/* <li
                onClick={() => navigate("/contact")}
                className="cursor-pointer"
              >
                Contact Us
              </li> */}
              <li>Privacy policy</li>
            </ul>
          </div>
          <div>
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>postura_gym@gmail.com</li>
            </ul>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center py-6 text-gray-500 text-sm">
          <p>Copyright 2025. All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
