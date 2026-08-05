import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, UploadCloud } from 'lucide-react';
import { authService } from '../../services/api';
import { toast } from 'react-hot-toast';

const HospitalRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '', regNumber: '', type: '', email: '',
    phone: '', emergencyNumber: '', state: '', district: '', city: '',
    address: '', departments: '', facilities: '', username: '',
    password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        ...formData,
        departments: formData.departments,
        facilities: formData.facilities,
      };
      const data = await authService.registerHospital(payload);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success('Hospital registered successfully!');
      navigate('/dashboard/hospital');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
            <Building2 size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register Hospital</h2>
          <p className="mt-2 text-sm text-gray-600">Join the Smart Rural Health network to reach more patients</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl py-8 px-6 shadow-xl shadow-emerald-100/50 rounded-3xl sm:px-10 border border-white">
          <form className="space-y-8" onSubmit={handleRegister}>
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                  <input required type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number (Govt.)</label>
                  <input required type="text" name="regNumber" value={formData.regNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Type</label>
                  <select required name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="">Select Type</option>
                    <option value="Government">Government Hospital</option>
                    <option value="Private">Private Hospital</option>
                    <option value="PHC">Primary Health Center (PHC)</option>
                    <option value="Clinic">Private Clinic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact & Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency 24/7 Number</label>
                  <input required type="tel" name="emergencyNumber" value={formData.emergencyNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input required type="text" name="district" value={formData.district} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City/Town/Village</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                  <textarea required name="address" rows="2" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
                </div>
              </div>
            </div>

            {/* Facilities & Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Facilities & Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departments (Comma separated)</label>
                  <input required type="text" name="departments" placeholder="e.g. Cardiology, Pediatrics, General" value={formData.departments} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Key Facilities</label>
                  <input required type="text" name="facilities" placeholder="e.g. ICU, Ambulance, 24/7 Pharmacy" value={formData.facilities} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Hospital License / Registration Certificate</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-emerald-500 transition-colors bg-gray-50/50 cursor-pointer">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500 px-2 py-1">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1 py-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Credentials */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Account Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input required type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-200 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? 'Creating Account...' : 'Create Hospital Account & Submit for Verification'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already a registered hospital?{' '}
              <Link to="/login/hospital" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign in to Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegister;