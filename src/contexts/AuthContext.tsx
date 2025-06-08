import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface User {
    id: string;
    email?: string;
    name: string;
    phone?: string;
    avatar?: string;
    username?: string;
    is_phone_verified?: boolean;
    is_email_verified?: boolean;
    created_at: string;
    updated_at: string;
    last_login?: string;
    is_active: boolean;
    preferences?: Record<string, unknown>;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };

        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };

        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };

        case 'CLEAR_ERROR':
            return { ...state, error: null };

        default:
            return state;
    }
}

interface LoginCredentials {
    email?: string;
    phone?: string;
    password?: string;
    otp?: string;
}

interface SignupCredentials extends LoginCredentials {
    name: string;
    confirmPassword?: string;
}

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => Promise<void>;
    sendOTP: (phone: string, purpose?: string) => Promise<void>;
    clearError: () => void;
    updateProfile: (data: Partial<User>) => Promise<User>;
    changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
    verifyPhone: (phone: string, otp: string) => Promise<User>;
    refreshToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

// Secure session storage utility
class SecureStorage {
    private static encrypt(data: string): string {
        // Simple encryption for demo - in production use proper encryption
        return btoa(data);
    }

    private static decrypt(data: string): string {
        try {
            return atob(data);
        } catch {
            return '';
        }
    }

    static setItem(key: string, value: unknown): void {
        const encrypted = this.encrypt(JSON.stringify(value));
        sessionStorage.setItem(key, encrypted);
    }

    static getItem(key: string): unknown {
        const encrypted = sessionStorage.getItem(key);
        if (!encrypted) return null;

        try {
            const decrypted = this.decrypt(encrypted);
            return JSON.parse(decrypted);
        } catch {
            return null;
        }
    }

    static removeItem(key: string): void {
        sessionStorage.removeItem(key);
    }

    static clear(): void {
        sessionStorage.clear();
    }
}

// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API utility functions
class APIClient {
    private static getAuthHeader(): Record<string, string> {
        const token = SecureStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    static async request(endpoint: string, options: RequestInit = {}): Promise<Record<string, unknown>> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader(),
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    }
}

// Real API functions
const authAPI = {
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        let requestData: Record<string, unknown> = {};

        if (credentials.email && credentials.password) {
            // Email + password login
            requestData = {
                type: 'email',
                email: credentials.email,
                password: credentials.password,
            };
        } else if (credentials.phone && credentials.otp) {
            // Phone + OTP login
            requestData = {
                type: 'phone',
                phone: credentials.phone,
                otp: credentials.otp,
            };
        } else {
            throw new Error('Invalid login credentials');
        }

        const response = await APIClient.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });

        return { user: response.user as User, token: response.token as string };
    },

    async signup(credentials: SignupCredentials): Promise<{ user: User; token: string }> {
        let requestData: Record<string, unknown> = {
            name: credentials.name,
        };

        if (credentials.email && credentials.password) {
            // Email signup
            requestData = {
                ...requestData,
                type: 'email',
                email: credentials.email,
                password: credentials.password,
                confirmPassword: credentials.confirmPassword,
            };
        } else if (credentials.phone && credentials.otp) {
            // Phone signup
            requestData = {
                ...requestData,
                type: 'phone',
                phone: credentials.phone,
                otp: credentials.otp,
            };
        } else {
            throw new Error('Invalid signup credentials');
        }

        const response = await APIClient.request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(requestData),
        });

        return { user: response.user as User, token: response.token as string };
    },

    async sendOTP(phone: string, purpose: string = 'login'): Promise<void> {
        await APIClient.request('/auth/send-otp', {
            method: 'POST',
            body: JSON.stringify({ phone, purpose }),
        });
    },

    async getUserProfile(): Promise<User> {
        const response = await APIClient.request('/auth/profile');
        return response.user as User;
    },

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await APIClient.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response.user as User;
    },

    async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
        await APIClient.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({
                currentPassword,
                newPassword,
                confirmPassword,
            }),
        });
    },

    async verifyPhone(phone: string, otp: string): Promise<User> {
        const response = await APIClient.request('/auth/verify-phone', {
            method: 'POST',
            body: JSON.stringify({ phone, otp }),
        });
        return response.user as User;
    },

    async logout(): Promise<void> {
        await APIClient.request('/auth/logout', {
            method: 'POST',
        });
    },

    async refreshToken(): Promise<string> {
        const response = await APIClient.request('/auth/refresh-token', {
            method: 'POST',
        });
        return response.token as string;
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);    // Load user from secure session storage on app start
    useEffect(() => {
        const savedUser = SecureStorage.getItem('user') as User | null;
        const savedToken = SecureStorage.getItem('token');

        if (savedUser && savedToken) {
            dispatch({ type: 'AUTH_SUCCESS', payload: savedUser });

            // Optionally verify token with server
            authAPI.getUserProfile()
                .then(user => {
                    dispatch({ type: 'AUTH_SUCCESS', payload: user });
                    SecureStorage.setItem('user', user);
                })
                .catch(() => {
                    // Token might be expired, logout user
                    SecureStorage.clear();
                    dispatch({ type: 'LOGOUT' });
                });
        }
    }, []);

    const authActions = {
        login: async (credentials: LoginCredentials) => {
            dispatch({ type: 'AUTH_START' });
            try {
                const { user, token } = await authAPI.login(credentials);
                SecureStorage.setItem('user', user);
                SecureStorage.setItem('token', token);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
                return { success: true, user };
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
                throw error; // Re-throw to let the component know authentication failed
            }
        },

        signup: async (credentials: SignupCredentials) => {
            dispatch({ type: 'AUTH_START' });
            try {
                const { user, token } = await authAPI.signup(credentials);
                SecureStorage.setItem('user', user);
                SecureStorage.setItem('token', token);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
                return { success: true, user };
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
                throw error; // Re-throw to let the component know authentication failed
            }
        },

        logout: async () => {
            try {
                await authAPI.logout();
            } catch (error) {
                // Continue with logout even if API call fails
                console.warn('Logout API call failed:', error);
            } finally {
                SecureStorage.clear();
                dispatch({ type: 'LOGOUT' });
            }
        },

        sendOTP: async (phone: string, purpose: string = 'login') => {
            try {
                await authAPI.sendOTP(phone, purpose);
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
                throw error; // Re-throw so the component can handle it
            }
        },

        clearError: () => {
            dispatch({ type: 'CLEAR_ERROR' });
        },

        // Additional methods for enhanced functionality
        updateProfile: async (data: Partial<User>) => {
            try {
                const updatedUser = await authAPI.updateProfile(data);
                SecureStorage.setItem('user', updatedUser);
                dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
                return updatedUser;
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
                throw error;
            }
        },

        changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
            try {
                await authAPI.changePassword(currentPassword, newPassword, confirmPassword);
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
                throw error;
            }
        },

        verifyPhone: async (phone: string, otp: string) => {
            try {
                const updatedUser = await authAPI.verifyPhone(phone, otp);
                SecureStorage.setItem('user', updatedUser);
                dispatch({ type: 'AUTH_SUCCESS', payload: updatedUser });
                return updatedUser;
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
                throw error;
            }
        },

        refreshToken: async () => {
            try {
                const newToken = await authAPI.refreshToken();
                SecureStorage.setItem('token', newToken);
                return newToken;
            } catch (error) {
                // Token refresh failed, logout user
                SecureStorage.clear();
                dispatch({ type: 'LOGOUT' });
                throw error;
            }
        },
    }; return (
        <AuthContext.Provider value={{ ...state, ...authActions }}>
            {children}
        </AuthContext.Provider>
    );
}
