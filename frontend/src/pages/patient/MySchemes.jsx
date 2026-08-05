import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { patientPortalService } from '../../services/api';
import { safeParseUser } from '../../utils/authUtils';

export default function MySchemes() {
    const user = safeParseUser();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                if (user?.id) {
                    const data = await patientPortalService.checkEligibility(user.id);
                    setSchemes(data || []);
                }
            } catch (error) {
                console.error('Failed to fetch schemes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, [user]);

    if (loading) return <div className="p-12 text-center text-gray-500">Checking Eligibility...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">My Health Schemes</h1>
                <p className="text-gray-500 mt-1">Government schemes and insurance coverage you are eligible for.</p>
            </div>

            {schemes.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                    <AlertCircle size={48} className="text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800">No Eligible Schemes Found</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                        Based on your profile, we couldn't find any active schemes you're currently eligible for. 
                        Please ensure your Annual Income and Category details are accurate in your Profile.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schemes.map(scheme => (
                        <div key={scheme._id} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border border-green-100 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 text-green-200/50">
                                <ShieldCheck size={160} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{scheme.name}</h3>
                                        <span className="text-xs font-semibold px-2 py-1 bg-green-200 text-green-700 rounded-full flex w-max items-center gap-1 mt-1">
                                            <CheckCircle2 size={12} /> Eligible
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm mb-4 min-h-[40px]">
                                    {scheme.description || "Provides comprehensive medical coverage for eligible families."}
                                </p>
                                <div className="bg-white/60 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Max Coverage</p>
                                        <p className="text-lg font-bold text-gray-900">₹{scheme.maxCoverageAmount.toLocaleString()}</p>
                                    </div>
                                    <button className="text-green-600 hover:text-green-700 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
                                        <Info size={16} /> Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
