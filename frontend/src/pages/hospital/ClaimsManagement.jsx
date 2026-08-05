import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { hospitalProfileService } from '../../services/api';

export default function ClaimsManagement() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const data = await hospitalProfileService.getHospitalClaims();
                setClaims(data || []);
            } catch (error) {
                console.error('Failed to fetch claims', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClaims();
    }, []);

    const getStatusColor = (status) => {
        if (status === 'Approved') return 'bg-green-100 text-green-700';
        if (status === 'Rejected') return 'bg-red-100 text-red-700';
        return 'bg-amber-100 text-amber-700'; // Pending
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading claims...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Claims & Billing</h1>
                    <p className="text-gray-500 mt-1">Track digital claims submitted for government health schemes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Clock size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {claims.filter(c => c.status === 'Pending').length}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Approved Claims</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {claims.filter(c => c.status === 'Approved').length}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <FileSpreadsheet size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Claimed Value</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                            ₹{claims.reduce((acc, c) => acc + c.claimAmount, 0).toLocaleString()}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium pl-6">Date</th>
                                <th className="p-4 font-medium">Patient Details</th>
                                <th className="p-4 font-medium">Scheme Applied</th>
                                <th className="p-4 font-medium">Total Bill</th>
                                <th className="p-4 font-medium">Claim Amount</th>
                                <th className="p-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {claims.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">No claims submitted yet.</td>
                                </tr>
                            ) : claims.map((claim) => (
                                <tr key={claim._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 text-sm text-gray-600">
                                        {new Date(claim.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-gray-900">{claim.patient?.full_name}</p>
                                        <p className="text-xs text-gray-500">Aadhar: {claim.patient?.aadharNumber || 'N/A'}</p>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-blue-600">
                                        {claim.schemeApplied ? claim.schemeApplied.name : 'None'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-900">
                                        ₹{claim.totalBillAmount.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-sm font-bold text-gray-900">
                                        ₹{claim.claimAmount.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                                            {claim.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
