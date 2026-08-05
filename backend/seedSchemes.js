const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HealthScheme = require('./models/HealthScheme');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_rural_health')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedSchemes = async () => {
    try {
        await HealthScheme.deleteMany();
        console.log('Cleared existing schemes');

        const schemes = [
            {
                name: 'Ayushman Bharat (PM-JAY)',
                description: 'World\'s largest government funded healthcare program targeting more than 50 crore beneficiaries. Provides a cover of up to ₹5 lakhs per family per year.',
                state: 'Central',
                incomeLimit: 250000,
                eligibleCategories: ['BPL', 'SC', 'ST'],
                maxCoverageAmount: 500000,
                isActive: true
            },
            {
                name: 'YSR Aarogyasri',
                description: 'Flagship healthcare scheme of Govt of AP aiming to provide quality healthcare to the poor. Applicable to all families below poverty line with white ration card.',
                state: 'Andhra Pradesh',
                incomeLimit: 500000, // up to 5 lakhs annual income in AP
                eligibleCategories: ['BPL', 'General', 'OBC', 'SC', 'ST'],
                maxCoverageAmount: 2500000, // Enhanced up to 25L for specific procedures
                isActive: true
            },
            {
                name: 'Chief Minister\'s Relief Fund (CMRF)',
                description: 'Financial assistance to the poorest of the poor who are in distress or requiring expensive medical treatment not covered under other schemes.',
                state: 'All',
                incomeLimit: 100000,
                eligibleCategories: ['BPL', 'SC', 'ST'],
                maxCoverageAmount: 100000,
                isActive: true
            }
        ];

        await HealthScheme.insertMany(schemes);
        console.log('Schemes seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding schemes:', error);
        process.exit(1);
    }
};

seedSchemes();
