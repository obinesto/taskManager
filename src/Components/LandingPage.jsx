import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center max-w-lg px-4 py-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-semibold text-indigo-600 mb-4">Welcome to Task Manager</h1>
        <p className="text-xl text-gray-700 mb-6">Organize your work and life, finally.</p>

        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 text-lg text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition duration-300"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
