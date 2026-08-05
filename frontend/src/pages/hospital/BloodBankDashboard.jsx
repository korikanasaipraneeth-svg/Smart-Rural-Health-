import React, { useState, useEffect } from 'react';
import { Droplet, Save, Search, MapPin, Phone } from 'lucide-react';
import { bloodBankService } from '../../services/api';

export default function BloodBankDashboard() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [myInventory, setMyInventory] = useState({
        A_pos: 0, A_neg: 0, B_pos: 0, B_neg: 0, 
        AB_pos: 0, AB_neg: 0, O_pos: 0, O_neg: 0
    });
    const [districtInventory, setDistrictInventory] = useState([]);
    const [patientRequests, setPatientRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBloodBankData();
        fetchPatientRequests();
    }, []);

    const fetchBloodBankData = async () => {
        try {
            const res = await bloodBankService.getDistrictInventory();
            if (res.myInventory) {
                setMyInventory(res.myInventory.inventory || {
                    A_pos: 0, A_neg: 0, B_pos: 0, B_neg: 0, 
                    AB_pos: 0, AB_neg: 0, O_pos: 0, O_neg: 0
                });
            }
            if (res.districtInventory) {
                setDistrictInventory(res.districtInventory);
            }
        } catch (error) {
            console.error('Failed to fetch blood bank data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientRequests = async () => {
        try {
            const res = await bloodBankService.getRequests();
            if (res) {
                setPatientRequests(res);
            }
        } catch (error) {
            console.error('Failed to fetch patient requests:', error);
        }
    };

    const handleRequestAction = async (id, status) => {
        try {
            await bloodBankService.updateRequestStatus(id, status);
            alert(`Request ${status} successfully!`);
            fetchPatientRequests();
            fetchBloodBankData(); // Refresh inventory if it was auto-updated
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await bloodBankService.updateInventory({ inventory: myInventory });
            alert('Blood inventory updated successfully!');
        } catch (error) {
            console.error('Failed to update blood inventory:', error);
            alert('Failed to update blood inventory.');
        } finally {
            setSaving(false);
        }
    };

    const handleIncrement = (type) => {
        setMyInventory(prev => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const handleDecrement = (type) => {
        setMyInventory(prev => ({ ...prev, [type]: prev[type] > 0 ? prev[type] - 1 : 0 }));
    };

    const filteredDistrict = districtInventory.filter(item => 
        item.hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.hospital?.district?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const bloodGroups = [
        { key: 'A_pos', label: 'A+' },
        { key: 'A_neg', label: 'A-' },
        { key: 'B_pos', label: 'B+' },
        { key: 'B_neg', label: 'B-' },
        { key: 'AB_pos', label: 'AB+' },
        { key: 'AB_neg', label: 'AB-' },
        { key: 'O_pos', label: 'O+' },
        { key: 'O_neg', label: 'O-' }
    ];

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Blood Bank Network...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Droplet className="text-red-600" size={32} /> Blood Bank Network
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your blood inventory and track availability across the district</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-red-500/30 transition-all flex items-center gap-2"
                >
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Stock'}
                </button>
            </div>

            {/* My Inventory */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">My Hospital's Blood Stock (Units)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {bloodGroups.map(bg => (
                        <div key={bg.key} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">
                                        {bg.label}
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center justify-between">
                                    <h4 className="text-4xl font-black text-gray-900">{myInventory[bg.key]}</h4>
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => handleIncrement(bg.key)} className="h-8 w-8 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg shadow-sm transition-colors text-gray-500 font-bold flex items-center justify-center">+</button>
                                        <button onClick={() => handleDecrement(bg.key)} className="h-8 w-8 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg shadow-sm transition-colors text-gray-500 font-bold flex items-center justify-center">-</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* District Network */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">District Network Availability</h2>
                        <p className="text-sm text-gray-500 mt-1">Real-time blood stock across other hospitals</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search hospitals or districts..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none w-full md:w-80"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Hospital Details</th>
                                <th className="px-6 py-4 text-center">A+</th>
                                <th className="px-6 py-4 text-center">A-</th>
                                <th className="px-6 py-4 text-center">B+</th>
                                <th className="px-6 py-4 text-center">B-</th>
                                <th className="px-6 py-4 text-center">AB+</th>
                                <th className="px-6 py-4 text-center">AB-</th>
                                <th className="px-6 py-4 text-center">O+</th>
                                <th className="px-6 py-4 text-center">O-</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredDistrict.map((item) => (
                                <tr key={item._id} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <h3 className="font-bold text-gray-900">{item.hospital?.name || 'Unknown'}</h3>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {item.hospital?.district || 'Unknown District'}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><Phone size={12}/> {item.hospital?.phone || 'N/A'}</span>
                                        </div>
                                    </td>
                                    {bloodGroups.map(bg => (
                                        <td key={bg.key} className="px-6 py-4 text-center">
                                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                (item.inventory?.[bg.key] || 0) === 0 
                                                    ? 'bg-gray-100 text-gray-400' 
                                                    : (item.inventory?.[bg.key] || 0) < 5
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {item.inventory?.[bg.key] || 0}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {filteredDistrict.length === 0 && (
                                <tr>
                                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                                        No hospitals found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Patient Requests & Donations */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Droplet className="text-red-500" size={24} /> Patient Requests & Donations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage incoming blood requests or donation pledges from patients.</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Blood Group</th>
                                <th className="px-6 py-4">Units</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {patientRequests.map(req => (
                                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{req.patient?.full_name}</div>
                                        <div className="text-xs text-gray-500">{req.patient?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'Donation' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                                            {req.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded font-bold text-xs border border-gray-200">
                                            {req.bloodGroup.replace('_pos', '+').replace('_neg', '-')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700">{req.units}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                            req.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            req.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {req.status === 'Pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleRequestAction(req._id, 'Approved')} className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg text-xs font-bold transition-colors">Accept</button>
                                                <button onClick={() => handleRequestAction(req._id, 'Rejected')} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-bold transition-colors">Reject</button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Processed</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {patientRequests.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No pending requests or donations.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
