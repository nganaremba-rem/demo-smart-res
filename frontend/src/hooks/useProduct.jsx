import { useState, useCallback } from 'react';
import { productApi } from '../api/product';

export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts();
      return response.data.data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProductsByRestaurant = useCallback(async (restaurantId) => {
    try {
      setLoading(true);
      const response = await productApi.getProductsByRestaurant(restaurantId);
      return response.data.data.products;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (formData) => {
    try {
      setLoading(true);
      const response = await productApi.createProduct(formData);
      return response.data.data.product;
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
    getProducts,
    getProductsByRestaurant,
    createProduct,
  };
};
