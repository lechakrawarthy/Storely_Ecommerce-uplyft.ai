import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Phone, AlertCircle, Loader2, User, Check, Eye, EyeOff, Lock, ArrowLeft } from '../utils/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
    const { signup, sendOTP, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [signupType, setSignupType] = useState<'email' | 'phone'>('email');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        otp: '',
        agreeToTerms: false
    });
    const [showOtp, setShowOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [isAnimating, setIsAnimating] = useState(false);

    // Animation effect on mount
    useEffect(() => {
        setIsAnimating(true);
    }, []);

    const validateForm = () => {
        const errors: Record<string, string> = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }

        // Email/Phone validation
        if (signupType === 'email') {
            if (!formData.email) {
                errors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = 'Please enter a valid email';
            }

            if (!showOtp) {
                if (!formData.password) {
                    errors.password = 'Password is required';
                } else if (formData.password.length < 6) {
                    errors.password = 'Password must be at least 6 characters';
                }

                if (!formData.confirmPassword) {
                    errors.confirmPassword = 'Please confirm your password';
                } else if (formData.password !== formData.confirmPassword) {
                    errors.confirmPassword = 'Passwords do not match';
                }
            }
        } else {
            if (!formData.phone) {
                errors.phone = 'Phone number is required';
            } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
                errors.phone = 'Please enter a valid 10-digit phone number';
            }
        }

        // OTP validation
        if (showOtp && !formData.otp) {
            errors.otp = 'OTP is required';
        }

        // Terms validation
        if (!formData.agreeToTerms) {
            errors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSendOtp = async () => {
        // Validate required fields before sending OTP
        const tempErrors: Record<string, string> = {};
        if (!formData.name.trim()) tempErrors.name = 'Name is required';
        if (!formData.phone) tempErrors.phone = 'Phone number is required';
        if (!formData.agreeToTerms) tempErrors.agreeToTerms = 'You must agree to the terms';

        if (Object.keys(tempErrors).length > 0) {
            setValidationErrors(tempErrors);
            return;
        }

        try {
            await sendOTP(formData.phone);
            setShowOtp(true);
        } catch (err) {
            console.error('Error sending OTP:', err);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (signupType === 'email') {
                await signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                });
            } else {
                await signup({
                    name: formData.name,
                    phone: formData.phone,
                    otp: formData.otp
                });
            }

            navigate('/', { replace: true });
        } catch (err) {
            console.error('Signup error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/15 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
            </div>

            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-all duration-300 hover:scale-105 z-20"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative">
                <div className="text-center space-y-8 px-12">
                    <div className="inline-flex items-center space-x-4 justify-center mb-8">
                        <div className="text-5xl">📚</div>
                        <span className="text-4xl font-bold font-poppins bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                            Storely
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
                    <p className="text-xl text-gray-300 leading-relaxed max-w-md">
                        Discover millions of books, connect with readers worldwide, and start your literary journey today.
                    </p>
                    <div className="flex items-center justify-center space-x-8 mt-12">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-teal-400">1M+</div>
                            <div className="text-sm text-gray-400">Books Available</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-teal-400">500K+</div>
                            <div className="text-sm text-gray-400">Happy Readers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-teal-400">50K+</div>
                            <div className="text-sm text-gray-400">Reviews</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8">
                <div className={`w-full max-w-md space-y-8 transform transition-all duration-1000 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                    {/* Mobile Header */}
                    <div className="text-center lg:hidden mb-8">
                        <div className="inline-flex items-center space-x-3 justify-center mb-6">
                            <div className="text-4xl">📚</div>
                            <span className="text-3xl font-bold font-poppins bg-gradient-to-r from-teal-400 to-green-400 bg-clip-text text-transparent">
                                Storely
                            </span>
                        </div>
                    </div>

                    {/* Form Header */}
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-3">Create Account</h1>
                        <p className="text-gray-400">Join us to start your reading journey</p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-300 hover:border-teal-500">
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                        <div className="flex space-x-3">
                            <button className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-300 hover:border-teal-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </button>
                            <button className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-600 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-white transition-all duration-300 hover:border-teal-500">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-900/50 border border-red-500/50 rounded-xl flex items-center space-x-3 text-red-300 backdrop-blur-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    {/* Signup Type Toggle */}
                    <div className="flex mb-6 bg-gray-800/50 p-1 rounded-xl border border-gray-600">
                        <Button
                            variant={signupType === 'email' ? 'default' : 'ghost'}
                            className={`flex-1 text-sm transition-all duration-300 ${signupType === 'email'
                                    ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-md hover:from-teal-700 hover:to-green-700'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                            onClick={() => {
                                setSignupType('email');
                                setShowOtp(false);
                                setFormData(prev => ({ ...prev, email: '', phone: '', password: '', confirmPassword: '', otp: '' }));
                                setValidationErrors({});
                            }}
                            disabled={isLoading}
                        >
                            <Mail className="w-4 h-4 inline mr-2" /> Email
                        </Button>
                        <Button
                            variant={signupType === 'phone' ? 'default' : 'ghost'}
                            className={`flex-1 text-sm transition-all duration-300 ${signupType === 'phone'
                                    ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-md hover:from-teal-700 hover:to-green-700'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                }`}
                            onClick={() => {
                                setSignupType('phone');
                                setShowOtp(false);
                                setFormData(prev => ({ ...prev, email: '', phone: '', password: '', confirmPassword: '', otp: '' }));
                                setValidationErrors({});
                            }}
                            disabled={isLoading}
                        >
                            <Phone className="w-4 h-4 inline mr-2" /> Phone
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Full Name"
                                    className={`pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500 ${validationErrors.name ? 'border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                            </div>
                            {validationErrors.name && (
                                <div className="flex items-center space-x-1 mt-1">
                                    <AlertCircle className="w-3 h-3 text-red-400" />
                                    <p className="text-red-400 text-xs">{validationErrors.name}</p>
                                </div>
                            )}
                        </div>

                        {/* Email Field */}
                        {signupType === 'email' && (
                            <div>
                                <div className="relative">
                                    <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Email Address"
                                        className={`pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500 ${validationErrors.email ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.email && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-3 h-3 text-red-400" />
                                        <p className="text-red-400 text-xs">{validationErrors.email}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Phone Field */}
                        {signupType === 'phone' && (
                            <div>
                                <div className="relative">
                                    <Phone className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Phone Number"
                                        className={`pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500 ${validationErrors.phone ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.phone && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-3 h-3 text-red-400" />
                                        <p className="text-red-400 text-xs">{validationErrors.phone}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Password Fields */}
                        {signupType === 'email' && !showOtp && (
                            <>
                                <div>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Password"
                                            className={`pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500 ${validationErrors.password ? 'border-red-500' : ''}`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {validationErrors.password && (
                                        <div className="flex items-center space-x-1 mt-1">
                                            <AlertCircle className="w-3 h-3 text-red-400" />
                                            <p className="text-red-400 text-xs">{validationErrors.password}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm Password"
                                            className={`pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {validationErrors.confirmPassword && (
                                        <div className="flex items-center space-x-1 mt-1">
                                            <AlertCircle className="w-3 h-3 text-red-400" />
                                            <p className="text-red-400 text-xs">{validationErrors.confirmPassword}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* OTP Field */}
                        {(signupType === 'phone' && showOtp) && (
                            <div>
                                <div className="relative">
                                    <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <Input
                                        type="text"
                                        name="otp"
                                        value={formData.otp}
                                        onChange={handleInputChange}
                                        placeholder="Enter OTP"
                                        className={`pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500 ${validationErrors.otp ? 'border-red-500' : ''}`}
                                        disabled={isLoading}
                                    />
                                </div>
                                {validationErrors.otp && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <AlertCircle className="w-3 h-3 text-red-400" />
                                        <p className="text-red-400 text-xs">{validationErrors.otp}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Terms and Conditions */}
                        <div className="flex items-start space-x-3">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                    className="sr-only"
                                    disabled={isLoading}
                                />
                                <div
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${formData.agreeToTerms
                                        ? 'bg-gradient-to-r from-teal-600 to-green-600 border-transparent shadow-md transform scale-105'
                                        : validationErrors.agreeToTerms
                                            ? 'border-red-500 hover:border-red-400'
                                            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/50'
                                        }`}
                                    onClick={() => !isLoading && handleInputChange({
                                        target: { name: 'agreeToTerms', type: 'checkbox', checked: !formData.agreeToTerms }
                                    } as React.ChangeEvent<HTMLInputElement>)}
                                >
                                    {formData.agreeToTerms && <Check className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div className="text-sm text-gray-400">
                                I agree to the{' '}
                                <Link to="/terms" className="text-teal-400 hover:text-teal-300 font-medium transition-colors underline-offset-2 hover:underline">
                                    Terms and Conditions
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-teal-400 hover:text-teal-300 font-medium transition-colors underline-offset-2 hover:underline">
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                        {validationErrors.agreeToTerms && (
                            <div className="flex items-center space-x-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-red-400" />
                                <p className="text-red-400 text-xs">{validationErrors.agreeToTerms}</p>
                            </div>
                        )}

                        {/* Send OTP Button */}
                        {(signupType === 'phone' && !showOtp) && (
                            <Button
                                type="button"
                                className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                onClick={handleSendOtp}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </Button>
                        )}

                        {/* Signup Button */}
                        {(signupType === 'email' || showOtp) && (
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-medium py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {showOtp ? 'Verifying...' : 'Creating Account...'}
                                    </>
                                ) : (
                                    showOtp ? 'Verify & Create Account' : 'Create Account'
                                )}
                            </Button>
                        )}
                    </form>

                    {/* Additional Links */}
                    <div className="mt-6 text-center">
                        <div className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors underline-offset-2 hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
