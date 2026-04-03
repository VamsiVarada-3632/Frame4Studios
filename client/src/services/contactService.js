import api from './api';

export const submitContact = (data) => api.post('/contact', data);
export const getContacts = (params = {}) => api.get('/contact', { params });
export const markRead = (id) => api.put(`/contact/${id}/read`);
export const deleteContact = (id) => api.delete(`/contact/${id}`);
