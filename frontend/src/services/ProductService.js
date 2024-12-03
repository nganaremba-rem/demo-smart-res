import { ApiService } from './ApiService';

class ProductService extends ApiService {
  constructor() {
    super('/products');
  }

  async getByRestaurant(restaurantId) {
    return this.get(null, { restaurantId });
  }

  async getByCategory(categoryId) {
    return this.get(null, { categoryId });
  }

  async getAvailable(restaurantId) {
    return this.get('available', { restaurantId });
  }

  async bulkCreate(products) {
    return this.post('/bulk', { products });
  }

  async bulkUpdate(products) {
    return this.put('/bulk', { products });
  }

  async updateAvailability(id, availability) {
    return this.put(`${id}/availability`, availability);
  }

  async updateCustomization(id, customization) {
    return this.put(`${id}/customization`, customization);
  }
}

export default new ProductService();
