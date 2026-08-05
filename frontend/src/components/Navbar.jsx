import { safeParseUser } from '../utils/authUtils';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope, Menu, X, Sun, Moon, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const token = localStorage.getItem('token');
  const user = safeParseUser() || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-colors">
      <div className="container mx-auto px-6 max-w-7xl h-[70px] flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-indigo-100 p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Stethoscope size={24} className="text-indigo-600" />
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">Smart Rural Health</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
          <a href="/#about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">About</a>
          <a href="/#services" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Services</a>
          <a href="/#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
        </div>
        
        {/* Auth / Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {token ? (
            <div className="flex items-center gap-4 border-l border-gray-200 pl-4">
              <Link 
                to={user.role === 'admin' ? '/dashboard/admin' : user.role === 'hospital' ? '/dashboard/hospital' : '/dashboard/patient'} 
                className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                <User size={18} />
                Dashboard
              </Link>
              <button 
                className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                Login
              </Link>
              <Link to="/register/patient" className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 rounded-xl transition-all active:scale-[0.98]">
                Register
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button onClick={() => setIsDark(!isDark)} className="p-2 text-gray-500 rounded-full bg-gray-50">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 text-gray-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-xl absolute w-full left-0 top-[70px]">
          <div className="flex flex-col p-4 space-y-4">
            <Link to="/" className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Home</Link>
            <a href="/#about" className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>About</a>
            <a href="/#services" className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Services</a>
            <a href="/#features" className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-50 rounded-lg" onClick={() => setIsOpen(false)}>Features</a>
            
            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
              {token ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/dashboard/admin' : user.role === 'hospital' ? '/dashboard/hospital' : '/dashboard/patient'} 
                    className="w-full text-center py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
                    Go to Dashboard
                  </Link>
                  <button 
                    className="w-full text-center py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl" 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register/patient" className="w-full text-center py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md" onClick={() => setIsOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
