import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, CheckCircle, XCircle, Phone, Activity } from 'lucide-react';
import { emergencyService } from '../../services/api';

export default function EmergencyRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ pending: 0, accepted: 0 });

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await emergencyService.getRequests();
            setRequests(data);
            setStats({
                pending: data.filter(r => r.status === 'Pending').length,
                accepted: data.filter(r => r.status === 'Accepted').length
            });
        } catch (error) {
            console.error('Failed to fetch emergency requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await emergencyService.updateStatus(id, status);
            fetchRequests(); // Refresh
        } catch (error) {
            console.error('Update status error:', error);
            alert('Failed to update status');
        }
    };

    const handleCreateFake = async () => {
        try {
            await emergencyService.createFakeEmergency();
            fetchRequests();
        } catch (error) {
            alert('Failed to create fake emergency');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <AlertTriangle className="text-red-500" size={32} /> Emergency Requests
                    </h1>
                    <p className="text-gray-500 mt-1">Live feed of incoming emergency cases from ambulances</p>
                </div>
                <button 
                    onClick={handleCreateFake}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                >
                    + Generate Test Emergency
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center justify-between">
                    <div>
                        <p className="text-red-600 font-medium mb-1">Pending Critical Alerts</p>
                        <h3 className="text-4xl font-bold text-red-700">{stats.pending}</h3>
                    </div>
                    <div className="h-16 w-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <Activity size={32} />
                    </div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div>
                        <p className="text-emerald-600 font-medium mb-1">Active Rescues (Accepted)</p>
                        <h3 className="text-4xl font-bold text-emerald-700">{stats.accepted}</h3>
                    </div>
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={32} />
                    </div>
                </div>
            </div>

            {/* Emergency Feed */}
            <div className="space-y-4">
                {loading && requests.length === 0 ? (
                    <div className="text-center p-12 text-gray-400">Loading live feed...</div>
                ) : requests.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-3xl border border-gray-100">
                        <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-600">No Emergency Requests</h3>
                        <p className="text-gray-400">Your hospital currently has no active incoming emergencies.</p>
                    </div>
                ) : (
                    requests.map((req) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={req._id} 
                            className={`bg-white rounded-2xl border-l-4 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                                req.status === 'Pending' ? 'border-l-red-500' : 
                                req.status === 'Accepted' ? 'border-l-emerald-500' : 
                                'border-l-gray-300 opacity-60'
                            }`}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        req.status === 'Pending' ? 'bg-red-100 text-red-700 animate-pulse' :
                                        req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {req.status}
                                    </span>
                                    <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} /> {new Date(req.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{req.condition}</h3>
                                <p className="text-gray-600 flex items-center gap-4">
                                    <span className="flex items-center gap-1"><MapPin size={16} className="text-gray-400" /> ETA: {req.expectedArrivalTime}</span>
                                    <span className="flex items-center gap-1"><Phone size={16} className="text-gray-400" /> {req.contactNumber}</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Patient: {req.patientName} • Ambulance: {req.assignedAmbulance}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {req.status === 'Pending' && (
                                    <>
                                        <button 
                                            onClick={() => handleStatusUpdate(req._id, 'Accepted')}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} /> Accept Case
                                        </button>
                                        <button 
                                            onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                                            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={18} /> Reject (Full)
                                        </button>
                                    </>
                                )}
                                {req.status === 'Accepted' && (
                                    <button 
                                        onClick={() => handleStatusUpdate(req._id, 'Resolved')}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all"
                                    >
                                        Mark as Resolved / Admitted
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}