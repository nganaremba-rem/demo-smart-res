import React, { useState, useEffect, useCallback } from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useToast } from '../../context/ToastContext';
import UserService from '../../services/UserService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { startLoading, stopLoading } = useLoading();
  const { addToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      startLoading('Loading users...');
      const data = await UserService.get();
      setUsers(data);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, addToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUpdateRole = async (userId, role) => {
    try {
      startLoading('Updating user role...');
      await UserService.updateRole(userId, role);
      await fetchUsers();
      addToast('User role updated successfully', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      stopLoading();
    }
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>User Management</h1>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Name
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Role
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {users.map((user) => (
              <tr key={user._id}>
                <td className='px-6 py-4 whitespace-nowrap'>{user.name}</td>
                <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                    className='rounded border-gray-300'
                  >
                    <option value='user'>User</option>
                    <option value='restaurant-admin'>Restaurant Admin</option>
                    <option value='admin'>Admin</option>
                  </select>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <button
                    type='button'
                    onClick={() =>
                      handleUpdateRole(
                        user._id,
                        user.role === 'active' ? 'inactive' : 'active'
                      )
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === 'active'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
