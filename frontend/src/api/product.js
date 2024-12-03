import api from './axios';

export const productApi = {
  getAllProducts: () => api.get('/products'),

  getProductById: (id) => api.get(`/products/${id}`),

  getProductsByRestaurant: (restaurantId) =>
    api.get(`/products/restaurant/${restaurantId}`),

  getProductsByCategory: (categoryId) =>
    api.get(`/products/category/${categoryId}`),

  getAvailableProducts: (restaurantId) =>
    api.get('/products/available', { params: { restaurantId } }),

  createProduct: (formData) =>
    api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id, formData) =>
    api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  updateAvailability: (id, availability) =>
    api.put(`/products/${id}/availability`, availability),

  updateCustomization: (id, customization) =>
    api.put(`/products/${id}/customization`, customization),
};
