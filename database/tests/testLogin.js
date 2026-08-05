const axios = require('axios');

async function testLogin() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'korikanasaipraneeth@gmail.com',
            password: 'admin123'
        });
        console.log("Login Success!");
        console.log("Response:", res.data);
    } catch (error) {
        console.error("Login Failed:");
        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testLogin();
