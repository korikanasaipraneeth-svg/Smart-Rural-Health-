const mongoose = require('mongoose');
require('dotenv').config();

const Hospital = require('./models/Hospital');
const Patient = require('./models/User'); // Patients are stored in User model with role 'patient'
const HealthCamp = require('./models/HealthCamp');
const CampRegistration = require('./models/CampRegistration');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/doctor_bangaram')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const seedCamps = async () => {
    try {
        // Clear existing camps
        await HealthCamp.deleteMany({});
        await CampRegistration.deleteMany({});
        console.log('Cleared existing camps and registrations');

        const hospitals = await Hospital.find({});
        const patients = await Patient.find({ role: 'patient' });

        if (hospitals.length === 0 || patients.length === 0) {
            console.log('Need at least 1 hospital and 1 patient to seed camps');
            process.exit(1);
        }

        const hospital = hospitals[0]; // Use first hospital for seeding

        // Create 3 fake camps
        const campsData = [
            {
                name: 'Free Eye Checkup & Cataract Screening',
                hospital: hospital._id,
                category: 'Eye Camp',
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
                startTime: '09:00 AM',
                endTime: '04:00 PM',
                location: {
                    village: 'Pamarru',
                    district: 'Krishna',
                    address: 'ZPHS High School Grounds, Pamarru'
                },
                maxPatients: 150,
                registeredCount: 0,
                status: 'Upcoming' // Will be 'Approved'
            },
            {
                name: 'Mega Blood Donation Drive',
                hospital: hospital._id,
                category: 'Blood Donation',
                date: new Date(), // Today
                startTime: '08:00 AM',
                endTime: '05:00 PM',
                location: {
                    village: 'Gudivada',
                    district: 'Krishna',
                    address: 'Municipal Office Compound, Gudivada'
                },
                maxPatients: 200,
                registeredCount: 0,
                status: 'Live'
            },
            {
                name: 'Child Immunization & Polio Drops',
                hospital: hospital._id,
                category: 'Child Vaccination',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
                startTime: '10:00 AM',
                endTime: '02:00 PM',
                location: {
                    village: 'Machilipatnam',
                    district: 'Krishna',
                    address: 'Community Hall, Ward 12'
                },
                maxPatients: 100,
                registeredCount: 0,
                status: 'Completed'
            }
        ];

        const insertedCamps = await HealthCamp.insertMany(campsData);
        console.log(`Created ${insertedCamps.length} camps`);

        // Register patients for the Live and Upcoming camp
        const liveCamp = insertedCamps.find(c => c.status === 'Live');
        const upcomingCamp = insertedCamps.find(c => c.status === 'Upcoming');

        if (patients.length > 0) {
            const regs = [];
            let tokenLive = 1;
            let tokenUp = 1;

            // Register up to 3 patients for Live Camp
            for(let i=0; i < Math.min(3, patients.length); i++) {
                regs.push({
                    camp: liveCamp._id,
                    patient: patients[i]._id,
                    tokenNumber: `CAMP-${liveCamp._id.toString().substring(18).toUpperCase()}-${tokenLive}`,
                    qrCodeString: `QR-CAMP-${liveCamp._id}-${patients[i]._id}`,
                    status: i === 0 ? 'CheckedIn' : 'Registered' // First patient checked in
                });
                tokenLive++;
                liveCamp.registeredCount++;
            }

            // Register up to 2 patients for Upcoming Camp
            for(let i=0; i < Math.min(2, patients.length); i++) {
                regs.push({
                    camp: upcomingCamp._id,
                    patient: patients[i]._id,
                    tokenNumber: `CAMP-${upcomingCamp._id.toString().substring(18).toUpperCase()}-${tokenUp}`,
                    qrCodeString: `QR-CAMP-${upcomingCamp._id}-${patients[i]._id}`,
                    status: 'Registered',
                    symptoms: 'Mild blurry vision'
                });
                tokenUp++;
                upcomingCamp.registeredCount++;
            }

            await CampRegistration.insertMany(regs);
            await liveCamp.save();
            await upcomingCamp.save();
            console.log(`Registered patients to camps successfully`);
        }

        console.log('Health Camp data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedCamps();
