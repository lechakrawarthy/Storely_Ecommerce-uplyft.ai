import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({ email: '', phone: '', password: '', otp: '' });
  const [showOtp, setShowOtp] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSendOtp = () => setShowOtp(true);
  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); /* login logic */ };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
      <Link to="/" className="absolute top-6 left-6 text-gray-700 hover:text-gray-900">← Home</Link>
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 justify-center mb-4">
            <div className="text-4xl">🌟</div>
            <span className="text-2xl font-bold font-poppins text-gray-800">BookBuddy</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>
        <div className="flex mb-6 bg-gray-100 p-1 rounded-full">
          <Button variant={loginType === 'email' ? 'default' : 'ghost'} className="flex-1 text-sm" onClick={() => setLoginType('email')}>
            <Mail className="w-4 h-4 inline mr-1" /> Email
          </Button>
          <Button variant={loginType === 'phone' ? 'default' : 'ghost'} className="flex-1 text-sm" onClick={() => setLoginType('phone')}>
            <Phone className="w-4 h-4 inline mr-1" /> Phone
          </Button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {loginType === 'email' && !showOtp && (
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
            />
          )}
          {loginType === 'phone' && !showOtp && (
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
          )}
          {loginType === 'email' && !showOtp && (
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
          )}
          {(loginType === 'phone' && !showOtp) && (
            <Button type="button" variant="default" className="w-full" onClick={handleSendOtp}>
              Send OTP
            </Button>
          )}
          {showOtp && (
            <Input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter OTP"
            />
          )}
          <Button type="submit" variant="default" className="w-full">
            {showOtp ? 'Verify & Login' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
