const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    type: {
        type: String,
        enum: ['Donation', 'Request'],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A_pos', 'A_neg', 'B_pos', 'B_neg', 'AB_pos', 'AB_neg', 'O_pos', 'O_neg'],
        required: true
    },
    units: {
        type: Number,
        default: 1,
        min: 1
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);
