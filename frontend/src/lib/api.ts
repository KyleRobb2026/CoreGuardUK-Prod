import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API client configuration
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearAuthToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // HTTP Methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // File upload
  async upload<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// API endpoints
export const endpoints = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    OFFICER_LOGIN: '/api/auth/officer-login',
    ME: '/api/auth/me',
    LOGOUT: '/api/auth/logout',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    RECENT_ACTIVITY: '/api/dashboard/recent-activity',
  },

  // Personnel
  PERSONNEL: {
    LIST: '/api/personnel',
    CREATE: '/api/personnel',
    UPDATE: (id: string) => `/api/personnel/${id}`,
    DELETE: (id: string) => `/api/personnel/${id}`,
  },

  // Sites
  SITES: {
    LIST: '/api/sites',
    CREATE: '/api/sites',
    UPDATE: (id: string) => `/api/sites/${id}`,
    DELETE: (id: string) => `/api/sites/${id}`,
  },

  // Rota
  ROTA: {
    LIST: '/api/rota',
    CREATE: '/api/rota',
    UPDATE: (id: string) => `/api/rota/${id}`,
    DELETE: (id: string) => `/api/rota/${id}`,
  },

  // Check Calls
  CHECK_CALLS: {
    LIST: '/api/check-calls',
    CREATE: '/api/check-calls',
    UPDATE: (id: string) => `/api/check-calls/${id}`,
    DELETE: (id: string) => `/api/check-calls/${id}`,
  },

  // Forms
  FORMS: {
    LIST: '/api/forms',
    CREATE: '/api/forms',
    UPDATE: (id: string) => `/api/forms/${id}`,
    DELETE: (id: string) => `/api/forms/${id}`,
  },

  // Compliance
  COMPLIANCE: {
    LIST: '/api/compliance',
    ALERTS: '/api/compliance/alerts',
    CREATE: '/api/compliance',
    UPDATE: (id: string) => `/api/compliance/${id}`,
  },

  // Audit
  AUDIT: {
    LIST: '/api/audit',
  },
};

export default apiClient;
