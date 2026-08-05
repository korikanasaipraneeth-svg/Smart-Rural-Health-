const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const InventoryItem = require('./models/InventoryItem');
const SupplyTransfer = require('./models/SupplyTransfer');

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("MongoDB Connected");

    try {
        // Find existing hospital
        let existingHospital = await User.findOne({ email: 'mohankrisna@gmail.com' });
        
        if (!existingHospital) {
            existingHospital = new User({
                full_name: 'Rural Care Hospital',
                email: 'mohankrisna@gmail.com',
                password: 'password123',
                role: 'hospital_admin',
                phone: '9876543210'
            });
            await existingHospital.save();
            console.log("Base hospital created.");
        }

        // 1. Create a second hospital if it doesn't exist
        let secondHospital = await User.findOne({ email: 'secondhospital@gmail.com' });
        if (!secondHospital) {
            secondHospital = new User({
                full_name: 'City Care Hospital',
                email: 'secondhospital@gmail.com',
                password: 'password123', // Mongoose middleware will hash this
                role: 'hospital_admin',
                phone: '9876543210'
            });
            await secondHospital.save();
            console.log("Second hospital created.");
        }

        // Clear existing inventory transfers just in case
        await SupplyTransfer.deleteMany({});
        
        // Let's create an item in existingHospital with a CRITICAL SHORTAGE
        const shortageItem = new InventoryItem({
            hospital: existingHospital._id,
            name: 'Anti-Venom (Polyvalent)',
            category: 'Medicine',
            quantity: 15, // Low stock
            unit: 'vials',
            threshold: 20,
            dailyConsumptionRate: 5, // Will deplete in 3 days (CRITICAL!)
            predictedDepletionDate: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000))
        });
        await shortageItem.save();

        // Let's create the same item in secondHospital with EXCESS STOCK
        const excessItem = new InventoryItem({
            hospital: secondHospital._id,
            name: 'Anti-Venom (Polyvalent)',
            category: 'Medicine',
            quantity: 200, // Excess stock
            unit: 'vials',
            threshold: 20,
            dailyConsumptionRate: 2, // Will deplete in 100 days (SAFE)
            predictedDepletionDate: new Date(Date.now() + (100 * 24 * 60 * 60 * 1000))
        });
        await excessItem.save();
        
        // Add some random stock to base hospital
        const anotherItem = new InventoryItem({
            hospital: existingHospital._id,
            name: 'Paracetamol 500mg',
            category: 'Medicine',
            quantity: 5000, 
            unit: 'tablets',
            threshold: 1000,
            dailyConsumptionRate: 100, // Depletes in 50 days (SAFE)
            predictedDepletionDate: new Date(Date.now() + (50 * 24 * 60 * 60 * 1000))
        });
        await anotherItem.save();

        console.log("Seed data created successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
