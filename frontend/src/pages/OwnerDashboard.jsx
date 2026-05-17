import React, { useState } from "react";
import Sidebar from "../components/OwnerDashBoard/SideBar";
import Dashboard from "../components/OwnerDashBoard/Dashboard";
import Memberships from "../components/OwnerDashBoard/Memberships";
import EditGym from "../components/OwnerDashBoard/EditGym";

const OwnerDashboard = () => {
  const [view, setView] = useState("dashboard");

  return (
    <div className="flex flex-col md:flex-row pt-24 md:pt-32 w-full min-h-screen bg-gray-50">
      <Sidebar setView={setView} />
      <div className="flex-1 p-3 md:p-6 overflow-x-hidden">
        {view === "dashboard" && <Dashboard />}
        {view === "memberships" && <Memberships />}
        {view === "edit-gym" && <EditGym />}
      </div>
    </div>
  );
};

export default OwnerDashboard;
