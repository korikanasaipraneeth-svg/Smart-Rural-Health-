import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High Disease Activity', message: 'Unusual spike in Viral Fever reported in District 4.', time: '10 mins ago', read: false },
    { id: 2, type: 'warning', title: 'Hospital Registration', message: 'Sunrise Care Clinic submitted documents for verification.', time: '1 hour ago', read: false },
    { id: 3, type: 'success', title: 'System Update', message: 'Automated backup completed successfully.', time: '3 hours ago', read: true },
    { id: 4, type: 'info', title: 'New Doctor Registered', message: 'Dr. Sarah Jenkins is awaiting approval.', time: '5 hours ago', read: true },
    { id: 5, type: 'alert', title: 'Emergency SOS Triggered', message: 'Cardiac arrest SOS received near Central Station.', time: '1 day ago', read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <ShieldAlert className="text-red-500" size={24} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={24} />;
      case 'success': return <CheckCircle2 className="text-emerald-500" size={24} />;
      default: return <Info className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="text-indigo-600" /> Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage system alerts and updates</p>
        </div>
        <button 
          onClick={markAllRead}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-2"
        >
          <CheckCircle size={16} /> Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-6 transition-colors flex items-start gap-4 ${notif.read ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50/30 hover:bg-indigo-50/50'}`}
            >
              <div className="mt-1 shrink-0 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{notif.time}</span>
                </div>
                <p className="text-gray-600 mt-1 text-sm">{notif.message}</p>
              </div>
              {!notif.read && (
                <button 
                  onClick={() => markAsRead(notif.id)}
                  className="shrink-0 text-xs font-medium text-indigo-600 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}