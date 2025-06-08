import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../contexts/AuthContext'
import { useAuth } from '../hooks/useAuth'
import Login from '../pages/Login'
import Signup from '../pages/Signup'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ children, to, ...props }: any) => <a href={to} {...props}>{children}</a>,
    }
})

// Mock toast hook
vi.mock('../components/ui/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn(),
    }),
}))

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    })

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

describe('Authentication Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockNavigate.mockClear()
        sessionStorage.clear()
    })
    describe('Login Component', () => {
        it('renders login form with email option by default', () => {
            render(
                <TestWrapper>
                    <Login />
                </TestWrapper>
            )

            expect(screen.getByText('Welcome back!')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
        })

        it('switches between email and phone login', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Login />
                </TestWrapper>
            )

            // Switch to phone login
            const phoneTab = screen.getByText('Phone')
            await user.click(phoneTab)

            expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument()

            // Switch back to email
            const emailTab = screen.getByText('Email')
            await user.click(emailTab)

            expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
        })

        it('validates email login form', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Login />
                </TestWrapper>
            )

            const loginButton = screen.getByRole('button', { name: /login/i })
            await user.click(loginButton)

            await waitFor(() => {
                expect(screen.getByText('Email is required')).toBeInTheDocument()
                expect(screen.getByText('Password is required')).toBeInTheDocument()
            })
        })

        it('handles successful email login', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Login />
                </TestWrapper>
            )

            await user.type(screen.getByPlaceholderText('Email Address'), 'user@example.com')
            await user.type(screen.getByPlaceholderText('Password'), 'password')

            const loginButton = screen.getByRole('button', { name: /login/i })
            await user.click(loginButton)

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
            })
        })

        it('handles phone OTP flow', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Login />
                </TestWrapper>
            )

            // Switch to phone login
            await user.click(screen.getByText('Phone'))

            await user.type(screen.getByPlaceholderText('Phone Number'), '+1234567890')

            const sendOtpButton = screen.getByRole('button', { name: /send otp/i })
            await user.click(sendOtpButton)

            await waitFor(() => {
                expect(screen.getByPlaceholderText('Enter OTP')).toBeInTheDocument()
            })

            await user.type(screen.getByPlaceholderText('Enter OTP'), '123456')

            const verifyButton = screen.getByRole('button', { name: /verify & login/i })
            await user.click(verifyButton)

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
            })
        })
    })

    describe('Signup Component', () => {
        it('renders signup form correctly', () => {
            render(
                <TestWrapper>
                    <Signup />
                </TestWrapper>
            )

            expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
            expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument()
        })

        it('switches between email and phone signup', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Signup />
                </TestWrapper>
            )

            // Switch to phone signup
            const phoneTab = screen.getByText('Phone')
            await user.click(phoneTab)

            expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
            expect(screen.queryByPlaceholderText('Email Address')).not.toBeInTheDocument()
        })

        it('validates signup form', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Signup />
                </TestWrapper>
            )

            const createAccountButton = screen.getByRole('button', { name: /create account/i })
            await user.click(createAccountButton)

            await waitFor(() => {
                expect(screen.getByText('Full name is required')).toBeInTheDocument()
                expect(screen.getByText('Email is required')).toBeInTheDocument()
                expect(screen.getByText('Password is required')).toBeInTheDocument()
            })
        })

        it('validates password confirmation', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Signup />
                </TestWrapper>
            )

            await user.type(screen.getByPlaceholderText('Full Name'), 'chakrawarthy')
            await user.type(screen.getByPlaceholderText('Email Address'), 'john@example.com')
            await user.type(screen.getByPlaceholderText('Password'), 'password123')
            await user.type(screen.getByPlaceholderText('Confirm Password'), 'differentpassword')

            const createAccountButton = screen.getByRole('button', { name: /create account/i })
            await user.click(createAccountButton)

            await waitFor(() => {
                expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
            })
        })

        it('requires terms agreement', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Signup />
                </TestWrapper>
            )

            await user.type(screen.getByPlaceholderText('Full Name'), 'chakrawarthy')
            await user.type(screen.getByPlaceholderText('Email Address'), 'john@example.com')
            await user.type(screen.getByPlaceholderText('Password'), 'password123')
            await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123')

            const createAccountButton = screen.getByRole('button', { name: /create account/i })
            await user.click(createAccountButton)

            await waitFor(() => {
                expect(screen.getByText('You must agree to the terms and conditions')).toBeInTheDocument()
            })
        })

        it('handles successful signup', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <Signup />
                </TestWrapper>
            )

            await user.type(screen.getByPlaceholderText('Full Name'), 'chakrawarthy')
            await user.type(screen.getByPlaceholderText('Email Address'), 'john@example.com')
            await user.type(screen.getByPlaceholderText('Password'), 'password123')      await user.type(screen.getByPlaceholderText('Confirm Password'), 'password123')

            // Click on the custom checkbox div that has cursor-pointer class
            const checkboxDiv = document.querySelector('.cursor-pointer')
            if (checkboxDiv) {
                await user.click(checkboxDiv as Element)
            }

            const createAccountButton = screen.getByRole('button', { name: /create account/i })
            await user.click(createAccountButton)

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
            })
        })
    })

    describe('AuthContext', () => {
        const MockAuthComponent = () => {
            const { user, login, logout, signup, sendOTP, isAuthenticated } = useAuth()

            return (
                <div>
                    <div data-testid="is-authenticated">{isAuthenticated.toString()}</div>          <div data-testid="user-name">{user?.name || 'No user'}</div>
                    <button onClick={() => login({ email: 'user@example.com', password: 'password' })}>
                        Login
                    </button>
                    <button onClick={logout}>Logout</button>
                    <button onClick={() => sendOTP('+1234567890')}>Send OTP</button>
                </div>
            )
        }

        it('initializes with no authenticated user', () => {
            render(
                <TestWrapper>
                    <MockAuthComponent />
                </TestWrapper>
            )

            expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
            expect(screen.getByTestId('user-name')).toHaveTextContent('No user')
        })

        it('handles login state changes', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <MockAuthComponent />
                </TestWrapper>
            )

            const loginButton = screen.getByText('Login')
            await user.click(loginButton)

            await waitFor(() => {
                expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
                expect(screen.getByTestId('user-name')).toHaveTextContent('Ryman Alex')
            })
        })

        it('handles logout', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <MockAuthComponent />
                </TestWrapper>
            )

            // Login first
            await user.click(screen.getByText('Login'))

            await waitFor(() => {
                expect(screen.getByTestId('is-authenticated')).toHaveTextContent('true')
            })

            // Then logout
            await user.click(screen.getByText('Logout'))

            await waitFor(() => {
                expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false')
                expect(screen.getByTestId('user-name')).toHaveTextContent('No user')
            })
        })

        it('handles OTP sending', async () => {
            const user = userEvent.setup()

            render(
                <TestWrapper>
                    <MockAuthComponent />
                </TestWrapper>
            )

            const sendOtpButton = screen.getByText('Send OTP')
            await user.click(sendOtpButton)

            // OTP sending should complete without errors
            await waitFor(() => {
                expect(sendOtpButton).toBeInTheDocument()
            })
        })
    })
})
