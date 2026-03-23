import React from "react";
import { FaHome, FaUsers, FaEdit } from "react-icons/fa";

const Sidebar = ({ setView }) => {
  return (
    <div className="bg-white min-h-screen w-64 border-r border-gray-200 hidden md:block">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-8">Gym Owner</h2>
        <ul className="space-y-4">
          <li
            onClick={() => setView("dashboard")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-900 cursor-pointer transition-colors"
          >
            <FaHome className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </li>
          <li
            onClick={() => setView("memberships")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-900 cursor-pointer transition-colors"
          >
            <FaUsers className="text-lg" />
            <span className="font-medium">Memberships</span>
          </li>
          {/* <li
            onClick={() => setView("edit-gym")}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-900 cursor-pointer transition-colors"
          >
            <FaEdit className="text-lg" />
            <span className="font-medium">Edit Gym</span>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
