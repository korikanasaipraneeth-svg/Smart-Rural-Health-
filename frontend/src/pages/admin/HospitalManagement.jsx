import React, { useState, useEffect } from 'react';
import { 
  Building2, CheckCircle, Clock, ShieldAlert, Activity, 
  Search, Filter, Plus, FileText, XCircle, Eye, Edit, Trash2, 
  MapPin, Phone, Mail, Navigation, BedDouble, PlusCircle, X
} from 'lucide-react';
import { adminService } from '../../services/api';

export default function HospitalManagement() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', address: '', contact_number: '', type: 'Private', district: '', city: '',
    email: '', totalBeds: 0, availableBeds: 0, doctorsCount: 0, has_emergency: false, icu: false, departments: ''
  });

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [emergencyFilter, setEmergencyFilter] = useState("");



  const fetchHospitals = async () => {
    try {
      const response = await adminService.getHospitals();
      const hospArray = response.data || response || [];
      const mappedHospitals = (Array.isArray(hospArray) ? hospArray : []).map(h => ({
        _id: h._id,
        id: String(h._id || '').substring(0, 8).toUpperCase(),
        name: h.name,
        address: h.address || '',
        regNo: h.regNo || 'REG-PENDING',
        type: h.type || 'Private',
        district: h.district || 'Unknown',
        city: h.city || 'Unknown',
        phone: h.contact_number,
        email: h.email || 'N/A',
        departments: h.departments || '',
        doctors: h.doctorsCount || 0,
        totalBeds: h.totalBeds || 0,
        availableBeds: h.availableBeds || 0,
        icu: h.icu || false,
        emergency: h.has_emergency || false,
        verification: h.verification || 'Pending',
        status: h.status || 'Active'
      }));
      setHospitals(mappedHospitals);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Government': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-blue-100 text-blue-800 border border-blue-200">Government</span>;
      case 'Private': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-purple-100 text-purple-800 border border-purple-200">Private</span>;
      case 'PHC': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">PHC</span>;
      case 'Clinic': return <span className="px-2 py-1 text-xs font-bold rounded-md bg-gray-100 text-gray-800 border border-gray-200">Clinic</span>;
      default: return null;
    }
  };

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified': return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-[#0F9D58]/10 text-[#0F9D58]"><CheckCircle size={12}/> Verified</span>;
      case 'Pending': return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700"><Clock size={12}/> Pending</span>;
      case 'Rejected': return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700"><XCircle size={12}/> Rejected</span>;
      default: return null;
    }
  };

  const openViewModal = (hospital) => {
    setSelectedHospital(hospital);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      name: '', address: '', contact_number: '', type: 'Private', district: '', city: '',
      email: '', totalBeds: 0, availableBeds: 0, doctorsCount: 0, has_emergency: false, icu: false, departments: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (hospital) => {
    setIsEditMode(true);
    setSelectedHospital(hospital);
    setFormData({
      name: hospital.name, address: hospital.address, contact_number: hospital.phone, 
      type: hospital.type, district: hospital.district, city: hospital.city,
      email: hospital.email, totalBeds: hospital.totalBeds, availableBeds: hospital.availableBeds, 
      doctorsCount: hospital.doctors, has_emergency: hospital.emergency, icu: hospital.icu, departments: hospital.departments
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hospital?")) {
      try {
        await adminService.deleteHospital(id);
        fetchHospitals();
      } catch (error) {
        console.error("Failed to delete hospital", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await adminService.updateHospital(selectedHospital._id, formData);
      } else {
        await adminService.addHospital(formData);
      }
      setIsAddModalOpen(false);
      fetchHospitals();
    } catch (error) {
      console.error("Failed to save hospital", error);
    }
  };

  const handleVerify = async (id) => {
    try {
      await adminService.updateHospital(id, { verification: 'Verified' });
      fetchHospitals();
      if(isViewModalOpen) setIsViewModalOpen(false);
    } catch (error) {
      console.error("Failed to verify hospital", error);
    }
  };

  // Filter Logic
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? h.type.toLowerCase() === typeFilter.toLowerCase() : true;
    const matchesDistrict = districtFilter ? h.district.toLowerCase() === districtFilter.toLowerCase() : true;
    const matchesEmergency = emergencyFilter === "yes" ? (h.emergency || h.icu) : true;
    return matchesSearch && matchesType && matchesDistrict && matchesEmergency;
  });

  // Dynamic Stats Calculation
  const totalVerified = hospitals.filter(h => h.verification === 'Verified').length;
  const totalPending = hospitals.filter(h => h.verification === 'Pending').length;
  const totalBeds = hospitals.reduce((acc, h) => acc + (parseInt(h.totalBeds) || 0), 0);
  const totalAvailableBeds = hospitals.reduce((acc, h) => acc + (parseInt(h.availableBeds) || 0), 0);
  const totalEmergency = hospitals.filter(h => h.emergency).length;

  const dynamicStats = [
    { title: "Total Hospitals", value: hospitals.length, icon: Building2, color: "text-[#1976D2]", bg: "bg-blue-50", border: "border-[#1976D2]" },
    { title: "Verified", value: totalVerified, icon: CheckCircle, color: "text-[#0F9D58]", bg: "bg-green-50", border: "border-[#0F9D58]" },
    { title: "Pending", value: totalPending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-500" },
    { title: "Total Beds", value: totalBeds.toLocaleString(), icon: BedDouble, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-500" },
    { title: "Available Beds", value: totalAvailableBeds.toLocaleString(), icon: PlusCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-500" },
    { title: "Emergency Live", value: totalEmergency, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50", border: "border-red-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#0F9D58]/10">
        <div>
          <h1 className="text-2xl font-bold text-[#0F9D58]">Hospital Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage registered hospitals, bed availability, emergency services, and verifications.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-[#1976D2] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={16} /> Register Hospital
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            <FileText size={16} /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {dynamicStats.map((stat, index) => (
          <div key={index} className={`bg-white p-4 rounded-2xl shadow-sm border-t-4 ${stat.border} hover:shadow-md transition-all group`}>
            <div className={`w-10 h-10 mb-3 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Hospital Name, ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58] transition-all" 
            />
          </div>
          
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58] text-gray-600"
          >
            <option value="">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="phc">PHC</option>
          </select>
          
          <select 
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58] text-gray-600"
          >
            <option value="">All Districts</option>
            <option value="vsp">Visakhapatnam</option>
            <option value="sklm">Srikakulam</option>
            <option value="vzm">Vizianagaram</option>
          </select>

          <select 
            value={emergencyFilter}
            onChange={(e) => setEmergencyFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F9D58] text-gray-600"
          >
            <option value="">Emergency Needed?</option>
            <option value="yes">Yes (ICU/Ambulance)</option>
          </select>
          
          <button 
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("");
              setDistrictFilter("");
              setEmergencyFilter("");
            }}
            className="w-full bg-[#0F9D58] text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Hospital Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Hospital Details</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Capacity</th>
                <th className="px-6 py-4 font-semibold">Facilities</th>
                <th className="px-6 py-4 font-semibold">Verification</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                      <div className="w-8 h-8 border-4 border-[#0F9D58]/20 border-t-[#0F9D58] rounded-full animate-spin"></div>
                      <p>Loading hospital data from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredHospitals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No hospitals match your search criteria.
                  </td>
                </tr>
              ) : filteredHospitals.map((hosp, index) => (
                <tr key={index} className="hover:bg-[#0F9D58]/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                        <Building2 size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#0F9D58] transition-colors">{hosp.name}</p>
                        <p className="text-xs text-gray-500 mb-1">{hosp.id} • {hosp.regNo}</p>
                        {getTypeBadge(hosp.type)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{hosp.city}</p>
                    <p className="text-xs text-gray-500">{hosp.district}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-900">{hosp.availableBeds} <span className="text-xs text-gray-500 font-normal">/ {hosp.totalBeds} Beds</span></span>
                      <span className="text-xs text-gray-500">{hosp.doctors} Doctors • {hosp.departments} Depts</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {hosp.emergency && <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-red-100 text-red-700">Emergency</span>}
                      {hosp.icu && <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-purple-100 text-purple-700">ICU</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getVerificationBadge(hosp.verification)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(hosp)} className="p-2 text-[#1976D2] bg-blue-50 rounded-lg hover:bg-[#1976D2] hover:text-white transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditModal(hosp)} className="p-2 text-[#0F9D58] bg-green-50 rounded-lg hover:bg-[#0F9D58] hover:text-white transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(hosp._id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Hospital Modal */}
      {isViewModalOpen && selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#0F9D58]/10 to-transparent">
              <h2 className="text-xl font-bold text-[#0F9D58] flex items-center gap-2">
                <Building2 size={24} /> Hospital Profile
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200 shrink-0">
                  <Building2 size={48} className="text-gray-400" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-gray-900">{selectedHospital.name}</h2>
                    {getVerificationBadge(selectedHospital.verification)}
                  </div>
                  <div className="flex gap-2">
                    {getTypeBadge(selectedHospital.type)}
                    <span className="px-2 py-1 text-xs font-bold rounded-md bg-gray-100 text-gray-600 border border-gray-200">ID: {selectedHospital.id}</span>
                  </div>
                  <p className="text-sm text-gray-500 max-w-lg">
                    Reg No: {selectedHospital.regNo} <br/>
                    A multi-specialty healthcare facility serving the rural and urban populations of {selectedHospital.district}.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Contact & Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><MapPin size={18}/></div>
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-bold text-gray-900">{selectedHospital.city}, {selectedHospital.district}, AP</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><Phone size={18}/></div>
                      <div>
                        <p className="text-xs text-gray-500">Contact Number</p>
                        <p className="text-sm font-bold text-gray-900">{selectedHospital.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><Mail size={18}/></div>
                      <div>
                        <p className="text-xs text-gray-500">Email Address</p>
                        <p className="text-sm font-bold text-gray-900">{selectedHospital.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Capacity & Facilities */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Capacity & Facilities</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Total Beds</p>
                      <p className="text-2xl font-black text-indigo-900">{selectedHospital.totalBeds}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Available</p>
                      <p className="text-2xl font-black text-emerald-900">{selectedHospital.availableBeds}</p>
                    </div>
                    <div className="col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Medical Staff</p>
                        <p className="text-lg font-bold text-gray-900">{selectedHospital.doctors} Doctors</p>
                      </div>
                      <div className="h-8 w-px bg-gray-300"></div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Departments</p>
                        <p className="text-lg font-bold text-gray-900">{selectedHospital.departments} Depts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Emergency Banner */}
              {selectedHospital.emergency && (
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg animate-pulse"><ShieldAlert size={24}/></div>
                    <div>
                      <p className="font-bold text-red-900">24/7 Emergency & Ambulance Services Active</p>
                      <p className="text-xs text-red-700 mt-1">This hospital is equipped to handle critical trauma and AI-SOS alerts.</p>
                    </div>
                  </div>
                  {selectedHospital.icu && (
                     <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg shadow-sm">ICU EQUIPPED</span>
                  )}
                </div>
              )}

              {selectedHospital.verification !== 'Verified' && (
                <div className="mt-6 flex justify-end gap-4 border-t border-gray-100 pt-6">
                  <button onClick={() => handleVerify(selectedHospital._id)} className="px-6 py-2 bg-[#0F9D58] text-white rounded-xl font-bold shadow-sm hover:bg-green-700 transition-colors">
                    Verify & Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#1976D2]/10 to-transparent">
              <h2 className="text-xl font-bold text-[#1976D2]">{isEditMode ? 'Edit Hospital' : 'Register New Hospital'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]">
                    <option value="Private">Private</option>
                    <option value="Government">Government</option>
                    <option value="PHC">PHC</option>
                    <option value="Clinic">Clinic</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                  <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">District</label>
                  <input required type="text" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Number</label>
                  <input required type="text" value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Total Beds</label>
                  <input type="number" value={formData.totalBeds} onChange={e => setFormData({...formData, totalBeds: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Available Beds</label>
                  <input type="number" value={formData.availableBeds} onChange={e => setFormData({...formData, availableBeds: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Doctors Count</label>
                  <input type="number" value={formData.doctorsCount} onChange={e => setFormData({...formData, doctorsCount: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Departments (Comma Separated)</label>
                  <input type="text" value={formData.departments} onChange={e => setFormData({...formData, departments: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1976D2]" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="has_emergency" checked={formData.has_emergency} onChange={e => setFormData({...formData, has_emergency: e.target.checked})} className="w-5 h-5 text-[#1976D2] rounded" />
                  <label htmlFor="has_emergency" className="font-bold text-gray-700">Has Emergency Services</label>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="icu" checked={formData.icu} onChange={e => setFormData({...formData, icu: e.target.checked})} className="w-5 h-5 text-[#1976D2] rounded" />
                  <label htmlFor="icu" className="font-bold text-gray-700">Has ICU</label>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#1976D2] text-white rounded-xl font-bold shadow-sm hover:bg-blue-700 transition-colors">{isEditMode ? 'Update' : 'Register'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}