import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, UserCheck, Clock, UserX, Activity, Download, 
  Search, Filter, Plus, FileText, CheckCircle, XCircle, Eye, Edit, Trash2, 
  MapPin, Phone, Mail, Award, X
} from 'lucide-react';
import { adminService } from '../../services/api';

export default function DoctorManagementAdmin() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [apiError, setApiError] = useState(null);
  
  const [formData, setFormData] = useState({
    userId: `DOC-${Math.floor(Math.random() * 10000)}`, name: '', qualification: '', 
    specialization: '', department: '', hospital: '', experience: '', phone: '', email: '', 
    status: 'Available', verification: 'Pending'
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [specFilter, setSpecFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");



  const fetchDoctors = async () => {
    try {
      const response = await adminService.getDoctors();
      const doctorsArray = response.data || response || [];
      const mappedDoctors = (Array.isArray(doctorsArray) ? doctorsArray : []).map(d => ({
        _id: d._id,
        id: d.userId || (d._id ? String(d._id).substring(0, 8).toUpperCase() : 'DOC'),
        name: d.name || 'Unknown',
        qualification: d.qualification || 'N/A',
        specialization: d.specialization || 'General',
        department: d.department || 'General',
        hospital: d.hospital || 'Unassigned',
        experience: d.experience,
        phone: d.phone,
        email: d.email,
        status: d.status || 'Available',
        verification: d.verification || 'Pending',
        rating: d.rating || 0,
        patients: d.patientsTreated || 0
      }));
      setDoctors(mappedDoctors);
      setApiError(null);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setApiError(error.message + ' | ' + JSON.stringify(error.response?.data || {}));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const getVerificationBadge = (status) => {
    switch (status) {
      case 'Verified': return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-[#0F9D58]/10 text-[#0F9D58]"><CheckCircle size={12}/> Verified</span>;
      case 'Pending': return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700"><Clock size={12}/> Pending</span>;
      case 'Rejected': return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700"><XCircle size={12}/> Rejected</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Available': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-[#1976D2]">Available</span>;
      case 'On Leave': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">On Leave</span>;
      case 'Busy': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Busy</span>;
      default: return null;
    }
  };

  const openViewModal = (doctor) => {
    setSelectedDoctor(doctor);
    setActiveTab('profile');
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      userId: `DOC-${Math.floor(Math.random() * 10000)}`, name: '', qualification: '', 
      specialization: '', department: '', hospital: '', experience: '', phone: '', email: '', 
      status: 'Available', verification: 'Pending'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (doctor) => {
    setIsEditMode(true);
    setSelectedDoctor(doctor);
    setFormData({
      userId: doctor.id, name: doctor.name, qualification: doctor.qualification, 
      specialization: doctor.specialization, department: doctor.department, hospital: doctor.hospital, 
      experience: doctor.experience, phone: doctor.phone, email: doctor.email, 
      status: doctor.status, verification: doctor.verification
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await adminService.deleteDoctor(id);
        fetchDoctors();
      } catch (error) {
        console.error("Failed to delete doctor", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await adminService.updateDoctor(selectedDoctor._id, formData);
      } else {
        await adminService.addDoctor(formData);
      }
      setIsAddModalOpen(false);
      fetchDoctors();
    } catch (error) {
      console.error("Failed to save doctor", error);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await adminService.updateDoctor(id, { verification: status });
      fetchDoctors();
      if(isViewModalOpen) setIsViewModalOpen(false);
    } catch (error) {
      console.error("Failed to verify doctor", error);
    }
  };

  // Filter Logic
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpec = specFilter ? d.specialization.toLowerCase().includes(specFilter.toLowerCase()) : true;
    const matchesStatus = statusFilter ? d.verification.toLowerCase() === statusFilter.toLowerCase() : true;
    return matchesSearch && matchesSpec && matchesStatus;
  });

  // Dynamic Stats Calculation
  const totalVerified = doctors.filter(d => d.verification === 'Verified').length;
  const totalPending = doctors.filter(d => d.verification === 'Pending').length;
  const totalOnLeave = doctors.filter(d => d.status === 'On Leave').length;
  // Mock today's consultations since we don't have appointment data yet
  const todayConsultations = doctors.length * 4;

  const dynamicStats = [
    { title: "Total Doctors", value: doctors.length.toLocaleString(), icon: Stethoscope, color: "text-[#1976D2]", bg: "bg-blue-50", border: "border-[#1976D2]" },
    { title: "Verified Doctors", value: totalVerified.toLocaleString(), icon: UserCheck, color: "text-[#0F9D58]", bg: "bg-green-50", border: "border-[#0F9D58]" },
    { title: "Pending Verification", value: totalPending.toLocaleString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-500" },
    { title: "Doctors On Leave", value: totalOnLeave.toLocaleString(), icon: UserX, color: "text-red-600", bg: "bg-red-50", border: "border-red-500" },
    { title: "Today's Consultations", value: todayConsultations.toLocaleString(), icon: Activity, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#0F9D58]/10">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Stethoscope className="text-indigo-600" /> Doctor Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage all registered doctors, specialists, approvals, and hospital assignments.</p>
            {apiError && <p className="text-red-500 text-sm mt-2 font-bold break-all">API Error: {apiError}</p>}
          </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-[#0F9D58] text-white rounded-xl hover:bg-[#0F9D58]/90 transition-colors text-sm font-medium shadow-sm">
            <Plus size={16} /> Add Doctor
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1976D2] border border-[#1976D2]/30 rounded-xl hover:bg-blue-50 transition-colors text-sm font-medium shadow-sm">
            <Download size={16} /> Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            <FileText size={16} /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dynamicStats.map((stat, index) => (
          <div key={index} className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 ${stat.border} hover:shadow-md transition-all group`}>
            <div className="flex justify-between items-center mb-3">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-gray-800">{stat.value}</h3>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-[#1976D2]" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Search & Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Doctor by Name, ID, Specialization..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] transition-all" 
            />
          </div>
          
          <select 
            value={specFilter}
            onChange={(e) => setSpecFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] text-gray-600"
          >
            <option value="">All Specializations</option>
            <option value="cardiology">Cardiology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="general">General Medicine</option>
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1976D2] text-gray-600"
          >
            <option value="">Verification Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
          
          <button 
            onClick={() => {
              setSearchTerm("");
              setSpecFilter("");
              setStatusFilter("");
            }}
            className="w-full bg-[#1976D2] text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Doctor Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Doctor Info</th>
                <th className="px-6 py-4 font-semibold">Specialization & Exp</th>
                <th className="px-6 py-4 font-semibold">Hospital Assigned</th>
                <th className="px-6 py-4 font-semibold">Status / Verification</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                      <div className="w-8 h-8 border-4 border-[#1976D2]/20 border-t-[#1976D2] rounded-full animate-spin"></div>
                      <p>Loading doctor data from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No doctors match your search criteria.
                  </td>
                </tr>
              ) : filteredDoctors.map((doc, index) => (
                <tr key={index} className="hover:bg-[#1976D2]/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#1976D2]/10 text-[#1976D2] flex items-center justify-center font-bold text-lg shrink-0">
                        {doc.name ? doc.name.charAt(4) || doc.name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#1976D2] transition-colors">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.id} • {doc.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{doc.specialization}</p>
                    <p className="text-xs text-gray-500">{doc.qualification} • {doc.experience}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{doc.hospital}</p>
                    <p className="text-xs text-gray-500">{doc.department}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      {getVerificationBadge(doc.verification)}
                      {getStatusBadge(doc.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(doc)} className="p-2 text-[#1976D2] bg-blue-50 rounded-lg hover:bg-[#1976D2] hover:text-white transition-colors" title="View Profile">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditModal(doc)} className="p-2 text-[#0F9D58] bg-green-50 rounded-lg hover:bg-[#0F9D58] hover:text-white transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(doc._id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete">
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

      {/* View Doctor Modal */}
      {isViewModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#1976D2]/5 to-[#0F9D58]/5">
              <h2 className="text-xl font-bold text-[#1976D2] flex items-center gap-2">
                <Stethoscope size={24} /> Doctor ERP Profile
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-4 flex flex-col gap-2">
                <button onClick={() => setActiveTab('profile')} className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-[#1976D2] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Overview Profile
                </button>
                <button onClick={() => setActiveTab('credentials')} className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'credentials' ? 'bg-[#1976D2] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Credentials & Verification
                </button>
                <button onClick={() => setActiveTab('hospital')} className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'hospital' ? 'bg-[#1976D2] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
                  Hospital Assignment
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
                {activeTab === 'profile' && (
                  <div className="animate-fade-in space-y-8">
                    {/* Top Profile Card */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#1976D2] to-[#0F9D58] p-1 shadow-lg shrink-0">
                        <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                           <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1976D2] to-[#0F9D58]">
                             {selectedDoctor.name ? (selectedDoctor.name.charAt(4) || selectedDoctor.name.charAt(0)) : 'D'}
                           </span>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h2 className="text-3xl font-black text-gray-900">{selectedDoctor.name}</h2>
                          {getVerificationBadge(selectedDoctor.verification)}
                        </div>
                        <p className="text-lg font-medium text-[#1976D2]">{selectedDoctor.specialization}</p>
                        <p className="text-sm text-gray-500">{selectedDoctor.qualification}</p>
                        
                        <div className="flex flex-wrap gap-4 pt-2">
                          <span className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <MapPin size={16} className="text-[#0F9D58]"/> {selectedDoctor.hospital}
                          </span>
                          <span className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                            <Award size={16} className="text-amber-500"/> {selectedDoctor.experience} Exp
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-center">
                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Patients Treated</p>
                        <p className="text-2xl font-black text-blue-900">{selectedDoctor.patients.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 text-center">
                        <p className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">Success Rating</p>
                        <p className="text-2xl font-black text-green-900">{selectedDoctor.rating > 0 ? selectedDoctor.rating : 'N/A'}</p>
                      </div>
                      <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-center">
                        <p className="text-xs text-purple-600 font-bold uppercase tracking-wider mb-1">Availability</p>
                        <p className="text-lg font-black text-purple-900 mt-1">{getStatusBadge(selectedDoctor.status)}</p>
                      </div>
                    </div>
                    
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Phone size={18}/></div>
                          <div>
                            <p className="text-xs text-gray-500">Phone Number</p>
                            <p className="text-sm font-bold text-gray-900">{selectedDoctor.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-50 rounded-lg text-gray-500"><Mail size={18}/></div>
                          <div>
                            <p className="text-xs text-gray-500">Email Address</p>
                            <p className="text-sm font-bold text-gray-900">{selectedDoctor.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                )}
                
                {activeTab === 'credentials' && (
                  <div className="animate-fade-in space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Verification & Documents</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                      <Clock className="text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-900 text-sm">Action Required</p>
                        <p className="text-xs text-amber-700 mt-1">Please verify the uploaded medical licenses against the national registry before approving this doctor.</p>
                      </div>
                    </div>
                    
                    {/* Placeholder for documents */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                        <FileText size={32} className="mb-2" />
                        <p className="text-sm font-bold text-gray-600">Medical License.pdf</p>
                        <p className="text-xs">Click to view document</p>
                      </div>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                        <FileText size={32} className="mb-2" />
                        <p className="text-sm font-bold text-gray-600">MD_Certificate.pdf</p>
                        <p className="text-xs">Click to view document</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 pt-4 border-t border-gray-100">
                      <button onClick={() => handleVerify(selectedDoctor._id, 'Verified')} className="px-6 py-3 bg-[#0F9D58] text-white rounded-xl font-bold shadow-md hover:bg-green-700 transition-colors">
                        Approve Doctor
                      </button>
                      <button onClick={() => handleVerify(selectedDoctor._id, 'Rejected')} className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors">
                        Reject Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#0F9D58]/10 to-transparent">
              <h2 className="text-xl font-bold text-[#0F9D58]">{isEditMode ? 'Edit Doctor' : 'Register New Doctor'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Specialization</label>
                  <input required type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Qualification</label>
                  <input required type="text" value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Experience (e.g., 5 Years)</label>
                  <input required type="text" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Department</label>
                  <input required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital Assigned</label>
                  <input required type="text" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]">
                    <option value="Available">Available</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Verification</label>
                  <select value={formData.verification} onChange={e => setFormData({...formData, verification: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F9D58]">
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#0F9D58] text-white rounded-xl font-bold shadow-sm hover:bg-[#0F9D58]/90 transition-colors">{isEditMode ? 'Update' : 'Add Doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}