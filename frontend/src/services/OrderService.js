import { ApiService } from './ApiService';

class OrderService extends ApiService {
  constructor() {
    super('/orders');
  }

  async getMyOrders() {
    return this.get('my-orders');
  }

  async getMyOrderById(id) {
    return this.get(`my-orders/${id}`);
  }

  async getRestaurantOrders(restaurantId) {
    return this.get(null, { restaurantId });
  }

  async updateStatus(id, status, note) {
    return this.put(`${id}/status`, { status, note });
  }

  async createPayment(orderId, paymentMethod) {
    return this.post(`${orderId}/payment`, { paymentMethod });
  }

  async verifyPayment(orderId, paymentId, signature) {
    return this.post(`${orderId}/verify-payment`, { paymentId, signature });
  }
}

export default new OrderService();
