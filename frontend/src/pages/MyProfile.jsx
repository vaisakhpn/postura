import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaDumbbell,
  FaIdCard,
  FaCamera,
  FaEdit,
  FaSave,
} from "react-icons/fa";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, getProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);

      image && formData.append("profilePic", image);

      const { data } = await axios.post(
        backendUrl + "/api/users/update-profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        await getProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
            {/* Header / Cover Area */}
            <div className="bg-gradient-to-r from-green-800 to-green-600 h-32 md:h-48 relative">
              <div className="absolute -bottom-16 left-8 md:left-12">
                <div className="relative group">
                  <img
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover shadow-md"
                    src={
                      image ? URL.createObjectURL(image) : userData.profilePic
                    }
                    alt="Profile"
                  />
                  {isEdit && (
                    <label
                      htmlFor="image"
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <FaCamera className="text-green-800" />
                      <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 px-8 pb-8 md:px-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                  {isEdit ? (
                    <input
                      className="text-3xl font-bold text-gray-900 border-b-2 border-green-500 focus:outline-none bg-transparent"
                      type="text"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userData.name}
                    </h1>
                  )}
                  <p className="text-gray-500 mt-1 flex items-center gap-2">
                    <FaEnvelope className="text-sm" /> {userData.email}
                  </p>
                </div>
                <button
                  className={`mt-4 md:mt-0 flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all shadow-sm ${
                    isEdit
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border border-green-600 text-green-600 hover:bg-green-50"
                  }`}
                  onClick={
                    isEdit ? updateUserProfileData : () => setIsEdit(true)
                  }
                >
                  {isEdit ? (
                    <>
                      <FaSave /> Save Changes
                    </>
                  ) : (
                    <>
                      <FaEdit /> Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gym Details Card */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <FaDumbbell /> Gym Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Gym Name</span>
                      <span className="font-medium text-gray-900">
                        {userData.selectedGym?.gymName || "N/A"}
                      </span>
                    </div>
                    {userData.selectedGym?.gymName && (
                      <>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">Owner</span>
                          <span className="font-medium text-gray-900">
                            {userData.selectedGym?.ownerName}
                          </span>
                        </div>
                        <div className="flex justify-between pb-2">
                          <span className="text-gray-500">Contact</span>
                          <span className="font-medium text-gray-900 flex items-center gap-1">
                            <FaPhone className="text-xs" />
                            {userData.selectedGym?.phone}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Account Details Card */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <FaIdCard /> Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Member Since</span>
                      <span className="font-medium text-gray-900">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500">Payment Status</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          userData.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {userData.paymentStatus || "Unpaid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
