import React, { useState, useEffect } from 'react';
import { Tent, MapPin, Calendar, Clock, CheckCircle, Search, QrCode } from 'lucide-react';
import { patientPortalService } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const HealthCamps = () => {
    const [camps, setCamps] = useState([]);
    const [myRegistrations, setMyRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('browse'); // browse, my-camps
    const [symptomsForm, setSymptomsForm] = useState('');
    const [registeringCamp, setRegisteringCamp] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [campsRes, regRes] = await Promise.all([
                patientPortalService.getUpcomingCamps(),
                patientPortalService.getMyCampRegistrations()
            ]);
            setCamps(campsRes || []);
            setMyRegistrations(regRes || []);
        } catch (error) {
            toast.error("Failed to load camps");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await patientPortalService.registerForCamp(registeringCamp._id, { symptoms: symptomsForm });
            toast.success("Successfully registered for camp!");
            setRegisteringCamp(null);
            setSymptomsForm('');
            setActiveTab('my-camps');
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Camps...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Tent className="text-emerald-600" size={36} fill="currentColor" />
                    Mobile Health Camps
                </h1>
                <p className="text-gray-500 mt-2">Find and register for free health checkups, vaccination drives, and specialist camps near you.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button 
                    onClick={() => setActiveTab('browse')}
                    className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'browse' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <div className="flex items-center gap-2"><Search size={18} /> Browse Upcoming Camps</div>
                </button>
                <button 
                    onClick={() => setActiveTab('my-camps')}
                    className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'my-camps' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <div className="flex items-center gap-2"><QrCode size={18} /> My Registered Camps</div>
                </button>
            </div>

            {activeTab === 'browse' && (
                <div>
                    {registeringCamp ? (
                        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <button onClick={() => setRegisteringCamp(null)} className="text-emerald-600 font-medium hover:underline mb-6">&larr; Back to Camps</button>
                            <h2 className="text-2xl font-bold mb-2">Register for {registeringCamp.name}</h2>
                            <p className="text-gray-500 flex items-center gap-2 mb-8"><MapPin size={16} /> {registeringCamp.location.village}, {registeringCamp.location.district}</p>
                            
                            <form onSubmit={handleRegister} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Are you experiencing any specific symptoms? (Optional)</label>
                                    <textarea 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500" 
                                        rows="3" 
                                        value={symptomsForm}
                                        onChange={(e) => setSymptomsForm(e.target.value)}
                                        placeholder="e.g., blurry vision, mild fever..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors">
                                    Confirm Registration
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {camps.map(camp => {
                                const isRegistered = myRegistrations.some(r => r.camp?._id === camp._id);
                                return (
                                    <div key={camp._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                        <div className="bg-emerald-50 p-6 border-b border-emerald-100">
                                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-3 inline-block">{camp.category}</span>
                                            <h3 className="text-xl font-bold text-gray-900">{camp.name}</h3>
                                            <p className="text-sm text-emerald-600 mt-1 font-medium">By {camp.hospital?.name}</p>
                                        </div>
                                        <div className="p-6 flex-1 space-y-4">
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><Calendar size={18} /></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{format(new Date(camp.date), 'MMM dd, yyyy')}</p>
                                                    <p className="text-xs">{camp.startTime} - {camp.endTime}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-600">
                                                <div className="bg-gray-50 p-2 rounded-lg text-gray-400"><MapPin size={18} /></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{camp.location.village}</p>
                                                    <p className="text-xs">{camp.location.district}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 pt-0 mt-auto">
                                            {isRegistered ? (
                                                <button disabled className="w-full py-3 bg-gray-100 text-gray-500 font-bold rounded-xl flex items-center justify-center gap-2">
                                                    <CheckCircle size={18} /> Already Registered
                                                </button>
                                            ) : (
                                                <button onClick={() => setRegisteringCamp(camp)} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-colors">
                                                    Register Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            {camps.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500">
                                    No upcoming health camps in your district at the moment.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'my-camps' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myRegistrations.map(reg => (
                        <div key={reg._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        reg.status === 'CheckedIn' ? 'bg-indigo-50 text-indigo-700' :
                                        reg.status === 'Completed' ? 'bg-gray-100 text-gray-600' :
                                        'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        Status: {reg.status}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-2">{reg.camp?.name}</h3>
                                    <p className="text-sm text-gray-500">{reg.camp?.hospital?.name}</p>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="flex items-center gap-2"><Calendar size={14}/> {format(new Date(reg.camp?.date), 'MMM dd, yyyy')}</p>
                                    <p className="flex items-center gap-2"><MapPin size={14}/> {reg.camp?.hospital?.district}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center min-w-[150px] border border-gray-100 text-center">
                                <QrCode size={48} className="text-gray-800 mb-2" />
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Token</p>
                                <p className="text-lg font-mono font-bold text-emerald-600">{reg.tokenNumber}</p>
                            </div>
                        </div>
                    ))}
                    {myRegistrations.length === 0 && (
                        <div className="col-span-full py-12 text-center text-gray-500">
                            You haven't registered for any camps yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HealthCamps;
