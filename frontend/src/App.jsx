import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantList from './pages/restaurant/RestaurantList';
import RestaurantDetail from './pages/restaurant/RestaurantDetail';
import ProductList from './pages/product/ProductList';
import OrderList from './pages/order/OrderList';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoutes from './pages/admin/AdminRoutes';
import Profile from './pages/profile/Profile';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LoadingProvider>
          <CartProvider>
            <ToastProvider>
              <Router>
                <div className='min-h-screen bg-gray-50'>
                  <Navbar />
                  <main className='container mx-auto px-4 py-8'>
                    <Routes>
                      <Route path='/login' element={<Login />} />
                      <Route path='/register' element={<Register />} />
                      <Route path='/' element={<RestaurantList />} />
                      <Route
                        path='/restaurants/:slug'
                        element={<RestaurantDetail />}
                      />

                      {/* Protected Routes */}
                      <Route
                        path='/products'
                        element={
                          <ProtectedRoute roles={['admin', 'restaurant-admin']}>
                            <ProductList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/orders'
                        element={
                          <ProtectedRoute>
                            <OrderList />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/admin/*'
                        element={
                          <ProtectedRoute roles={['admin', 'super-admin']}>
                            <AdminRoutes />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path='/profile'
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                </div>
              </Router>
            </ToastProvider>
          </CartProvider>
        </LoadingProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
