const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BloodRequest = require('./models/BloodRequest');
const User = require('./models/User');
const Hospital = require('./models/Hospital');

dotenv.config();

async function seedBloodRequests() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        await BloodRequest.deleteMany(); // Clear old records

        const patients = await User.find({ role: 'patient' }).limit(50);
        const hospitals = await Hospital.find().limit(20);

        if (patients.length === 0 || hospitals.length === 0) {
            console.log('No patients or hospitals found.');
            process.exit();
        }

        const requests = [];
        const types = ['Donation', 'Request'];
        const bloodGroups = ['A_pos', 'A_neg', 'B_pos', 'B_neg', 'AB_pos', 'AB_neg', 'O_pos', 'O_neg'];
        const statuses = ['Pending', 'Approved', 'Rejected'];

        for (let i = 0; i < 50; i++) {
            requests.push({
                patient: patients[Math.floor(Math.random() * patients.length)]._id,
                hospital: hospitals[Math.floor(Math.random() * hospitals.length)]._id,
                type: types[Math.floor(Math.random() * types.length)],
                bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
                units: Math.floor(Math.random() * 3) + 1,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                date: new Date(Date.now() - Math.floor(Math.random() * 100000000))
            });
        }

        await BloodRequest.insertMany(requests);
        console.log(`Successfully added ${requests.length} blood requests/donations.`);
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedBloodRequests();
