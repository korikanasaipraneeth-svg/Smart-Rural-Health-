import React, { useState, useEffect } from 'react';
import { 
  Activity, ShieldAlert, ThermometerSun, Bot, Search, Filter, 
  Plus, FileText, Eye, Edit, Trash2, X, AlertTriangle, Pill, User
} from 'lucide-react';
import { adminService } from '../../services/api';

export default function DiseaseManagement() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState(null);
  
  const [formData, setFormData] = useState({
    diseaseId: `DIS-${Math.floor(Math.random() * 10000)}`, name: '', category: '', 
    symptoms: '', riskLevel: 'Medium', contagious: 'No', seasonal: 'All Year', 
    treatment: '', status: 'Active'
  });

  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const [seasonalFilter, setSeasonalFilter] = useState("");



  const fetchDiseases = async () => {
    try {
      const response = await adminService.getDiseases();
      const diseaseArray = response.data || response || [];
      const mappedDiseases = (Array.isArray(diseaseArray) ? diseaseArray : []).map(d => ({
        _id: d._id,
        id: d.diseaseId || String(d._id || '').substring(0, 8).toUpperCase(),
        name: d.name,
        category: d.category,
        symptoms: d.symptoms,
        riskLevel: d.riskLevel || 'Medium',
        contagious: d.contagious || 'No',
        seasonal: d.seasonal || 'All Year',
        treatment: d.treatment || 'Consult Doctor',
        status: d.status || 'Active'
      }));
      setDiseases(mappedDiseases);
    } catch (error) {
      console.error('Failed to fetch diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiseases();
  }, []);

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'High': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">🔴 High Risk</span>;
      case 'Medium': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-700">🟠 Medium Risk</span>;
      case 'Low': return <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">🟢 Low Risk</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-100 text-emerald-700">Active</span>;
      case 'Inactive': return <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">Inactive</span>;
      default: return null;
    }
  };

  const openViewModal = (disease) => {
    setSelectedDisease(disease);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      diseaseId: `DIS-${Math.floor(Math.random() * 10000)}`, name: '', category: '', 
      symptoms: '', riskLevel: 'Medium', contagious: 'No', seasonal: 'All Year', 
      treatment: '', status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (disease) => {
    setIsEditMode(true);
    setSelectedDisease(disease);
    setFormData({
      diseaseId: disease.id, name: disease.name, category: disease.category, 
      symptoms: disease.symptoms, riskLevel: disease.riskLevel, contagious: disease.contagious, 
      seasonal: disease.seasonal, treatment: disease.treatment, status: disease.status
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this disease?")) {
      try {
        await adminService.deleteDisease(id);
        fetchDiseases();
      } catch (error) {
        console.error("Failed to delete disease", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await adminService.updateDisease(selectedDisease._id, formData);
      } else {
        await adminService.addDisease(formData);
      }
      setIsAddModalOpen(false);
      fetchDiseases();
    } catch (error) {
      console.error("Failed to save disease", error);
    }
  };

  // Filter Logic
  const filteredDiseases = diseases.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? d.category.toLowerCase().includes(categoryFilter.toLowerCase()) : true;
    const matchesRisk = riskFilter ? d.riskLevel.toLowerCase() === riskFilter.toLowerCase() : true;
    const matchesSeasonal = seasonalFilter ? d.seasonal.toLowerCase().includes(seasonalFilter.toLowerCase()) : true;
    return matchesSearch && matchesCategory && matchesRisk && matchesSeasonal;
  });

  // Dynamic Stats Calculation
  const activeOutbreaks = diseases.filter(d => d.riskLevel === 'High' && d.contagious === 'Yes').length;
  const highRisk = diseases.filter(d => d.riskLevel === 'High').length;
  const seasonal = diseases.filter(d => d.seasonal !== 'All Year').length;
  // Mock AI predictions scaling with disease count
  const aiPredictions = diseases.length * 15;

  const dynamicStats = [
    { title: "Total Diseases", value: diseases.length.toLocaleString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-500" },
    { title: "Active Outbreaks", value: activeOutbreaks.toLocaleString(), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-500" },
    { title: "High Risk", value: highRisk.toLocaleString(), icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-500" },
    { title: "Seasonal", value: seasonal.toLocaleString(), icon: ThermometerSun, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-500" },
    { title: "AI Predictions", value: aiPredictions.toLocaleString(), icon: Bot, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-500" },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
        <div>
          <h1 className="text-2xl font-bold text-indigo-900">Disease Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage diseases, symptoms, treatments, and AI prediction datasets.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={16} /> Add Disease
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-medium shadow-sm">
            <FileText size={16} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dynamicStats.map((stat, index) => (
          <div key={index} className={`bg-white p-4 rounded-2xl shadow-sm border-l-4 ${stat.border} hover:shadow-md transition-all group`}>
            <div className={`w-10 h-10 mb-3 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={20} />
            </div>
            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wider">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search Disease, Symptoms..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
            />
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
          >
            <option value="">All Categories</option>
            <option value="viral">Viral Infection</option>
            <option value="bacterial">Bacterial Infection</option>
          </select>
          
          <select 
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
          >
            <option value="">Risk Level</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          <select 
            value={seasonalFilter}
            onChange={(e) => setSeasonalFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
          >
            <option value="">Seasonal</option>
            <option value="monsoon">Monsoon</option>
            <option value="summer">Summer</option>
            <option value="winter">Winter</option>
          </select>
          
          <button 
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("");
              setRiskFilter("");
              setSeasonalFilter("");
            }}
            className="w-full bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Disease Info</th>
                <th className="px-6 py-4 font-semibold">Risk & Category</th>
                <th className="px-6 py-4 font-semibold">Symptoms</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p>Loading disease data from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredDiseases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No diseases match your search criteria.
                  </td>
                </tr>
              ) : filteredDiseases.map((disease, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{disease.name}</p>
                    <p className="text-xs text-gray-500">{disease.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900 mb-1">{disease.category}</p>
                    {getRiskBadge(disease.riskLevel)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 truncate max-w-[200px]">{disease.symptoms}</p>
                    <p className="text-xs text-gray-400 mt-1">Contagious: {disease.contagious}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(disease.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openViewModal(disease)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditModal(disease)} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(disease._id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete">
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

      {isViewModalOpen && selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-transparent">
              <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                <Activity size={24} className="text-indigo-600" /> Disease Details
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                   <Activity size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900">{selectedDisease.name}</h2>
                  <p className="text-sm text-gray-500 font-medium">{selectedDisease.id} • {selectedDisease.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">Risk Level</p>
                  {getRiskBadge(selectedDisease.riskLevel)}
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-1">Seasonal Outbreak</p>
                  <p className="text-lg font-bold text-amber-900">{selectedDisease.seasonal}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Medical Guidelines</h3>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Common Symptoms</p>
                    <p className="text-sm text-gray-600">{selectedDisease.symptoms}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Pill className="text-indigo-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Recommended Treatment</p>
                    <p className="text-sm text-gray-600">{selectedDisease.treatment}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <Bot className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">AI Prediction Status</p>
                    <p className="text-sm text-gray-600">Model accuracy is currently at 94% based on rural health symptom datasets.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Disease Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-transparent">
              <h2 className="text-xl font-bold text-indigo-900">{isEditMode ? 'Edit Disease' : 'Add New Disease'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Disease Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Risk Level</label>
                  <select value={formData.riskLevel} onChange={e => setFormData({...formData, riskLevel: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Symptoms</label>
                  <textarea required value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" rows="3" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Treatment</label>
                  <textarea value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" rows="3" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contagious</label>
                  <select value={formData.contagious} onChange={e => setFormData({...formData, contagious: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Seasonal</label>
                  <input type="text" value={formData.seasonal} onChange={e => setFormData({...formData, seasonal: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" placeholder="e.g., All Year, Monsoon, Winter" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors">{isEditMode ? 'Update' : 'Add Disease'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}