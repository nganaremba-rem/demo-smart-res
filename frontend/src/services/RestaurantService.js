import { ApiService } from './ApiService';

class RestaurantService extends ApiService {
  constructor() {
    super('/restaurants');
  }

  async getActive() {
    return this.get(null, { active: true });
  }

  async getMenu(id) {
    return this.get(`${id}/menu`);
  }

  async toggleStatus(id) {
    return this.put(`${id}/toggle-status`);
  }

  async toggleOrders(id) {
    return this.put(`${id}/toggle-orders`);
  }

  async updateSettings(id, settings) {
    return this.put(`${id}/settings`, settings);
  }

  async updateCustomization(id, customization) {
    return this.put(`${id}/customization`, customization);
  }
}

export default new RestaurantService();
