import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const Memberships = () => {
  const { backendUrl, ownerToken } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/owner/members`, {
          headers: { Authorization: `Bearer ${ownerToken}` },
        });

        if (data.success) {
          setMembers(data.members);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    if (ownerToken) {
      fetchMembers();
    }
  }, [backendUrl, ownerToken]);

  if (loading) return <div className="p-8">Loading members...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-green-900 mb-6">Memberships</h2>

      {members.length === 0 ? (
        <p className="text-gray-600">No members registered yet.</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {members.map((member) => (
              <li key={member._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={member.profilePic}
                      alt={member.name}
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-green-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.phone || "No phone"}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">
                        Joined:{" "}
                        {new Date(member.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Memberships;
