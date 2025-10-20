import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGym, setSelectedGym] = useState("");
  const [gyms, setGyms] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/users/gyms`);
        if (data.success) setGyms(data.gyms);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load gym list");
      }
    };
    fetchGyms();
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (state === "Sign Up") {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("selectedGym", selectedGym);
        if (profilePic) formData.append("profilePic", profilePic);

        const { data } = await axios.post(
          `${backendUrl}/api/users/register`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (data.success) {
          toast.success("Account created successfully!");
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/users/login`, {
          email,
          password,
        });

        if (data.success) {
          toast.success("Login successful!");
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-36 px-8 text-black min-h-screen flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border rounded-xl text-zinc-700 text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-green-900">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-600 mb-2">
          Please {state === "Sign Up" ? "sign up" : "login"} to manage your gym
          sessions.
        </p>

        {state === "Sign Up" && (
          <>
            <div className="flex gap-3">
              <div className="w-full">
                <p>Full Name</p>
                <input
                  type="text"
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="w-full">
                <p>Select Gym</p>
                <select
                  className="border border-zinc-300 rounded w-full p-2 mt-1"
                  value={selectedGym}
                  onChange={(e) => setSelectedGym(e.target.value)}
                  required
                >
                  <option value="">-- Choose a Gym --</option>
                  {gyms.map((gym) => (
                    <option key={gym._id} value={gym._id}>
                      {gym.gymName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <p>Profile Picture</p>
              <input
                type="file"
                accept="image/*"
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </div>
          </>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-800 text-white w-full py-2 rounded-md text-base mt-3 hover:bg-green-700"
        >
          {loading
            ? state === "Sign Up"
              ? "Creating Account..."
              : "Logging In..."
            : state === "Sign Up"
            ? "Sign Up"
            : "Login"}
        </button>

        <div className="mt-2 text-center w-full">
          {state === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-green-800 underline cursor-pointer"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-green-800 underline cursor-pointer"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
