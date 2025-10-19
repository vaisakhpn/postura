import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Workout from "./pages/workout";

const App = () => {
  return (
    <div className="w-screen overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
