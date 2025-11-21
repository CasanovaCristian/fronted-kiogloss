import api from './api';

const productService = {
    // Obtener todos los productos con paginación
    getAllProducts: async (page = 0, size = 12, sort = 'id,asc') => {
        try {
            const response = await api.get('/products', {
                params: { 
                    page, 
                    page_size: size  // El backend usa 'page_size' no 'size'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    getProductBySlug: async (slug) => {
        try {
            const response = await api.get(`/article/${slug}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product by slug:', error);
            throw error;
        }
    },

    // Obtener detalle de un producto
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching product details:', error);
            throw error;
        }
    },

    // Buscar productos
    searchProducts: async (query) => {
        try {
            const response = await api.get('/products/search', {
                params: { query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    // Filtrar productos por categoría
    getProductsByCategory: async (categoryId) => {
        try {
            const response = await api.get(`/products/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    },

    // Filtrar productos por precio
    filterProductsByPrice: async (minPrice, maxPrice) => {
        try {
            const response = await api.get('/products/filter', {
                params: { minPrice, maxPrice }
            });
            return response.data;
        } catch (error) {
            console.error('Error filtering products by price:', error);
            throw error;
        }
    },

    // Obtener productos destacados
    getFeaturedProducts: async () => {
        try {
            const response = await api.get('/products', {
                params: { featured: true, size: 4 }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching featured products:', error);
            throw error;
        }
    },

    // Obtener nuevos productos
    getNewArrivals: async () => {
        try {
            const response = await api.get('/products', {
                params: { newArrivals: true, size: 4 }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
            throw error;
        }
    },

    // Obtener productos recomendados
    getRecommendedProducts: async () => {
        try {
            const response = await api.get('/products', {
                params: { recommended: true, size: 8 }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recommended products:', error);
            throw error;
        }
    },

    // Obtener todos los tags/slugs disponibles
    getAllTags: async () => {
        try {
            const response = await api.get('/tags');  // El endpoint es /tags
            return response.data;
        } catch (error) {
            console.error('Error fetching tags:', error);
            throw error;
        }
    },

    // Filtrar productos por tags
    filterByTags: async (tagIds = [], page = 0, size = 12) => {
        try {
            const response = await api.get('/products/filter/tags', {
                params: { 
                    tagIds: tagIds.join(','),
                    page,
                    size
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error filtering by tags:', error);
            throw error;
        }
    },

    // Filtrar productos con múltiples criterios
    filterProducts: async (filters = {}) => {
        try {
            const response = await api.get('/products/filter', {
                params: {
                    tagIds: filters.tags?.join(','),
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice,
                    page: filters.page || 0,
                    size: filters.size || 12,
                    sort: filters.sort || 'id,asc'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error filtering products:', error);
            throw error;
        }
    },

    // Obtener productos con estado PUBLICADO (el backend ya filtra automáticamente)
    // Usar 'size' para ser consistente con otros endpoints y con la convención del backend.
    getPublishedProducts: async (page = 0, size = 12, sort = 'id,asc') => {
        try {
            const response = await api.get('/products', {
                params: { 
                    page,
                    size,
                    page_size: size, // enviar ambos por compatibilidad
                    sort
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching published products:', error);
            throw error;
        }
    },

    // Obtener productos PUBLICADOS con búsqueda y filtros (tags, precio, orden)
    filterPublishedProducts: async (filters = {}) => {
        try {
            const params = {
                page: filters.page || 0,
                size: filters.size || 12,
                page_size: filters.size || 12, // compatibilidad con backend que espere page_size
                sort: filters.sort || 'id,asc'
            };

            if (filters.search) params.search = filters.search;
            if (filters.tags && Array.isArray(filters.tags) && filters.tags.length) params.tagIds = filters.tags.join(',');
            if (filters.minPrice) params.minPrice = filters.minPrice;
            if (filters.maxPrice) params.maxPrice = filters.maxPrice;

            const response = await api.get('/products', {
                params
            });
            return response.data;
        } catch (error) {
            console.error('Error filtering published products:', error);
            throw error;
        }
    },

    // FAVORITES: add, list by account, remove by pk
    addFavorite: async (payload) => {
        try {
            const response = await api.post('/user/favorite', payload);
            return response;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },

    getFavoritesByAccount: async (accountId) => {
        try {
            const response = await api.get(`/user/account/account_favorites/${accountId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching account favorites:', error);
            throw error;
        }
    },

    removeFavoriteByPk: async (pk) => {
        try {
            const response = await api.delete(`/user/delete/${pk}`);
            return response;
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    },
};

export default productService;
