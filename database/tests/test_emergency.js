const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Hospital = require('./models/Hospital');
const EmergencyRequest = require('./models/EmergencyRequest');
dotenv.config();
connectDB().then(async () => {
    try {
        const hospital = await Hospital.findOne();
        if(!hospital) return console.log("No hospital");
        
        console.log("Updating bed availability...");
        hospital.totalBeds = 15;
        await hospital.save();
        console.log("Bed updated");

        console.log("Creating fake emergency...");
        await EmergencyRequest.create({
            hospital: hospital._id,
            patientName: "Test Patient",
            contactNumber: "1234567890",
            condition: "Test",
            expectedArrivalTime: "10 mins",
            assignedAmbulance: "AMB-1234",
            status: "Pending"
        });
        console.log("Fake emergency created");
        process.exit(0);
    } catch (error) {
        console.error("TEST FAILED:", error);
        process.exit(1);
    }
});
