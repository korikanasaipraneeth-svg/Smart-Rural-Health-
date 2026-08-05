import React, { useState, useEffect } from 'react';
import { Tent, Search, MapPin, Building2, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminCamps = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        setLoading(true);
        try {
            const res = await adminService.getAllCamps();
            setCamps(res || []);
        } catch (error) {
            toast.error("Failed to fetch camps");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (campId, status) => {
        try {
            await adminService.updateCampStatus(campId, { status });
            toast.success(`Camp marked as ${status}`);
            fetchCamps();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const totalCamps = camps.length;
    const upcomingCamps = camps.filter(c => c.status === 'Upcoming' || c.status === 'Approved').length;
    const liveCamps = camps.filter(c => c.status === 'Live').length;

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Admin Dashboard...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Tent className="text-teal-600" size={32} />
                    District Health Camps Overview
                </h1>
                <p className="text-gray-500 mt-2">Monitor all mobile health camps organized by hospitals and NGOs across the district.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div><p className="text-sm font-medium text-gray-500">Total Camps</p><h3 className="text-3xl font-bold">{totalCamps}</h3></div>
                    <div className="p-4 bg-gray-50 text-gray-600 rounded-xl"><Tent size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div><p className="text-sm font-medium text-gray-500">Upcoming (Approved)</p><h3 className="text-3xl font-bold">{upcomingCamps}</h3></div>
                    <div className="p-4 bg-teal-50 text-teal-600 rounded-xl"><Calendar size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div><p className="text-sm font-medium text-gray-500">Live Right Now</p><h3 className="text-3xl font-bold">{liveCamps}</h3></div>
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><Activity size={24} /></div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">All Registered Camps</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-xs uppercase text-gray-500">
                                <th className="px-6 py-4">Camp Details</th>
                                <th className="px-6 py-4">Host Hospital</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {camps.map(camp => (
                                <tr key={camp._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{camp.name}</div>
                                        <div className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded inline-block mt-1">{camp.category}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium flex items-center gap-1"><Building2 size={14} className="text-gray-400"/> {camp.hospital?.name}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">{camp.location.village}</div>
                                        <div className="text-xs text-gray-500">{camp.location.district}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">{format(new Date(camp.date), 'MMM dd, yyyy')}</div>
                                        <div className="text-xs text-gray-500">{camp.startTime} - {camp.endTime}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            camp.status === 'Live' ? 'bg-indigo-100 text-indigo-700' :
                                            camp.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                                            camp.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-emerald-100 text-emerald-700'
                                        }`}>
                                            {camp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {camp.status === 'Upcoming' && (
                                            <button onClick={() => updateStatus(camp._id, 'Live')} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded font-bold hover:bg-indigo-100">Set Live</button>
                                        )}
                                        {(camp.status === 'Upcoming' || camp.status === 'Live') && (
                                            <button onClick={() => updateStatus(camp._id, 'Cancelled')} className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded font-bold hover:bg-red-100">Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {camps.length === 0 && (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No camps found in the district.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Simple Activity icon since it's used in the template but not imported from lucide-react in the top import if missed
function Activity(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

export default AdminCamps;
