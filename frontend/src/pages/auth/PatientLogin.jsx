import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeartPulse, Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../../services/api';

import { toast } from 'react-hot-toast';

const PatientLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const cleanData = {
          email: formData.email.trim(),
          password: formData.password.trim()
      };
      const data = await authService.loginPatient(cleanData);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      
      toast.success(data.user.role === 'admin' ? 'Welcome Admin!' : 'Login successful!');
      if (data.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/dashboard/patient');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex bg-gray-50">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 py-12">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-inner">
              <HeartPulse size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Patient Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Access your AI healthcare assistant
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-indigo-100/50 rounded-3xl sm:px-10 border border-white">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address or Mobile Number</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm bg-gray-50/50"
                    placeholder="Enter your email or mobile"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors sm:text-sm bg-gray-50/50"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                New to Smart Rural Health?{' '}
                <Link to="/register/patient" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Create Patient Account
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
             <Link to="/login/hospital" className="text-sm font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
               Are you a Hospital? Switch to Hospital Login <ArrowRight size={16} />
             </Link>
          </div>

        </div>
      </div>
      
      {/* Right Side Illustration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-lg text-center text-white">
               <HeartPulse size={64} className="mx-auto mb-8 text-indigo-300 opacity-80" />
               <h2 className="text-4xl font-bold mb-4">Your Health, Empowered by AI</h2>
               <p className="text-lg text-indigo-200">Get instant AI-driven disease predictions, find the best local doctors, and manage your medical records all in one secure platform designed for rural communities.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;