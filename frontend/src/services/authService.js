import apiClient from './apiClient'

export const loginRequest = (payload) => apiClient.post('/auth/login', payload)
export const registerRequest = (payload) => apiClient.post('/auth/register', payload)
