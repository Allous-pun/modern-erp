import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Extend the AxiosRequestConfig to include _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = 'https://modern-erp-backend.onrender.com/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token and organization ID
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    const organizationId = localStorage.getItem('organizationId');
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      token: token ? 'present' : 'missing',
      organizationId: organizationId || 'missing',
      headers: config.headers,
      hasBody: !!config.data
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (organizationId) {
      config.headers['X-Organization-ID'] = organizationId;
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh - TEMPORARILY COMMENTED OUT FOR DEBUGGING
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      success: response.data?.success,
      data: response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    console.error('API Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.response?.data || error.message,
      headers: originalRequest?.headers
    });
    
    // TEMPORARILY DISABLED: Token refresh logic
    // Just reject the error without attempting refresh
    return Promise.reject(error);
    
    /* Original refresh logic - commented out for debugging
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          console.error('No refresh token available');
          throw new Error('No refresh token');
        }
        
        console.log('Attempting token refresh...');
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        const { token, refreshToken: newRefreshToken } = response.data.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        console.log('Token refresh successful');
        
        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Refresh failed - logout user
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    */
  }
);

// Helper to handle API responses
export const handleApiResponse = (response: any) => {
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'API request failed');
};

// Helper to handle API errors
export const handleApiError = (error: any): never => {
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (error.message) {
    throw new Error(error.message);
  }
  throw new Error('An unexpected error occurred');
};

// Export everything as default as well for compatibility
export default apiClient;