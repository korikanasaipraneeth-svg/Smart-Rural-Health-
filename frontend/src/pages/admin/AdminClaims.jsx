import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, CheckCircle, XCircle, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/api';

export default function AdminClaims() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            const data = await adminService.getAdminClaims();
            setClaims(data || []);
        } catch (error) {
            console.error('Failed to fetch claims', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (claimId, status) => {
        try {
            await adminService.updateClaimStatus(claimId, { status });
            fetchClaims();
        } catch (err) {
            alert('Failed to update claim status');
        }
    };

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
                    <h1 className="text-3xl font-bold text-gray-800">Claims Management (Government)</h1>
                    <p className="text-gray-500 mt-1">Review and disburse funds for hospital claims</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium pl-6">Hospital</th>
                                <th className="p-4 font-medium">Patient Details</th>
                                <th className="p-4 font-medium">Scheme</th>
                                <th className="p-4 font-medium">Claim Amount</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {claims.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">No claims available.</td>
                                </tr>
                            ) : claims.map((claim) => (
                                <tr key={claim._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6">
                                        <p className="font-semibold text-gray-900">{claim.hospital?.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(claim.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-gray-900">{claim.patient?.full_name}</p>
                                        <p className="text-xs text-gray-500">
                                            Ration: {claim.patient?.rationCardNumber || 'N/A'} • Cat: {claim.patient?.category || 'N/A'}
                                        </p>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5 text-blue-600">
                                            <ShieldCheck size={16} />
                                            <span className="text-sm font-medium">{claim.schemeApplied?.name || 'None'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-900">₹{claim.claimAmount.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">Bill: ₹{claim.totalBillAmount.toLocaleString()}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                                            {claim.status}
                                        </span>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        {claim.status === 'Pending' && (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleUpdateStatus(claim._id, 'Approved')} className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1"><CheckCircle size={14} /> Approve</button>
                                                <button onClick={() => handleUpdateStatus(claim._id, 'Rejected')} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"><XCircle size={14} /> Reject</button>
                                            </div>
                                        )}
                                        {claim.status !== 'Pending' && (
                                            <span className="text-sm text-gray-400">Processed</span>
                                        )}
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
