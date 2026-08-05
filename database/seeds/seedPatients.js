const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User'); // Patient Model
const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const bcrypt = require('bcryptjs');

dotenv.config();
connectDB();

const firstNames = ['Amit', 'Sunita', 'Ramesh', 'Pooja', 'Suresh', 'Kavita', 'Anil', 'Nisha', 'Vikram', 'Meena', 'Rahul', 'Neha', 'Sanjay', 'Geeta', 'Ashok'];
const lastNames = ['Kumar', 'Sharma', 'Singh', 'Patel', 'Yadav', 'Gupta', 'Verma', 'Reddy', 'Mishra', 'Chauhan', 'Das', 'Joshi', 'Tiwari', 'Nair', 'Bose'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const statuses = ['Active', 'Discharged', 'Critical', 'Under Observation'];
const riskLevels = ['Low', 'Medium', 'High', 'None'];
const symptomsList = ['Fever', 'Cough', 'Chest Pain', 'Headache', 'Nausea', 'Fatigue', 'Shortness of breath', 'Dizziness', 'Body Ache', 'Weakness'];
const medicalHistories = ['Diabetes', 'Hypertension', 'Asthma', 'None', 'Thyroid', 'Arthritis', 'Heart Disease', 'Migraine'];

const generateFakePatients = async () => {
    try {
        await User.deleteMany({ role: 'patient' });
        console.log('Existing patients cleared...');

        const hospitals = await Hospital.find();
        const doctors = await Doctor.find();
        
        if (hospitals.length === 0 || doctors.length === 0) {
            console.error('Please ensure Hospitals and Doctors are seeded before seeding Patients.');
            process.exit(1);
        }

        const patients = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Patient123!', salt);

        for (let i = 0; i < 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const randomHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
            
            // Get doctors for this hospital
            const hospitalDoctors = doctors.filter(d => d.hospital.toString() === randomHospital._id.toString());
            const randomDoctor = hospitalDoctors.length > 0 
                ? hospitalDoctors[Math.floor(Math.random() * hospitalDoctors.length)] 
                : doctors[Math.floor(Math.random() * doctors.length)]; // Fallback

            // Generate some random symptoms and history
            const randomSymptoms = [];
            for (let j=0; j < (Math.floor(Math.random() * 3) + 1); j++) {
                randomSymptoms.push(symptomsList[Math.floor(Math.random() * symptomsList.length)]);
            }

            const randomHistory = [];
            for (let j=0; j < (Math.floor(Math.random() * 2) + 1); j++) {
                randomHistory.push(medicalHistories[Math.floor(Math.random() * medicalHistories.length)]);
            }

            const isEmergency = Math.random() > 0.8;
            const status = isEmergency ? 'Critical' : statuses[Math.floor(Math.random() * statuses.length)];

            patients.push({
                full_name: `${firstName} ${lastName}`,
                email: `patient${i}@example.com`,
                password: hashedPassword,
                phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
                age: Math.floor(Math.random() * 80) + 5,
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                blood_group: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
                address: `House ${i}, Street ${Math.floor(Math.random() * 50)}, City`,
                role: 'patient',
                assignedHospital: randomHospital._id,
                assignedDoctor: randomDoctor._id,
                roomNumber: `Room-${Math.floor(Math.random() * 500) + 100}`,
                admissionDate: status !== 'Discharged' ? new Date(Date.now() - Math.floor(Math.random() * 1000000000)) : undefined,
                symptoms: [...new Set(randomSymptoms)],
                medicalHistory: [...new Set(randomHistory)],
                isEmergency: isEmergency,
                status: status,
                riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)]
            });
        }

        await User.insertMany(patients);
        console.log(`Successfully seeded ${patients.length} fake patients!`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding patients:', error);
        process.exit(1);
    }
};

generateFakePatients();
