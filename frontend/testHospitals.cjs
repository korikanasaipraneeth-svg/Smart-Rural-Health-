const axios = require('axios');
const jwt = require('jsonwebtoken');

const token = jwt.sign({ id: '64a1b2c3d4e5f60000000000', role: 'patient' }, 'super_secret_healthcare_key_2026', { expiresIn: '30d' });

async function testApi() {
    try {
        const response = await axios.get('http://localhost:5000/api/my-portal/hospitals', {
            headers: { Authorization: 'Bearer ' + token }
        });
        console.log('Status:', response.status);
        console.log('Data length:', response.data.data.length);
    } catch (error) {
        console.error('Error status:', error.response ? error.response.status : error.message);
        if (error.response) console.log(error.response.data);
    }
}
testApi();
