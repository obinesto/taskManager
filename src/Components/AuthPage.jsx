import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useLogin, useRegister } from '../hooks/useQueries';
import BgImage from "../assets/bg-4.jpg";
import { Mail, Lock, User } from 'lucide-react';

const AuthPage = ({ notify }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [submitLoader, setSubmitLoader] = useState(false);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoader(true);
    const mutationFn = isLogin ? login : register;
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      await mutationFn.mutateAsync(payload);
      notify(
        isLogin ? "Login successful" : "Registration successful",
        "success"
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      notify(isLogin ? "Login failed" : "Registration failed", "error");
    } finally {
      setSubmitLoader(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen px-4 bg-gradient-to-b from-purple-950 to-gray-900"
      style={{
        backgroundImage: `url(${BgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="w-full max-w-md bg-gray-800 md:ml-32 rounded-lg shadow-lg p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-300 mb-2">
            TaskManager
          </h1>
          <p className="text-gray-400">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {(login.error || register.error) && (
          <div className="bg-red-900 text-red-300 p-3 rounded-md text-sm">
            {login.error?.message || register.error?.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required={!isLogin}
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100"
                  placeholder="JohnDoe"
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitLoader || login.isLoading || register.isLoading} // Update 3
            className={`w-full py-3 text-white rounded-md font-medium transition duration-300 ${
              submitLoader || login.isLoading || register.isLoading // Update 3
                ? "bg-purple-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {submitLoader ? ( // Update 3
              <div className="flex justify-center items-center">
                <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

