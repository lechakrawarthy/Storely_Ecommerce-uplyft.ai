
import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    otp: ''
  });
  const [showOtp, setShowOtp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendOtp = () => {
    setShowOtp(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-cream-50 via-lavender-50 to-sage-50">
      {/* Floating 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Love floating hearts */}
        <div className="floating-element love-element absolute top-20 left-16 text-4xl animate-float">
          💖
        </div>
        <div className="floating-element love-element absolute bottom-32 right-20 text-3xl animate-float" style={{ animationDelay: '2s' }}>
          💕
        </div>
        
        {/* Horror elements */}
        <div className="floating-element horror-element absolute top-40 right-16 text-3xl animate-wiggle">
          👻
        </div>
        <div className="floating-element horror-element absolute bottom-60 left-10 text-2xl animate-wiggle" style={{ animationDelay: '1.5s' }}>
          🦇
        </div>
        
        {/* Funny elements */}
        <div className="floating-element funny-element absolute top-60 left-1/4 text-3xl animate-bounce-gentle">
          😄
        </div>
        <div className="floating-element funny-element absolute bottom-40 right-1/3 text-2xl animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          🎭
        </div>
        
        {/* Adventure elements */}
        <div className="floating-element adventure-element absolute top-32 right-1/3 text-3xl animate-float">
          🗺️
        </div>
        <div className="floating-element adventure-element absolute bottom-20 left-1/3 text-2xl animate-float" style={{ animationDelay: '3s' }}>
          ⛰️
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-24 left-1/2 w-32 h-32 bg-gradient-to-r from-lavender-200 to-sage-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-32 right-1/4 w-24 h-24 bg-gradient-to-r from-gold-200 to-lavender-200 rounded-full opacity-30 animate-wiggle"></div>
        <div className="absolute top-1/2 left-20 w-20 h-20 bg-gradient-to-r from-sage-200 to-gold-200 rounded-full opacity-25 animate-bounce-gentle"></div>
      </div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-lavender-600 hover:text-lavender-700 transition-colors duration-200 glass p-3 rounded-full"
        >
          <ArrowRight className="w-5 h-5 rotate-180" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Login Container */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12 relative z-10">
        <div className="glass w-full max-w-md p-8 rounded-3xl shadow-soft">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="text-4xl">🌟</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full animate-sparkle"></div>
              </div>
              <span className="text-2xl font-bold font-poppins">
                <span className="bg-gradient-to-r from-lavender-600 to-lavender-700 bg-clip-text text-transparent">Book</span>
                <span className="bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent">Buddy</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
            <p className="text-gray-600">Sign in to continue your reading journey</p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex mb-6 p-1 bg-cream-100 rounded-full">
            <button
              type="button"
              onClick={() => setLoginType('email')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                loginType === 'email'
                  ? 'bg-white shadow-soft text-lavender-600'
                  : 'text-gray-600 hover:text-lavender-600'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginType('phone')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                loginType === 'phone'
                  ? 'bg-white shadow-soft text-lavender-600'
                  : 'text-gray-600 hover:text-lavender-600'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginType === 'email' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 Enter your phone"
                    required
                  />
                </div>
              </div>
            )}

            {loginType === 'email' && !showOtp && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
            )}

            {(loginType === 'phone' || showOtp) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {showOtp ? 'Enter OTP' : 'We\'ll send you an OTP'}
                </label>
                {!showOtp ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-3 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-xl font-medium hover:shadow-soft-hover transition-all duration-200"
                  >
                    Send OTP
                  </button>
                ) : (
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lavender-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {(loginType === 'email' || showOtp) && (
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-lavender-500 to-sage-500 text-white rounded-xl font-medium hover:shadow-soft-hover transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {loginType === 'email' && (
              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-lavender-600 hover:text-lavender-700 transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"></div>
            <span>Continue with Google</span>
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-lavender-600 hover:text-lavender-700 font-medium transition-colors duration-200">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
