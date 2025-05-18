import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { authService } from './auth.service';

const API = import.meta.env.VITE_PRODUCTION === true ? import.meta.env.VITE_API_URL : '/api';

class ApiService {
  /**
   * Make an authenticated GET request
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.get<T>(`${API}${endpoint}`, config);
    return response.data;
  }

  /**
   * Make an authenticated POST request
   */
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.post<T>(`${API}${endpoint}`, data, config);
    return response.data;
  }

  /**
   * Make an authenticated PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.put<T>(`${API}${endpoint}`, data, config);
    return response.data;
  }

  /**
   * Make an authenticated DELETE request
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axios.delete<T>(`${API}${endpoint}`, config);
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return authService.getIsAuthenticated().value;
  }
}

export const apiService = new ApiService();
