// Get API base URL from env (or default to localhost)
const API_BASE = 'http://localhost:5000/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean; // For public endpoints like login
};

class ApiClient {
  /**
   * Core request method with interceptor logic
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists (unless skipAuth is true)
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Prepare fetch config
    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    // Add body if present (and not GET request)
    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log(`[API] ${options.method || 'GET'} ${endpoint}`, options.body);

      const response = await fetch(`${API_BASE}${endpoint}`, config);

      // Parse response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`[API] Response:`, { status: response.status, data });

      // Handle 401 Unauthorized - logout and redirect
      if (response.status === 401) {
        console.warn('[API] 401 Unauthorized - Logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Session expired. Please login again.');
      }

      // Handle other error responses
      if (!response.ok) {
        console.log(" Error from Interceptors : response is not okay ");
        const errorMessage = 
          data?.message || 
          data?.error || 
          `Request failed with status ${response.status}`;
          console.log(errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      console.error('[API] Error:', error);
      
      // Re-throw with more context
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw error;
    }
  }

  /**
   * GET request
   */
  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  post<T = any>(endpoint: string, body?: any, skipAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, skipAuth });
  }

  /**
   * PUT request
   */
  put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  /**
   * PATCH request
   */
  patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  /**
   * DELETE request
   */
  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiClient();

// Export for type safety
export type ApiResponse<T> = T;