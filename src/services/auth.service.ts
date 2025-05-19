// src/services/auth.service.ts
import liff from '@line/liff'
import axios from 'axios'
import { ref } from 'vue'

const API = process.env.NODE_ENV === 'production' ? import.meta.env.VITE_API_URL : '/api'
const TOKEN_KEY = 'auth_token'
const TOKEN_EXPIRY_KEY = 'auth_token_expiry'
const liff_user_classification = import.meta.env.VITE_LIFF_ID_USER_CLASSIFICATION

export class AuthService {
  private static instance: AuthService
  private isAuthenticated = ref(false)

  // Private constructor for singleton pattern
  private constructor() {
    this.setupInterceptors()
    this.checkTokenOnStartup()
  }

  // Singleton instance getter
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  public getIsAuthenticated() {
    return this.isAuthenticated
  }

  /**
   * Setup axios interceptors to automatically add the token to requests
   * and handle token expiration
   */
  private setupInterceptors() {
    // Request interceptor to add token to all API requests
    axios.interceptors.request.use(
      (config) => {
        // Only add token to requests going to our API
        if (config.url?.startsWith(API)) {
          const token = this.getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor to handle 401 unauthorized errors
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          console.log('Unauthorized request, logging out')
          this.logout()
          // Redirect to login page or show login modal
          window.location.href = `https://liff.line.me/${liff_user_classification}` // Modify as needed for your application
        }
        return Promise.reject(error)
      },
    )
  }

  /**
   * Save the access token to secure storage with expiration
   */
  public saveToken(token: string, expiresIn = 3600): void {
    // Calculate expiration time (current time + expiresIn seconds)
    const expiryTime = Date.now() + expiresIn * 1000

    // Save token and expiry time
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())

    this.isAuthenticated.value = true
  }

  /**
   * Check if token exists and is still valid on application startup
   */
  private checkTokenOnStartup(): void {
    const token = this.getToken()
    const isValid = this.isTokenValid()

    this.isAuthenticated.value = !!token && isValid

    if (token && !isValid) {
      // Token exists but is expired, clear it
      this.clearToken()
    }
  }

  /**
   * Get the stored token
   */
  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  /**
   * Check if token is still valid (not expired)
   */
  public isTokenValid(): boolean {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiryTime) return false

    // Compare current time with expiry time
    return Date.now() < parseInt(expiryTime)
  }

  /**
   * Clear token and authentication state
   */
  public clearToken(): void {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    this.isAuthenticated.value = false
  }

  /**
   * Login user with LINE ID token and store the returned access token
   */
  public async loginWithLineIdToken(idToken: string): Promise<boolean> {
    console.log('is production:', process.env.NODE_ENV)
    console.log(API)
    try {
      const response = await axios.post(`${API}/auth/login`, { idToken })
      const accessToken = response.data.access_token

      // Store the token
      this.saveToken(accessToken)
      console.log('User logged in successfully')
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  public async register(idToken: string, program_code?: string) {
    try {
      const payload: { idToken: string; program_code?: string } = { idToken }
      if (program_code !== undefined) {
        payload.program_code = program_code
      }
      console.log('Registering user with payload:', payload.idToken)

      const response = await axios.post(`${API}/users/register`, payload)

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const user = response.data
      console.log('User registered successfully:', user)
      authService.saveToken(user.access_token)
      console.log('get access_token:', authService.getToken())

      return user
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 500) {
        liff.logout()
      }
      console.error('Failed to register user:', error)
    }
  }

  /**
   * Logout function - clear token and redirect
   */
  public logout(): void {
    this.clearToken()
  }
}

// Export a default instance
export const authService = AuthService.getInstance()
