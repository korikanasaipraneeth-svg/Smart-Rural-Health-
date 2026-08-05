const mongoose = require('mongoose');

const LabReportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    },
    testName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    result: {
        type: String // e.g. "120 mg/dL"
    },
    normalRange: {
        type: String // e.g. "70 - 100 mg/dL"
    },
    fileUrl: {
        type: String // For uploaded PDF reports
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LabReport', LabReportSchema);
