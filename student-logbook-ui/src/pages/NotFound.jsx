import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-[#de7225]">404</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#de7225] hover:bg-[#a44a0e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#de7225] transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Need help? Contact support if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 