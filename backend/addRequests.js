const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');
const Hospital = require('./models/Hospital');
const BloodRequest = require('./models/BloodRequest');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const hUser = await Hospital.findOne({ email: 'mohankrisna@gmail.com' });
    if (!hUser) {
        console.log('Hospital not found');
        process.exit();
    }
    
    console.log("Using hospital:", hUser.name);

    const patients = await User.find({ role: 'patient' }).limit(10);
    const types = ['Donation', 'Request'];
    const bloodGroups = ['A_pos', 'O_pos', 'B_neg', 'AB_pos'];
    const reqs = [];
    
    for (let i = 0; i < 15; i++) {
        reqs.push({
            patient: patients[i % patients.length]._id,
            hospital: hUser._id,
            type: types[i % 2],
            bloodGroup: bloodGroups[i % 4],
            units: Math.floor(Math.random() * 3) + 1,
            status: 'Pending'
        });
    }
    
    await BloodRequest.insertMany(reqs);
    console.log(`Successfully added ${reqs.length} requests for ${hUser.email}`);
    process.exit(0);
});
