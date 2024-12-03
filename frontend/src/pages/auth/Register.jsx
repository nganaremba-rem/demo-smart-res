import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authApi.register(formData);
      navigate('/login', {
        state: { message: 'Registration successful! Please login.' },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <h1 className='text-2xl font-bold text-center mb-6'>Register</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Name
          </label>
          <input
            id='name'
            type='text'
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

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
            minLength={6}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
        </div>

        <div>
          <label
            htmlFor='phoneNumber'
            className='block text-sm font-medium text-gray-700'
          >
            Phone Number
          </label>
          <input
            id='phoneNumber'
            type='tel'
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
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
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className='text-center text-sm'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 hover:text-blue-600'>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
