const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    type: {
        type: String,
        enum: ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup'],
        default: 'Consultation'
    },
    reason: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
