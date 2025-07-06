// Authentication utility functions

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isStudent: boolean;
    matricNumber?: string;
    emailVerified: boolean;
    phoneNumber: string;
}

// Token management
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('jwtToken');
    }
    return null;
};

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', token);
    }
};

export const removeAuthToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwtToken');
    }
};

// User data management
export const getUserData = (): User | null => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing user data:', error);
                return null;
            }
        }
    }
    return null;
};

export const setUserData = (user: User): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const removeUserData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
};

// Authentication state
export const isAuthenticated = (): boolean => {
    const token = getAuthToken();
    return !!token;
};

export const isEmailVerified = (): boolean => {
    const user = getUserData();
    return user?.emailVerified || false;
};

// Logout function
export const logout = (): void => {
    removeAuthToken();
    removeUserData();
    // Clear any other auth-related data
    if (typeof window !== 'undefined') {
        localStorage.removeItem('verificationEmail');
        // Redirect to login page
        window.location.href = '/authentication/login';
    }
};

// Axios interceptor setup (for API calls with auth token)
export const setupAuthInterceptor = (axios: any) => {
    axios.interceptors.request.use(
        (config: any) => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response: any) => {
            return response;
        },
        (error: any) => {
            // Handle 401 Unauthorized errors
            if (error.response?.status === 401) {
                logout();
                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/authentication/login';
                }
            }
            return Promise.reject(error);
        }
    );
}; 