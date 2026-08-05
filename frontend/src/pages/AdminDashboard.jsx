import { safeParseUser } from '../utils/authUtils';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingHospitals = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = safeParseUser();
        
        if (!token || user?.role !== 'admin') {
          navigate('/login');
          return;
        }

        const res = await fetch('http://localhost:5000/api/hospitals/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        
        if (data.success) {
          setHospitals(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch hospitals');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingHospitals();
  }, [navigate]);

  const approveHospital = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/hospitals/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      if (data.success) {
        // Remove approved hospital from list
        setHospitals(hospitals.filter(h => h._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error approving hospital');
    }
  };

  if (loading) return <div className="container section text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="container section min-h-screen">
      <h2 className="heading-2 mb-8">Admin Dashboard</h2>
      
      <div className="glass-card p-6">
        <h3 className="heading-3 mb-6">Pending Hospital Approvals ({hospitals.length})</h3>
        
        {error && <div className="p-3 mb-4 text-white bg-danger rounded-md">{error}</div>}
        
        {hospitals.length === 0 ? (
          <p className="text-muted">No pending hospitals at this time.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {hospitals.map(hospital => (
              <div key={hospital._id} className="flex justify-between items-center p-4 border rounded-md border-color">
                <div>
                  <h4 className="font-bold text-lg">{hospital.name}</h4>
                  <p className="text-sm text-muted">{hospital.address} | Contact: {hospital.contact_number}</p>
                  <p className="text-xs mt-1">Departments: {hospital.departments}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => approveHospital(hospital._id)}
                    className="btn btn-primary flex items-center gap-2"
                    style={{ padding: '0.5rem 1rem' }}
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  {/* Optional: Add reject button later */}
                  <button className="btn btn-outline flex items-center gap-2" style={{ padding: '0.5rem 1rem' }}>
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
