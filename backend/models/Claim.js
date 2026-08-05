const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schemeApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthScheme'
    },
    totalBillAmount: {
        type: Number,
        required: true
    },
    claimAmount: {
        type: Number,
        required: true
    },
    patientPayable: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Claim', ClaimSchema);
