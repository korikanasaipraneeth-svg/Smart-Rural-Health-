const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Hospital = require('./models/Hospital');
const jwt = require('jsonwebtoken');
const axios = require('axios');

dotenv.config();
connectDB().then(async () => {
    try {
        const hospital = await Hospital.findOne();
        if(!hospital) {
            console.log("No hospital found");
            process.exit(1);
        }
        console.log("Hospital ID:", hospital._id);
        const token = jwt.sign({ id: hospital._id, role: 'hospital' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log("Token:", token);
        
        try {
            const res = await axios.put('http://localhost:5000/api/emergency/beds', {
                totalBeds: 10, availableBeds: 10, occupiedBeds: 0, icuBeds: 2, emergencyBeds: 3, generalBeds: 5
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Beds updated:", res.data);
        } catch(err) {
            console.error("Error updating beds:", err.response?.data || err.message);
        }

        try {
            const res2 = await axios.post('http://localhost:5000/api/emergency/fake', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Fake emergency created:", res2.data);
        } catch(err) {
            console.error("Error creating fake emergency:", err.response?.data || err.message);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
