import { ApiService } from './ApiService';

class UserService extends ApiService {
  constructor() {
    super('/users');
  }

  async getProfile() {
    return this.get('me');
  }

  async updateProfile(data) {
    return this.put('profile', data);
  }

  async updatePassword(data) {
    return this.put('update-password', data);
  }

  async updateRole(userId, role) {
    return this.put(`${userId}/role`, { role });
  }

  async updateStatus(userId, status) {
    return this.put(`${userId}/status`, { status });
  }

  async getRestaurantStaff(restaurantId) {
    return this.get('staff', { restaurantId });
  }

  async addStaffMember(restaurantId, userData) {
    return this.post('staff', { ...userData, restaurantId });
  }

  async removeStaffMember(userId, restaurantId) {
    return this.delete(`staff/${userId}`, { restaurantId });
  }

  async searchUsers(query) {
    return this.get('search', { query });
  }

  async getUserStats() {
    return this.get('stats');
  }

  async bulkUpdateUsers(updates) {
    return this.put('bulk', { updates });
  }

  async exportUsers(filters = {}) {
    return this.get('export', filters);
  }

  async importUsers(data) {
    return this.post('import', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Admin specific methods
  async getAuditLogs(userId) {
    return this.get(`${userId}/audit-logs`);
  }

  async resetUserPassword(userId) {
    return this.post(`${userId}/reset-password`);
  }

  async blockUser(userId, reason) {
    return this.put(`${userId}/block`, { reason });
  }

  async unblockUser(userId) {
    return this.put(`${userId}/unblock`);
  }

  async mergeAccounts(primaryUserId, secondaryUserId) {
    return this.post('merge-accounts', {
      primaryUserId,
      secondaryUserId,
    });
  }

  async deleteAccount(userId, reason) {
    return this.delete(`${userId}`, { reason });
  }

  // Analytics methods
  async getUserAnalytics(userId, startDate, endDate) {
    return this.get(`${userId}/analytics`, {
      startDate,
      endDate,
    });
  }

  async getUserOrders(userId, page = 1, limit = 10) {
    return this.get(`${userId}/orders`, {
      page,
      limit,
    });
  }

  async getUserPreferences(userId) {
    return this.get(`${userId}/preferences`);
  }

  async updateUserPreferences(userId, preferences) {
    return this.put(`${userId}/preferences`, preferences);
  }

  // Notification preferences
  async getNotificationPreferences(userId) {
    return this.get(`${userId}/notification-preferences`);
  }

  async updateNotificationPreferences(userId, preferences) {
    return this.put(`${userId}/notification-preferences`, preferences);
  }

  // Address management
  async getUserAddresses(userId) {
    return this.get(`${userId}/addresses`);
  }

  async addUserAddress(userId, address) {
    return this.post(`${userId}/addresses`, address);
  }

  async updateUserAddress(userId, addressId, address) {
    return this.put(`${userId}/addresses/${addressId}`, address);
  }

  async deleteUserAddress(userId, addressId) {
    return this.delete(`${userId}/addresses/${addressId}`);
  }

  async setDefaultAddress(userId, addressId) {
    return this.put(`${userId}/addresses/${addressId}/default`);
  }
}

export default new UserService();
