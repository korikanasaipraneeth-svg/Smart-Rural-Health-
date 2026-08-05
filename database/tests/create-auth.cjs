const fs = require('fs');
if (!fs.existsSync('src/pages/auth')) fs.mkdirSync('src/pages/auth', { recursive: true });
['RoleSelection', 'PatientLogin', 'HospitalLogin', 'PatientRegister', 'HospitalRegister'].forEach(name => {
  fs.writeFileSync('src/pages/auth/' + name + '.jsx', 'export default function ' + name + '() { return <div>' + name + '</div>; }', 'utf8');
});
