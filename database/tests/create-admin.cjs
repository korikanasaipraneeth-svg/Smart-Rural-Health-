const fs = require('fs');
['DoctorManagementAdmin', 'AdminAppointments', 'DiseaseManagement', 'AIPrediction', 'AdminNotifications', 'AdminReports', 'FeedbackManagement', 'AdminSettings', 'AdminProfile'].forEach(name => {
  fs.writeFileSync('src/pages/admin/' + name + '.jsx', `export default function ${name}() { return <div className="p-6"><h2 className="text-2xl font-bold">${name}</h2><p className="text-gray-500 mt-2">Under construction.</p></div>; }`, 'utf8');
});
