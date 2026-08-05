const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/smart_health_db')
  .then(async () => {
    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ role: 'patient' });
    
    const token = jwt.sign({ id: user._id.toString(), role: 'patient' }, 'super_secret_healthcare_key_2026', { expiresIn: '30d' });

    try {
        const response = await fetch('http://localhost:5000/api/my-portal/hospitals', {
            headers: { Authorization: 'Bearer ' + token }
        });
        const data = await response.json();
        console.log('Hospitals:', data.data ? data.data.length : data);
    } catch (error) {
        console.error('Error:', error);
    }
    mongoose.disconnect();
  });
