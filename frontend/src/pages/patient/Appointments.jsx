import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Search, Plus, X } from 'lucide-react';
import { patientPortalService } from '../../services/api';

export default function Appointments() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    
    // Booking Modal State
    const [isBookingMode, setIsBookingMode] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [doctors, setDoctors] = useState([]);
    
    const [formData, setFormData] = useState({
        hospital: '',
        doctor: '',
        date: '',
        time: '',
        type: 'Consultation',
        reason: ''
    });

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await patientPortalService.getAppointments();
            setAppointments(data);
        } catch (error) {
            console.error('Failed to fetch appointments', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchHospitals = async () => {
        try {
            const data = await patientPortalService.getHospitals();
            setHospitals(data);
        } catch (error) {
            console.error('Failed to fetch hospitals', error);
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchHospitals();
    }, []);

    const handleHospitalChange = async (e) => {
        const hospitalId = e.target.value;
        setFormData({ ...formData, hospital: hospitalId, doctor: '' });
        
        if (hospitalId) {
            try {
                const data = await patientPortalService.getDoctors(hospitalId);
                setDoctors(data);
            } catch (error) {
                console.error('Failed to fetch doctors', error);
            }
        } else {
            setDoctors([]);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            await patientPortalService.bookAppointment(formData);
            setIsBookingMode(false);
            setFormData({ hospital: '', doctor: '', date: '', time: '', type: 'Consultation', reason: '' });
            fetchAppointments(); // Refresh list
        } catch (error) {
            console.error('Failed to book appointment', error);
            alert('Failed to book appointment. Please check all fields.');
        }
    };

    if (loading && appointments.length === 0) return <div className="p-12 text-center text-gray-500">Loading Appointments...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
                    <p className="text-gray-500 mt-1">Manage your upcoming hospital and doctor visits</p>
                </div>
                {!isBookingMode && (
                    <button onClick={() => setIsBookingMode(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2">
                        <Plus size={20} /> Book Appointment
                    </button>
                )}
            </div>

            {isBookingMode ? (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Book New Appointment</h2>
                        <button onClick={() => setIsBookingMode(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleBookAppointment} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Hospital</label>
                                <select required value={formData.hospital} onChange={handleHospitalChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">-- Choose a Hospital --</option>
                                    {hospitals.map(h => (
                                        <option key={h._id} value={h._id}>{h.name} - {h.city || h.address}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                                <select required value={formData.doctor} onChange={(e) => setFormData({...formData, doctor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" disabled={!formData.hospital}>
                                    <option value="">-- Choose a Doctor --</option>
                                    {doctors.map(d => (
                                        <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                                <input required type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                                <input required type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="Consultation">Consultation</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Routine Checkup">Routine Checkup</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
                                <textarea required value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} rows="3" placeholder="Please describe your symptoms or reason for visit..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button type="button" onClick={() => setIsBookingMode(false)} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all">
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main List */}
                <div className="flex-1 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><CalendarIcon size={24} className="text-blue-500"/> Upcoming Visits</h2>
                    
                    {appointments.length === 0 ? (
                        <div className="text-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <CalendarIcon size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-800">No Upcoming Appointments</h3>
                            <p className="text-gray-500 mt-1 text-sm">You have no scheduled visits at the moment.</p>
                            <button onClick={() => setIsBookingMode(true)} className="mt-4 px-6 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                                Book Now
                            </button>
                        </div>
                    ) : (
                        appointments.map(apt => (
                            <div key={apt._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-6">
                                    <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-center min-w-[80px]">
                                        <p className="text-sm font-bold uppercase">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</p>
                                        <p className="text-3xl font-black">{new Date(apt.date).getDate()}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{apt.doctor?.name || 'Assigned Doctor'}</h3>
                                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{apt.type}</span>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-3">{apt.doctor?.specialization || 'General'}</p>
                                        
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400"/> {apt.time}</span>
                                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400"/> {apt.hospital?.name || 'Hospital'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold w-full md:w-auto text-center ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}


