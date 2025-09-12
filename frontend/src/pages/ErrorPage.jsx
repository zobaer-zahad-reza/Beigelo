import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="bg-white font-sans text-gray-800 flex items-center justify-center ">
      <div className="text-center p-8 w-full max-w-md mx-auto">

        {/* Main container for the error page content */}
        
        <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-black uppercase">
              Beigelo
            </h1>
            <p className="text-sm text-gray-500 tracking-widest mt-1">DEFINE YOUR LEGACY</p>
        </div>

        <div className=" p-10">
            <h2 className="text-8xl md:text-9xl font-extrabold text-black tracking-tighter -mt-4">
              4<span className='animate-ping text-red-600'>0</span>4
            </h2>
            {/* The error message */}
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
              Page Not Found
            </h3>

            <p className="text-gray-600 mt-4 text-base">
              We're sorry, but the page you are looking for does not exist or has been moved.
            </p>
            
            <Link to={'/'}
              className="mt-8 inline-block bg-black text-white font-semibold py-3 px-8 rounded-md hover:bg-gray-800 transition-colors duration-300 ease-in-out uppercase text-sm tracking-wider"
            >
              Go to Homepage
            </Link>
        </div>
      </div>
    </div>
  );
};

// To render this component in a typical React app, you would export it
// and use it in your main App component or router.
export default ErrorPage;

// Example of how it might be used in an App.js (for context):
/*
import React from 'react';
import ErrorPage from './ErrorPage';

function App() {
  return (
    <div>
      <ErrorPage />
    </div>
  );
}

export default App;
*/
