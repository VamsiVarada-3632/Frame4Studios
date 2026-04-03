import api from './api';

export const getHomepage = () => api.get('/homepage');
export const updateHomepage = (formData) =>
  api.put('/homepage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getCategories = () => api.get('/categories');
export const createCategory = (formData) =>
  api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateCategory = (id, formData) =>
  api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
