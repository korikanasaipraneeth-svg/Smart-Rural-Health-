const mongoose = require('mongoose');

const bloodBankSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true,
        unique: true
    },
    inventory: {
        A_pos: { type: Number, default: 0, min: 0 },
        A_neg: { type: Number, default: 0, min: 0 },
        B_pos: { type: Number, default: 0, min: 0 },
        B_neg: { type: Number, default: 0, min: 0 },
        AB_pos: { type: Number, default: 0, min: 0 },
        AB_neg: { type: Number, default: 0, min: 0 },
        O_pos: { type: Number, default: 0, min: 0 },
        O_neg: { type: Number, default: 0, min: 0 }
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
