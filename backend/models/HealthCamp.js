const mongoose = require('mongoose');

const HealthCampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Eye Camp', 'Blood Donation', 'Polio Vaccination', 'Dengue Awareness', 
            'General Health Checkup', 'Women Health Camp', 'Child Vaccination', 
            'Diabetes Screening', 'Dental Checkup', 'Organ Donation Awareness', 'Other'
        ]
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        village: { type: String, required: true },
        district: { type: String, required: true },
        address: { type: String, required: true }
    },
    maxPatients: {
        type: Number,
        required: true
    },
    doctorsAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }],
    status: {
        type: String,
        enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'],
        default: 'Upcoming' // Auto-approved since created by verified hospital
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthCamp', HealthCampSchema);
