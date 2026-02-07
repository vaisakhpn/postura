import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { backendUrl, setOwnerToken } = useContext(AppContext);
  const [ownerData, setOwnerData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      const token = localStorage.getItem("ownerToken");
      if (!token) {
        setOwnerToken(null);
        navigate("/owner-login");
        return;
      }

      try {
        const { data } = await axios.get(`${backendUrl}/api/owner/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setOwnerData(data.ownerData);
        } else {
          toast.error(data.message);
          if (
            data.message === "Invalid token" ||
            data.message === "Token expired"
          ) {
            localStorage.removeItem("ownerToken");
            setOwnerToken(null);
            navigate("/owner-login");
          }
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load profile");
      }
    };

    fetchOwnerProfile();
  }, [backendUrl, navigate, setOwnerToken]);

  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    setOwnerToken(null);
    navigate("/owner-login");
    toast.success("Logged out successfully");
  };

  if (!ownerData) return <div className="p-8">Loading...</div>;

  return (
    <div className="pt-36 px-8 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-green-900 mb-6">
          Owner Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Gym Name</p>
              <p className="text-xl font-semibold">{ownerData.gymName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Owner Name</p>
              <p className="text-xl font-semibold">{ownerData.ownerName}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-xl font-semibold">{ownerData.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="text-xl font-semibold">{ownerData.phone}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
