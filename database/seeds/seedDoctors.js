const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Sai Praneeth', 'Rahul', 'Ananya', 'Diya', 'Sneha', 'Riya', 'Aisha', 'Kavya', 'Priya', 'Meera'];
const lastNames = ['Reddy', 'Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Deshmukh', 'Iyer', 'Nair', 'Menon', 'Rao', 'Das', 'Chatterjee', 'Verma', 'Yadav'];
const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Dermatology', 'Oncology', 'Psychiatry', 'Ophthalmology', 'ENT'];
const qualifications = ['MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'BDS, MDS'];
const departments = ['General Medicine', 'Surgery', 'Emergency', 'ICU', 'Outpatient'];
const councils = ['Andhra Pradesh Medical Council', 'Maharashtra Medical Council', 'Delhi Medical Council', 'Tamil Nadu Medical Council', 'Karnataka Medical Council'];

const generateFakeDoctors = async () => {
    try {
        await Doctor.deleteMany(); // Clear existing
        console.log('Existing doctors cleared...');

        const hospitals = await Hospital.find();
        
        if (hospitals.length === 0) {
            console.error('No hospitals found! Please register at least one hospital first.');
            process.exit(1);
        }

        const doctors = [];
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        for (let i = 0; i < 50; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const randomHospital = hospitals[Math.floor(Math.random() * hospitals.length)];
            
            doctors.push({
                hospital: randomHospital._id,
                name: `Dr. ${firstName} ${lastName}`,
                email: `dr.${firstName.toLowerCase().replace(/\s+/g, '')}${i}@example.com`,
                password: hashedPassword,
                phone: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
                gender: Math.random() > 0.5 ? 'Male' : 'Female',
                dob: new Date(1970 + Math.floor(Math.random() * 25), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
                address: `Clinic Address ${i}, City`,
                registrationNumber: `MCI-${10000 + i}`,
                stateMedicalCouncil: councils[Math.floor(Math.random() * councils.length)],
                qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
                specialization: specializations[Math.floor(Math.random() * specializations.length)],
                department: departments[Math.floor(Math.random() * departments.length)],
                experienceYears: Math.floor(Math.random() * 30) + 2,
                consultationFee: Math.floor(Math.random() * 10) * 100 + 500, // 500 to 1500
                status: 'Active',
                verification: 'Verified',
                patientsTreated: Math.floor(Math.random() * 5000),
                averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
                reviewCount: Math.floor(Math.random() * 500),
                availability: {
                    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    startTime: '09:00 AM',
                    endTime: '05:00 PM',
                    avgConsultationTime: 15
                }
            });
        }

        await Doctor.insertMany(doctors);
        console.log(`Successfully seeded ${doctors.length} fake doctors!`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding doctors:', error);
        process.exit(1);
    }
};

generateFakeDoctors();
