import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Activity, Droplet, Calendar as CalendarIcon, Save } from 'lucide-react';
import { patientPortalService } from '../../services/api';

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '', email: '', phone: '', address: '', age: '', gender: '', blood_group: '',
        annualIncome: '', category: '', rationCardNumber: '', aadharNumber: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await patientPortalService.getProfile();
                setProfile({
                    full_name: data.full_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    age: data.age || '',
                    gender: data.gender || '',
                    blood_group: data.blood_group || '',
                    annualIncome: data.annualIncome || '',
                    category: data.category || '',
                    rationCardNumber: data.rationCardNumber || '',
                    aadharNumber: data.aadharNumber || ''
                });
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleSave = async () => {
        try {
            setSaving(true);
            await patientPortalService.updateProfile(profile);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Profile...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your personal and medical details</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Avatar Side */}
                    <div className="w-full md:w-1/3 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8">
                        <div className="h-40 w-40 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-inner mb-6 relative group cursor-pointer overflow-hidden">
                            <User size={64} className="text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-sm font-medium">Change Photo</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h2>
                        <p className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium mb-4">Patient Account</p>
                        <div className="w-full bg-blue-50 text-blue-700 p-4 rounded-2xl text-center text-sm">
                            <p>Complete your profile to help doctors provide better care.</p>
                        </div>
                    </div>

                    {/* Details Form */}
                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Personal Information</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                            <div className="relative">
                                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input name="full_name" value={profile.full_name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Email Address (Read-only)</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input name="email" value={profile.email} disabled className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input name="phone" value={profile.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input name="address" value={profile.address} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="col-span-full mt-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Medical Profile</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Age</label>
                            <div className="relative">
                                <CalendarIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="number" name="age" value={profile.age} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Blood Group</label>
                            <div className="relative">
                                <Droplet size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select name="blood_group" value={profile.blood_group} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none">
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-span-full mt-4">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">Financial & Scheme Eligibility</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Annual Income (₹)</label>
                            <div className="relative">
                                <input type="number" name="annualIncome" value={profile.annualIncome} onChange={handleChange} placeholder="e.g. 50000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Category / Caste</label>
                            <div className="relative">
                                <select name="category" value={profile.category} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none">
                                    <option value="">Select Category</option>
                                    <option value="General">General</option>
                                    <option value="OBC">OBC</option>
                                    <option value="SC">SC</option>
                                    <option value="ST">ST</option>
                                    <option value="BPL">BPL</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Ration Card Number</label>
                            <div className="relative">
                                <input name="rationCardNumber" value={profile.rationCardNumber} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Aadhar Card Number</label>
                            <div className="relative">
                                <input name="aadharNumber" value={profile.aadharNumber} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}