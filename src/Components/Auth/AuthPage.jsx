/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Utils/AuthContext";
import BgImage from "../../assets/bg-4.jpg";

const apiUrl = {
  login: import.meta.env.VITE_API_URL_LOGIN,
  register: import.meta.env.VITE_API_URL_REGISTER,
};

const AuthPage = ({ notify }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext); // Access login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const apiEndpoint = isLogin ? apiUrl.login : apiUrl.register;
    const payload = isLogin
      ? { email, password }
      : { username, email, password };

    try {
      const { data } = await axios.post(apiEndpoint, payload);
      if (data.token) {
        login(data.token);
        notify(
          isLogin ? "Login successful" : "Registration successful",
          "success"
        );
        navigate("/dashboard");
      }
    } catch (error) {
      notify(isLogin ? "Login failed" : "Registration failed", "error");
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen  px-4"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="w-full max-w-md bg-[#414449] rounded-lg shadow-lg p-6 opacity-95">
        <h1 className="text-2xl font-bold text-center text-[#FEFEFE] mb-6">
          Welcome to Task Manager
        </h1>

        {/* Error Message */}
        {error && (
          <p className="text-red-600 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-lg font-semibold text-center text-[#FEFEFE]">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h2>

          {/* Username Input (only for Registration) */}
          {!isLogin && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#C9C9C9] mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-3 border border-[#C9C9C9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#764CE8] text-sm bg-[#252525] text-[#FEFEFE]"
              />
            </div>
          )}

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#C9C9C9] mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-[#C9C9C9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#764CE8] text-sm bg-[#252525] text-[#FEFEFE]"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#C9C9C9] mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-[#C9C9C9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#764CE8] text-sm bg-[#252525] text-[#FEFEFE]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-md font-medium shadow-md transition ${
              loading
                ? "bg-[#585596] cursor-not-allowed"
                : "bg-[#764CE8] hover:bg-[#585596]"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>

          {/* Toggle Between Login/Register */}
          <p className="text-center text-sm text-[#C9C9C9]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              aria-pressed={!isLogin}
              className="text-[#764CE8] hover:text-[#585596] underline font-medium"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
