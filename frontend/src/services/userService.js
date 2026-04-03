import apiClient from './apiClient'

export const getUsers = () => apiClient.get('/users')
export const updateUserRole = (id, role) => apiClient.patch(`/users/${id}/role`, { role })
export const updateUserStatus = (id, status) => apiClient.patch(`/users/${id}/status`, { status })
