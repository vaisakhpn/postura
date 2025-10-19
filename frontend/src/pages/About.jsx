import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="pt-44 px-8 text-black min-h-screen">
      <div className="text-center text-2xl pt-10 text-green-800">
        <p>
          ABOUT <span className="text-green-700 font-medium">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          src={assets.about}
          alt="image"
          className="w-full md:max-w-[400px]"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to <b>Postura</b> — your intelligent fitness companion that
            combines advanced AI and gym management in one platform. Our goal is
            to revolutionize personal training by integrating posture detection,
            real-time feedback, and smart performance tracking. Whether you're a
            beginner or a pro, Postura helps you train smarter, safer, and more
            effectively.
          </p>

          <b className="text-gray-800">What We Offer</b>
          <p>
            Postura uses AI-powered vision models to analyze your posture and
            movements during workouts, providing instant corrections and
            insights. For gym owners, it includes an all-in-one management
            system to track members, schedule workouts, and monitor progress.
            The platform bridges technology and fitness, helping trainers
            optimize routines and users achieve their goals efficiently.
          </p>

          <b className="text-gray-800">Vision</b>
          <p>
            Our vision is to redefine fitness through technology — creating a
            world where workouts are guided by intelligent systems that
            understand human movement. We aim to make posture-perfect training
            accessible to everyone, enhancing performance while preventing
            injuries. Postura aspires to build the future of smart gyms powered
            by AI-driven analytics, personalization, and precision.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
