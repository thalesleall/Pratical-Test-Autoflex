const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export interface ApiError {
  message: string
  status: number
  details?: unknown
}

export class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config: RequestInit = {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    }

    try {
      const response = await fetch(url, config)
      if (response.status === 204) return undefined as T
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        const error: ApiError = {
          message: data?.message || response.statusText,
          status: response.status,
          details: data,
        }
        throw error
      }
      return data as T
    } catch (error) {
      if ((error as ApiError).status) throw error
      throw { message: 'Network error', status: 0, details: error } as ApiError
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
