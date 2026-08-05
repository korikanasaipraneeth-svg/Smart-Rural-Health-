const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Appointment = require('./models/Appointment');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');

dotenv.config();

const REASONS = [
    'Fever and body ache for 3 days',
    'Routine checkup for blood pressure',
    'Severe headache and nausea',
    'Follow up on previous lab reports',
    'Skin rash on arms',
    'Persistent cough and cold',
    'Knee joint pain',
    'Stomach ache after eating',
    'General fatigue and weakness',
    'Dental pain'
];

async function seedAppointments() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-bangaram');
        console.log('MongoDB Connected.');

        await Appointment.deleteMany(); // Clear old appointments
        
        const patients = await User.find({ role: 'patient' }).limit(100);
        const hospitals = await Hospital.find().limit(20);

        const appointments = [];

        for (let i = 0; i < 150; i++) {
            const patient = patients[Math.floor(Math.random() * patients.length)];
            const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
            const doctors = await Doctor.find({ hospital: hospital._id });
            
            if (doctors.length === 0) continue;

            const doctor = doctors[Math.floor(Math.random() * doctors.length)];
            
            // Random date in next 14 days
            const date = new Date();
            date.setDate(date.getDate() + Math.floor(Math.random() * 14));
            
            const hours = Math.floor(Math.random() * (17 - 9 + 1) + 9); // 9 AM to 5 PM
            const mins = Math.random() > 0.5 ? '00' : '30';
            const timeStr = `${hours > 12 ? hours - 12 : hours}:${mins} ${hours >= 12 ? 'PM' : 'AM'}`;
            
            const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
            const types = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'];

            appointments.push({
                patient: patient._id,
                doctor: doctor._id,
                hospital: hospital._id,
                date: date,
                time: timeStr,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                type: types[Math.floor(Math.random() * types.length)],
                reason: REASONS[Math.floor(Math.random() * REASONS.length)]
            });
        }

        await Appointment.insertMany(appointments);
        console.log(`Successfully added ${appointments.length} fake appointments.`);
        process.exit();

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedAppointments();
