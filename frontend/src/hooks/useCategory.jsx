import { useState, useCallback } from 'react';
import { categoryApi } from '../api/category';

export const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAllCategories();
      return response.data.data.categories;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoriesByRestaurant = useCallback(async (restaurantId) => {
    try {
      setLoading(true);
      const response = await categoryApi.getCategoriesByRestaurant(
        restaurantId
      );
      return response.data.data.categories;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await categoryApi.createCategory(data);
      return response.data.data.category;
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
    getCategories,
    getCategoriesByRestaurant,
    createCategory,
  };
};
