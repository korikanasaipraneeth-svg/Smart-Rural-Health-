import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Building2, Stethoscope, 
  Activity, Calendar, ShieldAlert, Bot, Download, Printer, Filter
} from 'lucide-react';
import { adminService } from '../../services/api';

export default function AdminReports() {
  const [dataCounts, setDataCounts] = useState({
    patients: 0, doctors: 0, hospitals: 0, diseases: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [p, d, h, dis] = await Promise.all([
          adminService.getPatients(),
          adminService.getDoctors(),
          adminService.getHospitals(),
          adminService.getDiseases()
        ]);
        setDataCounts({
          patients: (p.data || p || []).length,
          doctors: (d.data || d || []).length,
          hospitals: (h.data || h || []).length,
          diseases: (dis.data || dis || []).length,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Total Patients", value: dataCounts.patients, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Doctors", value: dataCounts.doctors, icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Hospitals", value: dataCounts.hospitals, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Appointments", value: Math.floor(dataCounts.patients * 0.4) || 12, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Diseases Tracked", value: dataCounts.diseases, icon: Activity, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "AI Predictions", value: dataCounts.patients * 2 + 10, icon: Bot, color: "text-teal-600", bg: "bg-teal-50" },
    { title: "Emergencies", value: Math.floor(dataCounts.patients * 0.1) || 3, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
    { title: "Active Users", value: dataCounts.patients + dataCounts.doctors, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor healthcare performance and generate professional reports.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
            <BarChart3 size={16} /> Generate Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            <Download size={16} /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-gray-400 border-r border-gray-200 pr-4">
          <Filter size={20} /> <span className="text-sm font-bold">Filters</span>
        </div>
        <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600">
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
        <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600">
          <option>All Districts</option>
          <option>Visakhapatnam</option>
          <option>Srikakulam</option>
        </select>
        <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600">
          <option>All Report Types</option>
          <option>Patient Analytics</option>
          <option>Hospital Performance</option>
        </select>
      </div>

      {/* Charts Area (Visual Placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Registration Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Registration Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {/* Simulating a bar chart */}
            {[40, 65, 45, 80, 55, 90, 75, 100, 85, 110, 95, 120].map((h, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t-sm hover:bg-blue-500 transition-colors relative group cursor-pointer" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                   {h * 12}
                 </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
        </div>

        {/* Chart 2: Disease Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top AI Predicted Diseases</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Dengue Fever</span>
                <span className="text-indigo-600">35%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Malaria</span>
                <span className="text-emerald-600">25%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Typhoid</span>
                <span className="text-amber-600">20%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Viral Infection</span>
                <span className="text-purple-600">15%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Other</span>
                <span className="text-gray-600">5%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Top Hospitals Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Top Performing Hospitals</h3>
          <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Hospital Name</th>
                <th className="px-6 py-4 font-semibold">Patients Treated</th>
                <th className="px-6 py-4 font-semibold">Doctors</th>
                <th className="px-6 py-4 font-semibold">Avg Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">Apollo Rural Health</p>
                  <p className="text-xs text-gray-500">Visakhapatnam</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">12,450</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">45</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700">4.9 / 5.0</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">District Govt Hospital</p>
                  <p className="text-xs text-gray-500">Srikakulam</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">8,920</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">28</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-bold rounded-md bg-green-100 text-green-700">4.6 / 5.0</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}