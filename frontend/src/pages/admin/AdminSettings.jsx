import React, { useState } from 'react';
import { 
  Settings, Shield, Bell, Mail, Database, Bot, 
  Palette, Globe, Lock, Key, Server, Save, RotateCcw, Cloud
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'security', label: 'Security & Roles', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email & SMS', icon: Mail },
    { id: 'ai', label: 'AI Configuration', icon: Bot },
    { id: 'database', label: 'Database & Backup', icon: Database },
    { id: 'appearance', label: 'Theme & Language', icon: Palette }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure application preferences, security, backups, and AI settings.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
            <Save size={16} /> Save Changes
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                activeTab === tab.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-100'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-white' : 'text-gray-400'} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
          
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Application Name</label>
                    <input type="text" defaultValue="Smart Rural Healthcare" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Organization Name</label>
                    <input type="text" defaultValue="Govt of Andhra Pradesh" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Support Email</label>
                    <input type="email" defaultValue="support@healthcare.ap.gov.in" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Support Phone</label>
                    <input type="text" defaultValue="104 (Toll Free)" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Branding</h2>
                <div className="flex gap-6 items-center">
                  <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400">
                    Logo
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">Upload New Logo</button>
                    <p className="text-xs text-gray-500 mt-2">Recommended size: 256x256px (PNG/SVG)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security & Roles */}
          {activeTab === 'security' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Lock size={20}/> Security Policies</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <p className="font-bold text-gray-900">Two-Factor Authentication (2FA)</p>
                      <p className="text-xs text-gray-500">Require all Admin and Doctor accounts to use 2FA.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <p className="font-bold text-gray-900">Session Timeout</p>
                      <p className="text-xs text-gray-500">Automatically log out inactive users after a set time.</p>
                    </div>
                    <select className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>1 Hour</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database & Backup */}
          {activeTab === 'database' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Database className="text-indigo-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900 text-lg">Production Database</h3>
                    <p className="text-sm text-indigo-700">Status: <span className="text-emerald-600 font-bold">Healthy (Connected)</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-indigo-900">4.2 GB</p>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Storage Used</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><Cloud size={20}/> Backup Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Automated Backup Schedule</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Daily at Midnight</option>
                      <option>Weekly (Sunday)</option>
                      <option>Manual Only</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full p-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                      <Save size={18} /> Backup Database Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['notifications', 'email', 'ai', 'appearance'].includes(activeTab) && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 animate-fade-in">
              <Settings size={48} className="opacity-20" />
              <p className="text-lg font-medium">Settings panel for {activeTab} will be implemented here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}