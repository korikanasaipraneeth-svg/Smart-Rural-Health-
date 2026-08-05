import { useState, useEffect } from 'react';
import { BedDouble, Activity, ShieldPlus, TrendingUp, TrendingDown, Save } from 'lucide-react';
import { hospitalProfileService, emergencyService } from '../../services/api';

export default function BedAvailability() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [beds, setBeds] = useState({
        totalBeds: 0,
        availableBeds: 0,
        occupiedBeds: 0,
        icuBeds: 0,
        emergencyBeds: 0,
        generalBeds: 0
    });

    useEffect(() => {
        fetchBedData();
    }, []);

    const fetchBedData = async () => {
        try {
            const data = await hospitalProfileService.getProfile();
            setBeds({
                totalBeds: data.totalBeds || 0,
                availableBeds: data.availableBeds || 0,
                occupiedBeds: data.occupiedBeds || 0,
                icuBeds: data.icuBeds || 0,
                emergencyBeds: data.emergencyBeds || 0,
                generalBeds: data.generalBeds || 0
            });
        } catch (error) {
            console.error('Failed to fetch bed data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleIncrement = (type) => {
        setBeds(prev => ({ ...prev, [type]: prev[type] + 1 }));
    };

    const handleDecrement = (type) => {
        setBeds(prev => ({ ...prev, [type]: prev[type] > 0 ? prev[type] - 1 : 0 }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            // Recalculate totals
            const updatedBeds = { ...beds };
            updatedBeds.totalBeds = updatedBeds.icuBeds + updatedBeds.emergencyBeds + updatedBeds.generalBeds;
            // Assume manual occupation is set properly, just saving the fields
            await hospitalProfileService.updateProfile(updatedBeds);
            setBeds(updatedBeds); // Update local state with totals
            alert('Bed availability updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update bed data.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Loading Bed Dashboard...</div>;

    const occupancyRate = beds.totalBeds > 0 ? Math.round((beds.occupiedBeds / beds.totalBeds) * 100) : 0;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <BedDouble className="text-blue-500" size={32} /> Bed Management
                    </h1>
                    <p className="text-gray-500 mt-1">Live overview and manual override of hospital bed capacities</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                >
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Overall Capacity Overview */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Overall Occupancy</h2>
                        <p className="text-gray-500 text-sm">Real-time capacity tracking across all departments</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-3xl font-bold text-gray-900">{occupancyRate}%</h3>
                        <p className="text-gray-500 text-sm font-medium">Current Occupancy Rate</p>
                    </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-4 mb-8 overflow-hidden flex">
                    <div className={`h-4 ${occupancyRate > 90 ? 'bg-red-500' : occupancyRate > 75 ? 'bg-amber-500' : 'bg-emerald-500'} transition-all duration-1000`} style={{ width: `${occupancyRate}%` }}></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-6 rounded-2xl">
                        <p className="text-gray-500 font-medium mb-1">Total Capacity</p>
                        <h3 className="text-4xl font-bold text-gray-900">{beds.totalBeds}</h3>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                        <p className="text-emerald-600 font-medium mb-1">Available Beds (Empty)</p>
                        <div className="flex items-center justify-between">
                            <h3 className="text-4xl font-bold text-emerald-700">{beds.availableBeds}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleDecrement('availableBeds')} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg"><TrendingDown size={20}/></button>
                                <button onClick={() => handleIncrement('availableBeds')} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg"><TrendingUp size={20}/></button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                        <p className="text-amber-600 font-medium mb-1">Occupied Beds (In Use)</p>
                        <div className="flex items-center justify-between">
                            <h3 className="text-4xl font-bold text-amber-700">{beds.occupiedBeds}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleDecrement('occupiedBeds')} className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg"><TrendingDown size={20}/></button>
                                <button onClick={() => handleIncrement('occupiedBeds')} className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg"><TrendingUp size={20}/></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Department Breakdown */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Department Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ICU */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-red-100 text-red-500 flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">ICU Beds</h3>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <h4 className="text-5xl font-bold text-gray-900">{beds.icuBeds}</h4>
                            <div className="flex gap-2 bg-gray-50 p-2 rounded-xl">
                                <button onClick={() => handleDecrement('icuBeds')} className="p-3 bg-white hover:bg-red-50 hover:text-red-600 rounded-lg shadow-sm transition-colors text-gray-400 font-bold text-xl">-</button>
                                <button onClick={() => handleIncrement('icuBeds')} className="p-3 bg-white hover:bg-red-50 hover:text-red-600 rounded-lg shadow-sm transition-colors text-gray-400 font-bold text-xl">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                                <ShieldPlus size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Emergency / Trauma</h3>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <h4 className="text-5xl font-bold text-gray-900">{beds.emergencyBeds}</h4>
                            <div className="flex gap-2 bg-gray-50 p-2 rounded-xl">
                                <button onClick={() => handleDecrement('emergencyBeds')} className="p-3 bg-white hover:bg-orange-50 hover:text-orange-600 rounded-lg shadow-sm transition-colors text-gray-400 font-bold text-xl">-</button>
                                <button onClick={() => handleIncrement('emergencyBeds')} className="p-3 bg-white hover:bg-orange-50 hover:text-orange-600 rounded-lg shadow-sm transition-colors text-gray-400 font-bold text-xl">+</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* General Wards */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center">
                                <BedDouble size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">General Wards</h3>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                            <h4 className="text-5xl font-bold text-gray-900">{beds.generalBeds}</h4>
                            <div className="flex gap-2 bg-gray-50 p-2 rounded-xl">
                                <button onClick={() => handleDecrement('generalBeds')} className="p-3 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm transition-colors text-gray-400 font-bold text-xl">-</button>
                                <button onClick={() => handleIncrement('generalBeds')} className="p-3 bg-white hover:bg-blue-50 hover:text-blue-600 rounded-lg shadow-sm transition-colors text-gray-400 font-bold text-xl">+</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}