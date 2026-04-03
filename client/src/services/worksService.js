import api from './api';

export const getWorks = (params = {}) => api.get('/works', { params });
export const getWorksCount = () => api.get('/works/count');
export const getWork = (id) => api.get(`/works/${id}`);
export const createWork = (formData) => api.post('/works', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateWork = (id, formData) => api.put(`/works/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteWork = (id) => api.delete(`/works/${id}`);
