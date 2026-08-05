const mongoose = require('mongoose');

const CampRegistrationSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    camp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthCamp',
        required: true
    },
    tokenNumber: {
        type: String,
        required: true
    },
    qrCodeString: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Registered', 'CheckedIn', 'Completed', 'NoShow'],
        default: 'Registered'
    },
    symptoms: {
        type: String,
        trim: true
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Ensure a patient can only register once per camp
CampRegistrationSchema.index({ patient: 1, camp: 1 }, { unique: true });

module.exports = mongoose.model('CampRegistration', CampRegistrationSchema);
