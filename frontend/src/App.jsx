import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Services from './pages/Services';
import FAQ from './pages/FAQ';

// Auth Pages (to be created)
import RoleSelection from './pages/auth/RoleSelection';
import PatientLogin from './pages/auth/PatientLogin';
import HospitalLogin from './pages/auth/HospitalLogin';
import PatientRegister from './pages/auth/PatientRegister';
import HospitalRegister from './pages/auth/HospitalRegister';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Patient Pages
import Dashboard from './pages/Dashboard';
import SymptomChecker from './pages/SymptomChecker';
import PatientProfile from './pages/patient/Profile';
import PatientRecords from './pages/patient/Records';
import PatientAppointments from './pages/patient/Appointments';
import DocumentScanner from './pages/patient/DocumentScanner';
import LiveMap from './pages/patient/LiveMap';
import PatientBloodBank from './pages/patient/PatientBloodBank';
import HealthCamps from './pages/patient/HealthCamps';
import MySchemes from './pages/patient/MySchemes';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminBloodBank from './pages/admin/AdminBloodBank';
import AdminCamps from './pages/admin/AdminCamps';
import AdminClaims from './pages/admin/AdminClaims';
import AdminSupplyChain from './pages/admin/AdminSupplyChain';
import UserManagement from './pages/admin/UserManagement';
import HospitalManagement from './pages/admin/HospitalManagement';
import AdminEmergency from './pages/admin/EmergencyManagement';
import DoctorManagementAdmin from './pages/admin/DoctorManagementAdmin';
import AdminAppointments from './pages/admin/AdminAppointments';
import DiseaseManagement from './pages/admin/DiseaseManagement';
import AIPrediction from './pages/admin/AIPrediction';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminReports from './pages/admin/AdminReports';
import FeedbackManagement from './pages/admin/FeedbackManagement';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';

// Hospital Pages
import HospitalOverview from './pages/hospital/HospitalOverview';
import HospitalProfile from './pages/hospital/HospitalProfile';
import DoctorManagement from './pages/hospital/DoctorManagement';
import PatientManagement from './pages/hospital/PatientManagement';
import HospitalEmergency from './pages/hospital/EmergencyRequests';
import HospitalAppointments from './pages/hospital/HospitalAppointments';
import BedAvailability from './pages/hospital/BedAvailability';
import InventoryManagement from './pages/hospital/InventoryManagement';
import CampManagement from './pages/hospital/CampManagement';
import ClaimsManagement from './pages/hospital/ClaimsManagement';
import BloodBankDashboard from './pages/hospital/BloodBankDashboard';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: 'var(--color-bg-card)', color: 'var(--text-main)' } }} />
      <Routes>
        {/* Public Routes wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<RoleSelection />} />
          <Route path="/login/patient" element={<PatientLogin />} />
          <Route path="/login/hospital" element={<HospitalLogin />} />
          <Route path="/register/patient" element={<PatientRegister />} />
          <Route path="/register/hospital" element={<HospitalRegister />} />
          {/* Legacy routes mapping */}
          <Route path="/register" element={<Navigate to="/register/patient" replace />} />
          <Route path="/admin" element={<Navigate to="/dashboard/admin" replace />} />
        </Route>

        {/* Dashboard Routes wrapped in DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Patient Routes */}
          <Route path="patient" element={<Dashboard />} />
          <Route path="patient/profile" element={<PatientProfile />} />
          <Route path="patient/records" element={<PatientRecords />} />
          <Route path="patient/appointments" element={<PatientAppointments />} />
          <Route path="patient/symptom-checker" element={<SymptomChecker />} />
          <Route path="patient/scanner" element={<DocumentScanner />} />
          <Route path="patient/live-map" element={<LiveMap />} />
          <Route path="patient/blood-bank" element={<PatientBloodBank />} />
          <Route path="patient/camps" element={<HealthCamps />} />
          <Route path="patient/schemes" element={<MySchemes />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminOverview />} />
          <Route path="admin/blood-bank" element={<AdminBloodBank />} />
          <Route path="admin/camps" element={<AdminCamps />} />
          <Route path="admin/claims" element={<AdminClaims />} />
          <Route path="admin/supply-chain" element={<AdminSupplyChain />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/doctors" element={<DoctorManagementAdmin />} />
          <Route path="admin/hospitals" element={<HospitalManagement />} />
          <Route path="admin/appointments" element={<AdminAppointments />} />
          <Route path="admin/diseases" element={<DiseaseManagement />} />
          <Route path="admin/ai" element={<AIPrediction />} />
          <Route path="admin/emergency" element={<AdminEmergency />} />
          <Route path="admin/notifications" element={<AdminNotifications />} />
          <Route path="admin/reports" element={<AdminReports />} />
          <Route path="admin/feedback" element={<FeedbackManagement />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/profile" element={<AdminProfile />} />

          {/* Hospital Routes */}
          <Route path="hospital" element={<HospitalOverview />} />
          <Route path="hospital/profile" element={<HospitalProfile />} />
          <Route path="hospital/doctors" element={<DoctorManagement />} />
          <Route path="hospital/patients" element={<PatientManagement />} />
          <Route path="hospital/appointments" element={<HospitalAppointments />} />
          <Route path="hospital/inventory" element={<InventoryManagement />} />
          <Route path="hospital/camps" element={<CampManagement />} />
          <Route path="hospital/claims" element={<ClaimsManagement />} />
          <Route path="hospital/blood-bank" element={<BloodBankDashboard />} />
          <Route path="hospital/emergency" element={<HospitalEmergency />} />
          <Route path="hospital/beds" element={<BedAvailability />} />
        </Route>
        
        {/* Catch-all route to redirect unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

