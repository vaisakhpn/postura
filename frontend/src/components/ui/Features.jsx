import React from "react";
import { assets } from "../../assets/assets";
import { FaCamera, FaHeartbeat, FaChartLine } from "react-icons/fa";

const Features = () => {
  return (
    <section className="relative w-screen min-h-screen bg-slate-200 text-black flex flex-col items-center overflow-hidden px-6 md:px-16 py-24">
    
      <img
        src={assets.p2}
        alt="Background pattern"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl w-full mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
          AI-Powered Posture Correction for Smarter Training
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="flex justify-center">
            <img
              src={assets.p3}
              alt="AI Training Visualization"
              className="rounded-lg shadow-[0_0_30px_#00ffff80] w-full max-w-md object-cover"
            />
          </div>

          {/* Right Text Content */}
          <div className="text-gray-800 text-start">
            <h3 className="text-2xl font-semibold mb-3 text-center md:text-left">
              Real-Time Motion Tracking & Feedback
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-4 text-center md:text-left">
              Postura integrates advanced AI and camera-based tracking to
              analyze every movement in real time. By detecting joint positions
              and motion patterns, it helps users perform exercises safely and
              efficiently.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed text-center md:text-left">
              The system continuously evaluates posture, offering visual and
              audio feedback through the interface to improve form, prevent
              injuries, and enhance muscle activation — creating a personalized
              training experience for each user.
            </p>
          </div>
        </div>
      </div>

      {/* --- Feature Cards --- */}
      <div className="relative z-10 max-w-6xl w-full grid md:grid-cols-3 gap-8 mb-12">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-8 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-green-800 text-white rounded-full mb-4 mx-auto md:mx-0">
            <FaCamera size={22} />
          </div>
          <h4 className="text-xl font-semibold mb-2 text-center md:text-left">
            AI Vision Tracking
          </h4>
          <p className="text-gray-600 text-center md:text-left">
            Uses Ai models to detect and monitor posture with high precision,
            capturing real-time skeletal movement for every exercise.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-8 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-green-800 text-white rounded-full mb-4 mx-auto md:mx-0">
            <FaHeartbeat size={22} />
          </div>
          <h4 className="text-xl font-semibold mb-2 text-center md:text-left">
            Smart Posture Alerts
          </h4>
          <p className="text-gray-600 text-center md:text-left">
            Provides instant feedback and warnings when improper form is
            detected, helping users correct movements before injury occurs.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-8 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300">
          <div className="flex items-center justify-center w-12 h-12 bg-green-800 text-white rounded-full mb-4 mx-auto md:mx-0">
            <FaChartLine size={22} />
          </div>
          <h4 className="text-xl font-semibold mb-2 text-center md:text-left">
            Personalized Progress Tracking
          </h4>
          <p className="text-gray-600 text-center md:text-left">
            Tracks user performance data, posture accuracy, and improvements
            over time to build adaptive workout plans for consistent progress.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
