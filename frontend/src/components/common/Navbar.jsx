import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='bg-white shadow-sm'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='text-xl font-bold text-gray-800'>
            Smart Restaurant
          </Link>

          <div className='flex items-center space-x-4'>
            <Link to='/' className='text-gray-600 hover:text-gray-800'>
              Restaurants
            </Link>

            {user ? (
              <>
                {(user.role === 'admin' ||
                  user.role === 'restaurant-admin') && (
                  <>
                    <Link
                      to='/products'
                      className='text-gray-600 hover:text-gray-800'
                    >
                      Products
                    </Link>
                    <Link
                      to='/orders'
                      className='text-gray-600 hover:text-gray-800'
                    >
                      Orders
                    </Link>
                  </>
                )}
                <div className='relative group'>
                  <button className='flex items-center space-x-1 text-gray-600 hover:text-gray-800'>
                    <span>{user.name}</span>
                  </button>
                  <div className='absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to='/login' className='text-gray-600 hover:text-gray-800'>
                  Login
                </Link>
                <Link
                  to='/register'
                  className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
