import React, { useState } from "react";
import Sidebar from "../components/OwnerDashBoard/SideBar";
import Dashboard from "../components/OwnerDashBoard/Dashboard";
import Memberships from "../components/OwnerDashBoard/Memberships";
import EditGym from "../components/OwnerDashBoard/EditGym";

const OwnerDashboard = () => {
  const [view, setView] = useState("dashboard");

  return (
    <div className="flex pt-32 w-full min-h-screen bg-gray-50">
      <Sidebar setView={setView} />
      <div className="flex-1 p-6">
        {view === "dashboard" && <Dashboard />}
        {view === "memberships" && <Memberships />}
        {view === "edit-gym" && <EditGym />}
      </div>
    </div>
  );
};

export default OwnerDashboard;
