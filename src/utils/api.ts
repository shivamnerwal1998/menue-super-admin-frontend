import { ValidationError } from '../types/menue'

// ── Typed error class ────────────────────────────────────────────────────────
export class AppError extends Error {
  code?: string
  details?: ValidationError[]

  constructor(message: string, code?: string, details?: ValidationError[]) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.details = details
  }
}

// ── Helper: cast unknown catch value to AppError ─────────────────────────────
export const asAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error
  if (error instanceof Error) return new AppError(error.message)
  return new AppError('An unexpected error occurred')
}

// Get API base URL from env (or default to localhost)
console.log('Meta -> ', import.meta)
const baseUrl = import.meta.env.VITE_API_URL

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
  skipAuth?: boolean // For public endpoints like login
}

class ApiClient {
  /**
   * Core request method with interceptor logic
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const token = localStorage.getItem('token')

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add Authorization header if token exists (unless skipAuth is true)
    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Prepare fetch config
    const config: RequestInit = {
      method: options.method || 'GET',
      headers,
    }

    // Add body if present (and not GET request)
    if (options.body && options.method !== 'GET') {
      config.body = JSON.stringify(options.body)
    }

    try {
      console.log(`[API] ${options.method || 'GET'} ${endpoint}`, options.body)

      const response = await fetch(`${baseUrl}${endpoint}`, config)

      // Parse response
      let data: any
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      console.log(`[API] Response:`, { status: response.status, data })

      // Handle 401 Unauthorized - logout and redirect
      if (response.status === 401) {
        console.warn('[API] 401 Unauthorized - Logging out')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        window.location.href = '/'
        throw new AppError('Session expired. Please login again.', 'UNAUTHORIZED')
      }

      // Handle other error responses
      if (!response.ok) {
        console.log(' Error from Interceptors : response is not okay ')
        const errorMessage =
          data?.message ||
          data?.error ||
          `Request failed with status ${response.status}`
        console.log(errorMessage)

        // Throw typed AppError — carries code + validation details if present
        throw new AppError(errorMessage, data?.code, data?.details)
      }

      return data
    } catch (error) {
      console.error('[API] Error:', error)

      // Pass through AppErrors as-is (already typed)
      if (error instanceof AppError) throw error

      // Wrap network-level errors
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        throw new AppError(
          'Unable to connect to server. Please check your internet connection.',
          'NETWORK_ERROR',
        )
      }

      // Wrap any other unexpected error
      throw new AppError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      )
    }
  }

  /**
   * GET request
   */
  get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST request
   */
  post<T = any>(endpoint: string, body?: any, skipAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, skipAuth })
  }

  /**
   * PUT request
   */
  put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body })
  }

  /**
   * PATCH request
   */
  patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body })
  }

  /**
   * DELETE request
   */
  delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const api = new ApiClient()

// Export for type safety
export type ApiResponse<T> = T