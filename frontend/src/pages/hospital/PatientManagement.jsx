import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
    Users, UserPlus, Search, Filter, Activity, 
    Edit, Trash2, X, AlertCircle, CheckCircle, Clock,
    HeartPulse, Thermometer, ShieldAlert, Upload
} from 'lucide-react';
import { patientService, doctorService, ehrService } from '../../services/api';

export default function PatientManagement() {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedPatientForUpload, setSelectedPatientForUpload] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedPatientForView, setSelectedPatientForView] = useState(null);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);
    const [selectedPatientForBill, setSelectedPatientForBill] = useState(null);
    
    // Stats
    const [stats, setStats] = useState({ total: 0, admitted: 0, discharged: 0, critical: 0 });

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
    }, [searchTerm]);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const patientsData = await patientService.getAllPatients({ search: searchTerm });
            setPatients(patientsData || []);
            
            // Calculate Stats
            setStats({
                total: patientsData?.length || 0,
                admitted: patientsData?.filter(p => p.status === 'Active' || p.status === 'Under Observation').length || 0,
                discharged: patientsData?.filter(p => p.status === 'Discharged').length || 0,
                critical: patientsData?.filter(p => p.status === 'Critical' || p.riskLevel === 'Critical').length || 0
            });
        } catch (error) {
            console.error('Failed to fetch patients', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const doctorsData = await doctorService.getAllDoctors();
            setDoctors(doctorsData || []);
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Active': return 'bg-blue-100 text-blue-700';
            case 'Under Observation': return 'bg-amber-100 text-amber-700';
            case 'Critical': return 'bg-red-100 text-red-700';
            case 'Discharged': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const openBillModal = (patient) => {
        setSelectedPatientForBill(patient);
        setIsBillModalOpen(true);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
                    <p className="text-gray-500 mt-1">Manage admissions, discharges, and patient records</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/30 transition-all"
                >
                    <UserPlus size={20} /> Admit Patient
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Records</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <Activity size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Currently Admitted</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.admitted}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                        <ShieldAlert size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Critical Cases</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.critical}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-500">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Discharged</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.discharged}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search patients by name..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium pl-6">Patient Name</th>
                                <th className="p-4 font-medium">Assigned Doctor</th>
                                <th className="p-4 font-medium">Room No.</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Risk Level</th>
                                <th className="p-4 font-medium text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">Loading patients...</td>
                                </tr>
                            ) : patients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">No patients found</td>
                                </tr>
                            ) : patients.map((patient) => (
                                <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600 font-bold shadow-inner">
                                                {patient.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{patient.full_name}</p>
                                                <p className="text-xs text-gray-500">{patient.age} yrs • {patient.gender}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {patient.assignedDoctor ? `Dr. ${patient.assignedDoctor.name.replace('Dr. ', '')}` : 'Not Assigned'}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600 font-medium">
                                        {patient.roomNumber || 'N/A'}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            {patient.riskLevel === 'Critical' || patient.riskLevel === 'High' ? (
                                                <AlertCircle size={16} className="text-red-500" />
                                            ) : patient.riskLevel === 'Medium' ? (
                                                <AlertCircle size={16} className="text-amber-500" />
                                            ) : (
                                                <CheckCircle size={16} className="text-green-500" />
                                            )}
                                            <span className="text-sm font-medium text-gray-700">{patient.riskLevel}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedPatientForUpload(patient); setIsUploadModalOpen(true); }} className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">Upload EHR</button>
                                            <button onClick={() => { setSelectedPatientForView(patient); setIsViewModalOpen(true); }} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">View Record</button>
                                            {patient.status !== 'Discharged' && (
                                                <button onClick={() => openBillModal(patient)} className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">Discharge & Bill</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Admit Patient Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AdmitPatientModal 
                        onClose={() => setIsAddModalOpen(false)} 
                        onSuccess={() => { setIsAddModalOpen(false); fetchPatients(); }}
                        doctors={doctors}
                    />
                )}
                {isUploadModalOpen && (
                    <UploadRecordModal
                        patient={selectedPatientForUpload}
                        onClose={() => { setIsUploadModalOpen(false); setSelectedPatientForUpload(null); }}
                    />
                )}
                {isViewModalOpen && (
                    <ViewRecordModal
                        patient={selectedPatientForView}
                        onClose={() => { setIsViewModalOpen(false); setSelectedPatientForView(null); }}
                    />
                )}
                {isBillModalOpen && (
                    <BillAndDischargeModal
                        patient={selectedPatientForBill}
                        onClose={() => { setIsBillModalOpen(false); setSelectedPatientForBill(null); }}
                        onSuccess={() => { setIsBillModalOpen(false); setSelectedPatientForBill(null); fetchPatients(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ViewRecordModal({ patient, onClose }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                // Find user id (patient._id might be a reference or the user object itself depending on backend route, but the frontend passes patient object which has _id)
                // Note: The patient ID returned from the patient list might be the user ID or the specific patient collection ID.
                const data = await ehrService.getPatientRecords(patient.userId || patient._id);
                setRecords(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [patient]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 max-h-[80vh] flex flex-col"
            >
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 rounded-t-3xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Medical Records</h2>
                        <p className="text-sm text-gray-500">{patient?.full_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    {loading ? (
                        <div className="text-center text-gray-500 py-8">Loading records...</div>
                    ) : records.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No records found for this patient.</div>
                    ) : (
                        <div className="space-y-4">
                            {records.map(record => (
                                <div key={record._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white transition-colors flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{record.title}</h4>
                                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                            <span className="font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{record.type}</span>
                                            <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {record.notes && <p className="text-sm text-gray-600 mt-2">{record.notes}</p>}
                                    </div>
                                    <div className="flex gap-2">
                                        <a href={`http://localhost:5000${record.fileUrl}`} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm">View</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

function UploadRecordModal({ patient, onClose }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);
    
    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('patientId', patient._id);
            formData.append('title', data.title);
            formData.append('type', data.type);
            formData.append('notes', data.notes);
            formData.append('document', data.document[0]);
            
            await ehrService.uploadRecord(formData);
            alert('Record uploaded successfully!');
            onClose();
        } catch (err) {
            console.error('Failed to upload record', err);
            alert('Failed to upload record. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 p-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Upload Record</h2>
                        <p className="text-sm text-gray-500">For {patient?.full_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Record Title</label>
                        <input {...register('title', { required: true })} type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Blood Test Results" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
                        <select {...register('type')} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                            <option value="Prescription">Prescription</option>
                            <option value="Lab Report">Lab Report</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                        <input {...register('document', { required: true })} type="file" accept=".pdf,image/*" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea {...register('notes')} rows="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                    </div>
                    
                    <button type="submit" disabled={submitting} className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-4">
                        {submitting ? 'Uploading...' : 'Upload Record'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

function AdmitPatientModal({ onClose, onSuccess, doctors }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await patientService.admitPatient(data);
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to admit patient');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Admit New Patient</h2>
                        <p className="text-sm text-gray-500">Enter patient details and assign to a doctor</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                    <form id="admit-patient-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Section: Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Users size={18} className="text-blue-500" /> Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input {...register('full_name', { required: true })} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" {...register('email', { required: true })} placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input {...register('phone', { required: true })} placeholder="+91 9876543210" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                    <input type="number" {...register('age', { required: true })} placeholder="35" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                    <select {...register('gender', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                    <select {...register('blood_group')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <option value="A+">A+</option>
                                        <option value="O+">O+</option>
                                        <option value="B+">B+</option>
                                        <option value="AB+">AB+</option>
                                        <option value="A-">A-</option>
                                        <option value="O-">O-</option>
                                        <option value="B-">B-</option>
                                        <option value="AB-">AB-</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section: Medical Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <HeartPulse size={18} className="text-red-500" /> Medical & Admission Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms (comma separated)</label>
                                    <input {...register('symptoms')} placeholder="Fever, Cough, Headache" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Doctor</label>
                                    <select {...register('assignedDoctor', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <option value="">Select Doctor...</option>
                                        {doctors.map(doc => (
                                            <option key={doc._id} value={doc._id}>{doc.name} - {doc.specialization}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room / Ward Number</label>
                                    <input {...register('roomNumber')} placeholder="e.g. ICU-01 or Ward-A-102" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                                    <select {...register('riskLevel')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                        <option value="Low">Low Risk</option>
                                        <option value="Medium">Medium Risk</option>
                                        <option value="High">High Risk</option>
                                        <option value="Critical">Critical</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" {...register('isEmergency')} className="w-5 h-5 text-red-600 rounded focus:ring-red-500 cursor-pointer" />
                                        <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-md">Mark as Emergency Case</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>
                
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                    <button form="admit-patient-form" type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-70">
                        {submitting ? 'Processing...' : 'Admit Patient'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function BillAndDischargeModal({ patient, onClose, onSuccess }) {
    const [billAmount, setBillAmount] = useState('');
    const [eligibleSchemes, setEligibleSchemes] = useState([]);
    const [selectedScheme, setSelectedScheme] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                // We use patientService to get schemes, but actually we created a scheme API in hospitalProfileService 
                // Let's import hospitalProfileService at the top or just use fetch
                const res = await fetch(`http://localhost:5000/api/schemes/eligibility/${patient._id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const data = await res.json();
                if(data.success) {
                    setEligibleSchemes(data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, [patient]);

    const handleDischarge = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Create Claim
            if (billAmount > 0) {
                await fetch(`http://localhost:5000/api/schemes/claim`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        patientId: patient._id,
                        totalBillAmount: Number(billAmount),
                        schemeId: selectedScheme || null
                    })
                });
            }

            // Discharge patient
            await patientService.updatePatientStatus(patient._id, { status: 'Discharged' });
            
            alert('Patient Discharged & Bill Generated!');
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Failed to process');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 p-8"
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Discharge & Billing</h2>
                        <p className="text-sm text-gray-500">For {patient?.full_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                </div>
                
                {loading ? <p className="text-gray-500 py-4 text-center">Checking Scheme Eligibility...</p> : (
                    <form onSubmit={handleDischarge} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Bill Amount (₹)</label>
                            <input type="number" required value={billAmount} onChange={e => setBillAmount(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Enter amount" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Apply Govt Scheme / Insurance</label>
                            {eligibleSchemes.length > 0 ? (
                                <select value={selectedScheme} onChange={e => setSelectedScheme(e.target.value)} className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-xl outline-none focus:ring-2 focus:ring-green-500 font-medium">
                                    <option value="">No Scheme Applied</option>
                                    {eligibleSchemes.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} (Max: ₹{s.maxCoverageAmount})</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-500 text-sm border border-gray-200">
                                    Patient is not eligible for any schemes based on their profile data.
                                </div>
                            )}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-xl mt-4">
                            <p className="text-sm text-blue-800 font-medium mb-1">Summary</p>
                            <p className="text-xs text-blue-600">A claim will be automatically submitted to the admin for the applied scheme amount.</p>
                        </div>
                        
                        <button type="submit" disabled={submitting} className="w-full py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors mt-4 shadow-lg shadow-emerald-500/30">
                            {submitting ? 'Processing...' : 'Confirm Discharge & Generate Bill'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}