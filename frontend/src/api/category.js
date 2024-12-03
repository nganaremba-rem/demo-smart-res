import api from './axios';

export const categoryApi = {
  getAllCategories: () => api.get('/categories'),

  getCategoryById: (id) => api.get(`/categories/${id}`),

  getCategoriesByRestaurant: (restaurantId) =>
    api.get(`/categories/restaurant/${restaurantId}`),

  createCategory: (data) => api.post('/categories', data),

  updateCategory: (id, data) => api.put(`/categories/${id}`, data),

  deleteCategory: (id) => api.delete(`/categories/${id}`),

  bulkCreateCategories: (categories) =>
    api.post('/categories/bulk', { categories }),

  bulkUpdateCategories: (categories) =>
    api.put('/categories/bulk', { categories }),
};
