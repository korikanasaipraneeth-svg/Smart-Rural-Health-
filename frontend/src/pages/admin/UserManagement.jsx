import React, { useState, useEffect } from 'react';
import { 
  Users, Activity, UserPlus, AlertCircle, Calendar, FileText, 
  Search, Filter, Download, Printer, RefreshCw, Eye, Edit, Trash2, 
  X, ChevronLeft, ChevronRight, CheckCircle, Clock 
} from 'lucide-react';
import { adminService } from '../../services/api';

export default function UserManagement() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', password: '', age: '', gender: 'Other', 
    blood_group: '', address: '', role: 'patient', status: 'Active', 
    riskLevel: 'None', assignedHospital: '', assignedDoctor: ''
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");



  const fetchPatients = async () => {
    try {
      const response = await adminService.getPatients();
      const patientArray = response.data || response || [];
      const mappedPatients = (Array.isArray(patientArray) ? patientArray : []).map(p => ({
        _id: p._id,
        id: String(p._id || '').substring(0, 8).toUpperCase(),
        full_name: p.full_name,
        name: p.full_name,
        age: p.age || 'N/A',
        gender: p.gender || 'Unknown',
        bloodGroup: p.blood_group || 'N/A',
        blood_group: p.blood_group || '',
        phone: p.phone || 'N/A',
        email: p.email,
        address: p.address || '',
        disease: p.diseasePrediction || 'Unknown',
        riskLevel: p.riskLevel || 'None',
        risk: p.riskLevel || 'None',
        assignedDoctor: p.assignedDoctor || '',
        doctor: p.assignedDoctor || 'Unassigned',
        assignedHospital: p.assignedHospital || '',
        hospital: p.assignedHospital || 'Unassigned',
        appointmentStatus: 'Confirmed', // Mock
        date: '2026-08-01',
        status: p.status || 'Active'
      }));
      setPatients(mappedPatients);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'Emergency': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700 border border-red-200">🔴 Emergency</span>;
      case 'High': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700 border border-orange-200">🟠 High Risk</span>;
      case 'Medium': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">🟡 Medium Risk</span>;
      case 'Low': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 border border-green-200">🟢 Low Risk</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Active</span>;
      case 'Inactive': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Inactive</span>;
      case 'Emergency': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 animate-pulse">Emergency</span>;
      default: return null;
    }
  };

  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      full_name: '', email: '', phone: '', password: '', age: '', gender: 'Other', 
      blood_group: '', address: '', role: 'patient', status: 'Active', 
      riskLevel: 'None', assignedHospital: '', assignedDoctor: ''
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (patient) => {
    setIsEditMode(true);
    setSelectedPatient(patient);
    setFormData({
      full_name: patient.full_name, email: patient.email, phone: patient.phone === 'N/A' ? '' : patient.phone, 
      password: '', age: patient.age === 'N/A' ? '' : patient.age, gender: patient.gender === 'Unknown' ? 'Other' : patient.gender, 
      blood_group: patient.blood_group, address: patient.address, role: 'patient', status: patient.status, 
      riskLevel: patient.riskLevel, assignedHospital: patient.assignedHospital, assignedDoctor: patient.assignedDoctor
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await adminService.deletePatient(id);
        fetchPatients();
      } catch (error) {
        console.error("Failed to delete patient", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (isEditMode && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      if (isEditMode) {
        await adminService.updatePatient(selectedPatient._id, dataToSubmit);
      } else {
        await adminService.addPatient(dataToSubmit);
      }
      setIsAddModalOpen(false);
      fetchPatients();
    } catch (error) {
      console.error("Failed to save patient", error);
    }
  };

  // Filter Logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.phone.includes(searchTerm);
    const matchesRisk = riskFilter ? p.risk.toLowerCase() === riskFilter.toLowerCase() : true;
    const matchesHospital = hospitalFilter ? p.hospital.toLowerCase().includes(hospitalFilter.toLowerCase()) : true;
    return matchesSearch && matchesRisk && matchesHospital;
  });

  // Dynamic Stats Calculation
  const totalActive = patients.filter(p => p.status === 'Active').length;
  const totalEmergency = patients.filter(p => p.risk === 'Emergency').length;
  // Mocks for data not in the current DB schema
  const newPatientsToday = Math.floor(patients.length * 0.1); 
  const appointmentsToday = Math.floor(patients.length * 0.3);
  const aiPredictions = Math.floor(patients.length * 0.5);

  const dynamicStats = [
    { title: "Total Registered Patients", value: patients.length.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%" },
    { title: "Active Patients", value: totalActive.toLocaleString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", trend: "+5%" },
    { title: "New Patients Today", value: newPatientsToday.toLocaleString(), icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-100", trend: "+2%" },
    { title: "Emergency Patients", value: totalEmergency.toLocaleString(), icon: AlertCircle, color: "text-red-600", bg: "bg-red-100", trend: "-4%" },
    { title: "Appointments Today", value: appointmentsToday.toLocaleString(), icon: Calendar, color: "text-amber-600", bg: "bg-amber-100", trend: "+8%" },
    { title: "AI Predictions", value: aiPredictions.toLocaleString(), icon: Activity, color: "text-purple-600", bg: "bg-purple-100", trend: "+15%" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all registered patients, records, appointments, and emergency information.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
            <UserPlus size={16} /> Add Patient
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {dynamicStats.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -mr-8 -mt-8 ${stat.bg} group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-600'} bg-gray-50 px-2 py-1 rounded-full`}>
                {stat.trend}
              </span>
            </div>
            <div className="mt-4 relative z-10">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs text-gray-500 mt-1 font-medium">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={18} className="text-gray-500" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Search & Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name, ID, Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
            />
          </div>
          
          <select 
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
          >
            <option value="">All Risk Levels</option>
            <option value="emergency">Emergency</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
          
          <select 
            value={hospitalFilter}
            onChange={(e) => setHospitalFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
          >
            <option value="">All Hospitals</option>
            <option value="city">City Hospital</option>
            <option value="apollo">Apollo Hospital</option>
            <option value="rural">Rural Health Center</option>
          </select>
          
          <div className="flex gap-2">
            <button 
              onClick={() => {
                setSearchTerm("");
                setRiskFilter("");
                setHospitalFilter("");
              }}
              className="w-full bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Medical Details</th>
                <th className="px-6 py-4 font-semibold">Assignment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p>Loading patient data from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : filteredPatients.map((patient, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {patient.name ? patient.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.id} • {patient.age}Y • {patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 font-medium">{patient.phone}</p>
                    <p className="text-xs text-gray-500">{patient.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{patient.disease}</p>
                    <div className="mt-1">{getRiskBadge(patient.risk)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{patient.doctor}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{patient.hospital}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(patient.status)}
                      <span className="text-[10px] text-gray-500 font-medium uppercase">{patient.appointmentStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(patient)} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditModal(patient)} className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors tooltip-trigger" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors tooltip-trigger" title="Medical Records">
                        <FileText size={16} />
                      </button>
                      <button onClick={() => handleDelete(patient._id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors tooltip-trigger" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-sm text-gray-500">Showing 1 to 4 of 12,450 entries</span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded-lg hover:bg-gray-200 text-gray-500 disabled:opacity-50" disabled><ChevronLeft size={20} /></button>
            <button className="w-8 h-8 rounded-lg bg-indigo-600 text-white text-sm font-medium">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-700 text-sm font-medium">2</button>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-700 text-sm font-medium">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-700 text-sm font-medium">1245</button>
            <button className="p-1 rounded-lg hover:bg-gray-200 text-gray-500"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* View Patient Modal */}
      {isViewModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="text-indigo-600" /> Patient Profile - {selectedPatient.id}
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column - Profile */}
                <div className="col-span-1 space-y-6">
                  <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-3xl mb-4 shadow-inner">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{selectedPatient.age} Years • {selectedPatient.gender}</p>
                    {getStatusBadge(selectedPatient.status)}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Contact Info</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium text-gray-900">{selectedPatient.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium text-gray-900">{selectedPatient.email}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Blood Group:</span>
                        <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{selectedPatient.bloodGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Columns - Medical Data */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1">Health Risk Score</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-orange-700">84</span>
                        <span className="text-sm text-orange-600 font-medium">/ 100</span>
                      </div>
                      <div className="mt-2">{getRiskBadge(selectedPatient.risk)}</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Current Disease</p>
                      <h4 className="text-xl font-bold text-indigo-900">{selectedPatient.disease}</h4>
                      <p className="text-xs text-indigo-600 mt-2 flex items-center gap-1"><Activity size={12}/> Diagnosed via AI</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" /> Assignment & Appointments
                    </h4>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Assigned Doctor</p>
                          <p className="font-bold text-gray-900">{selectedPatient.doctor}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Hospital</p>
                          <p className="font-bold text-gray-900">{selectedPatient.hospital}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Clock size={20} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Upcoming Appointment</p>
                          <p className="text-xs text-gray-500">{selectedPatient.date} • 10:30 AM • {selectedPatient.appointmentStatus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" /> Medical Actions
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button className="flex flex-col items-center justify-center p-3 gap-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-indigo-600">
                        <FileText size={20} />
                        <span className="text-xs font-medium">History</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-3 gap-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-emerald-600">
                        <Activity size={20} />
                        <span className="text-xs font-medium">Lab Reports</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-3 gap-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-amber-600">
                        <Calendar size={20} />
                        <span className="text-xs font-medium">Visits</span>
                      </button>
                      <button className="flex flex-col items-center justify-center p-3 gap-2 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-gray-700">
                        <Download size={20} />
                        <span className="text-xs font-medium">Export</span>
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-600/10 to-transparent">
              <h2 className="text-xl font-bold text-indigo-700">{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                  <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">{isEditMode ? 'Password (leave blank to keep)' : 'Password'}</label>
                  <input required={!isEditMode} type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Age</label>
                  <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Blood Group</label>
                  <input type="text" value={formData.blood_group} onChange={e => setFormData({...formData, blood_group: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Address</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="Active">Active</option>
                    <option value="Discharged">Discharged</option>
                    <option value="Critical">Critical</option>
                    <option value="Under Observation">Under Observation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Risk Level</label>
                  <select value={formData.riskLevel} onChange={e => setFormData({...formData, riskLevel: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="None">None</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Doctor</label>
                  <input type="text" value={formData.assignedDoctor} onChange={e => setFormData({...formData, assignedDoctor: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Assigned Hospital</label>
                  <input type="text" value={formData.assignedHospital} onChange={e => setFormData({...formData, assignedHospital: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors">{isEditMode ? 'Update' : 'Add Patient'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}