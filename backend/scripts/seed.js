const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// Models
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const User = require('../models/User'); // Patients are stored in User model with role='patient'
const Appointment = require('../models/Appointment');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_health_db')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  });

const seedDatabase = async () => {
    try {
        console.log('Clearing existing fake data (Hospitals, Doctors, Users, Appointments)...');
        await Hospital.deleteMany({});
        await Doctor.deleteMany({});
        await User.deleteMany({});
        await Appointment.deleteMany({});
        
        console.log('Generating 70 Hospitals...');
        const hospitals = [];
        const customPassword = await bcrypt.hash('1101@2007', 10);
        const defaultPassword = await bcrypt.hash('password123', 10);

        // Required specific hospitals
        const specificHospitals = [
            { name: 'Apollo Rural Health', email: 'lohithbudida@gmail.com', password: customPassword },
            { name: 'District Govt Hospital', email: 'mohankrisna@gmail.com', password: customPassword },
            { name: 'KIMS Hospital', email: 'rakesh@gmail.com', password: customPassword },
            { name: 'Medicover Hospital', email: 'medicover@gmail.com', password: defaultPassword },
            { name: 'GMR Care', email: 'gmrcare@gmail.com', password: defaultPassword },
            { name: 'Krishna Hospital', email: 'krishna@gmail.com', password: defaultPassword }
        ];

        for (const data of specificHospitals) {
            const hospital = new Hospital({
                name: data.name,
                regNo: faker.string.alphanumeric(8).toUpperCase(),
                type: faker.helpers.arrayElement(['Government', 'Private', 'PHC', 'Clinic']),
                establishedYear: faker.date.past({ years: 50 }).getFullYear().toString(),
                description: faker.lorem.paragraph(),
                ownerName: faker.person.fullName(),
                email: data.email,
                contact_number: faker.string.numeric(10),
                emergencyNumber: faker.string.numeric(10),
                website: faker.internet.url(),
                address: faker.location.streetAddress(),
                state: faker.location.state(),
                district: faker.location.county(),
                city: faker.location.city(),
                village: faker.location.city(),
                pincode: faker.location.zipCode(),
                facilities: faker.helpers.arrayElements(['ICU', 'Emergency', 'Laboratory', 'Pharmacy', 'Ambulance'], { min: 2, max: 5 }),
                departments: faker.helpers.arrayElements(['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'], { min: 2, max: 5 }),
                totalBeds: faker.number.int({ min: 100, max: 1000 }),
                availableBeds: faker.number.int({ min: 20, max: 200 }),
                occupiedBeds: faker.number.int({ min: 50, max: 800 }),
                icuBeds: faker.number.int({ min: 10, max: 50 }),
                emergencyBeds: faker.number.int({ min: 10, max: 50 }),
                generalBeds: faker.number.int({ min: 50, max: 500 }),
                password: data.password,
                isApproved: true
            });
            await hospital.save();
            hospitals.push(hospital);
        }

        // Generate the remaining random hospitals (up to 70 total)
        for (let i = specificHospitals.length; i < 70; i++) {
            const hospital = new Hospital({
                name: faker.company.name() + ' Hospital',
                regNo: faker.string.alphanumeric(8).toUpperCase(),
                type: faker.helpers.arrayElement(['Government', 'Private', 'PHC', 'Clinic']),
                establishedYear: faker.date.past({ years: 50 }).getFullYear().toString(),
                description: faker.lorem.paragraph(),
                ownerName: faker.person.fullName(),
                email: faker.internet.email(),
                contact_number: faker.string.numeric(10),
                emergencyNumber: faker.string.numeric(10),
                website: faker.internet.url(),
                address: faker.location.streetAddress(),
                state: faker.location.state(),
                district: faker.location.county(),
                city: faker.location.city(),
                village: faker.location.city(),
                pincode: faker.location.zipCode(),
                facilities: faker.helpers.arrayElements(['ICU', 'Emergency', 'Laboratory', 'Pharmacy', 'Ambulance'], { min: 2, max: 5 }),
                departments: faker.helpers.arrayElements(['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine'], { min: 2, max: 5 }),
                totalBeds: faker.number.int({ min: 50, max: 500 }),
                availableBeds: faker.number.int({ min: 10, max: 50 }),
                occupiedBeds: faker.number.int({ min: 20, max: 100 }),
                icuBeds: faker.number.int({ min: 5, max: 20 }),
                emergencyBeds: faker.number.int({ min: 5, max: 20 }),
                generalBeds: faker.number.int({ min: 30, max: 100 }),
                password: defaultPassword,
                isApproved: true
            });
            await hospital.save();
            hospitals.push(hospital);
        }

        console.log('Generating 100 Doctors...');
        const doctors = [];
        for (let i = 0; i < 100; i++) {
            // Assign doctors heavily to the specific hospitals, but distribute some randomly
            let targetHospital;
            if (i < 30) {
                // First 30 doctors go to Apollo, Govt Hospital, KIMS, Medicover, etc.
                targetHospital = hospitals[i % specificHospitals.length];
            } else {
                targetHospital = faker.helpers.arrayElement(hospitals);
            }

            const doctor = new Doctor({
                hospital: targetHospital._id,
                name: 'Dr. ' + faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(10),
                gender: faker.helpers.arrayElement(['Male', 'Female']),
                registrationNumber: faker.string.alphanumeric(10).toUpperCase(),
                stateMedicalCouncil: faker.location.state() + ' Medical Council',
                specialization: faker.helpers.arrayElement(['Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'Pediatrician', 'General Physician', 'Gynecologist', 'Dermatologist']),
                department: faker.helpers.arrayElement(['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Gynecology', 'Dermatology']),
                qualification: faker.helpers.arrayElement(['MBBS, MD', 'MBBS, MS', 'MBBS, DO']),
                experienceYears: faker.number.int({ min: 1, max: 30 }),
                consultationFee: faker.number.int({ min: 300, max: 1500 }),
                status: 'Active'
            });
            await doctor.save();
            doctors.push(doctor);
        }

        console.log('Generating 100 Patients (and Appointments)...');
        
        // Ensure Admin user exists
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            full_name: 'Platform Admin',
            email: 'korikanasaipraneeth@gmail.com',
            password: adminPassword,
            role: 'admin',
            phone: '9999999999',
            age: 30,
            gender: 'Male',
            address: 'Admin Headquarters',
            status: 'Active',
            riskLevel: 'None'
        });
        await adminUser.save();
        console.log('Admin account generated.');

        for (let i = 0; i < 100; i++) {
            // Heavantly assign to Apollo and District Govt Hospital as requested
            let targetHospital;
            if (i < 25) {
                targetHospital = hospitals.find(h => h.name === 'Apollo Rural Health');
            } else if (i < 50) {
                targetHospital = hospitals.find(h => h.name === 'District Govt Hospital');
            } else {
                targetHospital = faker.helpers.arrayElement(hospitals);
            }

            // Find doctors in that hospital
            const hospitalDoctors = doctors.filter(d => d.hospital.toString() === targetHospital._id.toString());
            const targetDoctor = hospitalDoctors.length > 0 ? faker.helpers.arrayElement(hospitalDoctors) : faker.helpers.arrayElement(doctors);
            
            const isEmergency = faker.datatype.boolean();

            const patient = new User({
                full_name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.string.numeric(10),
                password: defaultPassword,
                age: faker.number.int({ min: 5, max: 90 }),
                gender: faker.helpers.arrayElement(['Male', 'Female']),
                blood_group: faker.helpers.arrayElement(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-']),
                address: faker.location.streetAddress(),
                role: 'patient',
                status: isEmergency ? 'Critical' : faker.helpers.arrayElement(['Active', 'Under Observation']),
                riskLevel: isEmergency ? 'High' : faker.helpers.arrayElement(['Low', 'Medium', 'None']),
                assignedHospital: targetHospital._id,
                assignedDoctor: targetDoctor._id,
                isEmergency: isEmergency
            });
            await patient.save();

            // Create 1 to 3 random appointments for this patient
            const numAppointments = faker.number.int({ min: 1, max: 3 });
            for (let j = 0; j < numAppointments; j++) {
                const appointment = new Appointment({
                    patient: patient._id,
                    doctor: targetDoctor._id,
                    hospital: targetHospital._id,
                    date: faker.date.soon({ days: 30 }),
                    time: faker.helpers.arrayElement(['09:00 AM', '10:30 AM', '02:00 PM', '04:15 PM', '11:45 AM']),
                    status: faker.helpers.arrayElement(['Pending', 'Confirmed']),
                    type: faker.helpers.arrayElement(['Consultation', 'Follow-up', 'Routine Checkup']),
                    reason: faker.lorem.sentence()
                });
                await appointment.save();
            }
        }

        console.log('Successfully seeded database with fake hospitals, doctors, patients, and appointments!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
