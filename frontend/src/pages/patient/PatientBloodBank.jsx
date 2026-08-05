import React, { useState, useEffect } from 'react';
import { Droplet, Search, HandHeart, Activity, Calendar, MapPin, Building2, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { patientPortalService } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const BloodGroupBadge = ({ group }) => (
    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm shadow-sm border border-red-200">
        {group.replace('_pos', '+').replace('_neg', '-')}
    </span>
);

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Approved': return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200"><CheckCircle size={14} /> Approved</span>;
        case 'Rejected': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><XCircle size={14} /> Rejected</span>;
        default: return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-200"><Clock size={14} /> Pending</span>;
    }
};

const PatientBloodBank = () => {
    const [activeTab, setActiveTab] = useState('search');
    const [network, setNetwork] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchBlood, setSearchBlood] = useState('O_pos');
    
    // Request Form
    const [requestForm, setRequestForm] = useState({
        hospital: '',
        type: 'Request',
        bloodGroup: 'O_pos',
        units: 1
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [netRes, reqRes] = await Promise.all([
                patientPortalService.getBloodBankNetwork(),
                patientPortalService.getBloodRequests()
            ]);
            setNetwork(netRes || []);
            setMyRequests(reqRes || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load blood bank data");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!requestForm.hospital) {
            return toast.error("Please select a hospital");
        }
        try {
            await patientPortalService.createBloodRequest(requestForm);
            toast.success("Request submitted successfully!");
            setActiveTab('history');
            fetchData();
            setRequestForm({ ...requestForm, hospital: '', units: 1 });
        } catch (error) {
            toast.error(error.response?.data?.message || "Submission failed");
        }
    };

    // Filter network for search tab
    const hospitalsWithBlood = network.filter(nb => nb.inventory && nb.inventory[searchBlood] > 0);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Droplet className="text-red-500" size={36} fill="currentColor" />
                    Blood Bank Network
                </h1>
                <p className="text-gray-500 mt-2">Search for available blood, donate, or request units from connected hospitals.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button 
                    onClick={() => setActiveTab('search')}
                    className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'search' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <div className="flex items-center gap-2"><Search size={18} /> Seek Blood</div>
                </button>
                <button 
                    onClick={() => setActiveTab('donate')}
                    className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'donate' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <div className="flex items-center gap-2"><HandHeart size={18} /> Donate Blood</div>
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`pb-4 px-4 font-medium transition-colors ${activeTab === 'history' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-800'}`}
                >
                    <div className="flex items-center gap-2"><Activity size={18} /> My Requests</div>
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center text-gray-400">Loading network data...</div>
            ) : (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    
                    {/* SEEK BLOOD TAB */}
                    {activeTab === 'search' && (
                        <div>
                            <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Blood Group</label>
                                    <select 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        value={searchBlood}
                                        onChange={(e) => setSearchBlood(e.target.value)}
                                    >
                                        <option value="A_pos">A+</option>
                                        <option value="A_neg">A-</option>
                                        <option value="B_pos">B+</option>
                                        <option value="B_neg">B-</option>
                                        <option value="AB_pos">AB+</option>
                                        <option value="AB_neg">AB-</option>
                                        <option value="O_pos">O+</option>
                                        <option value="O_neg">O-</option>
                                    </select>
                                </div>
                                <div className="bg-red-50 text-red-700 px-6 py-3 rounded-xl flex items-center gap-3">
                                    <AlertTriangle size={24} />
                                    <div>
                                        <p className="font-bold">Need blood urgently?</p>
                                        <p className="text-sm">Find the nearest hospital below.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {hospitalsWithBlood.length > 0 ? hospitalsWithBlood.map(nb => (
                                    <div key={nb._id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="h-12 w-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                                                <Building2 size={24} />
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Available</p>
                                                <p className="text-2xl font-bold text-gray-900">{nb.inventory[searchBlood]} Units</p>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900">{nb.hospital?.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {nb.hospital?.city}, {nb.hospital?.district}</p>
                                        
                                        <button 
                                            onClick={() => {
                                                setRequestForm({ hospital: nb.hospital?._id, type: 'Request', bloodGroup: searchBlood, units: 1 });
                                                setActiveTab('donate'); // Use the same form for submitting
                                            }}
                                            className="w-full mt-6 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 font-medium py-2 rounded-xl transition-colors border border-gray-200 hover:border-red-200"
                                        >
                                            Request Units
                                        </button>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-12 text-center">
                                        <Droplet size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500">No hospitals found with {searchBlood.replace('_pos', '+').replace('_neg', '-')} blood currently in stock.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* DONATE/REQUEST FORM TAB */}
                    {activeTab === 'donate' && (
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <HandHeart size={48} className="mx-auto text-red-500 mb-4" />
                                <h2 className="text-2xl font-bold text-gray-800">Submit a Request</h2>
                                <p className="text-gray-500 mt-2">Whether you are donating to save a life or requesting blood for a patient, submit your details below.</p>
                            </div>

                            <form onSubmit={handleRequestSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div 
                                        onClick={() => setRequestForm({...requestForm, type: 'Donation'})}
                                        className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${requestForm.type === 'Donation' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-200 text-gray-600'}`}
                                    >
                                        <HandHeart className="mx-auto mb-2" size={24} />
                                        <p className="font-bold">I want to Donate</p>
                                    </div>
                                    <div 
                                        onClick={() => setRequestForm({...requestForm, type: 'Request'})}
                                        className={`p-4 rounded-xl border-2 cursor-pointer text-center transition-all ${requestForm.type === 'Request' ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-red-200 text-gray-600'}`}
                                    >
                                        <AlertTriangle className="mx-auto mb-2" size={24} />
                                        <p className="font-bold">I need Blood</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Hospital</label>
                                    <select 
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        value={requestForm.hospital}
                                        onChange={(e) => setRequestForm({...requestForm, hospital: e.target.value})}
                                    >
                                        <option value="">-- Choose a Hospital --</option>
                                        {network.map(nb => (
                                            <option key={nb.hospital?._id} value={nb.hospital?._id}>{nb.hospital?.name} ({nb.hospital?.city})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                                        <select 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            value={requestForm.bloodGroup}
                                            onChange={(e) => setRequestForm({...requestForm, bloodGroup: e.target.value})}
                                        >
                                            <option value="A_pos">A+</option>
                                            <option value="A_neg">A-</option>
                                            <option value="B_pos">B+</option>
                                            <option value="B_neg">B-</option>
                                            <option value="AB_pos">AB+</option>
                                            <option value="AB_neg">AB-</option>
                                            <option value="O_pos">O+</option>
                                            <option value="O_neg">O-</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Units (Pints)</label>
                                        <input 
                                            type="number" 
                                            min="1" max="10"
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            value={requestForm.units}
                                            onChange={(e) => setRequestForm({...requestForm, units: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all">
                                    Submit {requestForm.type}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <div>
                            {myRequests.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                                <th className="py-4 px-4 font-medium">Date</th>
                                                <th className="py-4 px-4 font-medium">Hospital</th>
                                                <th className="py-4 px-4 font-medium">Type</th>
                                                <th className="py-4 px-4 font-medium">Blood Group</th>
                                                <th className="py-4 px-4 font-medium">Units</th>
                                                <th className="py-4 px-4 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {myRequests.map(req => (
                                                <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-4 px-4 text-sm text-gray-600">{format(new Date(req.date), 'MMM dd, yyyy')}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="font-medium text-gray-900">{req.hospital?.name}</div>
                                                        <div className="text-xs text-gray-500">{req.hospital?.city}</div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'Donation' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                                                            {req.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4"><BloodGroupBadge group={req.bloodGroup} /></td>
                                                    <td className="py-4 px-4 font-bold text-gray-700">{req.units}</td>
                                                    <td className="py-4 px-4"><StatusBadge status={req.status} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <Activity size={48} className="mx-auto text-gray-300 mb-4" />
                                    <p className="text-gray-500">You haven't made any blood requests or donations yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientBloodBank;
