import { fetchApi } from './api.js';

export const productosService = {
    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = `/api/productos${queryString ? `?${queryString}` : ''}`;
        return fetchApi(endpoint);
    },

    async getById(id) {
        return fetchApi(`/api/productos/${id}`);
    },

    async create(productoData) {
        return fetchApi('/api/productos', {
            method: 'POST',
            body: JSON.stringify(productoData)
        });
    },

    async update(id, productoData) {
        return fetchApi(`/api/productos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productoData)
        });
    },

    async delete(id) {
        return fetchApi(`/api/productos/${id}`, {
            method: 'DELETE'
        });
    }
};
