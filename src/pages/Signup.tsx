import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Phone, AlertCircle, Loader2, User, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative py-8">
            <Link to="/" className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 transition-colors">← Home</Link>

            <div className="glass-card rounded-3xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-3 justify-center mb-4">
                        <div className="text-4xl">📚</div>
                        <span className="text-2xl font-bold font-poppins text-gray-800">S torely.</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us to start your reading journey</p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {/* Signup Type Toggle */}
                <div className="flex mb-6 glass-subtle p-1 rounded-full">
                    <Button
                        variant={signupType === 'email' ? 'default' : 'ghost'}
                        className="flex-1 text-sm"
                        onClick={() => {
                            setSignupType('email');
                            setShowOtp(false);
                            setFormData(prev => ({ ...prev, email: '', phone: '', password: '', confirmPassword: '', otp: '' }));
                            setValidationErrors({});
                        }}
                        disabled={isLoading}
                    >
                        <Mail className="w-4 h-4 inline mr-1" /> Email
                    </Button>
                    <Button
                        variant={signupType === 'phone' ? 'default' : 'ghost'}
                        className="flex-1 text-sm"
                        onClick={() => {
                            setSignupType('phone');
                            setShowOtp(false);
                            setFormData(prev => ({ ...prev, email: '', phone: '', password: '', confirmPassword: '', otp: '' }));
                            setValidationErrors({});
                        }}
                        disabled={isLoading}
                    >
                        <Phone className="w-4 h-4 inline mr-1" /> Phone
                    </Button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                className={`pl-10 ${validationErrors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                                disabled={isLoading}
                            />
                        </div>
                        {validationErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Email Input */}
                    {signupType === 'email' && (
                        <div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    className={`pl-10 ${validationErrors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                            )}
                        </div>
                    )}

                    {/* Phone Input */}
                    {signupType === 'phone' && !showOtp && (
                        <div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Phone Number"
                                    className={`pl-10 ${validationErrors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                                    disabled={isLoading}
                                />
                            </div>
                            {validationErrors.phone && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                            )}
                        </div>
                    )}

                    {/* Password Inputs */}
                    {signupType === 'email' && (
                        <>
                            <div>
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password"
                                    className={validationErrors.password ? 'border-red-300 focus:border-red-500' : ''}
                                    disabled={isLoading}
                                />
                                {validationErrors.password && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm Password"
                                    className={validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}
                                    disabled={isLoading}
                                />
                                {validationErrors.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* OTP Input */}
                    {showOtp && (
                        <div>
                            <Input
                                type="text"
                                name="otp"
                                value={formData.otp}
                                onChange={handleInputChange}
                                placeholder="Enter OTP"
                                className={validationErrors.otp ? 'border-red-300 focus:border-red-500' : ''}
                                disabled={isLoading}
                            />
                            {validationErrors.otp && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.otp}</p>
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
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${formData.agreeToTerms
                                    ? 'bg-sage-600 border-sage-600'
                                    : validationErrors.agreeToTerms
                                        ? 'border-red-300'
                                        : 'border-gray-300'
                                    }`} onClick={() => !isLoading && handleInputChange({
                                        target: { name: 'agreeToTerms', type: 'checkbox', checked: !formData.agreeToTerms }
                                    } as React.ChangeEvent<HTMLInputElement>)}
                            >
                                {formData.agreeToTerms && <Check className="w-3 h-3 text-white" />}
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            I agree to the{' '}
                            <Link to="/terms" className="text-pastel-600 hover:text-pastel-800">
                                Terms and Conditions
                            </Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-pastel-600 hover:text-pastel-800">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                    {validationErrors.agreeToTerms && (
                        <p className="text-red-500 text-xs">{validationErrors.agreeToTerms}</p>
                    )}

                    {/* Send OTP Button */}
                    {(signupType === 'phone' && !showOtp) && (
                        <Button
                            type="button"
                            variant="default"
                            className="w-full"
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
                            variant="default"
                            className="w-full"
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
                    <div className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-sage-600 hover:text-sage-800 font-medium">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
