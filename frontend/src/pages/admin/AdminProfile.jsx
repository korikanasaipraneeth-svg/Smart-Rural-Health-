import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Briefcase, Calendar, 
  Shield, Key, Bell, Clock, Edit, Save, X, LogIn, Activity
} from 'lucide-react';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock Admin Data
  const adminData = {
    name: "Dr. K. Srinivas",
    role: "Super Admin",
    empId: "EMP-GOV-9012",
    department: "IT Infrastructure",
    email: "admin.srinivas@ap.gov.in",
    phone: "+91 9876543210",
    joinDate: "Jan 12, 2024",
    lastLogin: "Today, 09:42 AM",
    status: "Active",
    address: "Health Secretariat, Amaravati, AP",
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your personal information, account settings, and security preferences.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
              <Edit size={16} /> Edit Profile
            </button>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                <X size={16} /> Cancel
              </button>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm">
                <Save size={16} /> Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Profile Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 absolute w-full top-0 left-0"></div>
        
        <div className="relative pt-24 px-8 pb-8 flex flex-col md:flex-row gap-8 items-end">
          <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl relative shrink-0">
            <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-black text-indigo-600 overflow-hidden">
               {adminData.name.charAt(4)}
            </div>
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-black text-gray-900">{adminData.name}</h2>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-md uppercase tracking-wider">{adminData.role}</span>
            </div>
            <p className="text-gray-500 font-medium">{adminData.empId} • {adminData.department}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Info) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-indigo-600" size={20} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <input type="text" disabled={!isEditing} defaultValue={adminData.name} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" disabled={!isEditing} defaultValue={adminData.email} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" disabled={!isEditing} defaultValue={adminData.phone} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Office Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="text" disabled={!isEditing} defaultValue={adminData.address} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70" />
                </div>
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="text-indigo-600" size={20} /> Professional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><User size={20}/></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Employee ID</p>
                  <p className="font-bold text-gray-900">{adminData.empId}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Briefcase size={20}/></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Department</p>
                  <p className="font-bold text-gray-900">{adminData.department}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={20}/></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Joining Date</p>
                  <p className="font-bold text-gray-900">{adminData.joinDate}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Shield size={20}/></div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Access Level</p>
                  <p className="font-bold text-gray-900">Level 5 (Full Access)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Security & Activity) */}
        <div className="space-y-6">
          
          {/* Security Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Shield className="text-indigo-600" size={16} /> Security Settings
              </h3>
            </div>
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded-xl border border-gray-100 text-sm font-medium group">
                <div className="flex items-center gap-3">
                  <Key size={16} className="text-gray-400 group-hover:text-indigo-600" /> Change Password
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded-xl border border-gray-100 text-sm font-medium group">
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-gray-400 group-hover:text-indigo-600" /> Two-Factor Auth (2FA)
                </div>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Enabled</span>
              </button>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="text-indigo-600" size={16} /> Recent Activity
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="mt-1 p-1.5 bg-indigo-50 rounded-lg text-indigo-600 shrink-0"><LogIn size={14}/></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Logged into Admin Dashboard</p>
                  <p className="text-xs text-gray-500">Today, 09:42 AM • IP: 192.168.1.45</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 p-1.5 bg-emerald-50 rounded-lg text-emerald-600 shrink-0"><Save size={14}/></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Updated Hospital Settings</p>
                  <p className="text-xs text-gray-500">Yesterday, 16:30 PM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1 p-1.5 bg-purple-50 rounded-lg text-purple-600 shrink-0"><Bell size={14}/></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Resolved Feedback FB-003</p>
                  <p className="text-xs text-gray-500">Oct 22, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}