import { fetchApi } from './api.js';
import { authState } from '../stores/auth.svelte.js';

export const authService = {
    async login(email, password) {
        const data = await fetchApi('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.data && data.data.token) {
            const user = {
                _id: data.data._id,
                nombre: data.data.nombre,
                email: data.data.email,
                rol: data.data.rol
            };
            authState.login(data.data.token, user);
            return user;
        }
        throw new Error('Respuesta de login inválida');
    },

    async register(userData) {
        const data = await fetchApi('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (data.data && data.data.token) {
            const user = {
                _id: data.data._id,
                nombre: data.data.nombre,
                email: data.data.email,
                rol: data.data.rol
            };
            authState.login(data.data.token, user);
            return user;
        }
        throw new Error('Respuesta de registro inválida');
    }
};
