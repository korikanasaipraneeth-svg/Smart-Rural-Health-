const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const User = require('./models/User');

dotenv.config();

const DEPARTMENTS = [
    'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
    'Gynecology', 'Pediatrics', 'ENT', 'Dentistry', 
    'Dermatology', 'Emergency'
];

const DOCTOR_NAMES = [
    'Arjun Kumar', 'Sneha Reddy', 'Vikram Singh', 'Priya Sharma', 
    'Ramesh Babu', 'Kavya Iyer', 'Sanjay Gupta', 'Deepa Patil'
];

const PATIENT_NAMES = [
    'Raju Das', 'Sita Devi', 'Karan Patel', 'Meera Nair',
    'Lakshmi Narayan', 'Ravi Teja', 'Anjali Desai', 'Suresh Menon'
];

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        // Clear existing Doctors and Patients (optional but good for clean slate)
        await Doctor.deleteMany();
        await User.deleteMany({ role: 'patient' });

        const hospitals = await Hospital.find();
        let doctorCount = 0;
        let patientCount = 0;

        for (const hospital of hospitals) {
            // Generate 3-6 doctors per hospital
            const numDocs = Math.floor(Math.random() * 4) + 3;
            for (let i = 0; i < numDocs; i++) {
                const name = DOCTOR_NAMES[Math.floor(Math.random() * DOCTOR_NAMES.length)] + ' ' + Math.floor(Math.random() * 100);
                const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
                
                const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                await Doctor.create({
                    hospital: hospital._id,
                    name: 'Dr. ' + name,
                    email: `dr.${name.replace(/\s+/g, '').toLowerCase()}.${uniqueSuffix}@example.com`,
                    phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
                    gender: Math.random() > 0.5 ? 'Male' : 'Female',
                    registrationNumber: 'REG' + Math.floor(100000 + Math.random() * 900000),
                    designation: 'Senior Consultant',
                    specialization: dept,
                    department: dept,
                    experienceYears: Math.floor(Math.random() * 20) + 2,
                    qualification: 'MBBS, MD',
                    stateMedicalCouncil: 'Andhra Pradesh Medical Council',
                    consultationFee: Math.floor(Math.random() * 5) * 100 + 300,
                    status: 'Active',
                    verificationStatus: 'Verified'
                });
                doctorCount++;
            }

            // Generate 5-10 patients per hospital
            const numPatients = Math.floor(Math.random() * 6) + 5;
            for (let i = 0; i < numPatients; i++) {
                const name = PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)] + ' ' + Math.floor(Math.random() * 100);
                
                const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                await User.create({
                    full_name: name,
                    email: `patient.${name.replace(/\s+/g, '').toLowerCase()}.${uniqueSuffix}@example.com`,
                    password: 'password123', // Dummy password
                    phone: '99' + Math.floor(10000000 + Math.random() * 90000000),
                    role: 'patient',
                    assignedHospital: hospital._id,
                    status: Math.random() > 0.8 ? 'Critical' : 'Active',
                    riskLevel: Math.random() > 0.7 ? 'High' : 'Low',
                    gender: Math.random() > 0.5 ? 'Male' : 'Female',
                    age: Math.floor(Math.random() * 60) + 15,
                    admissionDate: new Date()
                });
                patientCount++;
            }
        }

        console.log(`Successfully added ${doctorCount} doctors and ${patientCount} patients across ${hospitals.length} hospitals.`);
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();
