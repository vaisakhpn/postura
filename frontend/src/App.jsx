import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Workout from "./pages/workout";
import About from "./pages/About";
import PosturePage from "./pages/PosturePage";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerDashboard from "./pages/OwnerDashboard";
import MyProfile from "./pages/MyProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="w-screen overflow-x-hidden">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posture/:exerciseName" element={<PosturePage />} />
        <Route path="/owner-login" element={<OwnerLogin />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
      </Routes>
    </div>
  );
};

export default App;
