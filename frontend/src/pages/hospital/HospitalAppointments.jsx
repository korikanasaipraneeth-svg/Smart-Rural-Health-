import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import { hospitalProfileService } from '../../services/api';

export default function HospitalAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await hospitalProfileService.getAppointments();
            setAppointments(data || []);
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await hospitalProfileService.updateAppointmentStatus(id, status);
            // Refresh locally
            setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status } : apt));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update appointment status');
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'Pending');
    const confirmedAppointments = appointments.filter(a => a.status === 'Confirmed');
    const pastAppointments = appointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled');

    return (
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Appointments Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage incoming patient appointments and doctor schedules</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Section */}
                <div className="lg:col-span-1 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-amber-600">
                        <Clock size={24}/> Action Required ({pendingAppointments.length})
                    </h2>
                    {pendingAppointments.map(apt => (
                        <div key={apt._id} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{apt.patient?.full_name || 'Unknown Patient'}</h3>
                                    <p className="text-sm text-gray-500">{apt.patient?.phone || 'No Phone'}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold uppercase">{apt.type}</span>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-sm text-gray-600">
                                <p className="flex justify-between"><span className="text-gray-400">Date:</span> <span className="font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</span></p>
                                <p className="flex justify-between"><span className="text-gray-400">Time:</span> <span className="font-medium text-gray-900">{apt.time}</span></p>
                                <p className="flex justify-between"><span className="text-gray-400">Doctor:</span> <span className="font-medium text-gray-900">Dr. {apt.doctor?.name}</span></p>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100"><span className="font-bold block mb-1">Reason:</span> {apt.reason}</p>

                            <div className="flex gap-2">
                                <button onClick={() => handleUpdateStatus(apt._id, 'Confirmed')} className="flex-1 bg-[#0F9D58] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#0F9D58]/90 transition-colors flex items-center justify-center gap-1"><CheckCircle size={16}/> Confirm</button>
                                <button onClick={() => handleUpdateStatus(apt._id, 'Cancelled')} className="flex-1 bg-red-100 text-red-700 py-2 rounded-xl text-sm font-bold hover:bg-red-200 transition-colors flex items-center justify-center gap-1"><XCircle size={16}/> Cancel</button>
                            </div>
                        </div>
                    ))}
                    {pendingAppointments.length === 0 && (
                        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-200">
                            <p className="text-gray-500 text-sm">No pending appointments.</p>
                        </div>
                    )}
                </div>

                {/* Confirmed & Past Section */}
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-[#0F9D58] mb-4">
                            <Calendar size={24}/> Upcoming Confirmed ({confirmedAppointments.length})
                        </h2>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                                        <th className="p-4 font-medium">Patient</th>
                                        <th className="p-4 font-medium">Date & Time</th>
                                        <th className="p-4 font-medium">Doctor</th>
                                        <th className="p-4 font-medium">Type</th>
                                        <th className="p-4 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {confirmedAppointments.map(apt => (
                                        <tr key={apt._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900">{apt.patient?.full_name}</td>
                                            <td className="p-4 text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</td>
                                            <td className="p-4 text-gray-600">Dr. {apt.doctor?.name}</td>
                                            <td className="p-4"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">{apt.type}</span></td>
                                            <td className="p-4">
                                                <button onClick={() => handleUpdateStatus(apt._id, 'Completed')} className="bg-[#1976D2] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#1976D2]/90 shadow-sm">Mark Complete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {confirmedAppointments.length === 0 && (
                                        <tr><td colSpan="5" className="p-8 text-center text-gray-400">No confirmed appointments</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-500 mb-4">
                            <FileText size={24}/> Past Appointments ({pastAppointments.length})
                        </h2>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden opacity-70">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                                        <th className="p-4 font-medium">Patient</th>
                                        <th className="p-4 font-medium">Date</th>
                                        <th className="p-4 font-medium">Doctor</th>
                                        <th className="p-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastAppointments.slice(0, 10).map(apt => (
                                        <tr key={apt._id} className="border-b border-gray-50">
                                            <td className="p-4 text-gray-900">{apt.patient?.full_name}</td>
                                            <td className="p-4 text-gray-600">{new Date(apt.date).toLocaleDateString()}</td>
                                            <td className="p-4 text-gray-600">Dr. {apt.doctor?.name}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded font-medium ${apt.status === 'Completed' ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-600'}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
