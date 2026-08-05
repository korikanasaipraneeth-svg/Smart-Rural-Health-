const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config();

async function fixHospitalBeds() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        
        const hospitals = await Hospital.find();
        for (const hospital of hospitals) {
            hospital.totalBeds = hospital.totalBeds || 250;
            hospital.availableBeds = hospital.availableBeds || 120;
            hospital.icuBeds = hospital.icuBeds || 40;
            hospital.emergencyBeds = hospital.emergencyBeds || 20;
            hospital.generalBeds = hospital.generalBeds || 190;
            
            await hospital.save();
        }
        console.log('Beds fixed');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixHospitalBeds();
