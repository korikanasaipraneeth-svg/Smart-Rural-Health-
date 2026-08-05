import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User } from 'lucide-react';

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative overflow-hidden py-20">
      
      {/* Animated Heartbeat Background (CSS handled in index.css or via Tailwind arbitrary variants) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-[2px] bg-indigo-200">
          <div className="h-full bg-indigo-500 w-1/4 animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <div className="z-10 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Welcome Back</h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">Please select your account type to continue to the Smart Rural Healthcare platform.</p>
      </div>

      <div className="z-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-6">
        
        {/* Hospital Card */}
        <div className="group relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-trangray-y-2 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-emerald-600 group-hover:scale-110 transition-transform duration-300">
            <Building2 size={48} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">Hospital Portal</h2>
          <p className="text-gray-600 mb-8 flex-grow relative z-10">
            For hospitals, clinics, PHCs, and healthcare organizations to manage patients, appointments, doctors, emergency requests, and hospital services.
          </p>
          
          <button 
            onClick={() => navigate('/login/hospital')}
            className="w-full py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all active:scale-95 relative z-10 cursor-pointer"
          >
            Continue as Hospital
          </button>
        </div>

        {/* Patient Card */}
        <div className="group relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-trangray-y-2 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            <User size={48} strokeWidth={1.5} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 relative z-10">Patient / Admin Portal</h2>
          <p className="text-gray-600 mb-8 flex-grow relative z-10">
            For patients and platform administrators. Log in to access your dashboard.
          </p>
          
          <button 
            onClick={() => navigate('/login/patient')}
            className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95 relative z-10 cursor-pointer"
          >
            Continue as User
          </button>
        </div>

      </div>
    </div>
  );
};

export default RoleSelection;