import axios from 'axios';

const API_BASE = process.env.REACT_APP_BACKEND_URL;

// API service for CoreGuard SMS
export function createApiService() {
  return {
    get: async (url, config = {}) => {
      const token = localStorage.getItem('cg_token');
      return axios.get(`${API_BASE}${url}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
    },
    post: async (url, data = {}, config = {}) => {
      const token = localStorage.getItem('cg_token');
      return axios.post(`${API_BASE}${url}`, data, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
    },
    put: async (url, data = {}, config = {}) => {
      const token = localStorage.getItem('cg_token');
      return axios.put(`${API_BASE}${url}`, data, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
    },
    delete: async (url, config = {}) => {
      const token = localStorage.getItem('cg_token');
      return axios.delete(`${API_BASE}${url}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          ...config.headers
        },
        ...config
      });
    }
  };
}

export default createApiService;
