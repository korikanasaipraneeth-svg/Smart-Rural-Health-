import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
    Users, UserPlus, Search, Filter, MoreVertical, 
    Edit, Trash2, X, Activity, Stethoscope, Star, CheckCircle, Clock 
} from 'lucide-react';
import { doctorService } from '../../services/api';

export default function DoctorManagement() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    
    // Stats
    const [stats, setStats] = useState({ total: 0, active: 0, verified: 0 });

    useEffect(() => {
        fetchDoctors();
    }, [searchTerm]);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const doctorsData = await doctorService.getAllDoctors({ search: searchTerm });
            setDoctors(doctorsData || []);
            
            // Calculate Stats
            setStats({
                total: doctorsData?.length || 0,
                active: doctorsData?.filter(d => d.status === 'Active').length || 0,
                verified: doctorsData?.filter(d => d.verification === 'Verified').length || 0
            });
        } catch (error) {
            console.error('Failed to fetch doctors', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await doctorService.deleteDoctor(id);
                fetchDoctors();
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Doctor Management</h1>
                    <p className="text-gray-500 mt-1">Manage your hospital's doctors and specialists</p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
                >
                    <UserPlus size={20} /> Add New Doctor
                </button>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Doctors</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Activity size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Duty</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.active}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Verified Profiles</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.verified}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters Header */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search doctors by name or specialization..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Table Area */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-medium pl-6">Doctor Info</th>
                                <th className="p-4 font-medium">Department</th>
                                <th className="p-4 font-medium">Experience</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium">Rating</th>
                                <th className="p-4 font-medium text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">Loading doctors...</td>
                                </tr>
                            ) : doctors.filter(d => filterStatus === 'All' || d.status === filterStatus).length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">No doctors found</td>
                                </tr>
                            ) : doctors.filter(d => filterStatus === 'All' || d.status === filterStatus).map((doctor) => (
                                <tr key={doctor._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                                                {doctor.name.replace('Dr. ', '').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{doctor.name}</p>
                                                <p className="text-xs text-gray-500">{doctor.qualification} • {doctor.specialization}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5 bg-gray-100 w-max px-3 py-1 rounded-md text-xs font-medium">
                                            <Stethoscope size={14} className="text-gray-500" /> {doctor.department}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">{doctor.experienceYears} Years</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                            {doctor.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1 text-amber-500 font-medium text-sm">
                                            <Star size={16} fill="currentColor" /> {doctor.averageRating}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedDoctor(doctor); setIsEditModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(doctor._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Doctor Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <AddDoctorModal 
                        onClose={() => setIsAddModalOpen(false)} 
                        onSuccess={() => { setIsAddModalOpen(false); fetchDoctors(); }}
                    />
                )}
                {isEditModalOpen && selectedDoctor && (
                    <EditDoctorModal
                        doctor={selectedDoctor}
                        onClose={() => { setIsEditModalOpen(false); setSelectedDoctor(null); }}
                        onSuccess={() => { setIsEditModalOpen(false); setSelectedDoctor(null); fetchDoctors(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function AddDoctorModal({ onClose, onSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await doctorService.addDoctor(data);
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to add doctor');
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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Add New Doctor</h2>
                        <p className="text-sm text-gray-500">Fill in the professional details</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                    <form id="add-doctor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (with Title)</label>
                                <input {...register('name', { required: true })} placeholder="Dr. John Doe" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" {...register('email', { required: true })} placeholder="doctor@hospital.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input {...register('phone', { required: true })} placeholder="+91 9876543210" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select {...register('gender', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                                <input {...register('registrationNumber', { required: true })} placeholder="MCI-12345" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State Medical Council</label>
                                <input {...register('stateMedicalCouncil', { required: true })} placeholder="e.g., Delhi Medical Council" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                                <input {...register('qualification', { required: true })} placeholder="MBBS, MD" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                <input {...register('specialization', { required: true })} placeholder="Cardiology" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <input {...register('department', { required: true })} placeholder="General Medicine" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                <input type="number" {...register('experienceYears', { required: true, min: 0 })} placeholder="10" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee (₹)</label>
                                <input type="number" {...register('consultationFee', { required: true, min: 0 })} placeholder="1000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password (for Doctor Login)</label>
                                <input type="password" {...register('password', { required: true })} placeholder="********" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>

                    </form>
                </div>
                
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-4 rounded-b-3xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                    <button form="add-doctor-form" type="submit" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70">
                        {submitting ? 'Saving...' : 'Add Doctor'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
function EditDoctorModal({ doctor, onClose, onSuccess }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: doctor.name,
            email: doctor.email,
            phone: doctor.phone,
            gender: doctor.gender,
            department: doctor.department,
            specialization: doctor.specialization,
            qualification: doctor.qualification,
            experienceYears: doctor.experienceYears,
            status: doctor.status || 'Active'
        }
    });
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            await doctorService.updateDoctor(doctor._id, data);
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update doctor');
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
                className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Edit Doctor Profile</h2>
                        <p className="text-sm text-gray-500">Update professional details</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-8 overflow-y-auto">
                    <form id="edit-doctor-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name (with Title)</label>
                                <input {...register('name', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" {...register('email', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input {...register('phone', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                <select {...register('gender', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                <select {...register('department', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Gynecology">Gynecology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="General Medicine">General Medicine</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                                <input {...register('specialization', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                                <input {...register('qualification', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                                <input type="number" {...register('experienceYears', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select {...register('status', { required: true })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0 rounded-b-3xl">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="edit-doctor-form" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70">
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
