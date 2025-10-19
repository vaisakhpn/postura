import React from "react";
import { assets } from "../../assets/assets";

const Header = () => {
  return (
    <section className="relative bg-green-100 h-screen w-screen text-black flex flex-col justify-center items-center">
      <img
        src={assets.p4}
        alt="AI Gym"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div className="relative text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to the Future of Fitness
        </h1>
        <p className="text-lg md:text-xl text-gray-800 max-w-2xl mx-auto mb-8">
          Step into a revolutionary training space where AI meets human
          performance.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-green-800 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition">
            Start Your Journey
          </button>
          <button className="bg-white border border-green-700 text-green-800 px-6 py-3 rounded-lg font-semibold hover:bg-green-800 hover:text-white transition">
            Watch Tutorials
          </button>
        </div>
      </div>
    </section>
  );
};

export default Header;
