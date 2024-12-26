import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Menu, X } from "lucide-react";
import bgImage from "../assets/bg-4.jpg";
import { useState } from "react";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    "Smart task prioritization",
    "Team collaboration",
    "Real-time progress tracking",
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-950 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center mb-8 sm:mb-16">
          <div className="text-xl sm:text-2xl font-bold text-purple-300">
            TaskManager
          </div>
          <div className="hidden sm:flex space-x-4">
            <Link
              to="/login"
              className="text-purple-300 hover:text-purple-100 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-purple-300 hover:text-purple-100 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
          <button
            className="sm:hidden text-purple-300 hover:text-purple-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {!isMenuOpen ? <Menu size={24} /> : <X size={24} />}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="sm:hidden mb-8 flex flex-col items-center space-y-4">
            <Link
              to="/login"
              className="rounded-md bg-gray-800 hover:bg-gray-700 px-2 py-2 text-purple-300 hover:text-purple-100 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-gray-800 hover:bg-gray-700 px-2 py-2 text-purple-300 hover:text-purple-100 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-100 mb-6">
              Organize Your Work and Life, Finally
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              TaskManager helps you manage your tasks, projects, and goals with
              ease. Boost your productivity and achieve more, every day.
            </p>
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="text-purple-400 mr-2 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="md:hidden w-full lg:w-1/2 mt-8 lg:mt-0">
                <img
                  src={bgImage}
                  alt="TaskManager Dashboard"
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
              <Link
                to="/login"
                className="flex items-center justify-center px-6 py-3 text-base sm:text-lg bg-purple-600 text-white hover:bg-purple-700 rounded-full transition duration-300"
              >
                <span className="flex items-center">
                  Get Started <ArrowRight className="ml-2" />
                </span>
              </Link>
              <Link
                to="/demo"
                className="flex items-center justify-center bg-gray-800 border-2 border-purple-400 text-purple-300 hover:bg-purple-900 px-6 py-3 rounded-full font-semibold text-base sm:text-lg transition duration-300"
              >
                Watch Demo
              </Link>
            </div>
          </div>
          <div className="hidden md:block w-full lg:w-1/2 mt-8 lg:mt-0">
            <img
              src={bgImage}
              alt="TaskManager Dashboard"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 bottom-0 w-full md:fixed">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 sm:mb-0 text-sm sm:text-base">
              © {new Date().getFullYear()} TaskManager. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-4">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-gray-200 text-sm sm:text-base mb-2 sm:mb-0"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-gray-200 text-sm sm:text-base mb-2 sm:mb-0"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-gray-200 text-sm sm:text-base"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
