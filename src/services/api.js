import axios from 'axios';

// Configuración base de la API
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/API/V1.0',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de timeout
});

// Log para debug
console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000/API/V1.0');

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request details for debugging (url and params)
        try {
            console.debug('API Request:', {
                url: config.url,
                baseURL: config.baseURL,
                method: config.method,
                params: config.params,
                data: config.data
            });
        } catch (e) {
            // ignore logging errors
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // Log para debug
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });

        // Si el token expiró, intentar refrescarlo
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No hay refresh token, continuar sin autenticación
                    return Promise.reject(error);
                }
                
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/API/V1.0'}/refresh`, {
                    refreshToken,
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, limpiar tokens
                console.warn('Refresh token falló, limpiando tokens');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                // No redirigir automáticamente, dejar que el componente maneje el error
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
