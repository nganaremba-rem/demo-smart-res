import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-2xl font-bold text-center mb-6'>Login</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <input
            id='password'
            type='password'
            value={formData.password}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        {error && <div className='text-red-500 text-sm'>{error}</div>}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className='text-center text-sm'>
          <Link
            to='/forgot-password'
            className='text-blue-500 hover:text-blue-600'
          >
            Forgot Password?
          </Link>
        </div>

        <div className='text-center text-sm'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500 hover:text-blue-600'>
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
