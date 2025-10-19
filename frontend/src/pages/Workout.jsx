import React from "react";
import { workouts } from "../assets/assets";

const Workout = () => {
  return (
    <div className="pt-44 px-8 text-black min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-4">Workout Dashboard</h1>
        <p className="pb-4">
          Here you can view the Tutorials and Ai guided posture correction.
        </p>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-4 gap-8 mb-12">
        {workouts.map((workout) => (
          <div
            key={workout._id}
            className="bg-green-800 rounded-xl p-8 shadow-md hover:-translate-y-2 hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-white  text-white rounded-full mb-4 mx-auto md:mx-0">
              <img src={workout.icon} alt={workout.name} className="w-8 h-8" />
            </div>
            <div className="pb-3 h-36">
              <h4 className="text-xl text-white font-semibold mb-2 text-center md:text-left">
                {workout.name}
              </h4>
              <p className="text-slate-50 text-justify">{workout.about}</p>
            </div>

            <div className="flex justify-center gap-4">
              <button className="bg-white text-sm border text-green-800 p-2 rounded-xl font-semibold hover:bg-green-800 hover:text-white transition transition">
                Check Posture
              </button>
              <button className="bg-white text-sm border p-2  text-green-800 rounded-xl font-semibold hover:bg-green-800 hover:text-white transition">
                Watch Tutorial
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workout;
