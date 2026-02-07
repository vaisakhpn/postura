import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Tutorial = () => {
  const { workoutName } = useParams();
  const navigate = useNavigate();

  const videoMap = {
    pushup: "/pushup_tuto.mp4",
    squat: "/sqaut_tuto.mp4",
    planks: "/plank_tuto.mp4",
    biceps: "/biceps_tuto.mp4",
  };

  const videoSrc = videoMap[workoutName.toLowerCase()];

  const displayName =
    workoutName.charAt(0).toUpperCase() + workoutName.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/workout")}
          className="flex cursor-pointer items-center text-green-700 hover:text-green-900 font-medium mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2 cursor-pointer" /> Back to Workouts
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-800 p-6 text-center">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              {displayName} Tutorial
            </h1>
            <p className="text-green-100 mt-2">
              Master your form with this guided tutorial
            </p>
          </div>

          <div className="p-6 md:p-10">
            {videoSrc ? (
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black">
                <video
                  className="w-full h-auto max-h-[70vh]"
                  controls
                  autoPlay
                  src={videoSrc}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-100 rounded-xl">
                <p className="text-gray-500 text-lg">
                  Video not found for {displayName}
                </p>
              </div>
            )}

            <div className="mt-8 prose max-w-none text-gray-700">
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Instructions
              </h3>
              <p>
                Watch the video carefully to understand the correct posture and
                movement. Proper form is essential to prevent injury and
                maximize results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
