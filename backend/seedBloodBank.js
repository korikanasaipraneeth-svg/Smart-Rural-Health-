const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BloodBank = require('./models/BloodBank');
const Hospital = require('./models/Hospital');

dotenv.config();

async function seedBloodBank() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        await BloodBank.deleteMany(); // Clear old blood bank records

        const hospitals = await Hospital.find();
        const bloodBankRecords = [];

        for (const hospital of hospitals) {
            bloodBankRecords.push({
                hospital: hospital._id,
                inventory: {
                    A_pos: Math.floor(Math.random() * 50),
                    A_neg: Math.floor(Math.random() * 15),
                    B_pos: Math.floor(Math.random() * 40),
                    B_neg: Math.floor(Math.random() * 10),
                    AB_pos: Math.floor(Math.random() * 20),
                    AB_neg: Math.floor(Math.random() * 5),
                    O_pos: Math.floor(Math.random() * 60),
                    O_neg: Math.floor(Math.random() * 10) // High demand, low stock
                },
                lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 100000000))
            });
        }

        await BloodBank.insertMany(bloodBankRecords);
        console.log(`Successfully added blood bank inventory for ${bloodBankRecords.length} hospitals.`);
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedBloodBank();
