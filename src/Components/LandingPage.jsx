import { Link } from "react-router-dom";
import bgImage from "../assets/bg-2.jpg";

const LandingPage = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 sm:px-6"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center max-w-md sm:max-w-lg px-6 py-8 bg-[#171718] rounded-lg shadow-lg opacity-95">
        <h1 className="text-2xl sm:text-4xl font-semibold text-[#764CE8] mb-4">
          Welcome to Task Manager
        </h1>
        <p className="text-base sm:text-xl text-[#C9C9C9] mb-6">
          Organize your work and life, finally.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="flex items-center px-6 py-2 text-base sm:text-lg text-[#FBFCFA] bg-[#764CE8] rounded-full hover:bg-[#585596] transition duration-300 opacity-85"
          >
            <span className="px-3 py-1 bg-transparent text-2xl uppercase font-thin">Explore</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
