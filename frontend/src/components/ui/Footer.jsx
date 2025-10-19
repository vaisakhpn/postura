import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 absolute">
      <div className="md:mx-10  ">
        <div className="flex flex-col border-t-2 pt-2 border-b-2 pb-2   sm:grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10  text-sm">
          <div>
            <img className=" w-32" src={assets.logo} alt="LOGO" />
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
        <div>
          <p>Copyright 2025.All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
