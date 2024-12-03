import { ApiService } from './ApiService';

class CategoryService extends ApiService {
  constructor() {
    super('/categories');
  }

  async getByRestaurant(restaurantId) {
    return this.get(null, { restaurantId });
  }

  async bulkCreate(categories) {
    return this.post('/bulk', { categories });
  }

  async bulkUpdate(categories) {
    return this.put('/bulk', { categories });
  }

  async reorder(restaurantId, categories) {
    return this.put('/reorder', { restaurantId, categories });
  }
}

export default new CategoryService();
