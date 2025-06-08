import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Phone, AlertCircle, Loader2 } from '../utils/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login, sendOTP, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({ email: '', phone: '', password: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
      <Link to="/" className="absolute top-6 left-6 text-gray-700 hover:text-gray-900 transition-colors">← Home</Link>

      <div className="glass-card rounded-3xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 justify-center mb-4">
            <div className="text-4xl">📚</div>
            <span className="text-2xl font-bold font-poppins text-gray-800">S torely.</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Type Toggle */}
        <div className="flex mb-6 glass-subtle p-1 rounded-full">
          <Button
            variant={loginType === 'email' ? 'default' : 'ghost'}
            className="flex-1 text-sm"
            onClick={() => {
              setLoginType('email');
              setShowOtp(false);
              setFormData({ email: '', phone: '', password: '', otp: '' });
              setValidationErrors({});
            }}
            disabled={isLoading}
          >
            <Mail className="w-4 h-4 inline mr-1" /> Email
          </Button>
          <Button
            variant={loginType === 'phone' ? 'default' : 'ghost'}
            className="flex-1 text-sm"
            onClick={() => {
              setLoginType('phone');
              setShowOtp(false);
              setFormData({ email: '', phone: '', password: '', otp: '' });
              setValidationErrors({});
            }}
            disabled={isLoading}
          >
            <Phone className="w-4 h-4 inline mr-1" /> Phone
          </Button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          {loginType === 'email' && !showOtp && (
            <div>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={validationErrors.email ? 'border-red-300 focus:border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
              )}
            </div>
          )}

          {/* Phone Input */}
          {loginType === 'phone' && !showOtp && (
            <div>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className={validationErrors.phone ? 'border-red-300 focus:border-red-500' : ''}
                disabled={isLoading}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
              )}
            </div>
          )}

          {/* Password Input */}
          {loginType === 'email' && !showOtp && (
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
          )}

          {/* Send OTP Button */}
          {(loginType === 'phone' && !showOtp) && (
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

          {/* Login Button */}
          <Button
            type="submit"
            variant="default"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {showOtp ? 'Verifying...' : 'Signing in...'}
              </>
            ) : (
              showOtp ? 'Verify & Login' : 'Login'
            )}
          </Button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center space-y-2">
          {loginType === 'email' && (
            <Link to="/forgot-password" className="text-sm text-pastel-600 hover:text-pastel-800">
              Forgot your password?
            </Link>
          )}
          <div className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-sage-600 hover:text-sage-800 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
