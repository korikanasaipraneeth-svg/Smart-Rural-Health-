import { safeParseUser } from '../utils/authUtils';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User, Activity, Calendar, FileText, Bell, Settings, LogOut, 
  Users, Building2, AlertTriangle, Stethoscope, CalendarCheck, Bot, 
  LineChart, MessageSquare, ScanLine, MapPin, Package, Droplet, Tent, Video, ShieldCheck, FileSpreadsheet
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = safeParseUser() || { role: 'admin' };
  const role = user?.role || 'patient';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const patientLinks = [
    { name: t('Overview'), path: '/dashboard/patient', icon: <LayoutDashboard size={20} /> },
    { name: 'My EHR', path: '/dashboard/patient/ehr', icon: <FileText size={20} /> },
    { name: 'Live Map', path: '/dashboard/patient/live-map', icon: <MapPin size={20} /> },
    { name: 'Blood Bank', path: '/dashboard/patient/blood-bank', icon: <Droplet size={20} /> },
    { name: 'Health Camps', path: '/dashboard/patient/camps', icon: <Tent size={20} /> },
    { name: 'Telemedicine', path: '/dashboard/patient/telemedicine', icon: <Video size={20} /> },
    { name: 'My Schemes', path: '/dashboard/patient/schemes', icon: <ShieldCheck size={20} /> },
    
    { name: t('Medical Records'), path: '/dashboard/patient/records', icon: <FileText size={20} /> },
    { name: t('Scan Document'), path: '/dashboard/patient/scan-document', icon: <ScanLine size={20} /> }
  ];

  const hospitalLinks = [
    { name: 'Overview', path: '/dashboard/hospital', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Map', path: '/dashboard/hospital#map', icon: <MapPin size={20} /> },
    { name: 'Hospital Profile', path: '/dashboard/hospital/profile', icon: <Building2 size={20} /> },
    { name: 'Doctor Mgmt', path: '/dashboard/hospital/doctors', icon: <Stethoscope size={20} /> },
    { name: 'Patients', path: '/dashboard/hospital/patients', icon: <Users size={20} /> },
    { name: 'Appointments', path: '/dashboard/hospital/appointments', icon: <Calendar size={20} /> },
    { name: 'Inventory & Blood Bank', path: '/dashboard/hospital/inventory', icon: <Package size={20} /> },
    { name: 'Health Camps', path: '/dashboard/hospital/camps', icon: <Tent size={20} /> },
    { name: 'Emergency Requests', path: '/dashboard/hospital/emergency', icon: <AlertTriangle size={20} /> },
    { name: 'Claims & Billing', path: '/dashboard/hospital/claims', icon: <FileSpreadsheet size={20} /> },
    { name: t('Emergency'), path: '/dashboard/hospital/emergency', icon: <AlertTriangle size={20} /> },
    { name: t('Bed Availability'), path: '/dashboard/hospital/beds', icon: <Activity size={20} /> }
  ];

  const adminLinks = [
    { name: 'Dashboard Overview', path: '/dashboard/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Live Map', path: '/dashboard/admin#map', icon: <MapPin size={20} /> },
    { name: 'Patient Management', path: '/dashboard/admin/users', icon: <Users size={20} /> },
    { name: 'Doctor Management', path: '/dashboard/admin/doctors', icon: <Stethoscope size={20} /> },
    { name: 'Hospital Management', path: '/dashboard/admin/hospitals', icon: <Building2 size={20} /> },
    { name: 'Appointments', path: '/dashboard/admin/appointments', icon: <CalendarCheck size={20} /> },
    { name: 'Disease Management', path: '/dashboard/admin/diseases', icon: <Activity size={20} /> },
    { name: 'AI Prediction', path: '/dashboard/admin/ai', icon: <Bot size={20} /> },
    { name: 'Supply Chain AI', path: '/dashboard/admin/supply-chain', icon: <Package size={20} /> },
    { name: 'Emergency', path: '/dashboard/admin/emergency', icon: <AlertTriangle size={20} /> },
    { name: 'Blood Bank Network', path: '/dashboard/admin/blood-bank', icon: <Droplet size={20} /> },
    { name: 'Health Camps', path: '/dashboard/admin/camps', icon: <Tent size={20} /> },
    { name: 'Claims Mgmt', path: '/dashboard/admin/claims', icon: <FileSpreadsheet size={20} /> },
    { name: 'Notifications', path: '/dashboard/admin/notifications', icon: <Bell size={20} /> },
    { name: 'Reports & Analytics', path: '/dashboard/admin/reports', icon: <LineChart size={20} /> },
    { name: 'Feedback Management', path: '/dashboard/admin/feedback', icon: <MessageSquare size={20} /> },
    { name: 'System Settings', path: '/dashboard/admin/settings', icon: <Settings size={20} /> },
    { name: 'Profile', path: '/dashboard/admin/profile', icon: <User size={20} /> },
  ];

  let linksToRender = [];
  if (role === 'admin') linksToRender = adminLinks;
  else if (role === 'hospital_admin' || role === 'hospital') linksToRender = hospitalLinks;
  else linksToRender = patientLinks;

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col h-full shadow-sm z-10 shrink-0 overflow-hidden">
      <div className="flex-grow py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="px-6 mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {role.replace('_', ' ')} Menu
          </p>
        </div>
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {linksToRender.map((link, idx) => (
            <NavLink 
              key={idx} 
              to={link.path}
              end={link.path === '/dashboard/patient' || link.path === '/dashboard/hospital' || link.path === '/dashboard/admin'}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium whitespace-nowrap group ${
                  isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                    {link.icon}
                  </div>
                  <span className="text-sm tracking-wide">{link.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-600 font-medium hover:bg-red-50 hover:text-red-700 rounded-xl transition-all shadow-sm border border-transparent hover:border-red-100"
        >
          <LogOut size={20} />
          <span className="text-sm tracking-wide">Logout</span>
        </button>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
      `}} />
    </aside>
  );
};

export default Sidebar;

