import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Route based on role
        const role = data.user.role;
        if (role === 'admin') {
          navigate('/dashboard/admin');
        } else if (role === 'hospital_admin' || role === 'hospital') {
          navigate('/dashboard/hospital');
        } else {
          navigate('/dashboard/patient');
        }
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
    <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="heading-2 mb-6 text-center">Welcome Back</h2>
        {error && <div className="p-3 mb-4 text-sm text-white bg-danger rounded-md">{error}</div>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold mb-1 block">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="form-input" 
              style={inputStyle}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className="form-input" 
              style={inputStyle}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-muted">
          Don't have an account? <Link to="/register" className="text-primary font-semibold">Register</Link>
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

export default Login;
