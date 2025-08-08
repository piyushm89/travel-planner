import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Update token state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    // Listen for custom events from login/register
    const handleAuthChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    // Dispatch custom event to update App state
    window.dispatchEvent(new CustomEvent('authStateChange'));
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'>
      {/* Navigation Header */}
      <nav className='bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <Link to='/dashboard' className='flex items-center space-x-2'>
              <div className='h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' />
                </svg>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                AI Travel Planner
              </span>
            </Link>

            {/* Navigation Links */}
            <div className='flex items-center space-x-4'>
              {!token ? (
                <>
                  <Link
                    to='/login'
                    className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'
                  >
                    Login
                  </Link>
                  <Link
                    to='/register'
                    className='bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105'
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to='/dashboard'
                    className='text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium'
                  >
                    Dashboard
                  </Link>
                  <Link
                    to='/new'
                    className='bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2'
                  >
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                    </svg>
                    <span>New Trip</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className='text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium flex items-center space-x-1'
                  >
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className='bg-white/50 backdrop-blur-md border-t border-white/20 mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='text-center'>
            <div className='flex items-center justify-center space-x-2 mb-4'>
              <div className='h-6 w-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center'>
                <svg className='h-4 w-4 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' />
                </svg>
              </div>
              <span className='text-lg font-semibold text-gray-800'>AI Travel Planner</span>
            </div>
            <p className='text-gray-600 mb-4'>Plan your perfect journey with the power of AI</p>
            <div className='flex items-center justify-center space-x-6 text-sm text-gray-500'>
              <a href='#' className='hover:text-blue-600 transition-colors duration-200'>Privacy Policy</a>
              <a href='#' className='hover:text-blue-600 transition-colors duration-200'>Terms of Service</a>
              <a href='#' className='hover:text-blue-600 transition-colors duration-200'>Support</a>
            </div>
            <p className='text-xs text-gray-400 mt-4'>
              © 2025 AI Travel Planner. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
