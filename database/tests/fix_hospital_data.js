const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const User = require('./models/User'); // Patients are in User model

dotenv.config();

connectDB().then(async () => {
    try {
        // Find appolo hospital
        const hospital = await Hospital.findOne({ name: /appolo/i });
        if(!hospital) {
            console.log("No Appolo Hospital found! Picking the first hospital.");
            const anyHospital = await Hospital.findOne();
            if(!anyHospital) {
                console.log("No hospitals exist at all");
                process.exit(1);
            }
            await assignToHospital(anyHospital._id);
        } else {
            console.log(`Found Hospital: ${hospital.name} (${hospital._id})`);
            await assignToHospital(hospital._id);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});

async function assignToHospital(hospitalId) {
    // Re-assign all doctors to this hospital
    const dRes = await Doctor.updateMany({}, { hospital: hospitalId });
    console.log(`Assigned ${dRes.modifiedCount} doctors to the hospital`);
    
    // Re-assign all patients to this hospital
    const pRes = await User.updateMany({ role: 'patient' }, { assignedHospital: hospitalId });
    console.log(`Assigned ${pRes.modifiedCount} patients to the hospital`);
}
