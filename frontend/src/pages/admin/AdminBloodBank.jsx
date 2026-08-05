import React, { useState, useEffect } from 'react';
import { Droplet, Search, Activity, Building2, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Phone } from 'lucide-react';
import { adminService } from '../../services/api';
import { format } from 'date-fns';

const BloodGroupBadge = ({ group }) => (
    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold text-sm shadow-sm border border-red-200">
        {group.replace('_pos', '+').replace('_neg', '-')}
    </span>
);

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Approved': return <span className="flex items-center justify-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200"><CheckCircle size={14} /> Approved</span>;
        case 'Rejected': return <span className="flex items-center justify-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200"><XCircle size={14} /> Rejected</span>;
        default: return <span className="flex items-center justify-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-200"><Clock size={14} /> Pending</span>;
    }
};

const AdminBloodBank = () => {
    const [loading, setLoading] = useState(true);
    const [inventoryData, setInventoryData] = useState([]);
    const [requestsData, setRequestsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [invRes, reqRes] = await Promise.all([
                adminService.getBloodBankNetwork(),
                adminService.getAllBloodRequests()
            ]);
            setInventoryData(invRes || []);
            setRequestsData(reqRes || []);
        } catch (error) {
            console.error("Failed to fetch admin blood bank data", error);
        } finally {
            setLoading(false);
        }
    };

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

    const filteredInventory = inventoryData.filter(item => 
        item.hospital?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.hospital?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hospital?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate aggregate stats
    const totalUnits = inventoryData.reduce((acc, item) => {
        const hInv = item.inventory || {};
        return acc + Object.values(hInv).reduce((sum, val) => sum + (val || 0), 0);
    }, 0);
    const totalHospitalsWithBank = inventoryData.length;
    const pendingRequests = requestsData.filter(r => r.status === 'Pending').length;

    if (loading) {
        return <div className="p-12 text-center text-gray-500 animate-pulse">Loading Central Blood Bank Data...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Droplet className="text-red-600" size={32} fill="currentColor" />
                    Central Blood Bank Oversight
                </h1>
                <p className="text-gray-500 mt-2">Monitor district-wide blood availability and track donation/request flow across all registered hospitals.</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Blood Units</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalUnits.toLocaleString()}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-red-100 text-red-600">
                        <Droplet size={24} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Active Blood Banks</p>
                        <h3 className="text-3xl font-bold text-gray-900">{totalHospitalsWithBank}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-indigo-100 text-indigo-600">
                        <Building2 size={24} />
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between hover:-translate-y-1 transition-transform">
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Pending Requests</p>
                        <h3 className="text-3xl font-bold text-gray-900">{pendingRequests}</h3>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-100 text-amber-600">
                        <AlertTriangle size={24} />
                    </div>
                </div>
            </div>

            {/* District Inventory */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Hospital Blood Inventory</h2>
                        <p className="text-sm text-gray-500 mt-1">Real-time blood stock across all hospitals</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search hospital or district..."
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
                                {bloodGroups.map(bg => (
                                    <th key={bg.key} className="px-6 py-4 text-center">{bg.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredInventory.map((item) => (
                                <tr key={item._id} className="hover:bg-red-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <h3 className="font-bold text-gray-900">{item.hospital?.name || 'Unknown'}</h3>
                                        <div className="flex flex-col gap-1 mt-1">
                                            <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12}/> {item.hospital?.city}, {item.hospital?.district || 'Unknown District'}</span>
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
                            {filteredInventory.length === 0 && (
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

            {/* All Blood Requests */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Activity className="text-red-500" size={24} /> Global Patient Requests & Donations
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Audit log of all patient blood interactions across the platform.</p>
                </div>
                
                <div className="overflow-x-auto max-h-[500px]">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                            <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Target Hospital</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-center">Blood</th>
                                <th className="px-6 py-4 text-center">Units</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {requestsData.map(req => (
                                <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {format(new Date(req.date), 'MMM dd, yyyy p')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{req.patient?.full_name}</div>
                                        <div className="text-xs text-gray-500">{req.patient?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-700">{req.hospital?.name}</div>
                                        <div className="text-xs text-gray-400">{req.hospital?.city}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${req.type === 'Donation' ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'}`}>
                                            {req.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <BloodGroupBadge group={req.bloodGroup} />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-700 text-center">{req.units}</td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={req.status} />
                                    </td>
                                </tr>
                            ))}
                            {requestsData.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No patient requests or donations recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBloodBank;
