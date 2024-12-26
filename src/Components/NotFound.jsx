import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-gray-900 text-gray-100 flex items-center justify-center px-2">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-purple-300 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-purple-100 mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-300 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-full transition duration-300"
          >
            <Home className="mr-2" size={20} />
            Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center px-6 py-3 bg-gray-800 border-2 border-purple-400 text-purple-300 hover:bg-purple-900 rounded-full transition duration-300"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

