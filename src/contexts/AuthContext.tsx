import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
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
    logout: () => void;
    sendOTP: (phone: string) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

    static setItem(key: string, value: any): void {
        const encrypted = this.encrypt(JSON.stringify(value));
        sessionStorage.setItem(key, encrypted);
    }

    static getItem(key: string): any {
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

// Mock API functions - replace with real API calls
const mockAPI = {
    async login(credentials: LoginCredentials): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        // Mock validation
        if (credentials.email === 'user@example.com' && credentials.password === 'password') {
            return {
                id: '1',
                email: credentials.email,
                name: 'Ryman Alex',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
                createdAt: new Date(),
            };
        }

        if (credentials.phone === '+1234567890' && credentials.otp === '123456') {
            return {
                id: '2',
                email: 'phone@example.com',
                name: 'Phone User',
                phone: credentials.phone,
                createdAt: new Date(),
            };
        }

        throw new Error('Invalid credentials');
    },

    async signup(credentials: SignupCredentials): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay

        if (!credentials.name || credentials.name.length < 2) {
            throw new Error('Name must be at least 2 characters long');
        }

        if (credentials.email && !credentials.email.includes('@')) {
            throw new Error('Invalid email address');
        }

        if (credentials.password && credentials.password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        if (credentials.password !== credentials.confirmPassword) {
            throw new Error('Passwords do not match');
        }

        return {
            id: Date.now().toString(),
            email: credentials.email || `${credentials.phone}@phone.com`,
            name: credentials.name,
            phone: credentials.phone,
            createdAt: new Date(),
        };
    },

    async sendOTP(phone: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (!phone || phone.length < 10) {
            throw new Error('Invalid phone number');
        }
        // In real app, this would send an actual OTP
        console.log(`OTP sent to ${phone}: 123456`);
    },
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from secure session storage on app start
    useEffect(() => {
        const savedUser = SecureStorage.getItem('user');
        if (savedUser) {
            dispatch({ type: 'AUTH_SUCCESS', payload: savedUser });
        }
    }, []);

    const authActions = {
        login: async (credentials: LoginCredentials) => {
            dispatch({ type: 'AUTH_START' });
            try {
                const user = await mockAPI.login(credentials);
                SecureStorage.setItem('user', user);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
            }
        },

        signup: async (credentials: SignupCredentials) => {
            dispatch({ type: 'AUTH_START' });
            try {
                const user = await mockAPI.signup(credentials);
                SecureStorage.setItem('user', user);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
            }
        },

        logout: () => {
            SecureStorage.clear();
            dispatch({ type: 'LOGOUT' });
        },

        sendOTP: async (phone: string) => {
            try {
                await mockAPI.sendOTP(phone);
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', payload: (error as Error).message });
            }
        },

        clearError: () => {
            dispatch({ type: 'CLEAR_ERROR' });
        },
    };

    return (
        <AuthContext.Provider value={{ ...state, ...authActions }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
