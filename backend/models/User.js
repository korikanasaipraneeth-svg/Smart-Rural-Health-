const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: [true, 'Please add a full name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    blood_group: {
        type: String
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'hospital_admin', 'admin'],
        default: 'patient'
    },
    // Patient Specific Fields
    status: {
        type: String,
        enum: ['Active', 'Discharged', 'Critical', 'Under Observation'],
        default: 'Active'
    },
    riskLevel: {
        type: String,
        enum: ['High', 'Medium', 'Low', 'None'],
        default: 'None'
    },
    assignedHospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },
    assignedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    roomNumber: {
        type: String
    },
    admissionDate: {
        type: Date
    },
    medicalHistory: [{
        type: String
    }],
    nextAppointment: {
        type: Date
    },
    symptoms: [{
        type: String
    }],
    diseasePrediction: {
        type: String
    },
    isEmergency: {
        type: Boolean,
        default: false
    },
    // Scheme Eligibility Fields
    annualIncome: {
        type: Number
    },
    category: {
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'BPL']
    },
    rationCardNumber: {
        type: String
    },
    aadharNumber: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
