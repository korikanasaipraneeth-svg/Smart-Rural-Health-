import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Star, MessageCircleWarning, Lightbulb, 
  Search, Filter, Plus, FileText, CheckCircle, Clock, XCircle, 
  Eye, Reply, Trash2, X, Send, Paperclip
} from 'lucide-react';
import { adminService } from '../../services/api';

export default function FeedbackManagement() {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyText, setReplyText] = useState("");
  
  const [formData, setFormData] = useState({
    feedbackId: `FB-${Math.floor(Math.random() * 10000)}`, user: '', userType: 'Patient', 
    hospital: '', category: 'Suggestion', subject: '', rating: 5, description: '', status: 'New'
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");



  const fetchFeedbacks = async () => {
    try {
      const data = await adminService.getFeedback();
      const mappedFeedbacks = data.map(fb => ({
        _id: fb._id,
        id: fb.feedbackId || fb._id.substring(0, 8).toUpperCase(),
        user: fb.user,
        userType: fb.userType,
        hospital: fb.hospital || 'General App',
        category: fb.category,
        subject: fb.subject,
        rating: fb.rating,
        status: fb.status || 'New',
        date: fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
        description: fb.description,
        reply: fb.reply
      }));
      setFeedbacks(mappedFeedbacks);
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-blue-100 text-blue-700 border border-blue-200">New</span>;
      case 'In Progress': return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-amber-100 text-amber-700 border border-amber-200">In Progress</span>;
      case 'Resolved': return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-emerald-100 text-emerald-700 border border-emerald-200">Resolved</span>;
      case 'Closed': return <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-gray-100 text-gray-600 border border-gray-200">Closed</span>;
      default: return null;
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Complaint': return <span className="text-red-600 flex items-center gap-1 text-sm font-medium"><MessageCircleWarning size={14}/> {category}</span>;
      case 'Suggestion': return <span className="text-purple-600 flex items-center gap-1 text-sm font-medium"><Lightbulb size={14}/> {category}</span>;
      case 'Bug Report': return <span className="text-orange-600 flex items-center gap-1 text-sm font-medium"><XCircle size={14}/> {category}</span>;
      default: return <span className="text-blue-600 flex items-center gap-1 text-sm font-medium"><MessageSquare size={14}/> {category}</span>;
    }
  };

  const openViewModal = (feedback) => {
    setSelectedFeedback(feedback);
    setReplyText("");
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      feedbackId: `FB-${Math.floor(Math.random() * 10000)}`, user: '', userType: 'Patient', 
      hospital: '', category: 'Suggestion', subject: '', rating: 5, description: '', status: 'New'
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent opening the view modal
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await adminService.deleteFeedback(id);
        fetchFeedbacks();
      } catch (error) {
        console.error("Failed to delete feedback", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.addFeedback(formData);
      setIsAddModalOpen(false);
      fetchFeedbacks();
    } catch (error) {
      console.error("Failed to add feedback", error);
    }
  };

  const handleSendReply = async () => {
    if(!replyText) return;
    try {
      await adminService.updateFeedback(selectedFeedback._id, { 
        reply: replyText,
        status: 'Resolved'
      });
      setIsViewModalOpen(false);
      fetchFeedbacks();
    } catch (error) {
      console.error("Failed to send reply", error);
    }
  };

  // Filter Logic
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesSearch = fb.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fb.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fb.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? fb.userType.toLowerCase() === typeFilter.toLowerCase() : true;
    const matchesStatus = statusFilter ? fb.status.toLowerCase() === statusFilter.toLowerCase() : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Dynamic Stats Calculation
  const totalPending = feedbacks.filter(fb => fb.status === 'New' || fb.status === 'In Progress').length;
  const totalResolved = feedbacks.filter(fb => fb.status === 'Resolved' || fb.status === 'Closed').length;
  const totalComplaints = feedbacks.filter(fb => fb.category === 'Complaint').length;
  const totalSuggestions = feedbacks.filter(fb => fb.category === 'Suggestion').length;
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0) / feedbacks.length).toFixed(1) 
    : '0.0';

  const dynamicStats = [
    { title: "Total Feedback", value: feedbacks.length.toLocaleString(), icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-500" },
    { title: "Pending", value: totalPending.toLocaleString(), icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-500" },
    { title: "Resolved", value: totalResolved.toLocaleString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-500" },
    { title: "Complaints", value: totalComplaints.toLocaleString(), icon: MessageCircleWarning, color: "text-red-600", bg: "bg-red-50", border: "border-red-500" },
    { title: "Suggestions", value: totalSuggestions.toLocaleString(), icon: Lightbulb, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-500" },
    { title: "Avg Rating", value: avgRating, icon: Star, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-400" }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user feedback, complaints, suggestions, and service ratings.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm">
            <Plus size={16} /> Add Feedback
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Feedback ID, User Name, Subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
          />
        </div>
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
        >
          <option value="">All Types</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="hospital">Hospital</option>
        </select>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-600"
        >
          <option value="">All Status</option>
          <option value="new">New</option>
          <option value="in progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <button 
          onClick={() => {
            setSearchTerm("");
            setTypeFilter("");
            setStatusFilter("");
          }}
          className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
        >
          Reset
        </button>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4 font-semibold">Feedback Details</th>
                <th className="px-6 py-4 font-semibold">User Info</th>
                <th className="px-6 py-4 font-semibold">Rating & Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p>Loading feedback data from database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredFeedbacks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No feedback match your search criteria.
                  </td>
                </tr>
              ) : filteredFeedbacks.map((fb, index) => (
                <tr key={index} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer" onClick={() => openViewModal(fb)}>
                  <td className="px-6 py-4">
                    {getCategoryBadge(fb.category)}
                    <p className="text-sm font-bold text-gray-900 mt-1 truncate max-w-[250px]">{fb.subject}</p>
                    <p className="text-xs text-gray-400">{fb.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">{fb.user}</p>
                    <p className="text-xs text-gray-500">{fb.userType} • {fb.hospital || 'System'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < fb.rating ? "fill-current" : "text-gray-200"} />
                        ))}
                      </div>
                      {getStatusBadge(fb.status)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {fb.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors" title="Reply/View">
                      <Reply size={16} />
                    </button>
                    <button onClick={(e) => handleDelete(e, fb._id)} className="p-2 ml-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View/Reply Modal */}
      {isViewModalOpen && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Feedback: {selectedFeedback.id}
              </h2>
              <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              
              {/* User Profile Block */}
              <div className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {selectedFeedback.user ? selectedFeedback.user.charAt(0) : 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{selectedFeedback.user}</p>
                  <p className="text-xs text-gray-500">{selectedFeedback.userType} • {selectedFeedback.hospital || 'General App'}</p>
                </div>
                <div className="text-right">
                  <div className="flex gap-1 text-yellow-400 mb-1 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < selectedFeedback.rating ? "fill-current" : "text-gray-200"} />
                    ))}
                  </div>
                  {getStatusBadge(selectedFeedback.status)}
                </div>
              </div>

              {/* Feedback Content */}
              <div>
                <div className="mb-2">{getCategoryBadge(selectedFeedback.category)}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">{selectedFeedback.subject}</h3>
                <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50/30 p-4 rounded-xl border border-indigo-50">
                  "{selectedFeedback.description}"
                </p>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Clock size={12}/> Submitted on {selectedFeedback.date}
                </p>
              </div>

              {/* Existing Reply */}
              {selectedFeedback.reply && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">Admin Resolution / Reply</p>
                  <p className="text-sm text-gray-800">{selectedFeedback.reply}</p>
                </div>
              )}

              {/* Reply Box */}
              {!selectedFeedback.reply && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <p className="text-sm font-bold text-gray-900">Reply to User</p>
                  <textarea 
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your official resolution or response here..."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Paperclip size={20} />
                    </button>
                    <button onClick={handleSendReply} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-bold shadow-md disabled:opacity-50">
                      <Send size={16} /> Send Reply & Resolve
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Feedback Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col my-auto border border-white/20">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Add New Feedback</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">User Name</label>
                  <input required type="text" value={formData.user} onChange={e => setFormData({...formData, user: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">User Type</label>
                  <select value={formData.userType} onChange={e => setFormData({...formData, userType: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Hospital">Hospital</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600">
                    <option value="Suggestion">Suggestion</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="App Feedback">App Feedback</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rating</label>
                  <input required type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hospital (Optional)</label>
                  <input type="text" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                  <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600" rows="3" />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors">Add Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}