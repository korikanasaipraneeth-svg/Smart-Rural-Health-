import { safeParseUser } from '../../utils/authUtils';
import React, { useState, useEffect } from 'react';
import { 
  Users, Stethoscope, Building2, CalendarCheck, AlertTriangle, 
  Bot, Activity, Clock, FileWarning, TrendingUp, TrendingDown, MapPin
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { adminService } from '../../services/api';
import MapWidget from '../../components/MapWidget';

const AdminOverview = () => {
  const user = safeParseUser() || { name: 'Admin' };

  const [data, setData] = useState({
    patients: [],
    doctors: [],
    hospitals: [],
    diseases: []
  });
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const userGrowthData = [
    { name: 'Jan', patients: 40, doctors: 24 },
    { name: 'Feb', patients: 30, doctors: 13 },
    { name: 'Mar', patients: 200, doctors: 98 },
    { name: 'Apr', patients: 278, doctors: 100 },
    { name: 'May', patients: 400, doctors: 140 },
    { name: 'Jun', patients: 500, doctors: 200 },
    { name: 'Jul', patients: 600, doctors: 250 },
  ];

  const diseaseData = [
    { name: 'Viral Fever', value: 400 },
    { name: 'Malaria', value: 300 },
    { name: 'Typhoid', value: 300 },
    { name: 'Dengue', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [patients, doctors, hospitals, diseases] = await Promise.all([
          adminService.getPatients(),
          adminService.getDoctors(),
          adminService.getHospitals(),
          adminService.getDiseases()
        ]);
        setData({ patients, doctors, hospitals, diseases });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const totalPatients = data.patients.length;
  const totalDoctors = data.doctors.length;
  const totalHospitals = data.hospitals.length;
  const emergencyCases = data.patients.filter(p => p.risk === 'Emergency').length;
  const pendingDoctors = data.doctors.filter(d => d.verification === 'Pending');
  const pendingHospitals = data.hospitals.filter(h => h.verification === 'Pending');

  // Mocks for data not fully modeled yet (Appointments, AI)
  const todayAppts = Math.floor(totalPatients * 0.4);
  const aiPredictions = totalPatients * 2 + data.diseases.length * 10;
  const activeUsers = totalPatients + totalDoctors;

  const summaryCards = [
    { title: 'Total Patients', value: totalPatients.toLocaleString(), icon: <Users size={24} />, color: 'bg-blue-100 text-blue-600', trend: '+12%' },
    { title: 'Total Doctors', value: totalDoctors.toLocaleString(), icon: <Stethoscope size={24} />, color: 'bg-indigo-100 text-indigo-600', trend: '+5%' },
    { title: 'Total Hospitals', value: totalHospitals.toLocaleString(), icon: <Building2 size={24} />, color: 'bg-emerald-100 text-emerald-600', trend: '+2%' },
    { title: "Today's Appts", value: todayAppts.toLocaleString(), icon: <CalendarCheck size={24} />, color: 'bg-purple-100 text-purple-600', trend: '+8%' },
    { title: 'Emergency Cases', value: emergencyCases.toLocaleString(), icon: <AlertTriangle size={24} />, color: 'bg-red-100 text-red-600', trend: '-3%' },
    { title: 'AI Predictions', value: aiPredictions.toLocaleString(), icon: <Bot size={24} />, color: 'bg-cyan-100 text-cyan-600', trend: '+24%' },
    { title: 'Active Users', value: activeUsers.toLocaleString(), icon: <Activity size={24} />, color: 'bg-green-100 text-green-600', trend: '+18%' },
    { title: 'Pending Hospitals', value: pendingHospitals.length.toLocaleString(), icon: <Clock size={24} />, color: 'bg-amber-100 text-amber-600', trend: 'Needs Review' },
    { title: 'Pending Doctors', value: pendingDoctors.length.toLocaleString(), icon: <FileWarning size={24} />, color: 'bg-orange-100 text-orange-600', trend: 'Needs Review' },
  ];

  if (loading) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        <div>
          <div className="h-10 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name || 'Admin'}. Here is the system-wide overview.</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {card.trend.includes('+') ? (
                <TrendingUp size={16} className="text-emerald-500 mr-1" />
              ) : card.trend.includes('-') ? (
                <TrendingUp size={16} className="text-red-500 mr-1 transform rotate-180" />
              ) : null}
              <span className={
                card.trend.includes('+') ? 'text-emerald-600 font-medium' : 
                card.trend.includes('-') ? 'text-red-600 font-medium' : 'text-amber-600 font-medium'
              }>
                {card.trend}
              </span>
              <span className="text-gray-400 ml-2">{!card.trend.includes('Review') && 'vs last month'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
        {/* Left Column: Analytics & Reports (takes 2 cols) */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">System Analytics Overview</h2>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View Detailed Reports</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64 bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">User Growth</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="patients" stroke="#4f46e5" fillOpacity={1} fill="url(#colorPatients)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex flex-col">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Disease Distribution</h3>
                <div className="flex-1 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diseaseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {diseaseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'New Hospital Registered', desc: 'Sunrise Care Clinic submitted documents', time: '10 mins ago', color: 'bg-emerald-100 text-emerald-600' },
                { label: 'AI Alert Triggered', desc: 'High viral fever prediction in District 4', time: '25 mins ago', color: 'bg-red-100 text-red-600' },
                { label: 'Doctor Verified', desc: 'Dr. Sarah Jenkins approved by system', time: '1 hr ago', color: 'bg-blue-100 text-blue-600' },
                { label: '1,000+ Appts Booked', desc: 'Daily milestone reached', time: '2 hrs ago', color: 'bg-purple-100 text-purple-600' }
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className={`p-2 rounded-lg shrink-0 ${act.color}`}>
                     <Activity size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{act.label}</p>
                    <p className="text-xs text-gray-500">{act.desc}</p>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Emergency & Action Items (takes 1 col) */}
        <div className="space-y-6">
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 shadow-lg shadow-red-200 text-white">
             <div className="flex items-center gap-3 mb-6">
               <AlertTriangle className="animate-pulse" size={24} />
               <h2 className="text-lg font-bold">Live Emergency Panel</h2>
             </div>
             <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-red-100 font-medium uppercase tracking-wider mb-1">Active SOS Requests</p>
                  <p className="text-3xl font-bold">{emergencyCases > 0 ? emergencyCases : 12}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-red-100 font-medium uppercase tracking-wider mb-1">Ambulances Dispatched</p>
                  <p className="text-3xl font-bold">8</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-red-100 font-medium uppercase tracking-wider mb-1">Critical ICU Beds</p>
                  <p className="text-3xl font-bold">14 Available</p>
                </div>
             </div>
             <button className="w-full mt-6 bg-white text-red-600 py-3 rounded-xl font-bold shadow-md hover:bg-gray-50 transition-colors">
               Manage Emergencies
             </button>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Approvals</h2>
            <div className="space-y-4">
               {pendingHospitals.slice(0, 2).map((h, i) => (
                 <div key={`h-${i}`} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{h.name}</p>
                        <p className="text-xs text-gray-500">Reg: {h._id?.substring(0, 8).toUpperCase()}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">Pending</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-indigo-50 text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-100">Review</button>
                    </div>
                 </div>
               ))}
               {pendingDoctors.slice(0, 2).map((d, i) => (
                 <div key={`d-${i}`} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                        <p className="text-xs text-gray-500">{d.specialization}</p>
                      </div>
                      <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-md">Pending</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-indigo-50 text-indigo-600 text-xs font-bold py-2 rounded-lg hover:bg-indigo-100">Review</button>
                    </div>
                 </div>
               ))}
               {pendingHospitals.length === 0 && pendingDoctors.length === 0 && (
                 <div className="text-center py-4 text-gray-500 text-sm">
                   No pending approvals.
                 </div>
               )}
            </div>
            {(pendingHospitals.length + pendingDoctors.length) > 4 && (
              <button className="w-full mt-4 text-indigo-600 text-sm font-medium hover:text-indigo-700">
                 View all pending ({pendingHospitals.length + pendingDoctors.length})
              </button>
            )}
          </div>
        </div>
        {/* Admin Regional Map */}
        <div id="map" className="mt-8">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm dark:bg-slate-800 dark:border-slate-700">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 dark:text-white">
                    <MapPin className="text-indigo-600" size={24} />
                    Regional Hospital Overview
                </h3>
                <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                    Live map showing all registered hospitals and active emergency hotspots in the region.
                </p>
                <MapWidget 
                    height="450px"
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    markers={[
                        { lat: 19.0760, lng: 72.8777, title: "City Hospital (Mumbai)", description: "Active beds: 120" },
                        { lat: 28.7041, lng: 77.1025, title: "Metro Care (Delhi)", description: "Active beds: 85" },
                        { lat: 12.9716, lng: 77.5946, title: "HealthPlus (Bangalore)", description: "Active beds: 200" },
                        { lat: 13.0827, lng: 80.2707, title: "Life Line (Chennai)", description: "Active beds: 150" }
                    ]}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
