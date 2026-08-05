import { Link } from 'react-router-dom';
import { 
  Activity, Shield, MapPin, Check, ChevronRight 
} from 'lucide-react';
import './LandingPage.css';
import d2Img from '../assets/d2.jpeg';
import d3Img from '../assets/d3.jpeg';

// Helper Components
const VayuCheck = ({ text }) => (
  <div className="vayu-checkitem">
    <div className="vayu-checkicon"><Check size={14} strokeWidth={4} /></div>
    <span>{text}</span>
  </div>
);

const VayuBadge = ({ type, icon, text }) => (
  <div className={`vayu-badge badge-${type}`}>
    {icon} <span>{text}</span>
  </div>
);

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="vayu-container flex flex-col items-center">
          <h1 className="hero-title">
            Welcome to Smart Rural Health <Activity color="#4F46E5" size={48} strokeWidth={2.5} />
          </h1>
          <p className="hero-subtitle mb-8 mt-4">
            The <span className="font-semibold" style={{ color: '#111827' }}>Intelligent AI Healthcare Assistance System</span> empowering rural communities, doctors, and hospitals with real-time disease prediction, active hospital tracking, and seamless reporting.
          </p>
          <Link to="/register" className="btn-vayu mt-4">
            Explore Dashboard <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Section 1: Image Left, Text Right */}
      <section id="about" className="vayu-section">
        <div className="vayu-container vayu-grid">
          {/* Placeholder Card (Left) */}
          <div className="vayu-placeholder">
            <img src={d2Img} alt="Doctor Consultation" />
          </div>
          
          {/* Text Content (Right) */}
          <div>
            <VayuBadge type="red" icon={<Shield size={12} />} text="Prevention First" />
            <h2 className="vayu-section-title">Combating Rural Diseases</h2>
            <p className="vayu-section-text">
              Lack of medical experts poses a significant threat during seasonal shifts. Our platform uses AI-driven predictive modeling to identify high-risk diseases before an outbreak occurs.
            </p>
            <div className="vayu-checklist">
              <VayuCheck text="Real-time tracking of symptoms and condition severity." />
              <VayuCheck text="Targeted virtual consultations for vulnerable neighborhoods." />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Text Left, Image Right */}
      <section id="services" className="vayu-section pb-24">
        <div className="vayu-container vayu-grid">
          {/* Text Content (Left) */}
          <div className="order-last lg:order-first">
            <VayuBadge type="green" icon={<MapPin size={12} />} text="Active Response" />
            <h2 className="vayu-section-title">Data-Driven Hospital Access</h2>
            <p className="vayu-section-text">
              Intelligence from our platform directs rural patients directly to the nearest equipped facility. By analyzing real-time data, hospitals and ambulances are deployed efficiently to break the transmission cycle.
            </p>
            <div className="vayu-checklist">
              <VayuCheck text="Optimized routing for municipal ambulances and vehicles." />
              <VayuCheck text="Immediate response teams dispatched to reported red zones." />
            </div>
          </div>
          
          {/* Placeholder Card (Right) */}
          <div className="vayu-placeholder">
            <img src={d3Img} alt="Hospital Access" />
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default LandingPage;
