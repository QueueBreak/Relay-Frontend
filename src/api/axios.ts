import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1"

export const publicApi = axios.create({
  baseURL: BASE_URL,
})

export const privateApi = axios.create({
  baseURL: BASE_URL,
})

privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})