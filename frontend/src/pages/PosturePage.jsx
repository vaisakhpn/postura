import React from "react";
import { useParams } from "react-router-dom";
import SquatDetector from "../components/SquatDetector";
import PushUpDetector from "../components/PushUpDetector";

const PosturePage = () => {
  const { exerciseName } = useParams();

  const renderDetector = () => {
    switch (exerciseName.toLowerCase()) {
      case "squat":
        return <SquatDetector />;
      case "pushup":
        return <PushUpDetector />;
      default:
        return (
          <p className="text-center mt-10 text-red-600">
            Unknown exercise: {exerciseName}
          </p>
        );
    }
  };

  return (
    <div className="pt-36 px-6 text-black min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 capitalize">
        {exerciseName} Posture Correction
      </h1>
      {renderDetector()}
    </div>
  );
};

export default PosturePage;
