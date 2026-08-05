import React, { useState, useEffect } from 'react';
import { Tent, Plus, MapPin, Users, Calendar, Clock, CheckCircle, Activity, QrCode, Edit } from 'lucide-react';
import { hospitalProfileService } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CampManagement = () => {
    const [camps, setCamps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedCamp, setSelectedCamp] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editCampId, setEditCampId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Eye Camp',
        date: '',
        startTime: '',
        endTime: '',
        location: { village: '', district: '', address: '' },
        maxPatients: 100
    });

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        setLoading(true);
        try {
            const res = await hospitalProfileService.getHospitalCamps();
            setCamps(res || []);
        } catch (error) {
            toast.error("Failed to fetch camps");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCamp = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await hospitalProfileService.updateCamp(editCampId, formData);
                toast.success("Camp updated successfully!");
            } else {
                await hospitalProfileService.createCamp(formData);
                toast.success("Camp created successfully!");
            }
            setShowCreateForm(false);
            setIsEditing(false);
            setEditCampId(null);
            fetchCamps();
            setFormData({
                name: '', category: 'Eye Camp', date: '', startTime: '', endTime: '', 
                location: { village: '', district: '', address: '' }, maxPatients: 100
            });
        } catch (error) {
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} camp`);
        }
    };

    const handleEditCamp = (camp) => {
        setIsEditing(true);
        setEditCampId(camp._id);
        setFormData({
            name: camp.name,
            category: camp.category,
            date: new Date(camp.date).toISOString().split('T')[0],
            startTime: camp.startTime,
            endTime: camp.endTime,
            location: { 
                village: camp.location?.village || '', 
                district: camp.location?.district || '', 
                address: camp.location?.address || '' 
            },
            maxPatients: camp.maxPatients
        });
        setSelectedCamp(null);
        setShowCreateForm(true);
    };

    const handleViewCamp = async (camp) => {
        setSelectedCamp(camp);
        try {
            const regs = await hospitalProfileService.getCampRegistrations(camp._id);
            setRegistrations(regs || []);
        } catch (error) {
            toast.error("Failed to load registrations");
        }
    };

    const updateRegStatus = async (regId, status) => {
        try {
            await hospitalProfileService.updateCampRegistrationStatus(regId, status);
            toast.success(`Patient marked as ${status}`);
            const regs = await hospitalProfileService.getCampRegistrations(selectedCamp._id);
            setRegistrations(regs || []);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Camps...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                        <Tent className="text-indigo-600" size={32} />
                        Health Camps Management
                    </h1>
                    <p className="text-gray-500 mt-2">Organize mobile health camps and manage patient walk-ins & registrations.</p>
                </div>
                <button 
                    onClick={() => { 
                        setShowCreateForm(!showCreateForm); 
                        setSelectedCamp(null); 
                        if (showCreateForm) {
                            setIsEditing(false);
                            setEditCampId(null);
                            setFormData({
                                name: '', category: 'Eye Camp', date: '', startTime: '', endTime: '', 
                                location: { village: '', district: '', address: '' }, maxPatients: 100
                            });
                        }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
                >
                    {showCreateForm ? 'Cancel' : <><Plus size={20} /> Create New Camp</>}
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 border-b pb-4">{isEditing ? 'Edit Health Camp' : 'Create Health Camp'}</h2>
                    <form onSubmit={handleCreateCamp} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Camp Name</label>
                                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Free Eye Checkup Camp" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Eye Camp</option>
                                    <option>Blood Donation</option>
                                    <option>Polio Vaccination</option>
                                    <option>Dengue Awareness</option>
                                    <option>General Health Checkup</option>
                                    <option>Women Health Camp</option>
                                    <option>Child Vaccination</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input required type="date" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                    <input required type="time" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input required type="time" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <h3 className="font-bold text-gray-800 mt-6 pt-6 border-t border-gray-100 mb-4">Location Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Village / Town</label>
                                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.location.village} onChange={e => setFormData({...formData, location: {...formData.location, village: e.target.value}})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.location.district} onChange={e => setFormData({...formData, location: {...formData.location, district: e.target.value}})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                                <input required type="number" min="10" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" value={formData.maxPatients} onChange={e => setFormData({...formData, maxPatients: e.target.value})} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                            <textarea required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl" rows="2" value={formData.location.address} onChange={e => setFormData({...formData, location: {...formData.location, address: e.target.value}})}></textarea>
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                            {isEditing && (
                                <button type="button" onClick={() => {
                                    setShowCreateForm(false);
                                    setIsEditing(false);
                                    setEditCampId(null);
                                    setFormData({
                                        name: '', category: 'Eye Camp', date: '', startTime: '', endTime: '', 
                                        location: { village: '', district: '', address: '' }, maxPatients: 100
                                    });
                                }} className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
                                    Cancel Edit
                                </button>
                            )}
                            <button type="submit" className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-colors">
                                {isEditing ? 'Save Changes' : 'Submit Camp for Approval'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!showCreateForm && !selectedCamp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {camps.map(camp => (
                        <div key={camp._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewCamp(camp)}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold mb-2 inline-block">{camp.category}</span>
                                    <h3 className="text-xl font-bold text-gray-900">{camp.name}</h3>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${camp.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600' : camp.status === 'Live' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                        {camp.status}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-2 mt-4 text-sm text-gray-600">
                                <p className="flex items-center gap-2"><Calendar size={16} className="text-gray-400" /> {format(new Date(camp.date), 'MMMM dd, yyyy')}</p>
                                <p className="flex items-center gap-2"><Clock size={16} className="text-gray-400" /> {camp.startTime} - {camp.endTime}</p>
                                <p className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {camp.location.village}, {camp.location.district}</p>
                                <p className="flex items-center gap-2 text-indigo-600 font-medium mt-4 border-t pt-4">
                                    <Users size={16} /> Registrations: {camp.registeredCount} / {camp.maxPatients}
                                </p>
                            </div>
                        </div>
                    ))}
                    {camps.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            No camps created yet. Click "Create New Camp" to get started.
                        </div>
                    )}
                </div>
            )}

            {selectedCamp && (
                <div className="space-y-6">
                    <button onClick={() => setSelectedCamp(null)} className="text-indigo-600 font-medium hover:underline mb-4 inline-block">&larr; Back to all camps</button>
                    
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-4">
                                <h2 className="text-2xl font-bold">{selectedCamp.name}</h2>
                                <button onClick={() => handleEditCamp(selectedCamp)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors">
                                    <Edit size={14} /> Edit Camp
                                </button>
                            </div>
                            <p className="text-gray-500 mt-1">{format(new Date(selectedCamp.date), 'MMM dd, yyyy')} • {selectedCamp.location.village}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Total Registered</p>
                            <p className="text-3xl font-bold text-indigo-600">{registrations.length} <span className="text-lg text-gray-400">/ {selectedCamp.maxPatients}</span></p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold flex items-center gap-2"><Users className="text-indigo-600" size={20} /> Patient Registration Queue</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-bold">
                                        <th className="px-6 py-4">Token</th>
                                        <th className="px-6 py-4">Patient</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions (On-Ground)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {registrations.map(reg => (
                                        <tr key={reg._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono font-bold text-indigo-600">{reg.tokenNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{reg.patient?.full_name}</div>
                                                <div className="text-xs text-gray-500">Age: {reg.patient?.age} • {reg.patient?.gender}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    reg.status === 'CheckedIn' ? 'bg-emerald-100 text-emerald-700' :
                                                    reg.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.status === 'Registered' && (
                                                    <button onClick={() => updateRegStatus(reg._id, 'CheckedIn')} className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                                                        <QrCode size={16} /> Scan & Check-in
                                                    </button>
                                                )}
                                                {reg.status === 'CheckedIn' && (
                                                    <button onClick={() => updateRegStatus(reg._id, 'Completed')} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
                                                        Mark Completed
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {registrations.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-12 text-gray-500">No patients registered for this camp yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampManagement;
