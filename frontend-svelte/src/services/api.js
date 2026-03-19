import { authState } from '../stores/auth.svelte.js';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchApi(endpoint, options = {}) {
    const headers = new Headers(options.headers || {});

    // Add auth token if available
    if (authState.token) {
        headers.set('Authorization', `Bearer ${authState.token}`);
    }

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    const config = {
        ...options,
        headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
        authState.logout();
        throw new Error('Sesión expirada o no autorizada');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error en la petición');
    }

    return data;
}
