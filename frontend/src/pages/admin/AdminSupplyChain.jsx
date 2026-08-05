import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Activity, AlertTriangle, ArrowRightLeft, Check, X, Box, Info } from 'lucide-react';
import { inventoryService } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSupplyChain() {
    const [transfers, setTransfers] = useState([]);
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transfersData, predictData] = await Promise.all([
                inventoryService.getTransfers(),
                inventoryService.runPredictions()
            ]);
            setTransfers(transfersData || []);
            setPredictions(predictData || null);
        } catch (error) {
            console.error('Failed to fetch supply chain data', error);
            toast.error('Failed to load supply network data');
        } finally {
            setLoading(false);
        }
    };

    const handleTransferAction = async (id, status) => {
        try {
            await inventoryService.updateTransferStatus(id, { status });
            toast.success(`Transfer ${status.toLowerCase()} successfully`);
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update transfer status');
        }
    };

    const pendingTransfers = transfers.filter(t => t.status === 'Pending');
    const pastTransfers = transfers.filter(t => t.status !== 'Pending');

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Global Supply Chain</h1>
                    <p className="text-gray-500 mt-1">Manage AI-driven medicine redistribution across all hospitals</p>
                </div>
                <button 
                    onClick={fetchData}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
                >
                    <Activity size={18} /> Refresh AI Predictions
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Critical Shortages (Next 7 Days)</p>
                        <h3 className="text-2xl font-bold text-gray-900">{predictions?.criticalItems?.length || 0}</h3>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">AI Suggested Transfers</p>
                        <h3 className="text-2xl font-bold text-gray-900">{predictions?.recommendations?.length || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                        <ArrowRightLeft size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                        <h3 className="text-2xl font-bold text-gray-900">{pendingTransfers.length}</h3>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pending Transfers / AI Recommendations */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <Activity className="text-indigo-600" size={20} />
                            <h2 className="text-lg font-bold text-gray-800">Pending Re-routings</h2>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        {loading ? (
                            <p className="text-gray-500 text-center py-4">Analyzing global inventory...</p>
                        ) : pendingTransfers.length === 0 ? (
                            <div className="text-center py-8">
                                <Box className="mx-auto text-gray-300 mb-3" size={48} />
                                <p className="text-gray-500">No pending transfers.</p>
                            </div>
                        ) : (
                            pendingTransfers.map((transfer) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={transfer._id} 
                                    className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                                >
                                    {transfer.isAiRecommended && (
                                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                            AI RECOMMENDED
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{transfer.itemName}</h3>
                                            <p className="text-sm text-gray-500">Quantity: <span className="font-bold text-gray-800">{transfer.quantity}</span></p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl mb-4">
                                        <div className="text-center flex-1">
                                            <p className="text-xs text-gray-500 mb-1">From (Excess)</p>
                                            <p className="text-sm font-semibold text-gray-800">{transfer.sourceHospital?.name}</p>
                                        </div>
                                        <div className="px-4 text-indigo-400">
                                            <ArrowRightLeft size={20} />
                                        </div>
                                        <div className="text-center flex-1">
                                            <p className="text-xs text-red-500 mb-1 font-medium">To (Shortage)</p>
                                            <p className="text-sm font-semibold text-gray-800">{transfer.targetHospital?.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleTransferAction(transfer._id, 'Approved')}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Check size={16} /> Approve Transfer
                                        </button>
                                        <button 
                                            onClick={() => handleTransferAction(transfer._id, 'Rejected')}
                                            className="px-4 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Transfer History */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">Transfer History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase">
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-4 py-4">Route</th>
                                    <th className="px-4 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr><td colSpan="3" className="p-6 text-center text-gray-400">Loading...</td></tr>
                                ) : pastTransfers.length === 0 ? (
                                    <tr><td colSpan="3" className="p-6 text-center text-gray-400">No transfer history</td></tr>
                                ) : (
                                    pastTransfers.map((t) => (
                                        <tr key={t._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">{t.itemName}</p>
                                                <p className="text-xs text-gray-500">Qty: {t.quantity}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <span className="truncate max-w-[100px]" title={t.sourceHospital?.name}>{t.sourceHospital?.name}</span>
                                                    <ArrowRightLeft size={12} className="text-gray-400 flex-shrink-0" />
                                                    <span className="truncate max-w-[100px]" title={t.targetHospital?.name}>{t.targetHospital?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    t.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                    t.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
