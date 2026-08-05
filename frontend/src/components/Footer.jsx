import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-12">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <Heart className="text-indigo-600 fill-indigo-600" size={24} /> 
              Smart Rural Health
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              AI-Powered Healthcare Support for Rural Communities. Providing complete healthcare accessibility to the unreached through modern technology.
            </p>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><a href="/#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><Link to="/services" className="hover:text-indigo-600 transition-colors">Services</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-600 transition-colors">FAQs</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">Emergency</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-red-600 font-medium">
                Ambulance: <a href="tel:108" className="hover:underline">108</a>
              </li>
              <li className="flex items-center gap-2 text-red-600 font-medium">
                Emergency SOS: <a href="tel:112" className="hover:underline">112</a>
              </li>
              <li className="flex items-center gap-2 text-red-600 font-medium">
                Medical Helpline: <a href="tel:104" className="hover:underline">104</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gray-900 font-semibold mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                <a href="mailto:korikanasaipraneeth@gmail.com" className="hover:text-indigo-600 break-all">korikanasaipraneeth@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                <a href="tel:+917569552087" className="hover:text-indigo-600">+91 75695 52087</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-500 shrink-0 mt-0.5" />
                <span>Rural Tech Park, AP, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Smart Rural Healthcare Assistance. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
