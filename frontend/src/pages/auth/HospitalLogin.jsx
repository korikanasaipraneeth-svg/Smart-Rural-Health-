import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';
import { authService } from '../../services/api';

import { toast } from 'react-hot-toast';

const HospitalLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const data = await authService.loginHospital({
        email: formData.identifier, // API uses email field for both email/username
        password: formData.password
      });
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Hospital login successful!');
      navigate('/dashboard/hospital');
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
              <Building2 size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Hospital Login</h2>
            <p className="mt-2 text-sm text-gray-600">
              Manage your healthcare facility
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-xl shadow-emerald-100/50 rounded-3xl sm:px-10 border border-white">

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hospital ID or Email</label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm bg-gray-50/50"
                    placeholder="Enter ID or email"
                    value={formData.identifier}
                    onChange={(e) => setFormData({...formData, identifier: e.target.value})}
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
                    className="appearance-none block w-full pl-10 px-3 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors sm:text-sm bg-gray-50/50"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Want to join our network?{' '}
                <Link to="/register/hospital" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Register Hospital
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
             <Link to="/login/patient" className="text-sm font-medium text-gray-500 hover:text-gray-700 inline-flex items-center gap-1">
               Are you a Patient? Switch to Patient Login <ArrowRight size={16} />
             </Link>
          </div>

        </div>
      </div>
      
      {/* Right Side Illustration */}
      <div className="hidden lg:block relative w-0 flex-1 bg-emerald-900">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-900 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-lg text-center text-white">
               <Building2 size={64} className="mx-auto mb-8 text-emerald-300 opacity-80" />
               <h2 className="text-4xl font-bold mb-4">Enterprise Hospital Management</h2>
               <p className="text-lg text-emerald-100">Streamline your operations. Manage doctors, beds, SOS emergency requests, and patient appointments efficiently in a unified dashboard.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;