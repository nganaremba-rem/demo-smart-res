import api from './axios';

export const restaurantApi = {
  getAllRestaurants: () => api.get('/restaurants'),

  getActiveRestaurants: () => api.get('/restaurants/active'),

  getRestaurantBySlug: (slug) => api.get(`/restaurants/${slug}`),

  getRestaurantMenu: (id) => api.get(`/restaurants/${id}/menu`),

  createRestaurant: (formData) =>
    api.post('/restaurants', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateRestaurant: (id, formData) =>
    api.put(`/restaurants/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteRestaurant: (id) => api.delete(`/restaurants/${id}`),

  updateSettings: (id, settings) =>
    api.put(`/restaurants/${id}/settings`, settings),

  updateCustomization: (id, customization) =>
    api.put(`/restaurants/${id}/customization`, customization),
};
