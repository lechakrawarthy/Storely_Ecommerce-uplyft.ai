import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Phone, AlertCircle, Loader2, Eye, EyeOff, Lock, ArrowLeft } from '../utils/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { login, sendOTP, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({ email: '', phone: '', password: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation effect on mount
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (loginType === 'email') {
      if (!formData.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email';
      }

      if (!showOtp && !formData.password) {
        errors.password = 'Password is required';
      }
    } else {
      if (!formData.phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    if (showOtp && !formData.otp) {
      errors.otp = 'OTP is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    try {
      await sendOTP(formData.phone);
      setShowOtp(true);
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (loginType === 'email') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await login({ phone: formData.phone, otp: formData.otp });
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-all duration-300 hover:scale-105 z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      {/* Main Content */}
      <div className={`glass-card rounded-3xl p-8 w-full max-w-md relative z-10 transform transition-all duration-1000 ${
        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 justify-center mb-6 transform transition-all duration-700 hover:scale-105">
            <div className="text-4xl animate-bounce">📚</div>
            <span className="text-3xl font-bold font-poppins bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Storely
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 animate-fade-in-up">Welcome back!</h1>
          <p className="text-gray-600 animate-fade-in-up animation-delay-200">Sign in to continue your journey</p>
        </div>        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Login Type Toggle */}
        <div className="flex mb-8 glass-subtle p-1.5 rounded-2xl transition-all duration-300">
          <Button
            variant={loginType === 'email' ? 'default' : 'ghost'}
            className={`flex-1 text-sm font-medium transition-all duration-300 rounded-xl ${
              loginType === 'email' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setLoginType('email');
              setShowOtp(false);
              setFormData({ email: '', phone: '', password: '', otp: '' });
              setValidationErrors({});
            }}
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 mr-2" /> Email
          </Button>
          <Button
            variant={loginType === 'phone' ? 'default' : 'ghost'}
            className={`flex-1 text-sm font-medium transition-all duration-300 rounded-xl ${
              loginType === 'phone' 
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => {
              setLoginType('phone');
              setShowOtp(false);
              setFormData({ email: '', phone: '', password: '', otp: '' });
              setValidationErrors({});
            }}
            disabled={isLoading}
          >
            <Phone className="w-4 h-4 mr-2" /> Phone
          </Button>
        </div>        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          {loginType === 'email' && !showOtp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`pl-11 h-12 border-2 rounded-xl transition-all duration-300 focus:scale-[1.02] ${
                    validationErrors.email 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>
          )}

          {/* Phone Input */}
          {loginType === 'phone' && !showOtp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`pl-11 h-12 border-2 rounded-xl transition-all duration-300 focus:scale-[1.02] ${
                    validationErrors.phone 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.phone}
                </p>
              )}
            </div>
          )}

          {/* Password Input */}
          {loginType === 'email' && !showOtp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`pl-11 pr-11 h-12 border-2 rounded-xl transition-all duration-300 focus:scale-[1.02] ${
                    validationErrors.password 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>
          )}          {/* Send OTP Button */}
          {(loginType === 'phone' && !showOtp) && (
            <Button
              type="button"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              onClick={handleSendOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          )}

          {/* OTP Input */}
          {showOtp && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-sm font-medium text-gray-700">Enter OTP</label>
              <Input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="6-digit OTP"
                className={`h-12 border-2 rounded-xl text-center text-lg font-mono transition-all duration-300 focus:scale-[1.02] ${
                  validationErrors.otp 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-purple-500 hover:border-gray-300'
                }`}
                disabled={isLoading}
                maxLength={6}
              />
              {validationErrors.otp && (
                <p className="text-red-500 text-xs mt-1 animate-fade-in flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.otp}
                </p>
              )}
              <p className="text-xs text-gray-500 text-center">OTP sent to {formData.phone}</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {showOtp ? 'Verifying...' : 'Signing in...'}
              </>
            ) : (
              showOtp ? 'Verify & Login' : 'Sign In'
            )}
          </Button>
        </form>        {/* Additional Links */}
        <div className="mt-8 text-center space-y-4">
          {loginType === 'email' && (
            <Link 
              to="/forgot-password" 
              className="block text-sm text-purple-600 hover:text-purple-800 transition-colors duration-300 hover:underline"
            >
              Forgot your password?
            </Link>
          )}
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="text-purple-600 hover:text-purple-800 font-medium transition-all duration-300 hover:underline"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
