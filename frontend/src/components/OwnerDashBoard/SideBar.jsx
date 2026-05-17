import React from "react";
import { FaHome, FaUsers, FaEdit } from "react-icons/fa";

const Sidebar = ({ setView }) => {
  return (
    <div className="bg-white md:min-h-screen w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 sticky top-16 md:top-0 z-40">
      <div className="p-4 md:p-6">
        <h2 className="text-2xl font-bold text-green-900 mb-8 hidden md:block">Gym Owner</h2>
        <ul className="flex flex-row md:flex-col gap-2 md:space-y-4 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <li
            onClick={() => setView("dashboard")}
            className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 p-3 rounded-lg hover:bg-green-50 bg-gray-50 md:bg-transparent text-gray-700 hover:text-green-900 cursor-pointer transition-colors whitespace-nowrap"
          >
            <FaHome className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </li>
          <li
            onClick={() => setView("memberships")}
            className="flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2 md:gap-3 p-3 rounded-lg hover:bg-green-50 bg-gray-50 md:bg-transparent text-gray-700 hover:text-green-900 cursor-pointer transition-colors whitespace-nowrap"
          >
            <FaUsers className="text-lg" />
            <span className="font-medium">Memberships</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
