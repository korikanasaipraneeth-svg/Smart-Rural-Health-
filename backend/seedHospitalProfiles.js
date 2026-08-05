const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');

dotenv.config();

async function seedHospitalProfiles() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        const hospitals = await Hospital.find();
        
        for (const hospital of hospitals) {
            // Update with realistic fake data
            hospital.establishedYear = hospital.establishedYear || '1995';
            hospital.description = hospital.description || 'A leading healthcare provider committed to delivering world-class medical services to rural and urban communities with state-of-the-art facilities and compassionate care.';
            hospital.ownerName = hospital.ownerName || 'Dr. K. Srinivasa Rao';
            hospital.website = hospital.website || 'https://www.smartruralhealth.com';
            
            // Bed Information
            hospital.beds = hospital.beds || {
                total: 250,
                available: 120,
                icu: 40,
                ventilators: 15
            };

            // Location
            hospital.address = hospital.address || '123 Healthway Drive, Medical Enclave';
            hospital.state = hospital.state || 'Andhra Pradesh';
            hospital.district = hospital.district || 'Visakhapatnam';
            hospital.city = hospital.city || 'Visakhapatnam';
            hospital.pincode = hospital.pincode || '530001';
            
            // Facilities & Departments
            if (!hospital.facilities || hospital.facilities.length === 0) {
                hospital.facilities = ['Emergency', 'ICU', 'Blood Bank', 'Pharmacy', 'Ambulance'];
            }
            if (!hospital.departments || hospital.departments.length === 0) {
                hospital.departments = ['General Medicine', 'Cardiology', 'Pediatrics', 'Orthopedics'];
            }

            hospital.isApproved = true; // ensure it's approved

            await hospital.save();
        }

        console.log(`Successfully updated profiles for ${hospitals.length} hospitals.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedHospitalProfiles();
