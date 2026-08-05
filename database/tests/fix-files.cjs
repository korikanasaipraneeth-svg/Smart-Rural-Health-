const fs = require('fs');
const files = [
  'src/pages/patient/Profile.jsx',
  'src/pages/patient/Records.jsx',
  'src/pages/patient/Appointments.jsx',
  'src/pages/hospital/HospitalProfile.jsx',
  'src/pages/hospital/DoctorManagement.jsx',
  'src/pages/hospital/PatientManagement.jsx',
  'src/pages/hospital/EmergencyRequests.jsx',
  'src/pages/hospital/BedAvailability.jsx',
  'src/pages/admin/UserManagement.jsx',
  'src/pages/admin/HospitalManagement.jsx',
  'src/pages/admin/EmergencyManagement.jsx'
];
files.forEach(f => {
  const name = f.split('/').pop().replace('.jsx', '');
  fs.writeFileSync(f, `export default function ${name}() { return <div className="container section"><h2 className="heading-2">${name}</h2><p className="text-muted">This page is under construction.</p></div>; }`, 'utf8');
});
console.log('Fixed binary files.');
