import api from '../api/axios';
import { handleApiError } from '../utils/apiErrorHandler';

export class ApiService {
  constructor(resourcePath) {
    this.resourcePath = resourcePath;
  }

  async get(id, params = {}) {
    try {
      const response = await api.get(
        id ? `${this.resourcePath}/${id}` : this.resourcePath,
        { params }
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async post(data, config = {}) {
    try {
      const response = await api.post(this.resourcePath, data, config);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async put(id, data, config = {}) {
    try {
      const response = await api.put(
        `${this.resourcePath}/${id}`,
        data,
        config
      );
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async delete(id) {
    try {
      const response = await api.delete(`${this.resourcePath}/${id}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  }

  async upload(data, config = {}) {
    return this.post(data, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
    });
  }
}
