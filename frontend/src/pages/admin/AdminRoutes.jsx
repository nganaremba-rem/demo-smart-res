import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import RestaurantManagement from './RestaurantManagement';
import UserManagement from './UserManagement';
import Settings from './Settings';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/restaurants/*' element={<RestaurantManagement />} />
      <Route path='/users/*' element={<UserManagement />} />
      <Route path='/settings' element={<Settings />} />
    </Routes>
  );
};

export default AdminRoutes;
