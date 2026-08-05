import { safeParseUser } from '../../utils/authUtils';
import React from 'react';
import { Users, UserPlus, Calendar, AlertTriangle, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import MapWidget from '../../components/MapWidget';
import { emergencyService } from '../../services/api';

const HospitalOverview = () => {
  const user = safeParseUser();
  const hospitalName = user?.full_name || 'Hospital Admin';
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await emergencyService.getRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRequests();
    
    // Poll every 5 seconds
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const weeklyAppts = [
    { day: 'Mon', appts: 45 },
    { day: 'Tue', appts: 52 },
    { day: 'Wed', appts: 38 },
    { day: 'Thu', appts: 65 },
    { day: 'Fri', appts: 48 },
    { day: 'Sat', appts: 70 },
    { day: 'Sun', appts: 20 },
  ];

  const bedData = [
    { name: 'Occupied', value: 120 },
    { name: 'Available', value: 45 },
    { name: 'Maintenance', value: 10 },
  ];
  const COLORS = ['#ef4444', '#22c55e', '#f59e0b'];

  return (
    <div className="container">
      <div className="mb-8">
        <h2 className="heading-2">Hospital Dashboard</h2>
        <p className="text-muted">Welcome back, {hospitalName}. Here is the overview of your facility.</p>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 mb-8">
        <DashboardWidget icon={<Users />} title="Total Patients" value="1,248" color="var(--color-primary)" />
        <DashboardWidget icon={<UserPlus />} title="Total Doctors" value="45" color="var(--color-secondary)" />
        <DashboardWidget icon={<Calendar />} title="Today's Appts" value="84" color="var(--color-accent)" />
        <DashboardWidget icon={<AlertTriangle />} title="Emergency Cases" value="2" color="var(--color-danger)" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-8 mb-8">
        <div className="glass-card flex flex-col">
          <h3 className="heading-4 mb-4">Weekly Appointments</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyAppts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="appts" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card flex flex-col">
          <h3 className="heading-4 mb-4">Bed Availability</h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-1 gap-8">
        <div className="glass-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="heading-4">Live Emergency Requests</h3>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">{requests.length} Active</span>
          </div>
          <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {requests.length > 0 ? requests.map(req => (
              <div key={req._id} className="p-4 bg-light rounded-md border border-red-200 border-l-4 border-l-red-500">
                <div className="flex justify-between">
                  <h4 className="font-semibold text-red-700">{req.condition}</h4>
                  <span className="text-sm text-red-500 font-medium">{req.status}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Patient: {req.patientName}</p>
                <p className="text-sm text-gray-600 mt-1">Ambulance: {req.assignedAmbulance}</p>
              </div>
            )) : (
              <p className="text-gray-500 italic p-4 text-center">No active emergencies.</p>
            )}
          </div>
        </div>

        <div className="glass-card">
          <h3 className="heading-4 mb-4">Pending Appointments</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-3 bg-light rounded-md border border-muted">
              <div className="bg-indigo-100 text-indigo-700 p-3 rounded-md text-center" style={{ minWidth: '70px' }}>
                <div className="font-bold">10:30</div>
                <div className="text-xs font-bold">AM</div>
              </div>
              <div>
                <h4 className="font-semibold">Ramesh Kumar</h4>
                <p className="text-sm text-muted">Consulting Dr. Sarah (Cardiology)</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-light rounded-md border border-muted">
              <div className="bg-indigo-100 text-indigo-700 p-3 rounded-md text-center" style={{ minWidth: '70px' }}>
                <div className="font-bold">11:15</div>
                <div className="text-xs font-bold">AM</div>
              </div>
              <div>
                <h4 className="font-semibold">Anjali Sharma</h4>
                <p className="text-sm text-muted">Consulting Dr. Mehta (Pediatrics)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Map Section */}
      <div id="map" className="mt-8">
        <div className="glass-card">
          <h3 className="heading-4 mb-4 flex items-center gap-2">
            Live Ambulance & Emergency Tracking
          </h3>
          <p className="text-sm text-muted mb-4">
            Monitoring active incoming emergency requests and your facility location.
          </p>
          <MapWidget 
            height="400px"
            center={[16.5062, 80.6480]} // Andhra Pradesh (Vijayawada)
            zoom={8}
            markers={[
              { lat: 16.5062, lng: 80.6480, title: hospitalName, description: "Your Hospital Location" },
              ...requests.map(r => ({
                lat: r.latitude || 16.5062,
                lng: r.longitude || 80.6480,
                title: r.patientName,
                description: `Emergency: ${r.condition}`
              }))
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const DashboardWidget = ({ icon, title, value, color }) => (
  <div className="glass-card flex items-center gap-4 p-6">
    <div className="p-4 rounded-full text-white" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-muted">{title}</p>
      <h3 className="heading-3">{value}</h3>
    </div>
  </div>
);

export default HospitalOverview;
