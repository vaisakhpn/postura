import React, { useState, useContext,  } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const OwnerLogin = () => {
  const { backendUrl, setOwnerToken } = useContext(AppContext);
  const [state, setState] = useState("Sign up");
  const [gymName, setGymName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (state === "Sign up") {
        const { data } = await axios.post(`${backendUrl}/api/owner/register`, {
          gymName,
          ownerName,
          email,
          phone,
          password,
        });

        if (data.success) {
          toast.success("Gym Owner account created successfully!");
          localStorage.setItem("ownerToken", data.token);
          setOwnerToken(data.token);
          navigate("/owner-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/owner/login`, {
          email,
          password,
        });

        if (data.success) {
          toast.success("Login successful!");
          localStorage.setItem("ownerToken", data.token);
          setOwnerToken(data.token);
          navigate("/owner-dashboard");
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

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-36 px-8 text-black min-h-screen flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-[400px] border rounded-xl text-zinc-700 text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold text-green-900">
          {state === "Sign up" ? "Gym Owner Sign Up" : "Gym Owner Login"}
        </p>
        <p className="text-gray-600 mb-2">
          Please {state === "Sign up" ? "sign up" : "login"} to manage your gym.
        </p>

        {state === "Sign up" && (
          <>
            <div className="w-full">
              <p>Gym Name</p>
              <input
                type="text"
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <p>Owner Name</p>
              <input
                type="text"
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <p>Phone</p>
              <input
                type="text"
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
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
            ? state === "Sign up"
              ? "Creating Account..."
              : "Logging In..."
            : state === "Sign up"
              ? "Sign Up"
              : "Login"}
        </button>

        <div className="mt-2 text-center w-full">
          {state === "Sign up" ? (
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
                onClick={() => setState("Sign up")}
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

export default OwnerLogin;
