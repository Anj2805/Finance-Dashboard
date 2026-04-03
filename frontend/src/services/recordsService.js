import apiClient from './apiClient'

export const getRecords = (params) => apiClient.get('/records', { params })
export const getRecord = (id) => apiClient.get(`/records/${id}`)
export const createRecord = (payload) => apiClient.post('/records', payload)
export const updateRecord = (id, payload) => apiClient.put(`/records/${id}`, payload)
export const deleteRecord = (id) => apiClient.delete(`/records/${id}`)
