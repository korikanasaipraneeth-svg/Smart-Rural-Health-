const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const Prescription = require('./models/Prescription');
const LabReport = require('./models/LabReport');

dotenv.config();

connectDB().then(async () => {
    try {
        const patient = await User.findOne({ role: 'patient' });
        const doctor = await Doctor.findOne();
        const hospital = await Hospital.findOne();

        if (!patient || !doctor || !hospital) {
            console.log("Missing patient, doctor, or hospital for seeding");
            process.exit(1);
        }

        console.log(`Seeding records for Patient: ${patient.full_name}`);

        await Prescription.create({
            patient: patient._id,
            doctor: doctor._id,
            hospital: hospital._id,
            diagnosis: 'Acute Bronchitis',
            medicines: [
                { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice a day', duration: '5 days' },
                { name: 'Cough Syrup', dosage: '10ml', frequency: 'Thrice a day', duration: '5 days' }
            ],
            instructions: 'Drink plenty of warm water. Rest well.',
            date: new Date()
        });

        await LabReport.create({
            patient: patient._id,
            doctor: doctor._id,
            hospital: hospital._id,
            testName: 'Complete Blood Count (CBC)',
            results: 'Normal',
            attachmentUrl: 'https://example.com/report1.pdf',
            date: new Date()
        });

        console.log("Dummy Medical Records Created successfully!");
        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});
