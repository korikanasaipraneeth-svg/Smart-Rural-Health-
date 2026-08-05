const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');

dotenv.config();

async function fixDoctorsCount() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        
        const hospitals = await Hospital.find();
        for (const hospital of hospitals) {
            const count = await Doctor.countDocuments({ hospital: hospital._id });
            hospital.doctorsCount = count;
            await hospital.save();
        }
        console.log('Doctors count fixed on all hospitals');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixDoctorsCount();
