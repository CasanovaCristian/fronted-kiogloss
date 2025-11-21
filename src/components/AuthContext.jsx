import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = () => {
        const token = localStorage.getItem('accessToken');
        const legacyToken = localStorage.getItem('access');
        setIsAuthenticated(!!(token || legacyToken));
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();

        // Escuchar cambios en localStorage
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth_changed', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth_changed', handleStorageChange);
        };
    }, []);

    const login = (tokens) => {
        localStorage.setItem('accessToken', tokens.access);
        if (tokens.refresh) {
            localStorage.setItem('refreshToken', tokens.refresh);
        }
        setIsAuthenticated(true);
        window.dispatchEvent(new Event('auth_changed'));
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('access');
        setIsAuthenticated(false);
        window.dispatchEvent(new Event('auth_changed'));
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};