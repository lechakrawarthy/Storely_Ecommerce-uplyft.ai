import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Eye, EyeOff, Loader2, ArrowLeft } from '../utils/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Signup = () => {
    const { signup, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }; const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            console.error('Passwords do not match');
            return;
        }
        try {
            await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            // Only navigate if signup was actually successful (no errors in context)
            if (!error) {
                console.log('Signup successful, redirecting to homepage');
                navigate('/');
            } else {
                console.error('Signup failed:', error);
                // Error is already set in context, UI will display it
            }
        } catch (err) {
            console.error('Signup failed:', err);
            // Don't navigate on error - let the error display in the UI
        }
    }; return (<div className="min-h-screen bg-black flex relative overflow-hidden">
        {/* Back to Home Button */}
        <Link
            to="/"
            className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-green-400 transition-all duration-300 hover:scale-105 z-20"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
        </Link>

        {/* Error Display */}
        {error && (
            <div className="absolute top-6 right-6 bg-red-500/90 text-white px-4 py-2 rounded-md z-50 max-w-xs">
                <p className="font-medium">Signup Error</p>
                <p className="text-sm">{error}</p>
            </div>
        )}

        {/* Decorative curved borders */}
        <div className="absolute inset-0 pointer-events-none z-0">
            {/* Top left large curved border */}
            <div className="absolute top-0 left-0">
                <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
                    <path d="M0 0H300C134.315 0 0 134.315 0 300V0Z" fill="url(#signupGradient1)" />
                    <defs>
                        <linearGradient id="signupGradient1" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                            <stop offset="50%" stopColor="#059669" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#047857" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Top left inner curved border */}
            <div className="absolute top-0 left-0">
                <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                    <path d="M0 0H180C80.5939 0 0 80.5939 0 180V0Z" stroke="url(#signupGradientStroke1)" strokeWidth="2" fill="none" />
                    <defs>
                        <linearGradient id="signupGradientStroke1" x1="0" y1="0" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#34D399" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom right large curved border */}
            <div className="absolute bottom-0 right-0 rotate-180">
                <svg width="280" height="280" viewBox="0 0 280 280" fill="none">
                    <path d="M0 0H280C125.228 0 0 125.228 0 280V0Z" fill="url(#signupGradient2)" />
                    <defs>
                        <linearGradient id="signupGradient2" x1="0" y1="0" x2="280" y2="280" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#059669" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#047857" stopOpacity="0.03" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Bottom right inner curved border */}
            <div className="absolute bottom-0 right-0 rotate-180">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                    <path d="M0 0H160C71.6344 0 0 71.6344 0 160V0Z" stroke="url(#signupGradientStroke2)" strokeWidth="1.5" fill="none" />
                    <defs>
                        <linearGradient id="signupGradientStroke2" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Animated floating elements */}
            <div className="absolute top-1/4 right-1/4 animate-pulse">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400/30 to-green-600/20 rounded-full border border-green-400/40"></div>
            </div>
            <div className="absolute bottom-1/3 left-1/4 animate-pulse delay-700">
                <div className="w-6 h-6 bg-gradient-to-br from-green-300/25 to-green-500/15 rounded-full border border-green-300/30"></div>
            </div>
            <div className="absolute top-1/3 left-1/3 animate-pulse delay-300">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500/20 to-green-700/10 rounded-full border border-green-400/25"></div>
            </div>

            {/* Additional curved accent lines */}
            <div className="absolute top-1/2 left-0">
                <svg width="100" height="200" viewBox="0 0 100 200" fill="none">
                    <path d="M0 0C55.2285 0 100 44.7715 100 100S44.7715 200 0 200" stroke="url(#signupAccentGradient1)" strokeWidth="1" fill="none" opacity="0.3" />
                    <defs>
                        <linearGradient id="signupAccentGradient1" x1="0" y1="0" x2="100" y2="200" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div className="absolute bottom-0 right-1/2">
                <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                    <path d="M0 100C0 44.7715 44.7715 0 100 0S200 44.7715 200 100" stroke="url(#signupAccentGradient2)" strokeWidth="1" fill="none" opacity="0.2" />
                    <defs>
                        <linearGradient id="signupAccentGradient2" x1="0" y1="100" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>

        {/* Left Panel - Sign Up Form */}
        <div className="w-1/2 bg-black flex items-center justify-center p-12 relative z-10">
            <div className="w-full max-w-md bg-black rounded-3xl p-8">{/* Brand */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white mb-2">storely</h1>
                </div>

                {/* Welcome Message */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join storely and start shopping</p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Sign Up Form */}
                <form onSubmit={handleSignup} className="space-y-6">
                    {/* Name Input */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-4 py-3 bg-white border-0 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="chakrawarthy"
                            required
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Email
                        </label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full px-4 py-3 bg-white border-0 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="chakrawarthy@gmail.com"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-0 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                                placeholder="••••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-white text-sm font-medium mb-2">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className="w-full px-4 py-3 bg-white border-0 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                                placeholder="••••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Sign Up Button */}
                    <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Creating Account...
                            </div>
                        ) : (
                            'Sign up'
                        )}            </Button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                    <Link to="/login" className="text-white text-sm hover:underline">
                        Already have an account? Sign in
                    </Link>
                </div>
            </div>
        </div>            {/* Right Panel - Welcome Message */}
        <div className="w-1/2 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center p-12 relative overflow-hidden">                {/* Decorative curved borders for right panel */}
            <div className="absolute inset-0 pointer-events-none z-0">
                {/* Top right large curved accent */}
                <div className="absolute top-0 right-0">
                    <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                        <path d="M220 0V220C220 98.4975 121.502 0 0 0H220Z" fill="url(#signupRightGradient1)" />
                        <defs>
                            <linearGradient id="signupRightGradient1" x1="220" y1="0" x2="0" y2="220" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Top right stroke border */}
                <div className="absolute top-0 right-0">
                    <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
                        <path d="M150 0V150C150 67.1573 82.8427 0 0 0H150Z" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                    </svg>
                </div>

                {/* Bottom left large curved accent */}
                <div className="absolute bottom-0 left-0 rotate-180">
                    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                        <path d="M180 0V180C180 80.5939 99.4061 0 0 0H180Z" fill="url(#signupRightGradient2)" />
                        <defs>
                            <linearGradient id="signupRightGradient2" x1="180" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.08" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Bottom left stroke border */}
                <div className="absolute bottom-0 left-0 rotate-180">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                        <path d="M120 0V120C120 53.7258 66.2742 0 0 0H120Z" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
                    </svg>
                </div>

                {/* Floating enhanced decorative dots */}
                <div className="absolute top-1/4 left-1/4 animate-pulse">
                    <div className="w-5 h-5 bg-white/30 rounded-full border border-white/50 shadow-lg"></div>
                </div>
                <div className="absolute bottom-1/4 right-1/3 animate-pulse delay-1000">
                    <div className="w-3 h-3 bg-white/25 rounded-full border border-white/40 shadow-md"></div>
                </div>
                <div className="absolute top-1/2 right-1/4 animate-pulse delay-500">
                    <div className="w-6 h-6 bg-white/20 rounded-full border border-white/35 shadow-lg"></div>
                </div>

                {/* Additional curved flow lines */}
                <div className="absolute top-0 left-1/2">
                    <svg width="150" height="150" viewBox="0 0 150 150" fill="none">
                        <path d="M75 0C116.421 0 150 33.5786 150 75S116.421 150 75 150" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none" />
                    </svg>
                </div>

                <div className="absolute bottom-1/3 right-0">
                    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                        <path d="M120 100C120 44.7715 75.2285 0 20 0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
                    <div className="w-full h-full border-2 border-white rounded-full"></div>
                    <div className="absolute top-8 left-8 right-8 bottom-8 border border-white rounded-full"></div>
                    <div className="absolute top-16 left-16 right-16 bottom-16 border border-white rounded-full"></div>
                </div>
            </div>

            <div className="relative z-10 text-white max-w-lg">          {/* Main Heading */}
                <div className="mb-12">
                    <h2 className="text-4xl font-bold mb-4">
                        Join Our<br />
                        Shopping Community.
                    </h2>
                    <div className="w-16 h-1 bg-white rounded"></div>
                </div>

                {/* Quote */}
                <div className="mb-8">
                    <p className="text-lg leading-relaxed mb-6">
                        "Start your shopping journey with storely today. Discover amazing
                        electronics, books, and textiles at unbeatable prices."
                    </p>

                    <div className="mb-8">
                        <h4 className="font-semibold text-lg">Michael Chen</h4>
                        <p className="text-green-100">Product Manager at storely</p>
                    </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex space-x-3 mb-8">
                    <button className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>          {/* Bottom Card */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">Start shopping today and unlock exclusive deals</h3>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-green-100 mb-4">
                        Join thousands of satisfied customers who have found their perfect
                        products with our curated selection.
                    </p>
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-gray-600 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                            +9k
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Signup;
