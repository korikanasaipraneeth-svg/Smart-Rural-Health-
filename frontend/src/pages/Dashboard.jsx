import { safeParseUser } from '../utils/authUtils';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, Pill, AlertTriangle, Building2, UserCircle, MapPin, Phone, FileText } from 'lucide-react';
import { patientPortalService } from '../services/api';
import MapWidget from '../components/MapWidget';

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await patientPortalService.getProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const user = safeParseUser();
    const userName = profile?.full_name || user?.full_name || 'Patient';

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Dashboard...</div>;

    const assignedHospital = profile?.assignedHospital;
    const assignedDoctor = profile?.assignedDoctor;
    const isAdmitted = profile?.status === 'Admitted';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {userName}. Here is your health overview.</p>
                </div>
                <Link to="/dashboard/patient/symptom-checker" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2">
                    <Activity size={20} /> AI Symptom Checker
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardWidget icon={<Calendar size={28} />} title="Appointments" value="0 Upcoming" color="bg-purple-100 text-purple-600" />
                <DashboardWidget icon={<Activity size={28} />} title="Health Status" value={isAdmitted ? "Admitted" : "Stable"} color={isAdmitted ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"} />
                <DashboardWidget icon={<Pill size={28} />} title="Prescriptions" value="2 Active" color="bg-blue-100 text-blue-600" />
                <DashboardWidget icon={<AlertTriangle size={28} />} title="Risk Level" value={profile?.medicalHistory?.riskLevel || "Low"} color="bg-red-100 text-red-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Hospital Assignment Card */}
                <div className="lg:col-span-2 space-y-8">
                    {assignedHospital ? (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                                <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Building2 size={48} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isAdmitted ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                            {isAdmitted ? 'Currently Admitted' : 'Registered Patient'}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{assignedHospital.name}</h2>
                                    <p className="text-gray-600 flex items-center gap-2 mb-1"><MapPin size={16} className="text-gray-400" /> {assignedHospital.address}, {assignedHospital.city}</p>
                                    <p className="text-gray-600 flex items-center gap-2 mb-4"><Phone size={16} className="text-gray-400" /> {assignedHospital.phone || 'Contact not available'}</p>
                                    
                                    {assignedDoctor && (
                                        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 mt-6">
                                            <div className="h-10 w-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                                                <UserCircle size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-medium">Assigned Primary Doctor</p>
                                                <p className="text-gray-900 font-bold">{assignedDoctor.name} ({assignedDoctor.specialization})</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
                            <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No Hospital Assigned</h3>
                            <p className="text-gray-500">You are not currently registered or admitted to any specific hospital.</p>
                        </div>
                    )}

                    {/* Quick Access */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/dashboard/patient/records" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-center gap-4">
                            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <FileText size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Medical Records</h3>
                                <p className="text-sm text-gray-500">View Prescriptions & Lab Reports</p>
                            </div>
                        </Link>
                        <Link to="/dashboard/patient/appointments" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex items-center gap-4">
                            <div className="h-14 w-14 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Appointments</h3>
                                <p className="text-sm text-gray-500">Book & Manage Consultations</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
                        <div className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <Calendar size={32} className="mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm">No upcoming appointments scheduled.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Health Tips</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <h4 className="font-semibold text-emerald-800">Stay Hydrated</h4>
                                <p className="text-sm text-emerald-600 mt-1">Drink at least 8 glasses of water daily to maintain optimal health.</p>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <h4 className="font-semibold text-blue-800">Regular Exercise</h4>
                                <p className="text-sm text-blue-600 mt-1">Aim for 30 minutes of moderate activity 5 times a week.</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Map Section */}
            <div id="map" className="mt-8">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="text-indigo-600" size={24} />
                        Route to Assigned Hospital
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Live routing from your current location to {assignedHospital?.name || 'the hospital'}.
                    </p>
                    <MapWidget 
                        height="400px"
                        // Dummy coords for patient (e.g. somewhere nearby) and hospital
                        routeOrigin={{ lat: 20.6, lng: 79.0 }} // Mock patient location
                        routeDestination={{ lat: 20.5937, lng: 78.9629 }} // Mock hospital location
                        markers={[
                            { lat: 20.6, lng: 79.0, title: "You are here", description: "Your current location" },
                            { lat: 20.5937, lng: 78.9629, title: assignedHospital?.name || "Hospital", description: "Assigned Hospital" }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

const DashboardWidget = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
        <div className={`p-4 rounded-2xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
    </div>
);

export default Dashboard;
