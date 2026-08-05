import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
    Building2, MapPin, Phone, Mail, Globe, 
    Upload, Camera, CheckCircle2, AlertCircle, Save, 
    Activity, Clock, Stethoscope, BedDouble, ShieldCheck
} from 'lucide-react';
import { hospitalProfileService } from '../../services/api';

const FACILITIES = [
    'Emergency', 'ICU', 'Blood Bank', 'Laboratory', 
    'Pharmacy', 'Operation Theatre', 'Radiology', 
    'MRI', 'CT Scan', 'Oxygen Facility', 'Ambulance', 
    'Ventilator', 'Dialysis'
];

const DEPARTMENTS = [
    'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
    'Gynecology', 'Pediatrics', 'ENT', 'Dentistry', 
    'Dermatology', 'Emergency'
];

export default function HospitalProfile() {
    const { register, handleSubmit, control, reset, watch, setValue } = useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Image Previews
    const [logoPreview, setLogoPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    
    const logoInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const API_BASE = 'http://localhost:5000';

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await hospitalProfileService.getProfile();
            reset(data); // Populate form
            if (data.logo) setLogoPreview(`${API_BASE}${data.logo}`);
            if (data.coverImage) setCoverPreview(`${API_BASE}${data.coverImage}`);
        } catch (err) {
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await hospitalProfileService.updateProfile(data);
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append(type === 'logo' ? 'logo' : 'coverImage', file);

        try {
            setSaving(true);
            const res = type === 'logo' 
                ? await hospitalProfileService.uploadLogo(formData)
                : await hospitalProfileService.uploadCover(formData);
            
            if (type === 'logo') setLogoPreview(`${API_BASE}${res.logo}`);
            else setCoverPreview(`${API_BASE}${res.coverImage}`);
            
            setSuccess(`${type === 'logo' ? 'Logo' : 'Cover image'} uploaded successfully`);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to upload image');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pb-12"
        >
            {/* Success/Error Toasts */}
            {success && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    {success}
                </div>
            )}
            {error && (
                <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6 px-4">
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Hospital Profile</h1>
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md shadow-blue-500/30 disabled:opacity-70"
                    >
                        {saving ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>

                {/* Banner Section (Glassmorphism + Apple UI vibes) */}
                <div className="mx-4 mb-8 relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-white/20">
                    <div className="h-64 md:h-80 w-full relative bg-gray-100 group">
                        {coverPreview ? (
                            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-emerald-50 flex items-center justify-center">
                                <Building2 size={64} className="text-blue-300 opacity-50" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button type="button" onClick={() => coverInputRef.current?.click()} className="bg-white/90 text-gray-800 px-6 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg">
                                <Camera size={18} /> Update Cover
                            </button>
                            <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                        </div>
                    </div>

                    <div className="px-8 pb-8 pt-20 relative">
                        {/* Logo */}
                        <div className="absolute -top-16 left-8 group">
                            <div className="h-32 w-32 rounded-2xl bg-white shadow-xl border-4 border-white overflow-hidden relative">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                        <Building2 size={40} className="text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => logoInputRef.current?.click()}>
                                    <Upload size={24} className="text-white" />
                                </div>
                                <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} />
                            </div>
                        </div>

                        {/* Title & Badge */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pl-36">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">{watch('name') || 'Hospital Name'}</h2>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1"><ShieldCheck size={16} className={watch('isApproved') ? "text-green-500" : "text-amber-500"} /> {watch('isApproved') ? 'Verified Partner' : 'Pending Verification'}</span>
                                    <span className="flex items-center gap-1"><Building2 size={16} /> {watch('type')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Basic Info Card */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800"><Activity className="text-blue-500" /> Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Hospital Name</label>
                                    <input {...register('name')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Registration Number</label>
                                    <input {...register('regNo')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Hospital Type</label>
                                    <select {...register('type')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50">
                                        <option value="Government">Government</option>
                                        <option value="Private">Private</option>
                                        <option value="PHC">PHC</option>
                                        <option value="Clinic">Clinic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Established Year</label>
                                    <input type="number" {...register('establishedYear')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                                    <textarea {...register('description')} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Address & Location */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800"><MapPin className="text-red-500" /> Location & Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Full Address</label>
                                    <input {...register('address')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">City</label>
                                    <input {...register('city')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">District</label>
                                    <input {...register('district')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">State</label>
                                    <input {...register('state')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Pincode</label>
                                    <input {...register('pincode')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50" />
                                </div>
                            </div>
                        </div>

                        {/* Facilities & Departments */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800"><Stethoscope className="text-emerald-500" /> Medical Facilities</h3>
                            
                            <h4 className="font-medium text-gray-700 mb-3">Available Facilities</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                                {FACILITIES.map((facility) => (
                                    <label key={facility} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input type="checkbox" value={facility} {...register('facilities')} className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500" />
                                        <span className="text-sm text-gray-700">{facility}</span>
                                    </label>
                                ))}
                            </div>

                            <h4 className="font-medium text-gray-700 mb-3">Departments</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {DEPARTMENTS.map((dept) => (
                                    <label key={dept} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <input type="checkbox" value={dept} {...register('departments')} className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500" />
                                        <span className="text-sm text-gray-700">{dept}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        
                        {/* Bed Info */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <BedDouble size={120} />
                            </div>
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 relative z-10"><BedDouble /> Bed Information</h3>
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-1">Total Beds</label>
                                    <input type="number" {...register('totalBeds')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-100 mb-1">Available</label>
                                        <input type="number" {...register('availableBeds')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-100 mb-1">ICU Beds</label>
                                        <input type="number" {...register('icuBeds')} className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800"><Phone className="text-indigo-500" /> Contact Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Owner / Admin Name</label>
                                    <input {...register('ownerName')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                                    <input type="email" {...register('email')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                                    <input {...register('contact_number')} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Emergency Hotline</label>
                                    <input {...register('emergencyNumber')} className="w-full px-4 py-2.5 rounded-xl border border-red-200 focus:ring-2 focus:ring-red-500/20 outline-none bg-red-50/30 text-red-700" />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800"><Globe className="text-sky-500" /> Digital Presence</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Globe className="text-gray-400" size={20} />
                                    <input placeholder="Website URL" {...register('website')} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none bg-white/50" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="text-blue-600" size={20} />
                                    <input placeholder="Facebook Profile" {...register('socialLinks.facebook')} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none bg-white/50" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="text-pink-600" size={20} />
                                    <input placeholder="Instagram Profile" {...register('socialLinks.instagram')} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm outline-none bg-white/50" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </motion.div>
    );
}