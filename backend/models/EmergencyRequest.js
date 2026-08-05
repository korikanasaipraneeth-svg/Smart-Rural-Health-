const mongoose = require('mongoose');

const EmergencyRequestSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: false // Optional, can be assigned later
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional, if requested directly
    },
    patientName: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
    },
    ambulanceLocation: {
        lat: Number,
        lng: Number
    },
    condition: {
        type: String, // e.g. "Heart Attack", "Accident"
        required: true
    },
    expectedArrivalTime: {
        type: String // e.g. "10 mins"
    },
    assignedAmbulance: {
        type: String // License plate or driver name
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Resolved'],
        default: 'Pending'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('EmergencyRequest', EmergencyRequestSchema);
