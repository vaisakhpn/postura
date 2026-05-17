import React from "react";

const DetectorLayout = ({ title, referenceVideoSrc, proTips, onToggleCamera, videoRef, canvasRef, feedbackRef, extraUi }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 w-full flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        {title}
      </h2>

      <div className="flex flex-col-reverse xl:flex-row gap-4 md:gap-8 w-full max-w-7xl justify-center items-start">
        <div className="w-full xl:w-1/2 flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <span>🎥</span> Reference Form
            </h3>
            <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black aspect-[3/4] md:aspect-video flex items-center justify-center">
              {referenceVideoSrc?.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img
                  src={referenceVideoSrc}
                  className="w-full h-full object-contain"
                  alt="Reference"
                />
              ) : (
                <video
                  src={referenceVideoSrc}
                  className="w-full h-full object-fit"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              )}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                Pro Tips:
              </h4>
              <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-400 space-y-1">
                {proTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-1/2 flex flex-col items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>👁️</span> AI Analysis
              </span>
              <div className="flex gap-3">
                {extraUi}
                <button
                  onClick={onToggleCamera}
                  className="text-sm px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition flex items-center gap-2"
                >
                  🔄 Flip Camera
                </button>
              </div>
            </h3>

            <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-lg aspect-[3/4] md:aspect-[4/3] flex items-center justify-center">
              <video
                ref={videoRef}
                className="hidden"
                playsInline
                muted
                autoPlay
              />
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />

              <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
                <div
                  ref={feedbackRef}
                  className="bg-black/70 backdrop-blur-md text-white px-6 py-2 rounded-full font-medium text-lg shadow-lg border border-white/10 transition-all duration-300"
                >
                  Initializing camera...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectorLayout;
