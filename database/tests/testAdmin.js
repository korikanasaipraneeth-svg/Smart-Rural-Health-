const axios = require('axios');

async function testLoginAndGetPatients() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'korikanasaipraneeth@gmail.com',
            password: 'admin123'
        });
        const token = res.data.token;
        console.log("Login Success! Token:", token.substring(0, 20) + "...");

        try {
            const patientsRes = await axios.get('http://localhost:5000/api/admin/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Patients fetch success!", patientsRes.data.count, "patients found.");
        } catch (err) {
            console.error("Patients Fetch Failed:");
            console.error(err.response ? err.response.data : err.message);
        }

    } catch (error) {
        console.error("Login Failed:");
        console.error(error.response ? error.response.data : error.message);
    }
}

testLoginAndGetPatients();
