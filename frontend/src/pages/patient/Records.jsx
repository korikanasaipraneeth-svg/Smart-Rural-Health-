import React, { useState, useEffect } from 'react';
import { FileText, Beaker, Download, Eye, Calendar, User, Building2, AlertCircle } from 'lucide-react';
import { ehrService } from '../../services/api';

export default function Records() {
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState({ prescriptions: [], labReports: [] });
    const [activeTab, setActiveTab] = useState('prescriptions');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await ehrService.getPatientRecords('me');
                const prescriptions = data.filter(r => r.type === 'Prescription');
                const labReports = data.filter(r => r.type === 'Lab Report' || r.type === 'Other');
                setRecords({ prescriptions, labReports });
            } catch (error) {
                console.error('Failed to fetch records', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, []);

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Medical Records...</div>;

    const dataList = activeTab === 'prescriptions' ? records.prescriptions : records.labReports;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Medical Records</h1>
                <p className="text-gray-500 mt-1">Access your prescriptions, lab results, and medical history</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-8">
                <button 
                    onClick={() => setActiveTab('prescriptions')}
                    className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'prescriptions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <FileText size={20} /> Prescriptions <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{records.prescriptions.length}</span>
                </button>
                <button 
                    onClick={() => setActiveTab('labReports')}
                    className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'labReports' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Beaker size={20} /> Lab Reports <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">{records.labReports.length}</span>
                </button>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataList.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-gray-400">
                        <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-lg">No {activeTab === 'prescriptions' ? 'prescriptions' : 'lab reports'} found.</p>
                        <p className="text-sm mt-2">Any future records uploaded by your hospital will appear here.</p>
                    </div>
                ) : (
                    dataList.map((record) => (
                        <div key={record._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'prescriptions' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    <span className="text-sm font-semibold text-gray-600">{new Date(record.date || record.createdAt).toLocaleDateString()}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${activeTab === 'prescriptions' ? 'bg-blue-50 text-blue-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                    {activeTab === 'prescriptions' ? 'Rx' : 'Lab'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-3 truncate">
                                {record.title || (activeTab === 'prescriptions' ? 'General Prescription' : 'Lab Report')}
                            </h3>

                            <div className="space-y-2 mb-6">
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <User size={16} className="text-gray-400" /> {record.doctor?.name || 'Unknown Doctor'}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <Building2 size={16} className="text-gray-400" /> {record.hospital?.name || 'Unknown Hospital'}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mt-auto">
                                <a href={`http://localhost:5000${record.fileUrl}`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 border border-gray-200">
                                    <Eye size={16} /> View
                                </a>
                                <a href={`http://localhost:5000${record.fileUrl}`} download className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                                    <Download size={16} /> Download
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}