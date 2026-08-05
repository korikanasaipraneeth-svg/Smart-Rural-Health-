const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hospital = require('./models/Hospital');
const Record = require('./models/Record');

dotenv.config();

async function seedEHRs() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        const patients = await User.find({ role: 'patient' });
        console.log(`Found ${patients.length} patients in User collection.`);

        const hospital = await Hospital.findOne();
        if (!hospital) {
            console.log('No hospital user found.');
            process.exit(1);
        }

        let count = 0;
        for (const patient of patients) {
            const userId = patient._id; 
            
            const existing = await Record.countDocuments({ patient: userId });
            if (existing === 0) {
                await Record.create({
                    patient: userId,
                    hospital: hospital._id,
                    title: 'General Health Checkup Prescription',
                    type: 'Prescription',
                    fileUrl: '/uploads/fake-prescription.pdf',
                    notes: 'Take paracetamol for 3 days.'
                });

                await Record.create({
                    patient: userId,
                    hospital: hospital._id,
                    title: 'Complete Blood Count (CBC)',
                    type: 'Lab Report',
                    fileUrl: '/uploads/fake-lab-report.pdf',
                    notes: 'All values within normal range.'
                });
                count += 2;
            }
        }

        console.log(`Successfully added ${count} fake records.`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedEHRs();
