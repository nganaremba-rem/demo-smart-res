import { ApiService } from './ApiService';

class SettingsService extends ApiService {
  constructor() {
    super('/settings');
  }

  // General settings
  async getSettings() {
    return this.get();
  }

  async updateSettings(settings) {
    return this.put('', settings);
  }

  // Platform settings
  async getPlatformSettings() {
    return this.get('platform');
  }

  async updatePlatformSettings(settings) {
    return this.put('platform', settings);
  }

  // Payment settings
  async getPaymentSettings() {
    return this.get('payment');
  }

  async updatePaymentSettings(settings) {
    return this.put('payment', settings);
  }

  // Delivery settings
  async getDeliverySettings() {
    return this.get('delivery');
  }

  async updateDeliverySettings(settings) {
    return this.put('delivery', settings);
  }

  // Tax settings
  async getTaxSettings() {
    return this.get('tax');
  }

  async updateTaxSettings(settings) {
    return this.put('tax', settings);
  }

  // Notification settings
  async getNotificationSettings() {
    return this.get('notifications');
  }

  async updateNotificationSettings(settings) {
    return this.put('notifications', settings);
  }

  // Email settings
  async getEmailSettings() {
    return this.get('email');
  }

  async updateEmailSettings(settings) {
    return this.put('email', settings);
  }

  // SMS settings
  async getSMSSettings() {
    return this.get('sms');
  }

  async updateSMSSettings(settings) {
    return this.put('sms', settings);
  }

  // Integration settings
  async getIntegrationSettings() {
    return this.get('integrations');
  }

  async updateIntegrationSettings(settings) {
    return this.put('integrations', settings);
  }

  // Currency settings
  async getCurrencySettings() {
    return this.get('currency');
  }

  async updateCurrencySettings(settings) {
    return this.put('currency', settings);
  }

  // Language settings
  async getLanguageSettings() {
    return this.get('language');
  }

  async updateLanguageSettings(settings) {
    return this.put('language', settings);
  }

  // Theme settings
  async getThemeSettings() {
    return this.get('theme');
  }

  async updateThemeSettings(settings) {
    return this.put('theme', settings);
  }

  // Analytics settings
  async getAnalyticsSettings() {
    return this.get('analytics');
  }

  async updateAnalyticsSettings(settings) {
    return this.put('analytics', settings);
  }

  // Security settings
  async getSecuritySettings() {
    return this.get('security');
  }

  async updateSecuritySettings(settings) {
    return this.put('security', settings);
  }

  // Backup settings
  async getBackupSettings() {
    return this.get('backup');
  }

  async updateBackupSettings(settings) {
    return this.put('backup', settings);
  }

  // Cache settings
  async getCacheSettings() {
    return this.get('cache');
  }

  async updateCacheSettings(settings) {
    return this.put('cache', settings);
  }

  // Clear cache
  async clearCache(type = 'all') {
    return this.post('cache/clear', { type });
  }

  // Maintenance mode
  async getMaintenanceMode() {
    return this.get('maintenance');
  }

  async updateMaintenanceMode(enabled, message = '') {
    return this.put('maintenance', { enabled, message });
  }

  // System health
  async getSystemHealth() {
    return this.get('health');
  }

  // System logs
  async getSystemLogs(page = 1, limit = 50) {
    return this.get('logs', { page, limit });
  }

  // Export settings
  async exportSettings() {
    return this.get('export');
  }

  // Import settings
  async importSettings(settings) {
    return this.post('import', settings);
  }

  // Reset settings
  async resetSettings(category = 'all') {
    return this.post('reset', { category });
  }
}

export default new SettingsService();
