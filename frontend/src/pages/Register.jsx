import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard/patient');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center section">
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="heading-2 mb-2 text-center">Create Account</h2>
        <p className="text-center text-muted mb-6">Join Smart Rural Health today.</p>
        
        {error && <div className="p-3 mb-4 text-sm text-white bg-danger rounded-md">{error}</div>}
        
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="col-span-2" style={{ gridColumn: 'span 2' }}>
            <label className="text-sm font-semibold mb-1 block">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              style={inputStyle}
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Email</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              style={inputStyle}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+91 9876543210" 
              style={inputStyle}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={inputStyle}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={inputStyle}
              value={formData.confirm_password}
              onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
              required
            />
          </div>
          
          <div className="col-span-2 mt-4" style={{ gridColumn: 'span 2' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <p className="text-center mt-4 text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: 'var(--radius-md)',
  border: '1px solid rgba(0,0,0,0.1)',
  outline: 'none',
  fontFamily: 'inherit'
};

export default Register;
