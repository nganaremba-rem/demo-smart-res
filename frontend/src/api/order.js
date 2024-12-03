import api from './axios';

export const orderApi = {
  createOrder: (data) => api.post('/orders', data),

  getMyOrders: () => api.get('/orders/my-orders'),

  getMyOrderById: (id) => api.get(`/orders/my-orders/${id}`),

  getRestaurantOrders: (restaurantId) =>
    api.get(`/orders/restaurant/${restaurantId}`),

  updateOrderStatus: (id, status, note) =>
    api.put(`/orders/${id}/status`, { status, note }),

  getAllOrders: () => api.get('/orders'),

  getOrderById: (id) => api.get(`/orders/${id}`),

  deleteOrder: (id) => api.delete(`/orders/${id}`),
};
