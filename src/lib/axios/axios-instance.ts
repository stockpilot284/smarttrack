import axios from 'axios'

// Get the base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // optional timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach auth token if available
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage or your store
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: handle errors globally (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      // e.g., window.location.href = '/login';
    }
    return Promise.reject(error)
  },
)
