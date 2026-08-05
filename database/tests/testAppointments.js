const axios = require('axios');

async function testAppointments() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'korikanasaipraneeth@gmail.com', // wait, the screenshot shows they are trying to view patient appointments
            password: 'admin123'
        });
        const token = res.data.token;
        console.log("Login Success! Token:", token.substring(0, 20) + "...");

        try {
            const aptsRes = await axios.get('http://localhost:5000/api/my-portal/appointments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Appointments fetch success!");
            console.log(JSON.stringify(aptsRes.data, null, 2));
        } catch (err) {
            console.error("Appointments Fetch Failed:");
            console.error(err.response ? err.response.data : err.message);
        }

    } catch (error) {
        console.error("Login Failed:");
        console.error(error.response ? error.response.data : error.message);
    }
}

testAppointments();
