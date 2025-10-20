import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem("token");
    return stored && stored !== "false" ? stored : null;
  });

  const [gyms, setGyms] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const getGymData = async () => {
    try {
      setLoadingGyms(true);
      const { data } = await axios.get(`${backendUrl}/api/users/gyms`);
      if (data.success) {
        setGyms(data.gyms);
      } else {
        toast.error(data.message || "Failed to load gym list");
      }
    } catch (error) {
      console.error("Error fetching gyms:", error);
      toast.error("Unable to fetch gym list");
    } finally {
      setLoadingGyms(false);
    }
  };

  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      setLoadingProfile(true);
      const { data } = await axios.get(`${backendUrl}/api/users/get-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const value = {
    backendUrl,
    token,
    setToken,
    gyms,
    getGymData,
    userData,
    setUserData,
    loadUserProfileData,
    loadingGyms,
    loadingProfile,
    logout,
  };

  useEffect(() => {
    getGymData();
  }, []);

  useEffect(() => {
    if (token && token !== "false") {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
