import { useState, useCallback } from 'react';
import { restaurantApi } from '../api/restaurant';

export const useRestaurant = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const response = await restaurantApi.getAllRestaurants();
      return response.data.data.restaurants;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createRestaurant = useCallback(async (formData) => {
    try {
      setLoading(true);
      const response = await restaurantApi.createRestaurant(formData);
      return response.data.data.restaurant;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getRestaurants,
    createRestaurant,
  };
};
