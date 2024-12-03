import React, { useState, useEffect, useCallback } from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useToast } from '../../context/ToastContext';
import RestaurantService from '../../services/RestaurantService';
import RestaurantForm from '../../components/restaurant/RestaurantForm';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { addToast } = useToast();

  const fetchRestaurants = useCallback(async () => {
    try {
      startLoading('Loading restaurants...');
      const data = await RestaurantService.get();
      setRestaurants(data);
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, addToast]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleToggleStatus = async (id) => {
    try {
      startLoading('Updating status...');
      await RestaurantService.toggleStatus(id);
      await fetchRestaurants();
      addToast('Restaurant status updated successfully', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      stopLoading();
    }
  };

  const handleToggleOrders = async (id) => {
    try {
      startLoading('Updating order status...');
      await RestaurantService.toggleOrders(id);
      await fetchRestaurants();
      addToast('Order acceptance status updated successfully', 'success');
    } catch (error) {
      addToast(error.message, 'error');
    } finally {
      stopLoading();
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Restaurant Management</h1>
        <button
          type='button'
          onClick={() => setShowForm(!showForm)}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          {showForm ? 'Cancel' : 'Add Restaurant'}
        </button>
      </div>

      {showForm && (
        <div className='bg-white rounded-lg shadow p-6'>
          <RestaurantForm
            onSuccess={() => {
              setShowForm(false);
              fetchRestaurants();
              addToast('Restaurant created successfully', 'success');
            }}
          />
        </div>
      )}

      <div className='grid gap-6'>
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className='bg-white rounded-lg shadow p-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-xl font-semibold'>{restaurant.name}</h2>
                <p className='text-gray-600 mt-1'>{restaurant.description}</p>
                <div className='mt-2 space-x-2'>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      restaurant.settings.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {restaurant.settings.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      restaurant.settings.acceptingOrders
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {restaurant.settings.acceptingOrders
                      ? 'Accepting Orders'
                      : 'Not Accepting Orders'}
                  </span>
                </div>
              </div>
              <div className='space-x-2'>
                <button
                  type='button'
                  onClick={() => handleToggleStatus(restaurant._id)}
                  className='text-blue-500 hover:text-blue-700'
                >
                  Toggle Status
                </button>
                <button
                  type='button'
                  onClick={() => handleToggleOrders(restaurant._id)}
                  className='text-blue-500 hover:text-blue-700'
                >
                  Toggle Orders
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantManagement;
