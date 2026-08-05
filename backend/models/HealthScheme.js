const mongoose = require('mongoose');

const HealthSchemeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    state: {
        type: String,
        default: 'All'
    },
    incomeLimit: {
        type: Number,
        required: true
    },
    eligibleCategories: [{
        type: String,
        enum: ['General', 'OBC', 'SC', 'ST', 'BPL']
    }],
    maxCoverageAmount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthScheme', HealthSchemeSchema);
